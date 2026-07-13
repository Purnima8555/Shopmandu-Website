
import crypto from "crypto"
import slugify from "slugify"
import ShopModel from "../models/Shop.model.js";
import ProductModel from "../models/Product.model.js";
import OrderModel from "../models/Order.model.js";
import CategoryModel from "../models/Category.model.js";



//// slugs random string generates


const slugsRandomString = (bytes) => {
    const randomSlugsToken = crypto.randomBytes(bytes).toString('hex')
    return randomSlugsToken;
}

const generateUniqueShopSlug = async (string) => {
    const slug = slugify(string, {
        lower: true,
        strict: true,
        trim: true
    })
    let slugs;
    let exists = true;
    while (exists) {
        const token = slugsRandomString(4)
        slugs = `${slug}-${token}`;
        exists= false
        // exists = await ShopModel.findOne({slugs});  /// if not found then auto set exists there false value.
    }
    
    return slugs;
}

const generateUniqueProductSlug = async (string) => {
    const slug = slugify(string, {
        lower: true,
        strict: true,
        trim: true
    })
    let slugs;
    let exists = true;
    while (exists) {
        const token = slugsRandomString(8)
        slugs = `${slug}-${token}`;
        exists= false
        exists = await ProductModel.findOne({slug: slugs});  /// if not found then auto set exists there false value.
    }
    
    return slugs;
}


const generateUniqueOrderNumber = async () => {

    const orderPrefix  =  `ORD-${Date.now()}`
    let orderNumber
    let exists = true;
    while (exists) {
        const token = slugsRandomString(8)
        orderNumber = `${orderPrefix}-${token}`;
        exists= false
        exists = await OrderModel.findOne({orderNumber});  /// if not found then auto set exists there false value.
    }
    return orderNumber;
}


const generatedUniqueCategorySlug = async (string) => { 
    
    let categorySlug
    let exists = true 
    while(exists){
        const slug = slugsRandomString(6);
        categorySlug = `${string}-${slug}`;
        exists = false;

        exists = await CategoryModel.findOne({slug: categorySlug})
    }
    return categorySlug

 }


// new Promise((resolve, rejects)=>{
//     resolve(generateUniqueProductSlug("ikea-markus-chair"))
// }).then(data=> console.log(data))



export {generateUniqueShopSlug, generateUniqueProductSlug, generateUniqueOrderNumber, generatedUniqueCategorySlug};



