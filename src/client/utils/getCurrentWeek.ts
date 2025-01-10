import { HabitWithDetails, GoalWithDetails } from "../../types/index.js";

const getCurrentWeek = (habit: HabitWithDetails, goal: GoalWithDetails) => {
    let currentWeek: Date[] = [];
    let firstDay = new Date()

    // If Habit is in a Goal that is overdue, make sure the first day of week is =< due date
    while (firstDay.setHours(0, 0, 0, 0) > new Date(goal.dueDate).setHours(0, 0, 0, 0)) {
      firstDay = new Date(firstDay.setDate(firstDay.getDate() - 1))
    }

    // Get number associated with current day of the week
    const firstDayNumber = firstDay.getDay()

    // Push Sunday before firstDay's date to firstWeek array
    currentWeek.push(new Date(firstDay.setDate(firstDay.getDate() - firstDayNumber)))

    // Push the rest of dates in that week to firstWeek array
    for (let i = 1; i < 7; i++) {
      const previousDay = new Date(currentWeek[i - 1]);
      const previousDayOfTheMonth = currentWeek[i - 1].getDate()
      currentWeek.push(new Date(previousDay.setDate(previousDayOfTheMonth + 1)))
    }
    
    return currentWeek;
}

export default getCurrentWeek;