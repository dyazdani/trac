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

    let characterTypeMessage = "";
    let lengthMessage = "";

    if (isTooWeak) {
        if (strengthCheck.contains.length < 4) {
            characterTypeMessage += `Password must include: ${missingCharactersString}. `
        }

        if (strengthCheck.length < 8) {
            lengthMessage += "Password must be at least 8 characters."
        }
    }

    const validation = {
        isTooWeak,
        message: `Your password strength is: ${strengthCheck.value}`,
        characterTypeMessage,
        lengthMessage 
    }

    return validation
}

export default getPasswordValidation;