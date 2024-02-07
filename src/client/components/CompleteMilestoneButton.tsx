import { 
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
    const currentUser = useAppSelector((state) => state.auth.user);

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
                        title: 'Milestone completed.',
                        description: 'Your milestone was marked as complete.',
                        status: 'success',
                        duration: 9000,
                        isClosable: true
                    })
                } else {
                    toast({
                        title: 'Milestone incomplete.',
                        description: 'Your milestone was marked as incomplete.',
                        status: 'info',
                        duration: 9000,
                        isClosable: true
                    })
                }
            } else {
                toast({
                    title: 'ERROR',
                    description: 'Unable to mark milestone as complete or incomplete',
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                })
            }
        } catch (e) {
            console.error(e)
            toast({
                title: 'ERROR',
                description: 'Unable to mark milestone as complete or incomplete',
                status: 'error',
                duration: 9000,
                isClosable: true
            })
        }
    }
        return (
            <IconButton 
                aria-label="complete-milestone-button" 
                icon={<CheckIcon />} 
                isDisabled={milestone?.isCanceled}
                variant={milestone.isCompleted ? "solid" : "outline"}
                colorScheme={milestone.isCompleted ? "teal" : ""}
                onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                }}
            />           
        )
    }
}

export default CompleteMilestoneButton;