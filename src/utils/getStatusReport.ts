import { HabitWithDetails } from "../types/index.js";
import areDatesSameDayMonthYear from "./areDatesSameDayMonthYear.js";
import getMostRecentCheckInDayDate, { ONE_DAY_IN_MILLISECONDS } from "./getMostRecentCheckInDayDate.js";


const getStatusReport = (habit: HabitWithDetails) => {
    const checkInDate = getMostRecentCheckInDayDate(habit);

    if (checkInDate) {

        const statusReport = [
            {[checkInDate.toDateString()]: false},
            {[new Date(checkInDate.getTime() - ONE_DAY_IN_MILLISECONDS).toDateString()]: false},
            {[new Date(checkInDate.getTime() - (2 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: false},
            {[new Date(checkInDate.getTime() - (3 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: false},
            {[new Date(checkInDate.getTime() - (4 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: false},
            {[new Date(checkInDate.getTime() - (5 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: false},
            {[new Date(checkInDate.getTime() - (6 * ONE_DAY_IN_MILLISECONDS)).toDateString()]: false}
        ]
        let currentDateInMilliseconds = checkInDate?.getTime();
    
        console.log(`${habit.name} datesCompleted: ${habit.datesCompleted}`)

        for (let i = 0; i < 7; i++) {
            const targetDate = new Date(currentDateInMilliseconds);
            if (habit.datesCompleted.find(date => areDatesSameDayMonthYear(new Date(date), targetDate))) {
                statusReport[i][targetDate.toDateString()] = true
            }
            currentDateInMilliseconds = currentDateInMilliseconds - ONE_DAY_IN_MILLISECONDS;
        }
        return statusReport;
    } 
}

export default getStatusReport;