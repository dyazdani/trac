import { routineDays } from "../types/index.js";

export type routineDaysArrayType = (
    "monday" |
    "tuesday" |
    "wednesday" |
    "thursday" |
    "friday" | 
    "saturday" |
    "sunday"
)[] | [];


const getBooleanRoutineDays = (routineDaysArray: routineDaysArrayType) => {
    const finalObject: routineDays = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    };
    
    for (let i = 0; i < routineDaysArray.length; i++) {
        const currentDay = routineDaysArray[i];
        finalObject[currentDay] = true; 
        
    }

    return finalObject;
}

export default getBooleanRoutineDays