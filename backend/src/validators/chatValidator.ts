import { body, param, query } from 'express-validator'

class ChatValidator {
    checkAccessGroup() {
        return [
            body('userId')
                .notEmpty()
                .withMessage('userId field is empty!')
                .ltrim(' ')
                .rtrim(' ')
            ,
        ];
    }

    checkCreateGroup() {
        return [
            body('membersIDs')
                .notEmpty()
                .withMessage('membersIDs field is empty!')
                .isArray()
                .withMessage("membersIDs must be an array")
            ,
            body("name")
                .notEmpty()
                .withMessage('name field is empty!')
                .isString()
                .withMessage('name field must be string!')
        ];
    }
}

/*
.isStrongPassword()
Check if a password is strong or not. Allows for custom requirements or scoring rules. If returnScore is true, then the function returns an integer score for the password rather than a boolean.
Default options:
{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
*/

export default new ChatValidator();