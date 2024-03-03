import { User } from "@prisma/client";
import { useAppSelector } from "../app/hooks.js";
import { useGetHabitsByUserQuery, useGetMilestonesByUserQuery } from "../features/api.js";
import isTodayCheckInDay from "./isTodayCheckInDay.js";

const doesAHabitHaveACheckInToday = () => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, 'password'> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
  
    if (currentUser) {
        const { data: milestonesData, isLoading } = useGetMilestonesByUserQuery(currentUser.id)

        let doesAHabitHaveACheckInToday: undefined | boolean;
        const { data } = useGetHabitsByUserQuery(currentUser.id);
        const checkIns = data?.habits.map(habit => habit.checkIn)
        if (checkIns) {
            doesAHabitHaveACheckInToday = checkIns.some(checkIn => isTodayCheckInDay(checkIn))
        }

        console.log(`doesAHabiteHaveACheckInTOday: ${doesAHabitHaveACheckInToday}`)
        if (typeof doesAHabitHaveACheckInToday === "undefined") {
            return new Error("doesAHabitHaveACheckInToday was undefined.")
        } else {
            return doesAHabitHaveACheckInToday;
        }
    } else {
        return new Error("currentUser is null.")
    }

    
}

export default doesAHabitHaveACheckInToday;