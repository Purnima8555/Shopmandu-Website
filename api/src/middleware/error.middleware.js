
import { AppError, NotFoundError } from "../utils/AppError.js";

//// error handlear middleware function
export const errorMiddleware = (err, req, res, next) => { 
    
    let message = "Internal App Error";
    let code = "INTERNAL_ERROR";
    let details = null
    let status = 500

    // console.log(err)

    if(err instanceof AppError){
        message= err.message;
        code = err.code;
        details = err.details;
        status = err.status;
    }else{
        console.log(`unknown error: `, err)
    }
    return res.status(status).json({
        success: false,
        message,
        code,
        details,
    })
 }


 /// not found error 
export const RouteNotFoundMiddleware = (req, res, next) => { 
    next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
 } 


