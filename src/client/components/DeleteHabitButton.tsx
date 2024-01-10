import { useAppSelector } from "../app/hooks.js";
import { useDeleteHabitMutation } from "../features/api.js";
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
}

const DeleteHabitButton = ({ habit }: DeleteHabitButtonProps) =>  {
  const currentUser = useAppSelector(state => state.auth.user);
  const [deleteHabit, { isSuccess, isLoading, isError, error }] = useDeleteHabitMutation();
  const toast = useToast();

  const handleDeleteHabit = async () => {
    if (currentUser) {
      const deletedHabit = await deleteHabit({id: currentUser.id, habitId: habit.id})
      console.log(deletedHabit, "THE DELETED HABIT")
    }
  }
    
    return(
        <>
            <IconButton 
                aria-label="delete-habit-button" 
                icon={<DeleteIcon />} 
                variant="unstyled"
                onClick={handleDeleteHabit}
            />
        </>
    );
}

export default DeleteHabitButton;