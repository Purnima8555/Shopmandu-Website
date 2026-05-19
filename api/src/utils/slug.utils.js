
import crypto from "crypto"
import slugify from "slugify"
// import ShopModel from "../models/Shop.model.js";
// import ProductModel from "../models/Product.model.js";


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
        // exists = await ProductModel.findOne({slugs});  /// if not found then auto set exists there false value.
    }
    
    return slugs;
}



export default generateUniqueShopSlug;



