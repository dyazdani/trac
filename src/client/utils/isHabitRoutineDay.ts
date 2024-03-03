import { HabitWithDetails } from "../../types/index.js";

export const LOWER_CASE_DAYS_OF_WEEK = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
]

const isHabitRoutineDay = (habit: HabitWithDetails, date: Date) => {
    const dateDayOfWeek = date.getDay();

    const habitRoutineValue = habit.routine[LOWER_CASE_DAYS_OF_WEEK[dateDayOfWeek] as keyof typeof habit.routine];

    if (typeof habitRoutineValue === "boolean") {
        return habitRoutineValue;
    } else {
        return false
    }
}

export default isHabitRoutineDay;