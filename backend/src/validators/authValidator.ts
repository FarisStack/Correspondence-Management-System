import { body, param, query } from 'express-validator'

class AuthValidator {
    checkRegisterUser() {
        return [
            body('email')
                .notEmpty()
                .withMessage('Email field is empty!')
                .isEmail()
                .withMessage('Invalid email format!')
                .ltrim(' ')
                .rtrim(' ')
            ,
        ];
    }

    checkLoginUser() {
        return [
            body('username')
                .notEmpty()
                .withMessage('Username field is empty!')
                .ltrim(' ')
                .rtrim(' ')
            ,
            body('password')
                .notEmpty()
                .withMessage('Password field is empty!')
                .isLength({ min: 4, max: 100 })
                .withMessage('Password length should be larger than 4, less than 100')
            // .isStrongPassword()
            // .withMessage('Please write a strong password')
        ];
    }
}

/*
.isStrongPassword()
Check if a password is strong or not. Allows for custom requirements or scoring rules. If returnScore is true, then the function returns an integer score for the password rather than a boolean.
Default options:
{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
*/

export default new AuthValidator();