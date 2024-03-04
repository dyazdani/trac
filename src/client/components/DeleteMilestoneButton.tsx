import { 
    IconButton, 
    MenuItem, 
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
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        const handleDeleteMilestone = async () => {
            try {
                const { milestone: deletedMilestone } = await deleteMilestone({
                    ownerId: currentUser.id,
                    milestoneId: milestone.id
                }).unwrap();

                if (deletedMilestone) {
                    console.log(deletedMilestone);
                    toast({
                        title: 'Goal deleted.',
                        description: `Your Goal "${milestone.name}" has been successfully deleted`,
                        status: 'success',
                        duration: 4000,
                        isClosable: true
                    })
                } else {
                    toast({
                        title: 'ERROR',
                        description: `Unable to delete Goal "${milestone.name}"`,                        
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
            <MenuItem
                aria-label="Delete Goal" 
                icon={<DeleteIcon/>}
                onClick={(e) => {
                    e.preventDefault();
                    handleDeleteMilestone();
                }}
            >Delete Goal</MenuItem>
        )
    }
}

export default DeleteMilestoneButton;