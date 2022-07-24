import { Request, Response } from 'express';


export const indexWelcome = (req: Request, res: Response): Response => {
    return res.json('Welcome to My API');
}
export const indexWelcome2 = (req: Request, res: Response): Response => {
    return res.json('Welcome to My API2');
}


export default { indexWelcome, indexWelcome2 }