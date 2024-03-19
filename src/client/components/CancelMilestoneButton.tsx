import { 
    MenuItem, 
    useToast 
} from "@chakra-ui/react";
import { ArrowUpIcon, NotAllowedIcon, PlusSquareIcon } from "@chakra-ui/icons";
import {  useGetMilestonesByUserQuery, useUpdateMilestoneMutation } from "../features/api.js";
import { useAppSelector } from "../app/hooks.js";
import { MilestoneWithDetails } from "../../types/index.js";
import { useDispatch } from "react-redux";
import doOtherMilestonesHaveStatusReportDue from "../utils/doOtherMilestonesHaveStatusReportDue.js";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";

export interface CancelMilestoneButtonProps{
    milestone: MilestoneWithDetails
}

const CancelMilestoneButton = ({milestone}: CancelMilestoneButtonProps) => {
    const [updateMilestone, { isLoading }] = useUpdateMilestoneMutation();
    const toast = useToast();
    const dispatch = useDispatch();
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        const currentUserId = currentUser.id
        const { data, isLoading: isMilestonesLoading } = useGetMilestonesByUserQuery(currentUserId); 

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
                        title: 'Goal Canceled',
                        description: `Your Goal "${updatedMilestone.name}" was canceled.`,
                        status: 'info',
                        variant: 'subtle',
                        duration: 9000,
                        isClosable: true,
                        icon: <NotAllowedIcon boxSize="1.4em"/>
                    })

                    if (data) {
                        if (!doOtherMilestonesHaveStatusReportDue(milestone, data.milestones)) {
                            dispatch(setIsBannerDisplayed(false))
                        }
                    }
                } else {
                    toast({
                        title: 'Goal Restored',
                        description: `Your Goal "${updatedMilestone.name}" was restored.`,
                        status: 'success',
                        variant: 'subtle',
                        duration: 9000,
                        isClosable: true,
                        icon: <ArrowUpIcon boxSize="1.4em"/>
                    })

                    if (
                        !milestone.isCompleted &&
                        milestone.habits.some(habit => {
                            const firstCheckInDate = getFirstCheckInDayDate(habit);
                            if (firstCheckInDate) {
                                return (
                                    firstCheckInDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) &&
                                    !isMostRecentStatusReportSent(habit)
                                )
                            }
                        })    
                    ) {
                        dispatch(setIsBannerDisplayed(true))
                    }
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
                backgroundColor="turquoise.50"
                isDisabled={isLoading || isMilestonesLoading}
                _hover={{
                    backgroundColor: "turquoise.100"
                }}
                _active={{
                    backgroundColor: "turquoise.200"
                }}
                onClick={(e) => {
                    e.preventDefault();
                    handleClick();
                }}
            >{milestone.isCanceled ? "Restore Goal" : "Cancel Goal"}</MenuItem>           
        )
    }
}

export default CancelMilestoneButton;