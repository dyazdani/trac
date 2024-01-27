import React, { useState } from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Button,
    Stack,
    FormLabel,
    Box,
    Input,
    IconButton,
    ButtonGroup,
    Editable,
    EditablePreview,
    EditableInput,
    CheckboxGroup,
    Checkbox,
    FormControl,
    useCheckboxGroup,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuOptionGroup,
    MenuItemOption,
    useToast
  } from '@chakra-ui/react'
import { useAppSelector } from '../app/hooks.js';
import { RoutineDaysArrayType } from '../../types/index.js';
import { useCreateHabitMutation, useCreateMilestoneMutation, useCreateScheduleMutation } from '../features/api.js';
import { DaysOfWeek } from '@knocklabs/node';
import getBooleanRoutineDays from '../../utils/getBooleanRoutineDays.js';
import { DayOfTheWeek } from '@prisma/client';
import { ChevronDownIcon } from '@chakra-ui/icons';


export interface CreateMilestoneFormProps {
    isOpenForMilestone: boolean
    onCloseForMilestone: () => void
}

const CreateMilestoneForm = ({isOpenForMilestone, onCloseForMilestone}: CreateMilestoneFormProps) => {
    const [menuValue, setMenuValue] = useState<string | string[]>('Monday')
    const [checkboxGroupValue, setCheckboxGroupValue] = useState<RoutineDaysArrayType>([])
    const [milestoneNameValue, setMilestoneNameValue] = useState("")


    const [createMilestone, {isLoading, data, error}] = useCreateMilestoneMutation();
    const [
        createSchedule, 
        {
            isLoading: isScheduleLoading,
            data: scheduleData,
            error: scheduleError
        }
    ] = useCreateScheduleMutation();

    const inputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();

    const currentUser = useAppSelector(state => state.auth.user);

    return (
        <Drawer 
                placement='right' 
                onClose={onCloseForMilestone} 
                isOpen={isOpenForMilestone}
                closeOnEsc={false}
                closeOnOverlayClick={false}
                size="sm"
                initialFocusRef={inputRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                <DrawerHeader 
                    borderBottomWidth='1px'
                >
                    Create a Milestone
                </DrawerHeader>
                <DrawerBody>
                    <Stack
                        as="form"
                        // onSubmit={async (e) => {
                        //     e.preventDefault();
                        //     if (
                        //         currentUser && 
                        //         typeof menuValue === 'string' && 
                        //         checkboxGroupValue &&
                        //         !checkboxGroupValue.some(el => typeof el === 'number')
                        //     ) {
                        //         try {
                        //             const { schedules } = await createSchedule({
                        //                 milestoneName: milestoneNameValue,
                        //                 days: [DaysOfWeek[menuValue.slice(0, 3) as keyof typeof DaysOfWeek]],
                        //                 workflowKey: "check-in-day"
                        //             }).unwrap()

                        //             if (!scheduleError && schedules) {
                        //                 const { milestone } = await createMilestone({
                        //                     ownerId: currentUser.id,
                        //                     milestoneDetails: {
                        //                         name: milestoneNameValue,
                        //                         routineDays: getBooleanRoutineDays(checkboxGroupValue),
                        //                         checkInDay:  DayOfTheWeek[menuValue.toUpperCase() as keyof typeof DayOfTheWeek],
                        //                         scheduleId: schedules[0].id
                        //                     }
                        //                 }).unwrap()

                        //                 onClose()

                        //                 toast({
                        //                     title: 'Milestone created.',
                        //                     description: 'Your new Milestone was created and added to your dashboard.',
                        //                     status: 'success',
                        //                     duration: 9000,
                        //                     isClosable: true
                        //                 })
                        //             }   
                        //         } catch (e) {
                        //             console.error(e)
                        //         }
                        //     }
                        // }}
                        id="milestoneForm"
                        spacing="3vw"
                    >
                        <Box>
                            <FormControl isRequired>
                                <FormLabel
                                    htmlFor="Milestone Name"
                                >
                                    Name
                                </FormLabel>
                                <Editable
                                    defaultValue='New Milestone'
                                >
                                    <EditablePreview />
                                    <EditableInput 
                                        id="milestoneName" 
                                        ref={inputRef}
                                        onChange={(e) => {setMilestoneNameValue(e.target.value)}}
                                        value={milestoneNameValue}
                                    />
                                </Editable>
                            </FormControl>
                            
                        </Box>
                        <Box>
                            <FormLabel>Due Date</FormLabel>
                        </Box>
                    </Stack>
                </DrawerBody>
                <DrawerFooter>
                    <ButtonGroup>
                        <Button 
                            variant="outline" 
                            colorScheme='teal' 
                            mr={3} 
                            onClick={onCloseForMilestone}
                        >
                            Cancel
                        </Button>
                        <Button 
                            mr={3}  
                            colorScheme='teal' 
                            type="submit"
                            form="milestoneForm"
                        >
                            Create
                        </Button>
                    </ButtonGroup>
                </DrawerFooter>
                </DrawerContent>
            </Drawer>
    )
}

export default CreateMilestoneForm;