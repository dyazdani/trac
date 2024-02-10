import { passwordStrength } from 'check-password-strength';


const getPasswordValidation = (password: string) => {
    const strengthCheck = passwordStrength(password);
    
    const isTooWeak = passwordStrength(password).value === "Too weak" || passwordStrength(password).value === "Weak"
    
    let containsString = ""
    
    strengthCheck.contains.forEach((word, i) => {
        if (i === 0) {
            containsString += word;
        } else {
            containsString += `, ${word}`
        }
    })

    let tooWeakMessage = "";

    if (isTooWeak) {
        if (strengthCheck.contains.length < 4) {
            tooWeakMessage += `Add the following character types to increase strength: ${containsString}. `
        }

        if (strengthCheck.length < 8) {
            tooWeakMessage += "Increase length of password to at least 8 characters."
        }
    }




    const validation = {
        isTooWeak,
        message: `Your password strength is: ${strengthCheck.value}.`,
        tooWeakMessage  
    }

    return validation
}

export default getPasswordValidation;