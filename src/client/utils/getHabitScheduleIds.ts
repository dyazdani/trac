import { MilestoneWithDetails } from "../../types/index.js";

const getHabitScheduleIds = (milestone: MilestoneWithDetails) => {
    const scheduleIds: string[] = []
    milestone.habits.forEach(habit => {
        if (habit.scheduleId) {
            scheduleIds.push(habit.scheduleId)
        }
    })

    return scheduleIds;
}

export default getHabitScheduleIds;