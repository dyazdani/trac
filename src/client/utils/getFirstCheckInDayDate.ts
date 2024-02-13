import { HabitWithDetails } from "../../types/index.js";
import { DAYS_OF_THE_WEEK, ONE_DAY_IN_MILLISECONDS } from "./getMostRecentCheckInDayDate.js";

const getFirstCheckInDayDate = (habit: HabitWithDetails) => {
    const firstDayOfHabit = new Date(habit.dateCreated)

    let firstWeekOfHabit: Date[] = [];

    for (let i = 0; i < 7; i++) {
        firstWeekOfHabit.push(new Date(firstDayOfHabit.getTime() + (i * ONE_DAY_IN_MILLISECONDS)))
    }

    for (let i = 0; i < firstWeekOfHabit.length; i++) {
        if (DAYS_OF_THE_WEEK[firstWeekOfHabit[i].getDay()] === habit.checkIn.dayOfTheWeek) {
            if (i === 0) {
                return new Date(firstWeekOfHabit[i].getTime() + (7 * ONE_DAY_IN_MILLISECONDS))  
            } 

            return firstWeekOfHabit[i]
        }
    }
} 

export default getFirstCheckInDayDate