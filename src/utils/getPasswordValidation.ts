import { passwordStrength, DiversityType } from 'check-password-strength';

const CHARACTER_TYPES: DiversityType[] = [
    "lowercase",
    "uppercase",
    "symbol",
    "number"
]

const getPasswordValidation = (password: string) => {
    const strengthCheck = passwordStrength(password);
    
    const isTooWeak = passwordStrength(password).value === "Too weak" || passwordStrength(password).value === "Weak"
    
    let missingCharactersString = ""
 
    const missingCharacters = CHARACTER_TYPES.filter(type => !strengthCheck.contains.includes(type))

    missingCharacters.forEach((word, i) => {
        if (i === 0) {
            missingCharactersString += word;
        } else {
            missingCharactersString += `, ${word}`
        }
    })

    let tooWeakMessage = "";

    if (isTooWeak) {
        if (strengthCheck.contains.length < 4) {
            tooWeakMessage += `Add the following character types to increase strength: ${missingCharactersString}. `
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