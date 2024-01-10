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

const DeleteHabitButton = (props: DeleteHabitButtonProps) =>  {
    
    return(
        <>
            <IconButton 
                aria-label="delete-habit-button" 
                icon={<DeleteIcon />} 
                variant="unstyled"
            />
        </>
    );
}

export default DeleteHabitButton;