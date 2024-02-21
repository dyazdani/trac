import {
    useDisclosure,
    Button,
    VStack,
    IconButton
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useAppSelector } from '../app/hooks.js'
import CreateMilestoneForm from './CreateMilestoneForm.js'

export interface RightDrawerProps {
    toggleBannerDisplayed: () => void
}

const RightDrawer = ({ toggleBannerDisplayed }: RightDrawerProps) => {
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
                position="fixed"
                bottom="50px"
                right="50px"
                >
                    <IconButton
                    variant='solid'
                    colorScheme='yellow'
                    size="lg"
                    aria-label='create-milestone'
                    icon={<AddIcon />}
                    isRound={true}
                    onClick={onOpenForMilestone}
                    >
                    </IconButton>
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