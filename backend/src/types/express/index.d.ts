import express from "express";
import { JwtPayload } from 'jsonwebtoken'; //JwtPayload is an interface
declare global {
    namespace Express {
        interface Request {
            //   user?: Record<string,any>
            authenticated?: Boolean;
            // user?: string | JwtPayload;
            user?: any; //because I want to allow something like: req.user.name
            files?: any;
        }
    }
}