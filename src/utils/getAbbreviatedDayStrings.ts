// This utility module can be used for getting the array type needed to create a habit routine reminder schedule in Knock
import { DaysOfWeek } from "@knocklabs/node";
import { RoutineDaysArrayType } from "./getBooleanRoutineDays.js";

export type KnockDaysOfWeekType = {
    monday: DaysOfWeek
    tuesday: DaysOfWeek
    wednesday: DaysOfWeek
    thursday: DaysOfWeek
    friday: DaysOfWeek
    saturday: DaysOfWeek
    sunday: DaysOfWeek
} 

const getAbbreviatedDayStrings = (dayStringArray: RoutineDaysArrayType): DaysOfWeek[] => {
    
const knockDaysOfWeek: KnockDaysOfWeekType = {
    monday: DaysOfWeek.Mon,
    tuesday: DaysOfWeek.Tue,
    wednesday: DaysOfWeek.Wed,
    thursday: DaysOfWeek.Thu,
    friday: DaysOfWeek.Fri,
    saturday: DaysOfWeek.Sat,
    sunday: DaysOfWeek.Sun
}
    
    return dayStringArray.map(day => knockDaysOfWeek[day])
}

export default getAbbreviatedDayStrings;
