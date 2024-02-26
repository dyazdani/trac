import {
    useDisclosure,
    VStack,
    Button
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useAppSelector } from '../app/hooks.js'
import CreateMilestoneForm from './CreateMilestoneForm.js'

export interface RightDrawerProps {
    toggleBannerDisplayed: () => void
    isMilestonesEmpty: boolean
}

const RightDrawer = ({ toggleBannerDisplayed, isMilestonesEmpty }: RightDrawerProps) => {
    // TODO: Set this value to upper case when sending it to database
    const { isOpen, onClose, onOpen} = useDisclosure();
    const { isOpen: isOpenForMilestone, onClose: onCloseForMilestone, onOpen: onOpenForMilestone} = useDisclosure();

    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    return (
        <>
            {currentUser && 
                <VStack
                    position={isMilestonesEmpty ? undefined : "fixed"}
                    bottom={isMilestonesEmpty ? "" : "50px"}
                    right={isMilestonesEmpty ? "" : "50px"}
                    mt={isMilestonesEmpty ? "5vh" : ""}
                >
                    <Button
                        variant='solid'
                        colorScheme='yellow'
                        size="lg"
                        aria-label='create-milestone'
                        leftIcon={<AddIcon />}
                        onClick={onOpenForMilestone}
                    >
                        {isMilestonesEmpty ? "Add your first Goal" : "Add Goal"}
                    </Button>
                    <CreateMilestoneForm
                        onCloseForMilestone={onCloseForMilestone}
                        isOpenForMilestone={isOpenForMilestone}
                    />
                </VStack>
            }
        </>
    )
}

export default RightDrawer;