import { HabitWithDetails } from "../../types/index.js";
import areDatesSameDayMonthYear from "./areDatesSameDayMonthYear.js";
import { ONE_DAY_IN_MILLISECONDS } from "./getMostRecentCheckInDayDate.js";

const getStatusReport = (habit: HabitWithDetails) => {
    let statusReport = []
    let currentDateObject = habit.statusReports.length ? new Date(habit.statusReports[habit.statusReports.length - 1].dateCreated) : new Date(habit.dateCreated);

    while (!areDatesSameDayMonthYear(currentDateObject, new Date())) {
        const completionStatus = habit.datesCompleted.find((date: Date) => areDatesSameDayMonthYear(new Date(date), currentDateObject)) ? "Completed" : "Not Completed"; 
        statusReport.push({[currentDateObject.toDateString()]: completionStatus});

        currentDateObject = new Date(currentDateObject.getTime() + ONE_DAY_IN_MILLISECONDS)
    }

    return statusReport;
}

export default getStatusReport;