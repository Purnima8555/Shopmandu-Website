

import { Router } from "express";

const router = Router()


//// GET api/producs => get all product list (none auth, paginated list, query filters.)
//// GET api/products/:id => get product by id (none auth, sing product )
//// Get api/products/slug/:slug => fetch product by slug used for SEO friendly products page url

/// GET api/products/category/:categoryId => get all product filter by categoryId


/// POST api/product => vendor create new product, generate auto slug using (slugify, url-slug, or limax).
//// PUT api/product/:id => vendor updates porduct fields, (cannot change vendorId or total sold ) it can add remove images
//// DEL api/product/:id => vendor can deleter there product 





