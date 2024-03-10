import {
    useDisclosure,
    VStack,
    Button
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useAppSelector } from '../app/hooks.js'
import CreateMilestoneForm from './CreateMilestoneForm.js'

export interface RightDrawerProps {
    isMilestonesEmpty: boolean
}

const RightDrawer = ({ isMilestonesEmpty }: RightDrawerProps) => {
    // TODO: Set this value to upper case when sending it to database
    const { isOpen, onClose, onOpen} = useDisclosure();
    const { isOpen: isOpenForMilestone, onClose: onCloseForMilestone, onOpen: onOpenForMilestone} = useDisclosure();

    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    return (
        <>
            {currentUser && 
                <>
                    <Button
                        position={isMilestonesEmpty ? undefined : "fixed"}
                        bottom={isMilestonesEmpty ? "" : "50px"}
                        mt={isMilestonesEmpty ? "5vh" : ""}
                        variant='solid'
                        backgroundColor="yellow.500"
                        _hover={{
                            backgroundColor: "yellow.600"
                        }}
                        _active={{
                            backgroundColor: "yellow.700"
                        }} 
                        size="lg"
                        aria-label='create-goal'
                        leftIcon={<AddIcon />}
                        onClick={onOpenForMilestone}
                    >
                        {isMilestonesEmpty ? "Add your first Goal" : "Add Goal"}
                    </Button>
                    <CreateMilestoneForm
                        onCloseForMilestone={onCloseForMilestone}
                        isOpenForMilestone={isOpenForMilestone}
                    />
                </>     
            }
        </>
    )
}

export default RightDrawer;