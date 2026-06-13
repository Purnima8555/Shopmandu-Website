import OrderItemsModel from "../models/OrderItem.model.js";
import ProductModel from "../models/Product.model.js";
import { BadRequestError, NotFoundError } from "./AppError.js";
import { orderNotification } from "./EmailQueue.js";


const SHIPPING_CONFIG = {
   volumetricDivisor: 5000,
   fuelSurcharge: 0.05,
   codRate: 0.02,
   minCodFee: 50,
   zones: {
      local: { base: 40, perKg: 12 },
      district: { base: 60, perKg: 18 },
      province: { base: 100, perKg: 25 },
      alloverCountry: { base: 180, perKg: 40 }
   }
};

const PLATFORM_TAX_RATE = 0.03   // 3% of subTotal

//// each product total calculate
const calculateItemTotal = (price, quantity) => price * quantity;

/// calculate sub total of all product
const calculateSubTotal = (items) => {
   const subTotal = items.reduce((acc, item) => {
      return acc += calculateItemTotal(item.price, item.quantity);
   }, 0)
   return subTotal
}

/// calculate grand total for order.
const calculateOrderTotals = (vendorsOrder) => {
   return Object.values(vendorsOrder).reduce(
      (totals, vendor) => {
         totals.subTotal += vendor.totalPrice;
         totals.totalWeight += vendor.totalProductWeight;
         totals.totalVolume += vendor.totalProductVolume;
         return totals;
      },
      {
         subTotal: 0,
         totalWeight: 0,
         totalVolume: 0
      }
   );
};

//// also do that optional

//  console.log(calculateSubTotal([{price: 10, quantity: 5}, {price: 20, quantity: 6}]))

// const calculateDiscountAmount = (subTotal, couponCode) => {   /// {type: "PERCENTAGE", }
//    if (!couponCode || Object.keys(couponCode).length === 0) return 0;
//    if (couponCode.type === "PERCENTAGE") {
//       const discount = couponCode.percentage / 100  //// 15/100 = 0.15
//       return discount * subTotal  //// it return discount ammount, 0.15 * 500 = 75
//    }
//    if (couponCode.type === "FIX") {
//       return couponCode.price
//    }
// }
//  console.log(calculateDiscountAmount(500, {type: "PERCENTAGE", value: 50}))

/// calcuate shipping charge
function calculateShipping({ orderAmount = 0, weightKg = 0, volumeCm3 = 0, zone = "local", cod = false }) {

   // console.log(orderAmount, weightKg, volumeCm3)

   /// calculate volumetric weight 
   const volumetricWeight = volumeCm3 / SHIPPING_CONFIG.volumetricDivisor;

   //// determine chargeable weight 
   const chargeableWeight = Math.ceil(Math.max(weightKg, volumetricWeight));
   // console.log(chargeableWeight)

   //// get zone rates
   const zoneRate = SHIPPING_CONFIG.zones[zone] || SHIPPING_CONFIG.zones.local;

   /// calculate Weight fee
   let weightFee = zoneRate.base;
   // console.log(chargeableWeight)
   if (chargeableWeight > 1) {
      weightFee += (chargeableWeight - 1) * zoneRate.perKg;  /// first 1 kg deliver on base price
      // console.log(weightFee)
   }

   //  COD Calculation 
   let codFee = 0;
   if (cod) {
      codFee = Math.max(SHIPPING_CONFIG.minCodFee, orderAmount * SHIPPING_CONFIG.codRate);  /// 
   }

   /// fuel Surcharge
   const fuelSurchargeFee = weightFee * SHIPPING_CONFIG.fuelSurcharge;

   let totalFee = weightFee + fuelSurchargeFee + codFee;

   ///  Advanced Promotion Logic
   let discount = 0;
   if (orderAmount >= 3000) {
      discount = Math.min(totalFee, 100);
   } else if (orderAmount >= 2000) {
      discount = 50;
   }
   totalFee -= discount;
   return {
      totalShippingFee: Math.ceil(totalFee),
      breakdown: {
         chargeableWeight: chargeableWeight.toFixed(2) + "kg",
         baseAndWeight: weightFee.toFixed(2),
         fuelSurcharge: fuelSurchargeFee.toFixed(2),
         codFee: codFee.toFixed(2),
         discountApplied: discount
      }
   };
}


// const result = calculateShipping({
//    orderAmount: 1000,
//    weightKg: 5,
//    volumeCm3: 2000,
//    zone: "province",
//    cod: true
// });

// console.log(result)

//// 
const calculateOrderTotal = (subTotal, discountAmount = 0, shippingCharge, taxAmount) => {
   return (subTotal + shippingCharge + taxAmount) - discountAmount
}


//// group by vendor and ther items.

