import { useAppSelector } from "../app/hooks.js";
import { useDeleteHabitMutation, useDeleteSchedulesMutation } from "../features/api.js";
import { HabitWithDetails } from "../../types/index.js";

import { 
    useToast,
    IconButton 
} from "@chakra-ui/react";

import { 
    DeleteIcon 
} from "@chakra-ui/icons";

type DeleteHabitButtonProps = {
    habit: HabitWithDetails
    handleClick: () => void
}

const DeleteHabitButton = ({ habit, handleClick }: DeleteHabitButtonProps) =>  {
    const currentUser = useAppSelector(state => state.auth.user);
    const [deleteHabit, { isLoading }] = useDeleteHabitMutation();
    const [ deleteSchedules ] = useDeleteSchedulesMutation();

    const toast = useToast();

    const handleDeleteHabit = async () => {
        if (currentUser && habit.scheduleId) {
            try {
                const { schedules } = await deleteSchedules({
                    scheduleIds: [habit.scheduleId]
                }).unwrap()
        
                const { habit: deletedHabit } = await deleteHabit({
                    id: currentUser.id, 
                    habitId: habit.id
                }).unwrap()
        
                toast({
                    title: 'Habit deleted.',
                    description: 'Your habit has been successfully deleted',
                    status: 'success',
                    duration: 4000,
                    isClosable: true
                })
            } catch (e) {
                console.error(e)
                toast({
                    title: 'ERROR',
                    description: 'Unable to delete habit',
                    status: 'error',
                    duration: 4000,
                    isClosable: true
                })
            }
            
        }
    }
    
    return(
        <>
            <IconButton 
                aria-label="delete-habit-button" 
                icon={<DeleteIcon />}
                isLoading={isLoading} 
                variant="unstyled"
                onClick={(e) => {
                    e.preventDefault();
                    handleDeleteHabit();
                    handleClick();
                }}
            />
        </>
    );
}

export default DeleteHabitButton;