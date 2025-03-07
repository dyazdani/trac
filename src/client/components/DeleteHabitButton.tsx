import { useAppSelector } from "../app/hooks.js";
import { useDeleteHabitMutation, useDeleteSchedulesMutation } from "../features/api.js";
import { HabitWithDetails, GoalWithDetails } from "../../types/index.js";

import { 
    useToast,
    MenuItem 
} from "@chakra-ui/react";

import { 
    DeleteIcon 
} from "@chakra-ui/icons";
import { User } from "@prisma/client";

type DeleteHabitButtonProps = {
    habit: HabitWithDetails
}

const DeleteHabitButton = ({ habit}: DeleteHabitButtonProps) =>  {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    const [deleteHabit, { isLoading }] = useDeleteHabitMutation();
    const [ deleteSchedules ] = useDeleteSchedulesMutation();

    const toast = useToast();

    const handleDeleteHabit = async () => {
        if (currentUser && habit.scheduleId) {
            try {
                await deleteSchedules({
                    scheduleIds: [habit.scheduleId]
                })
        
                await deleteHabit({
                    id: currentUser.id, 
                    habitId: habit.id
                })
        
                toast({
                    title: 'Habit Deleted',
                    description: `"${habit.name}" was successfully deleted`,
                    status: 'info',
                    variant: 'subtle',
                    duration: 4000,
                    isClosable: true,
                    icon: <DeleteIcon boxSize="1.2em"/>
                })
            } catch (e) {
                console.error(e)
                toast({
                    title: 'ERROR',
                    description: `Unable to delete Habit "${habit.name}"`,
                    status: 'error',
                    duration: 4000,
                    isClosable: true
                })
            }
            
        }
    }
    
    return(
        <MenuItem 
            aria-label="Delete Habit"
            backgroundColor="cornflowerblue.50"
            _hover={{
                backgroundColor: "cornflowerblue.100"
            }}
            _active={{
                backgroundColor: "cornflowerblue.200",
                color: "floralwhite.50"
            }}
            icon={<DeleteIcon />}
            onClick={(e) => {
                e.preventDefault();
                handleDeleteHabit();
            }}
        >Delete Habit</MenuItem>
    );
}

export default DeleteHabitButton;