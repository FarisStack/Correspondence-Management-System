import express, { Request, Response, NextFunction } from 'express';
import { verify, Secret, Jwt, JwtPayload } from 'jsonwebtoken';
//Secret is a type from @types/jsonwebtoken
// Jwt and JwtPayload is interface.
import 'dotenv/config';

export const validateAccessToken = (req: Request, res: Response, next: NextFunction) => {
    // extract the accessToken from the cookie storage:
    const accessToken = req.cookies['access-token'];
    console.log("ACCESS TOKEN: ", accessToken);
    if (!accessToken) {
        // then the client is not logged in, or the accessToken is removed from cookies
        return res.json({
            message: 'Unauthorized Access!',
            statusCode: 401, //401 unauthorized
            path: req.path,
            tokenVerified: false,
        });
    }
    try {
        //verify(token:string, secretKey: Secret)
        const secretKey: Secret = process.env.JWT_AUTH_SECRET as Secret;
        const validToken: JwtPayload | string = verify(accessToken, secretKey);
        // const validToken: any = verify(accessToken, secretKey);
        // If token is invalid, the verify() will throw an error:

        // If program reaches this line, that means token is valid
        // (no error thrown)

        /* So verify() function
        returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.

        the returned value is of type: string | JwtPayload
        */
        // req.authenticated = true;
        req.user = validToken; //add the decoded payload data to the req object
        const employeeCurrentPositionId = req.header("employeeCurrentPositionId");
        req.user.employeePositionId = Number(employeeCurrentPositionId);


        console.log("The decoded token: ", validToken);
        // ---- If reaches here then the token is verified (valid), now we just have to check some other things before proceeding: ----
        checkEmpPosIdValidity(req, res, validToken);


        return next(); //move forward with the request
    }
    catch (error: any) {
        /* verify() function returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error. */
        console.error('\x1b[31m', error) // adding some color to our logs
        // error.message = "Invalid token"; // I want to overwrite the default err.message
        // next(error); //pass the err object to the error handler middleware function
        return res.json({
            message: 'Unauthenticated! Invalid Access Token',
            statusCode: 401, // 401 unauthorized
            path: req.path,
            stack: process.env.NODE_ENV === "production" ? null : error.stack,
            tokenVerified: false,
        });
    }
}

const checkEmpPosIdValidity = (req: Request, res: Response, decodedToken: any) => {

    //Since the req.header("employeeCurrentPositionId") is sent from the client side (stored in localStorage), we must check that the employeeCurrentPositionId is one of the ids that this user actually has in the database:

    const employeeCurrentPositionId: number = Number(req.header("employeeCurrentPositionId"));

    const found = decodedToken?.allEmployeePositions.find(
        (empPos: any) => +empPos.id === +employeeCurrentPositionId
    );

    if (!found) {
        console.log("Unauthorized! The employee's current position ID in the request header is invalid!");
        return res.json({
            message: "Unauthorized! The employee's current position ID in the request header is invalid!",
            statusCode: 401, //401 unauthorized
            path: req.path,
            tokenVerified: false,
        });
    }
}

export const validateAccountActivationToken = (req: Request, res: Response, next: NextFunction) => {

    const token = req.body.token; //receive the account activation token from the client-side;

    if (!token) {
        //then the token has not been passed within the request.body:
        return res.json({
            msg: 'WRONG ACCESS! activation token not found!',
            status: 401, //401 unauthorized
            activated: false
        });
    }

    try {
        //verify(token:string, secretKey: Secret)
        const secretKey: Secret = process.env.JWT_ACC_ACTIVATE as Secret;
        const decodedValidToken: JwtPayload | string = verify(token, secretKey);
        // If token is invalid, the verify() will throw an error:

        // If program reaches this line, that means token is valid
        // (no error thrown)

        /* So verify() function
        returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw the error.

        the returned value is of type: string | JwtPayload
        */
        req.user = decodedValidToken; //add the decoded payload data to the req object
        console.log(req.user);
        // console.log(req.user.email, req.user.id, req.user.role);

        return next(); //move forward with the request
    }
    catch (err) {
        /* verify() function returns the payload decoded if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will throw an error. */
        // console.log(err);
        return res.json({
            msg: "Failed to activate 😫. Invalid token, or could be expired. Kindly try to register again",
            error: err,
            status: 401,
            activated: false
        });
    }
}

// export default validateAccessToken;