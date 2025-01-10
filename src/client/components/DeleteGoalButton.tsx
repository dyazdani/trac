import { 
    MenuItem, 
    useToast 
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { 
    useDeleteGoalMutation, 
    useGetGoalsByUserQuery, 
    useDeleteSchedulesMutation 
} from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { GoalWithDetails } from "../../types/index.js";
import { useDispatch } from "react-redux";
import doOtherGoalsHaveStatusReportDue from "../utils/doOtherGoalsHaveStatusReportDue.js";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import { User } from "@prisma/client";
import getHabitScheduleIds from "../utils/getHabitScheduleIds.js";

export interface DeleteGoalButtonProps{
    goal: GoalWithDetails
}

const DeleteGoalButton = ({goal}: DeleteGoalButtonProps) => {
    const [
        deleteGoal, 
        {
            isLoading: isDeleteGoalLoading, 
            error: deleteGoalError
        }
    ] = useDeleteGoalMutation();
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
            isLoading: isGoalsLoading, 
            error 
        } = useGetGoalsByUserQuery(currentUserId); 

        const handleDeleteGoal = async () => {
            if (
                typeof error === "undefined" &&
                typeof deleteGoalError === "undefined" &&
                typeof deleteSchedulesError === "undefined"
                ) {
                try {
                    const scheduleIds = getHabitScheduleIds(goal);

                    const { goal: deletedGoal } = await deleteGoal({
                        ownerId: currentUser.id,
                        goalId: goal.id
                    }).unwrap();

                    if (deletedGoal) {
                        if (scheduleIds.length) {
                            const deleteSchedulesResponse = await deleteSchedules({
                                scheduleIds
                            }).unwrap()

                            if (deleteSchedulesResponse.message === "successfully deleted") {
                                toast({
                                    title: 'Goal Deleted',
                                    description: `"${goal.name}" has been successfully deleted`,
                                    status: 'info',
                                    variant: 'subtle',
                                    duration: 4000,
                                    isClosable: true,
                                    icon: <DeleteIcon boxSize="1.2em"/>
                                })
                            } else {
                                toast({
                                    title: 'ERROR',
                                    description: `Unable to delete "${goal.name}" Line 100`,                        
                                    status: 'error',
                                    duration: 4000,
                                    isClosable: true
                                })
                            }
                        } else {
                            toast({
                                title: 'Goal Deleted',
                                description: `"${goal.name}" has been successfully deleted`,
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
                            description: `Unable to delete "${goal.name}"`,                        
                            status: 'error',
                            duration: 4000,
                            isClosable: true
                        })
                    }
                    
                    if (data) {
                        if (data.goals.length) {
                            if (!doOtherGoalsHaveStatusReportDue(goal, data.goals)) {
                                dispatch(setIsBannerDisplayed(false))
                            }
                        } else {
                            dispatch(setIsBannerDisplayed(false))
                        }
                    }
                    
                } catch (e) {
                    toast({
                        title: 'ERROR',
                        description: `Unable to delete "${goal.name}"`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    })
                }
            } else {
                toast({
                    title: 'ERROR',
                    description: `Unable to delete "${goal.name}"`,
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
                    isGoalsLoading || 
                    isDeleteGoalLoading || 
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
                    handleDeleteGoal();
                }}
            >Delete Goal</MenuItem>
        )
    }
}

export default DeleteGoalButton;