const groupByVendorItems = async (items) => {

   // vendor grouped object
   const groupedVendors = {}

   try {
      // collect all product ids
      const productIds = items.map(item => item.productId)

      // fetch all products in single databses call query
      const products = await ProductModel.find({
         _id: { $in: productIds }
      }).populate(
         "vendorId",
         "email userName",
      ).lean()

      // console.log(products)

      // create product map for fast lookup
      const productMap = new Map()

      products.forEach(product => {
         productMap.set(product._id.toString(), product)
      })

      // p3s0cn49cne409cnm4 => {_id:p3s0v4rn9, name: ..., discountPrice: ...., discountPersent: ...,}
      // console.log(productMap)


      let productReserve = []

      // loop cart items
      for (const item of items) {

         const product = productMap.get(item.productId.toString())

         // validate product
         if (!product) {
            throw new NotFoundError(`Product not found: ${item.productId}`)
         }

         const currentStock = product.stock - product.releasedStock;
         const availableStock = currentStock - product.inReserve;

         // validate stock
         if (availableStock < item.quantity) {
            throw new BadRequestError(`${product.name} has insufficient stock`);
         }


         // console.log(product)
         const vendorId = product?.vendorId?._id.toString() || product?.vendorId?.toString()
         const vendorEmail = product?.vendorId?.email
         const userName = product?.vendorId?.userName

         // create vendor bucket if not exists
         if (!groupedVendors[vendorId]) {

            groupedVendors[vendorId] = {
               vendorId,
               products: [],
               totalPrice: 0,
               totalProductWeight: 0,
               totalProductVolume: 0,
               vendorEmail,
               userName

            }
         }

         // calculate item total
         const total = calculateItemTotal(Number(product.price), Number(item.quantity))

         // push product snapshot
         groupedVendors[vendorId].products.push({
            productId: product._id.toString(),
            productName: product.name,
            price: product.price,
            quantity: item.quantity,
            total,
            productImage: product.images?.[0] || null,
            variant: {
               color: item.color || null,
               size: item.size || null
            }
         })



         // update vendor total
         groupedVendors[vendorId].totalPrice += total

         // console.log(typeof product.boxVolume, product.boxVolume, product.productWeight)
         groupedVendors[vendorId].totalProductWeight += Number(product.productWeight.toString()) * item.quantity;
         groupedVendors[vendorId].totalProductVolume += Number(product.boxVolume.toString()) * item.quantity;


         // update there Reserve product
         productReserve.push({
            updateOne: {
               filter: {
                  _id: product._id,
                  $expr: {
                     $gte: [
                        {
                           $subtract: [
                              { $subtract: ["$stock", "$releasedStock"] },
                              "$inReserve"
                           ]
                        },
                        item.quantity
                     ]
                  }
               },
               update: {
                  $inc: {
                     inReserve: item.quantity
                  }
               }
            }
         });
      }

      /// update product Reserve inventry

      // if (productReserve.length > 0) {
      //    // console.dir(productReserve, { depth: null })
      //    await ProductModel.bulkWrite(productReserve);
      //    //   console.log(result)
      // }


      // convert object -> array
      // console.dir(groupedVendors, {depth: null})
      return { vendorOrders: groupedVendors, productReserve }
   } catch (err) {
      console.error(err);
      throw err;

   }
};

const restoreProductStock = async (items) => {

   const productRestock = items.map(item => {
      return {
         updateOne: {
            filter: {
               _id: item.productId
            },
            update: {
               $inc: {
                  inReserve: -item.quantity
               }
            }
         }
      };
   });

   if (productRestock.length > 0) {
      await ProductModel.bulkWrite(productRestock);
   }
};

const notifyVendor = async (order, commonData) => {

   const orderItems = await OrderItemsModel.find({ orderId: order._id })
      .populate("vendorId", "userName email");

   const notificationJobs = orderItems.map(item => ({
      name: "orderNotifaction",
      jobId: `notif_${commonData.orderNumber}_${item.vendorId._id}`,
      data: {
         vendorEmail: item.vendorId.email,
         vendorName: item.vendorId.userName,
         totalAmount: item.totalPrice,
         totalItems: item.products.length,
         paymentStatus: order.paymentStatus,
         orderType: order.paymentMethod,
         ...commonData
      },
      opts: {
         attempts: 3,
         backoff: {
            type: "exponential",
            delay: 1000
         },
         removeOnComplete: true,
         removeOnFail: false
      }
   }));

   await orderNotification(notificationJobs);
};


/// tax calculation

const calculateTax = (subTotal) => {
   return subTotal * PLATFORM_TAX_RATE
}




export { groupByVendorItems, calculateOrderTotals, calculateShipping, calculateTax, restoreProductStock, notifyVendor };
