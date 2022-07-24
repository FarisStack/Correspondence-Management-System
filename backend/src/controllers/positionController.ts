import { NextFunction, Request, Response } from 'express';
import db from '../models/'; // our database connection object
const { models } = db.sequelize; // returns object with all our models.
import 'dotenv/config'

interface IPosition {
    description: string;
    parent: string;
}

export const getPositions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const positions = await models.Position.findAll();
        return res.json({ positions: positions });
    }
    catch (err) {
        return res.json(err);
    }
}


export const addPositions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const _positions = req.body;
        _positions.reverse();
        let counter = 1;
        const map = new Map();
        _positions.map((pos: IPosition) => {
            models.Position.create({ id: counter, description: pos.description, parentPositionId: ((counter == 1) ? counter : map.get(pos.parent)) });
            map.set(pos.description, counter);
            counter++;
        });

        res.json("success");
    }
    catch (err) {
        return res.json(err);
    }
}