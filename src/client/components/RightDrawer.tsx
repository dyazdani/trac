import {
    useDisclosure,
    Button,
    useBreakpointValue,
    useBreakpoint
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useAppSelector } from '../app/hooks.js'
import CreateGoalForm from './CreateGoalForm.js'
import { User } from '@prisma/client'
import isLessThanBreakpoint from '../utils/isLessThanBreakpoint.js'

export interface RightDrawerProps {
    isGoalsEmpty: boolean
    isBannerDisplayed: boolean | null
}

const RightDrawer = ({ isGoalsEmpty, isBannerDisplayed }: RightDrawerProps) => {
    const { isOpen, onClose, onOpen} = useDisclosure();
    const breakpoint = useBreakpoint({ssr: false})
    const bottom = useBreakpointValue(
        {
            base: undefined,
            lg: "50px"
        },
        {ssr: false}
    )
    const top = isBannerDisplayed ? "198px" : "106px"

    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    return (
        <>
            {currentUser && 
                <>
                    <Button
                        position={isGoalsEmpty || isLessThanBreakpoint(breakpoint, "lg") ? undefined : "fixed"}
                        bottom={isGoalsEmpty || isLessThanBreakpoint(breakpoint, "lg") ? undefined : bottom}
                        marginTop={isGoalsEmpty ? "3rem" : undefined}
                        variant='solid'
                        backgroundColor="yellow.500"
                        _hover={{
                            backgroundColor: "yellow.600"
                        }}
                        _active={{
                            backgroundColor: "yellow.700"
                        }} 
                        size={{
                            base: `${isGoalsEmpty ? "lg" : "sm"}`,
                            lg: `${isGoalsEmpty ? "lg" : "md"}`,
                            xl: "lg"
                        }}
                        aria-label='create-goal'
                        leftIcon={<AddIcon />}
                        onClick={onOpen}
                    >
                        {isGoalsEmpty ? "Add your first Goal" : "Add Goal"}
                    </Button>
                    <CreateGoalForm
                        onCloseForGoal={onClose}
                        isOpenForGoal={isOpen}
                    />
                </>     
            }
        </>
    )
}

export default RightDrawer;