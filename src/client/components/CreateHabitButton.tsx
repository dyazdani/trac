import { 
    Box, 
    Button, 
    ButtonGroup, 
    Checkbox, 
    CheckboxGroup, 
    Drawer, 
    DrawerBody, 
    DrawerContent, 
    DrawerFooter, 
    DrawerHeader, 
    DrawerOverlay, 
    Editable, 
    EditableInput, 
    EditablePreview, 
    FormControl, 
    FormLabel, 
    IconButton, 
    Menu, 
    MenuButton, 
    MenuItemOption, 
    MenuList, 
    MenuOptionGroup, 
    Stack, 
    useDisclosure, 
    useToast 
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon, EditIcon } from "@chakra-ui/icons";
import { useCreateHabitMutation, useCreateScheduleMutation } from "../features/api.js";
import { DayOfTheWeek } from "@prisma/client";
import React, { useState } from "react";
import getBooleanRoutineDays from "..//utils/getBooleanRoutineDays.js";
import { useAppSelector } from "../app/hooks.js";
import { MilestoneWithDetails, RoutineDaysArrayType } from "../../types/index.js";
import { DaysOfWeek } from "@knocklabs/node";

export interface CreateHabitButtonProps{
    milestone: MilestoneWithDetails
}

const CreateHabitButton = ({milestone}: CreateHabitButtonProps) => {
    const [menuValue, setMenuValue] = useState<string | string[]>('Monday')
    const [checkboxGroupValue, setCheckboxGroupValue] = useState<RoutineDaysArrayType>([])
    const [habitNameValue, setHabitNameValue] = useState("New Habit")
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const inputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();
    
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    const [createHabit, {isLoading, data, error}] = useCreateHabitMutation();
    const [
        createSchedule, 
        {
            isLoading: isScheduleLoading,
            data: scheduleData,
            error: scheduleError
        }
    ] = useCreateScheduleMutation();

    const iconButtonBackgroundColor = milestone.isCompleted ? "rgba(249, 209, 98, 0.1)" : milestone.isCanceled ? "rgba(212, 211, 212, 1)" : ""

    if (currentUser) {
        return (
            <>
            <Button 
                aria-label="Add Habit" 
                leftIcon={<AddIcon />} 
                isDisabled={milestone && milestone.isCompleted || milestone.isCanceled}
                variant="solid"
                border="1px solid black"
                onClick={onOpen}
                backgroundColor={iconButtonBackgroundColor}
                colorScheme="yellow"
            >{!milestone.habits.length ? `Add first Habit for "${milestone.name}"` : "Add Habit"}</Button>
                <Drawer 
                    placement='right' 
                    onClose={onClose} 
                    isOpen={isOpen}
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
                            Add a Habit
                        </DrawerHeader>
                        <DrawerBody>
                            <Stack
                                as="form"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                if (
                                    currentUser && 
                                    typeof menuValue === 'string' && 
                                    checkboxGroupValue &&
                                    !checkboxGroupValue.some(el => typeof el === 'number')
                                ) {
                                    try {
                                        const { schedules } = await createSchedule({
                                            habitName: habitNameValue,
                                            milestoneName: milestone.name,
                                            days: [DaysOfWeek[menuValue.slice(0, 3) as keyof typeof DaysOfWeek]],
                                            workflowKey: "check-in-day"
                                        }).unwrap()

                                        if (!scheduleError && schedules) {
                                            const { habit } = await createHabit({
                                                id: currentUser.id,
                                                habitDetails: {
                                                    name: habitNameValue,
                                                    routineDays: getBooleanRoutineDays(checkboxGroupValue),
                                                    checkInDay:  DayOfTheWeek[menuValue.toUpperCase() as keyof typeof DayOfTheWeek],
                                                    scheduleId: schedules[0].id,
                                                    milestoneId: milestone.id
                                                }
                                            }).unwrap()

                                            onClose()

                                            console.log(schedules)

                                            toast({
                                                title: 'Habit added.',
                                                description: `Your new Habit "${habit.name}" was created and added to ${milestone.name}.`,
                                                status: 'success',
                                                duration: 9000,
                                                isClosable: true
                                            })

                                            setMenuValue('Monday');
                                            setCheckboxGroupValue([]);
                                            setHabitNameValue('New Habit');
                                        }   
                                    } catch (e) {
                                        console.error(e)
                                        toast({
                                            title: 'ERROR',
                                            description: `Could not create/add your Habit.`,
                                            status: 'error',
                                            duration: 9000,
                                            isClosable: true
                                        })
                                    }
                                }
                            }}
                                id="habitForm"
                                spacing="3vw"
                            >
                                <Box>
                                    <FormControl isRequired>
                                        <FormLabel
                                            htmlFor="habitName"
                                        >
                                            Name
                                        </FormLabel>
                                        <Editable
                                            defaultValue="New Habit"
                                        >
                                            <EditablePreview />
                                            <EditableInput 
                                                id="habitName" 
                                                ref={inputRef}
                                                onChange={(e) => {setHabitNameValue(e.target.value)}}
                                                value={habitNameValue}
                                                paddingLeft="16px"
                                                paddingRight="16px"    
                                            />
                                        </Editable>
                                    </FormControl>
                                    
                                </Box>
                                {/* TODO: Prevent submitting form unless > 0 boxes are checked */}
                                <Box as="fieldset">
                                    <FormLabel>Weekly Routine</FormLabel>
                                    <CheckboxGroup colorScheme='teal' onChange={(e: RoutineDaysArrayType) => {
                                        setCheckboxGroupValue(e);
                                    }} 
                                        value={checkboxGroupValue}
                                    >
                                        <Stack direction='row'>
                                            <Checkbox value="monday">M</Checkbox>
                                            <Checkbox value="tuesday">T</Checkbox>
                                            <Checkbox value="wednesday">W</Checkbox>
                                            <Checkbox value="thursday">Th</Checkbox>
                                            <Checkbox value="friday">F</Checkbox>
                                            <Checkbox value="saturday">Sa</Checkbox>
                                            <Checkbox value="sunday">Su</Checkbox>
                                        </Stack>
                                    </CheckboxGroup>
                                </Box>
                                <Box>
                                    <FormLabel>Check-In Day</FormLabel>
                                    <Menu>
                                        <MenuButton 
                                            as={Button} 
                                            rightIcon={<ChevronDownIcon />}
                                            colorScheme="blue"
                                            variant="outline"
                                        >{menuValue}</MenuButton>
                                        <MenuList>
                                            <MenuOptionGroup 
                                            type='radio'
                                            value={menuValue}
                                            onChange={
                                                (e) => {
                                                    setMenuValue(e)
                                            }}
                                            >
                                                <MenuItemOption value='Monday'>Monday</MenuItemOption>
                                                <MenuItemOption value='Tuesday'>Tuesday</MenuItemOption>
                                                <MenuItemOption value='Wednesday'>Wednesday</MenuItemOption>
                                                <MenuItemOption value='Thursday'>Thursday</MenuItemOption>
                                                <MenuItemOption value='Friday'>Friday</MenuItemOption>
                                                <MenuItemOption value='Saturday'>Saturday</MenuItemOption>
                                                <MenuItemOption value='Sunday'>Sunday</MenuItemOption>
                                            </MenuOptionGroup>
                                        </MenuList>
                                    </Menu>
                                </Box>
                                <Checkbox
                                    isChecked
                                    isDisabled
                                >I agree to have trac email me a weekly reminder on my Check-In Day (unsubscribing from these emails not available at this time).</Checkbox>
                            </Stack>
                        </DrawerBody>
                        <DrawerFooter>
                            <ButtonGroup>
                                <Button 
                                    variant="outline" 
                                    colorScheme='yellow' 
                                    mr={3} 
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    mr={3}  
                                    colorScheme='yellow' 
                                    type="submit"
                                    form="habitForm"
                                >
                                    Add
                                </Button>
                            </ButtonGroup>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        )
    }
}

export default CreateHabitButton;