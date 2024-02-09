import { passwordStrength } from 'check-password-strength';


const getPasswordValidation = (password: string) => {
    const validation = {
        isInvalid: passwordStrength(password).value === "Too weak" || passwordStrength(password).value === "Weak",
        message: `Your password strength is: ${passwordStrength(password).value}`
    }

    return validation
}

export default getPasswordValidation;