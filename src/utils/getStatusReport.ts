import { HabitWithDetails } from "../types/index.js";
import areDatesSameDayMonthYear from "./areDatesSameDayMonthYear.js";
import getMostRecentCheckInDayDate, { ONE_DAY_IN_MILLISECONDS } from "./getMostRecentCheckInDayDate.js";


const getStatusReport = (habit: HabitWithDetails) => {
    const checkInDate = getMostRecentCheckInDayDate(habit);

    if (checkInDate) {

        const statusReport = [
            {[new Date(checkInDate.getTime() - (6 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: "Not Completed"},
            {[new Date(checkInDate.getTime() - (5 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: "Not Completed"},
            {[new Date(checkInDate.getTime() - (4 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: "Not Completed"},
            {[new Date(checkInDate.getTime() - (3 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: "Not Completed"},
            {[new Date(checkInDate.getTime() - (2 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: "Not Completed"},
            {[new Date(checkInDate.getTime() - ONE_DAY_IN_MILLISECONDS).toDateString()]: "Not Completed"},
            {[checkInDate.toDateString()]: "Not Completed"}
        ]
        let currentDateInMilliseconds = checkInDate?.getTime();
    
        for (let i = 6; i > -1; i--) {
            const targetDate = new Date(currentDateInMilliseconds);
            if (habit.datesCompleted.find(date => areDatesSameDayMonthYear(new Date(date), targetDate))) {
                statusReport[i][targetDate.toDateString()] = "Completed"
            }
            currentDateInMilliseconds = currentDateInMilliseconds - ONE_DAY_IN_MILLISECONDS;
        }
        return statusReport;
    } 
}

export default getStatusReport;