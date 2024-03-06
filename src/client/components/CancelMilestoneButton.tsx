import { 
    MenuItem, 
    useToast 
} from "@chakra-ui/react";
import { ArrowUpIcon, NotAllowedIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {  useUpdateMilestoneMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { MilestoneWithDetails } from "../../types/index.js";

export interface CancelMilestoneButtonProps{
    milestone: MilestoneWithDetails
}

const CancelMilestoneButton = ({milestone}: CancelMilestoneButtonProps) => {
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
                    isCompleted: milestone.isCompleted,
                    isCanceled: !milestone.isCanceled
                }
            }).unwrap();
    
            if (updatedMilestone) {
                if (updatedMilestone.isCanceled) {
                    toast({
                        title: 'Goal canceled',
                        description: `Your Goal "${updatedMilestone.name}" was canceled.`,
                        status: 'info',
                        duration: 9000,
                        isClosable: true,
                        icon: <NotAllowedIcon boxSize="1.4em"/>
                    })
                } else {
                    toast({
                        title: 'Goal restored',
                        description: `Your Goal "${updatedMilestone.name}" was restored.`,
                        status: 'info',
                        duration: 9000,
                        isClosable: true,
                        icon: <ArrowUpIcon boxSize="1.4em"/>
                    })
                }
            } else {
                toast({
                    title: 'ERROR',
                    description: `Unable to cancel or restore "${milestone.name}"`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            }
        } catch (e) {
            console.error(e)
            toast({
                title: 'ERROR',
                description: `Unable to cancel or restore Goal "${milestone.name}"`,
                status: 'error',
                duration: 9000,
                isClosable: true
            })
        }
    }
        return (
            <MenuItem 
                aria-label={milestone.isCanceled ? "Restore Goal" : "Cancel Goal"} 
                icon={milestone.isCanceled ? (<ArrowUpIcon />) : (<NotAllowedIcon/>)} 
                onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                }}
            >{milestone.isCanceled ? "Restore Goal" : "Cancel Goal"}</MenuItem>           
        )
    }
}

export default CancelMilestoneButton;