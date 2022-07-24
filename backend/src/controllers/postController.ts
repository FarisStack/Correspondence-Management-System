import { Request, Response } from 'express';
import db from '../models/'; // our database connection object
const { models } = db.sequelize; // returns object with all our models.


export const getPosts = (req: Request, res: Response): void => {

    db.User.findAll({
        include: {
            model: models.Project,
        },
        attributes: {
            exclude: ['password']
        }
    })
        .then((result: object) => {
            //console.log(JSON.stringify(result));
            return res.json(result);
        })
        .catch((err: any) => console.log(err))
}

export default { getPosts }