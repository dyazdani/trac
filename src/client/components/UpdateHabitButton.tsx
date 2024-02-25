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
    Menu, 
    MenuButton, 
    MenuItem, 
    MenuItemOption, 
    MenuList, 
    MenuOptionGroup, 
    Stack, 
    useDisclosure, 
    useToast 
} from "@chakra-ui/react";
import { 
    ChevronDownIcon, 
    EditIcon 
} from "@chakra-ui/icons";
import { 
    useUpdateHabitMutation,
    useUpdateScheduleMutation 
} from "../features/api.js";
import { DayOfTheWeek } from "@prisma/client";
import React, { useState } from "react";
import getBooleanRoutineDays from "..//utils/getBooleanRoutineDays.js";
import { useAppSelector } from "../app/hooks.js";
import { 
    HabitWithDetails, 
    RoutineDaysArrayType 
} from "../../types/index.js";
import getRoutineDaysStringArray from "..//utils/getRoutineDaysStringArray.js";
import { DaysOfWeek } from "@knocklabs/node";

export interface UpdateHabitButtonProps{
    habit: HabitWithDetails
}

const UpdateHabitButton = ({habit}: UpdateHabitButtonProps) => {
    const [menuValue, setMenuValue] = useState<string | string[]>(habit.checkIn.dayOfTheWeek)
    const [checkboxGroupValue, setCheckboxGroupValue] = useState<RoutineDaysArrayType>(getRoutineDaysStringArray(habit.routine))
    const [habitNameValue, setHabitNameValue] = useState(habit.name)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const inputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();

    const [updateHabit] = useUpdateHabitMutation();
    const [updateSchedule] = useUpdateScheduleMutation();

    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        return (
            <>
            <MenuItem
                aria-label="Edit Habit" 
                icon={<EditIcon />} 
                onClick={onOpen}
            >Edit Habit</MenuItem>
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
                        Edit a Habit
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
                                    !checkboxGroupValue.some(el => typeof el === 'number') &&
                                    habit.scheduleId
                                ) {
                                    try {
                                        const { habit: newHabit, routine, checkIn} = await updateHabit({
                                            id: currentUser.id,
                                            habitId: habit.id,
                                            newHabit: {
                                                name: habitNameValue,
                                                datesCompleted: habit.datesCompleted,
                                                routineDays: getBooleanRoutineDays(checkboxGroupValue as RoutineDaysArrayType),
                                                checkInDay:  DayOfTheWeek[menuValue.toUpperCase() as keyof typeof DayOfTheWeek],
                                                scheduleId: habit.scheduleId
                                            }}).unwrap()

                                        console.log(newHabit)  
                                        console.log(routine) 
                                        console.log(checkIn)

                                        if (checkIn.dayOfTheWeek !== habit.checkIn.dayOfTheWeek) {
                                            const { schedules } = await updateSchedule({
                                                scheduleIds: [habit.scheduleId],
                                                days: [DaysOfWeek[menuValue.slice(0, 3) as keyof typeof DaysOfWeek]]
                                            }).unwrap()

                                            console.log("updatedSchedules: ", schedules);
                                        }
                                        onClose();
                                        toast({
                                            title: 'Habit updated.',
                                            description: 'Your Habit was successfully updated.',
                                            status: 'success',
                                            duration: 9000,
                                            isClosable: true
                                        });
                                    } catch (e) {
                                        console.error(e)
                                        toast({
                                            title: 'ERROR',
                                            description: 'Unable to update habit',
                                            status: 'error',
                                            duration: 4000,
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
                                        defaultValue={habitNameValue}
                                    >
                                        <EditablePreview />
                                        <EditableInput 
                                            id="habitName" 
                                            ref={inputRef}
                                            onChange={(e) => {setHabitNameValue(e.target.value)}}
                                            value={habitNameValue}
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
                                        <Checkbox isChecked={habit.routine.monday} value="monday">M</Checkbox>
                                        <Checkbox isChecked={habit.routine.tuesday} value="tuesday">T</Checkbox>
                                        <Checkbox isChecked={habit.routine.wednesday} value="wednesday">W</Checkbox>
                                        <Checkbox isChecked={habit.routine.thursday} value="thursday">Th</Checkbox>
                                        <Checkbox isChecked={habit.routine.friday} value="friday">F</Checkbox>
                                        <Checkbox isChecked={habit.routine.saturday} value="saturday">Sa</Checkbox>
                                        <Checkbox isChecked={habit.routine.sunday} value="sunday">Su</Checkbox>
                                    </Stack>
                                </CheckboxGroup>
                            </Box>
                            <Box>
                                <FormLabel>Check-In Day</FormLabel>
                                <Menu>
                                    <MenuButton 
                                        as={Button} 
                                        rightIcon={<ChevronDownIcon />}
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
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter>
                        <ButtonGroup>
                            <Button 
                                variant="outline" 
                                colorScheme='teal' 
                                mr={3} 
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                mr={3}  
                                colorScheme='teal' 
                                type="submit"
                                form="habitForm"
                            >
                                Save
                            </Button>
                        </ButtonGroup>
                        
                    </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        )
    }
}

export default UpdateHabitButton;