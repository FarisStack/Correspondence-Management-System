import { body, param, query } from 'express-validator'

class WorkflowValidator {
    checkCreateAction() {
        return [
            body("workflowId")
                .notEmpty()
                .withMessage("Must provide a workflowId")
            ,
            body("recipients")
                .notEmpty()
                .withMessage("Must specify at least one recipient!")
                .isArray()
                .withMessage("Recipients must be an array of objects")
            ,
            // body("cc")
            //     .notEmpty()
            //     .withMessage("CC field is not provided")
            //     .isArray()
            //     .withMessage("CC must be an array of objects")
            // ,
            // body("richTextContent")
            //     .notEmpty()
            //     .withMessage("Content field is not provided")
            //     .isString()
            // ,
        ];
    }

    checkSearchBy() {
        return [
            query('filterBy')
                .notEmpty()
                .withMessage('You need to specify a `filterBy` query')
                .ltrim(' ')
                .rtrim(' ')
            ,
            // .isStrongPassword()
            // .withMessage('Please write a strong password')
        ];
    }
}


export default new WorkflowValidator();