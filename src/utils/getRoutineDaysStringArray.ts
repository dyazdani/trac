import { Routine } from "@prisma/client";
import { RoutineDaysArrayType, DayString } from "../types/index.js";

const getRoutineDaysStringArray = (routine: Routine) => {
    const routineDays = (({ id, habitId, dateCreated, dateUpdated, ...object }) => object)(routine);

    let finalArray: RoutineDaysArrayType = [];

    for (const key in routineDays) {
        if (routineDays[key as keyof typeof routineDays]) {
            const dayString: DayString = key as DayString
            finalArray = [...finalArray, dayString]
        }
    }

    return finalArray
}

export default getRoutineDaysStringArray;

