import {
    useDisclosure,
    Button,
    useBreakpointValue
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useAppSelector } from '../app/hooks.js'
import CreateMilestoneForm from './CreateMilestoneForm.js'
import { User } from '@prisma/client'

export interface RightDrawerProps {
    isMilestonesEmpty: boolean
}

const RightDrawer = ({ isMilestonesEmpty }: RightDrawerProps) => {
    const { isOpen, onClose, onOpen} = useDisclosure();
    const position = useBreakpointValue(
        {
            base: "fixed"
        },
        {ssr: false}
    )

    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    return (
        <>
            {currentUser && 
                <>
                    <Button
                        position={isMilestonesEmpty ? undefined : "fixed"}
                        bottom={isMilestonesEmpty ? undefined : "50px"}
                        marginTop={isMilestonesEmpty ? "3rem" : undefined}
                        variant='solid'
                        backgroundColor="yellow.500"
                        _hover={{
                            backgroundColor: "yellow.600"
                        }}
                        _active={{
                            backgroundColor: "yellow.700"
                        }} 
                        size={{
                            base: `${isMilestonesEmpty ? "lg" : "sm"}`,
                            lg: "lg"
                        }}
                        aria-label='create-goal'
                        leftIcon={<AddIcon />}
                        onClick={onOpen}
                    >
                        {isMilestonesEmpty ? "Add your first Goal" : "Add Goal"}
                    </Button>
                    <CreateMilestoneForm
                        onCloseForMilestone={onClose}
                        isOpenForMilestone={isOpen}
                    />
                </>     
            }
        </>
    )
}

export default RightDrawer;