import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import colors from "colors"; //console colors library

// //   Bashar Odeh
// const handleError = (error: any, req: Request, res: Response, next: NextFunction) => {
//     console.log("Error Handling Middleware called")
//     console.log('Path: ', req.path)
//     console.error('Error: ', error)

//     const statusCode = res.statusCode ? res.statusCode : 500;
//     // res.status(statusCode);
//     res.json({
//         message: error.message,
//         statusCode: statusCode,
//         stack: process.env.NODE_ENV === "production" ? null : error.stack,
//     })
// }


export const myErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    // First, log the error.message:
    
    console.error('\x1b[31m', error.message) // adding some color to our logs
    // next(error) // if you want to forward to next middleware
    
    const statusCode = error.statusCode ? error.statusCode : 500;
    res.statusCode=statusCode;

    return res.json({
        message: error.message,
        statusCode: statusCode,
        path: req.path,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
    });
}





// ============== From https://scoutapm.com/blog/express-error-handling: ==========
// export const errorLogger = (error: any, req: Request, res: Response, next: NextFunction) => {
//     // for logging errors
//     console.error(error) // or using any fancy logging library
//     next(error) // forward to next middleware
// }

// export const errorResponder = (error: any, req: Request, res: Response, next: NextFunction) => {
//     // responding to client
//     if (error.type == 'redirect')
//         res.redirect('/error')
//     else if (error.type == 'time-out') // arbitrary condition check
//         res.json({
//             error,
//             statusCode: 408
//         });
//     else
//         next(error) // forwarding exceptional case to fail-safe middleware
// }

// export const failSafeHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
//     // generic handler
//     res.json({
//         error,
//         statusCode: 500 //internal server error
//     });
// }


export default {
    myErrorHandler
    // errorLogger,
    // errorResponder,
    // failSafeHandler
};