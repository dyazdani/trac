import { 
    IconButton, 
    useToast 
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDeleteMilestoneMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { MilestoneWithDetails } from "../../types/index.js";

export interface DeleteMilestoneButtonProps{
    milestone: MilestoneWithDetails
}

const DeleteMilestoneButton = ({milestone}: DeleteMilestoneButtonProps) => {
    const [deleteMilestone] = useDeleteMilestoneMutation();
    const toast = useToast();
    const currentUser = useAppSelector((state) => state.auth.user);

    if (currentUser) {
        const handleDeleteMilestone = async () => {
            try {
                const { milestone: deletedMilestone } = await deleteMilestone({
                    ownerId: currentUser.id,
                    milestoneId: milestone.id
                }).unwrap();

                if (milestone) {
                    console.log(deletedMilestone);
                    toast({
                        title: 'Milestone deleted.',
                        description: 'Your milestone has been successfully deleted',
                        status: 'success',
                        duration: 4000,
                        isClosable: true
                    })
                } else {
                    toast({
                        title: 'ERROR',
                        description: 'Unable to delete milestone. Please try again.',                        
                        status: 'error',
                        duration: 4000,
                        isClosable: true
                    })
                }
            } catch (e) {
                console.error(e);
            }
        }

    return (
            <IconButton 
                aria-label="delete-milestone-button" 
                icon={<DeleteIcon />} 
                isDisabled={milestone?.isCompleted || milestone?.isCanceled}
                variant="unstyled"
                onClick={ (e) => {
                    e.preventDefault();
                    handleDeleteMilestone();
                }}
            />
        )
    }
}

export default DeleteMilestoneButton;