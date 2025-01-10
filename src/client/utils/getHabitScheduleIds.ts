import { GoalWithDetails } from "../../types/index.js";

const getHabitScheduleIds = (goal: GoalWithDetails) => {
    const scheduleIds: string[] = []
    goal.habits.forEach(habit => {
        if (habit.scheduleId) {
            scheduleIds.push(habit.scheduleId)
        }
    })

    return scheduleIds;
}

export default getHabitScheduleIds;