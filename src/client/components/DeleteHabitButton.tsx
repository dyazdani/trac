import { useAppSelector } from "../app/hooks.js";
import { useDeleteHabitMutation, useDeleteSchedulesMutation } from "../features/api.js";
import { HabitWithDetails, MilestoneWithDetails } from "../../types/index.js";

import { 
    useToast,
    MenuItem 
} from "@chakra-ui/react";

import { 
    DeleteIcon 
} from "@chakra-ui/icons";

type DeleteHabitButtonProps = {
    habit: HabitWithDetails
}

const DeleteHabitButton = ({ habit}: DeleteHabitButtonProps) =>  {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
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
                    title: 'Habit deleted',
                    description: `"${habit.name}" was successfully deleted`,
                    status: 'info',
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
            icon={<DeleteIcon />}
            onClick={(e) => {
                e.preventDefault();
                handleDeleteHabit();
            }}
        >Delete Habit</MenuItem>
    );
}

export default DeleteHabitButton;