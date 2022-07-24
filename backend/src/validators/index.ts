// import { body, param, query } from 'express-validator'

// class TodoValidator {
//     checkCreateTodo() {
//         return [
//             body('id')
//                 .optional()
//                 .isUUID(4)
//                 .withMessage('ID should UUID v4'),
//             body('title')
//                 .notEmpty()
//                 .withMessage('Field: `title` is required'),
//             body('completed')
//                 .optional()
//                 .isBoolean()
//                 .withMessage("Field: `completed` should be boolean")
//                 .isIn([0, false])
//                 .withMessage('Task cannot be completed!'),
//         ]
//     }

//     chechReadTodo() {
//         return [
//             query('limit')
//                 .notEmpty()
//                 .withMessage('query `limit` shouldn\'t be empty')
//                 .isInt({ min: 1, max: 10 })
//                 .withMessage('query `limit` should be a number between [1, 10]'),
//             query('offset')
//                 .optional()
//                 .isNumeric()
//                 .withMessage('query `offset` should be a number')
//         ]
//     }

//     checkIdParam() {
//         return [
//             param('id')
//                 .notEmpty()
//                 .withMessage('param `id` shouldn\'n be empty')
//                 .isUUID(4)
//                 .withMessage('Invalid id, id should be UUIDv4')
//         ]
//     }
// }

// export default new TodoValidator();