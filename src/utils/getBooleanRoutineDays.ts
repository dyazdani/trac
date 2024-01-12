import { RoutineDays, RoutineDaysArrayType } from "../types/index.js";

const getBooleanRoutineDays = (routineDaysArray: RoutineDaysArrayType) => {

    const finalObject: RoutineDays = {
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