import { 
    Button,
    IconButton, 
    useToast 
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import {  useUpdateMilestoneMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { MilestoneWithDetails } from "../../types/index.js";

export interface CompleteMilestoneButtonProps{
    milestone: MilestoneWithDetails
}

const CompleteMilestoneButton = ({milestone}: CompleteMilestoneButtonProps) => {
    const [updateMilestone] = useUpdateMilestoneMutation();
    const toast = useToast();
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
    const handleClick = async () => {
        try {
            const { milestone: updatedMilestone } = await updateMilestone({
                ownerId: currentUser.id,
                milestoneId: milestone.id,
                newMilestone: {
                    name: milestone.name,
                    dueDate: milestone.dueDate,
                    isCompleted: !milestone.isCompleted,
                    isCanceled: milestone.isCanceled
                }
            }).unwrap();
    
            if (updatedMilestone) {
                if (updatedMilestone.isCompleted) {
                    toast({
                        title: 'Goal completed.',
                        description: 'Your Goal was marked as complete.',
                        status: 'success',
                        duration: 9000,
                        isClosable: true
                    })
                } else {
                    toast({
                        title: 'Goal incomplete.',
                        description: 'Your Goal was marked as incomplete.',
                        status: 'info',
                        duration: 9000,
                        isClosable: true
                    })
                }
            } else {
                toast({
                    title: 'ERROR',
                    description: 'Unable to mark Goal as complete or incomplete',
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                })
            }
        } catch (e) {
            console.error(e)
            toast({
                title: 'ERROR',
                description: 'Unable to mark Goal as complete or incomplete',
                status: 'error',
                duration: 9000,
                isClosable: true
            })
        }
    }
        return (
            <Button 
                aria-label="Complete goal" 
                leftIcon={milestone.isCompleted ? <CheckIcon /> : undefined} 
                variant={milestone.isCompleted ? "outline" : "solid"}
                colorScheme="green"
                onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                }}
            >{milestone.isCompleted ? "Goal Completed!" : "Complete Goal"}</Button>           
        )
    }
}

export default CompleteMilestoneButton;