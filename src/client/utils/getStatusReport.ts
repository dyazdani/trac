import { HabitWithDetails } from "../../types/index.js";
import areDatesSameDayMonthYear from "./areDatesSameDayMonthYear.js";
import { ONE_DAY_IN_MILLISECONDS } from "./getMostRecentCheckInDayDate.js";
import isHabitRoutineDay from "./isHabitRoutineDay.js";

const getStatusReport = (habit: HabitWithDetails) => {
    let statusReport = []
    let currentDateObject = habit.statusReports.length ? new Date(habit.statusReports[habit.statusReports.length - 1].dateCreated) : new Date(habit.dateCreated);

    const today = new Date();

    while (!areDatesSameDayMonthYear(currentDateObject, today)) {
        const completionStatus = habit.datesCompleted.find((date: Date) => areDatesSameDayMonthYear(new Date(date), currentDateObject)) ? "Completed" : "Not Completed"; 

        if (isHabitRoutineDay(habit, currentDateObject)) {
            statusReport.push({[currentDateObject.toDateString()]: completionStatus});
        }
        
        currentDateObject = new Date(currentDateObject.getTime() + ONE_DAY_IN_MILLISECONDS)
    }

    statusReport.push(
        {
            [currentDateObject.toDateString()]: habit.datesCompleted.find((date: Date) => areDatesSameDayMonthYear(new Date(date), currentDateObject)) ? 
            "Completed" : 
            "Not Completed"
        }
    )

    return statusReport;
}

export default getStatusReport;