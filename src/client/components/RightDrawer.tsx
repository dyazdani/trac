import {
    useDisclosure,
    Button,
    VStack
  } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useAppSelector } from '../app/hooks.js'
import CreateHabitForm from './CreateHabitForm.js'
import CreateMilestoneForm from './CreateMilestoneForm.js'

export interface RightDrawerProps {
    toggleBannerDisplayed: () => void
}

const RightDrawer = ({ toggleBannerDisplayed }: RightDrawerProps) => {
    // TODO: Set this value to upper case when sending it to database
    const { isOpen, onClose, onOpen} = useDisclosure();
    const { isOpen: isOpenForMilestone, onClose: onCloseForMilestone, onOpen: onOpenForMilestone} = useDisclosure();

    const currentUser = useAppSelector((state) => state.auth.user);

    return (
        <>
            {currentUser && 
                <VStack
                position="fixed"
                bottom="50px"
                right="50px"
                >
                    <Button
                    variant='solid'
                    colorScheme='teal'
                    aria-label='Create Milestone'
                    fontSize='1.5vw'
                    leftIcon={<AddIcon />}
                    p="1.5vw"
                    onClick={onOpenForMilestone}
                    >
                        Milestone
                    </Button>
                    <CreateMilestoneForm
                        onCloseForMilestone={onCloseForMilestone}
                        isOpenForMilestone={isOpenForMilestone}
                    />
                    <Button
                    variant='solid'
                    colorScheme='teal'
                    aria-label='Create Habit'
                    fontSize='1.5vw'
                    leftIcon={<AddIcon />}
                    p="1.5vw"
                    onClick={onOpen}
                    >
                        Habit
                    </Button>
                    <CreateHabitForm
                        onClose={onClose}
                        isOpen={isOpen}
                    />
                </VStack>
            }
        </>
    )
}

export default RightDrawer;