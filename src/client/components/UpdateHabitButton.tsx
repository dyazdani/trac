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
import { ChevronDownIcon, EditIcon } from "@chakra-ui/icons";
import { 
    useUpdateHabitMutation,
    useGetSchedulesByUserQuery, 
    useUpdateScheduleMutation 
} from "../features/api.js";
import { DayOfTheWeek } from "@prisma/client";
import React, { useState } from "react";
import getBooleanRoutineDays from "../../utils/getBooleanRoutineDays.js";
import { useAppSelector } from "../app/hooks.js";
import { HabitWithDetails, RoutineDaysArrayType } from "../../types/index.js";
import getRoutineDaysStringArray from "../../utils/getRoutineDaysStringArray.js";
import { DaysOfWeek } from "@knocklabs/node";

export interface UpdateHabitButtonProps{
    habit: HabitWithDetails
}

const UpdateHabitButton = ({habit}: UpdateHabitButtonProps) => {
    const [menuValue, setMenuValue] = useState<string | string[]>(habit.checkIn.dayOfTheWeek);
    const [checkboxGroupValue, setCheckboxGroupValue] = useState<RoutineDaysArrayType>(getRoutineDaysStringArray(habit.routine));
    const [habitNameValue, setHabitNameValue] = useState(habit.name);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();

    console.log("menuValue: ", menuValue);
    console.log("checkboxGroupValue: ", checkboxGroupValue);
    console.log("habitNameValue: ", habitNameValue);

    const [updateHabit] = useUpdateHabitMutation();
    const [updateSchedule] = useUpdateScheduleMutation();

    const currentUser = useAppSelector((state) => state.auth.user);

    if (currentUser) {
        const { data } = useGetSchedulesByUserQuery(currentUser.id);
        let scheduleIds: string[];
        if (data) {
            scheduleIds = data.schedules.map(schedule => schedule.id);
        }

        return (
            <>
            <IconButton 
                aria-label="edit-habit-button" 
                icon={<EditIcon />} 
                variant="unstyled"
                onClick={onOpen}
            />
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
                                    !checkboxGroupValue.some(el => typeof el === 'number')
                                ) {
                                    const newHabit = await updateHabit({
                                        id: currentUser.id,
                                        habitId: habit.id,
                                        newHabit: {
                                            name: habitNameValue,
                                            datesCompleted: habit.datesCompleted,
                                            routineDays: getBooleanRoutineDays(checkboxGroupValue as RoutineDaysArrayType),
                                            checkInDay:  DayOfTheWeek[menuValue.toUpperCase() as keyof typeof DayOfTheWeek]
                                        }
                                    });

                                    console.log("newHabit: ", newHabit)
                                    const updatedSchedules = await updateSchedule({
                                        scheduleIds,
                                        days: [DaysOfWeek[menuValue.slice(0, 3) as keyof typeof DaysOfWeek]]
                                    });

                                    console.log("updatedSchedules: ", updatedSchedules);

                                    onClose();
                                    toast({
                                        title: 'Habit updated.',
                                        description: 'Your Habit was successfully updated.',
                                        status: 'success',
                                        duration: 9000,
                                        isClosable: true
                                    });
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