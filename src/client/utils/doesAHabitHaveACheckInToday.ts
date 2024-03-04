import { User } from "@prisma/client";
import { useAppSelector } from "../app/hooks.js";
import { useGetHabitsByUserQuery } from "../features/api.js";
import isTodayCheckInDay from "./isTodayCheckInDay.js";
import areDatesSameDayMonthYear from "./areDatesSameDayMonthYear.js";

const doesAHabitHaveACheckInToday = () => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, 'password'> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
  
    if (currentUser) {
        let doesAHabitHaveACheckInToday: undefined | boolean;
        const { data } = useGetHabitsByUserQuery(currentUser.id);
        const checkInsToday = data?.habits.filter(habit => !areDatesSameDayMonthYear(new Date(habit.dateCreated), new Date()) && isTodayCheckInDay(habit.checkIn))
        if (checkInsToday) {
            doesAHabitHaveACheckInToday = !!checkInsToday.length
        }

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