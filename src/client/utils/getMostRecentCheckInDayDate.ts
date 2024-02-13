import { HabitWithDetails } from "../../types/index.js";
import areDatesSameDayMonthYear from "./areDatesSameDayMonthYear.js";

export const DAYS_OF_THE_WEEK = [
    "SUNDAY", 
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY" 
]

export const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

const getMostRecentCheckInDayDate = (habit: HabitWithDetails) => {
    const today = new Date(Date.now());
    const checkInDayIndex = DAYS_OF_THE_WEEK.indexOf(habit.checkIn.dayOfTheWeek)

    if (today.getDay() === checkInDayIndex) {
        if (areDatesSameDayMonthYear(today, new Date(habit.dateCreated))) {
            // if today is the first day of the Habit and it is a check-in day, set first check-in day date to be a week in the future
            return new Date(today.getTime() + (7 * ONE_DAY_IN_MILLISECONDS))
        }
        return today
    }

    let targetDayInMilliseconds = today.getTime() - ONE_DAY_IN_MILLISECONDS

    while (targetDayInMilliseconds > today.getTime() - (7 * ONE_DAY_IN_MILLISECONDS)) {
        const targetDate = new Date(targetDayInMilliseconds)
        if (targetDate.getDay() === checkInDayIndex) {
            return targetDate
        } else {
            targetDayInMilliseconds = targetDayInMilliseconds - ONE_DAY_IN_MILLISECONDS
        }
    }
}

export default getMostRecentCheckInDayDate;