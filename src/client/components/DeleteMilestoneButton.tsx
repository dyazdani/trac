import { 
    MenuItem, 
    useToast 
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { 
    useDeleteMilestoneMutation, 
    useGetMilestonesByUserQuery, 
    useDeleteSchedulesMutation 
} from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { MilestoneWithDetails } from "../../types/index.js";
import { useDispatch } from "react-redux";
import doOtherMilestonesHaveStatusReportDue from "../utils/doOtherMilestonesHaveStatusReportDue.js";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import { User } from "@prisma/client";
import getHabitScheduleIds from "../utils/getHabitScheduleIds.js";

export interface DeleteMilestoneButtonProps{
    milestone: MilestoneWithDetails
}

const DeleteMilestoneButton = ({milestone}: DeleteMilestoneButtonProps) => {
    const [
        deleteMilestone, 
        {
            isLoading: isDeleteMilestoneLoading, 
            error: deleteMilestoneError
        }
    ] = useDeleteMilestoneMutation();
    const [
        deleteSchedules, 
        {
            isLoading: isDeleteSchedulesLoading,
            error: deleteSchedulesError
        }
    ] = useDeleteSchedulesMutation();

    const toast = useToast();
    const dispatch = useDispatch();
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        const currentUserId = currentUser.id
        const { 
            data, 
            isLoading: isMilestonesLoading, 
            error 
        } = useGetMilestonesByUserQuery(currentUserId); 

        const handleDeleteMilestone = async () => {
            if (
                typeof error === "undefined" &&
                typeof deleteMilestoneError === "undefined" &&
                typeof deleteSchedulesError === "undefined"
                ) {
                try {
                    const scheduleIds = getHabitScheduleIds(milestone);

                    const { milestone: deletedMilestone } = await deleteMilestone({
                        ownerId: currentUser.id,
                        milestoneId: milestone.id
                    }).unwrap();

                    if (deletedMilestone) {
                        if (scheduleIds.length) {
                            const deleteSchedulesResponse = await deleteSchedules({
                                scheduleIds
                            }).unwrap()

                            if (deleteSchedulesResponse.message === "successfully deleted") {
                                toast({
                                    title: 'Goal Deleted',
                                    description: `"${milestone.name}" has been successfully deleted`,
                                    status: 'info',
                                    variant: 'subtle',
                                    duration: 4000,
                                    isClosable: true,
                                    icon: <DeleteIcon boxSize="1.2em"/>
                                })
                            } else {
                                toast({
                                    title: 'ERROR',
                                    description: `Unable to delete "${milestone.name}" Line 100`,                        
                                    status: 'error',
                                    duration: 4000,
                                    isClosable: true
                                })
                            }
                        } else {
                            toast({
                                title: 'Goal Deleted',
                                description: `"${milestone.name}" has been successfully deleted`,
                                status: 'info',
                                variant: 'subtle',
                                duration: 4000,
                                isClosable: true,
                                icon: <DeleteIcon boxSize="1.2em"/>
                            })
                        }
                    } else {
                        toast({
                            title: 'ERROR',
                            description: `Unable to delete "${milestone.name}"`,                        
                            status: 'error',
                            duration: 4000,
                            isClosable: true
                        })
                    }
                    
                    if (data) {
                        if (data.milestones.length) {
                            if (!doOtherMilestonesHaveStatusReportDue(milestone, data.milestones)) {
                                dispatch(setIsBannerDisplayed(false))
                            }
                        } else {
                            dispatch(setIsBannerDisplayed(false))
                        }
                    }
                    
                } catch (e) {
                    toast({
                        title: 'ERROR',
                        description: `Unable to delete "${milestone.name}"`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    })
                }
            } else {
                toast({
                    title: 'ERROR',
                    description: `Unable to delete "${milestone.name}"`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true
                })
            }
        }

        return (
            <MenuItem
                aria-label="Delete Goal" 
                icon={<DeleteIcon/>}
                backgroundColor="turquoise.50"
                isDisabled={
                    isMilestonesLoading || 
                    isDeleteMilestoneLoading || 
                    isDeleteSchedulesLoading
                }
                _hover={{
                    backgroundColor: "turquoise.100"
                }}
                _active={{
                    backgroundColor: "turquoise.200"
                }}
                onClick={(e) => {
                    e.preventDefault();
                    handleDeleteMilestone();
                }}
            >Delete Goal</MenuItem>
        )
    }
}

export default DeleteMilestoneButton;