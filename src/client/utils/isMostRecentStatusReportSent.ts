import { HabitWithDetails } from "../../types/index.js";
import getMostRecentCheckInDayDate from "./getMostRecentCheckInDayDate.js";

const isMostRecentStatusReportSent = (habit: HabitWithDetails) => {
    if (!habit.statusReports.length) {
        return false
    }
    const lastStatusReportDate = new Date(habit.statusReports[habit.statusReports.length - 1].dateCreated);

    // Get very beginning (midnight) of most recent check-in date
    const midnightOfCheckInDate = getMostRecentCheckInDayDate(habit)?.setHours(0, 0, 0, 0)

    if (midnightOfCheckInDate) {
        return lastStatusReportDate.getTime() > midnightOfCheckInDate
    }
}


























































































































































































export default isMostRecentStatusReportSent;