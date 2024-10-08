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
    Flex, 
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
    useToast ,
    Text
} from "@chakra-ui/react";
import { 
    ChevronDownIcon, 
    EditIcon 
} from "@chakra-ui/icons";
import { 
    useUpdateHabitMutation,
    useUpdateScheduleMutation 
} from "../features/api.js";
import { DayOfTheWeek, User } from "@prisma/client";
import React, { useState } from "react";
import getBooleanRoutineDays from "..//utils/getBooleanRoutineDays.js";
import { useAppSelector } from "../app/hooks.js";
import { 
    HabitWithDetails, 
    RoutineDaysArrayType 
} from "../../types/index.js";
import getRoutineDaysStringArray from "..//utils/getRoutineDaysStringArray.js";
import { DaysOfWeek } from "@knocklabs/node";
import isTodayCheckInDay from "../utils/isTodayCheckInDay.js";
import { useDispatch } from "react-redux";
import { setIsBannerDisplayed } from "../features/bannerSlice.js";
import areDatesSameDayMonthYear from "../utils/areDatesSameDayMonthYear.js";
import getCapitalizedDayOfTheWeek from "../utils/getCapitalizedDayOfTheWeek.js";

export interface UpdateHabitButtonProps{
    habit: HabitWithDetails
}

const UpdateHabitButton = ({habit}: UpdateHabitButtonProps) => {
    const [menuValue, setMenuValue] = useState<string | string[]>(getCapitalizedDayOfTheWeek(habit.checkIn.dayOfTheWeek))
    const [checkboxGroupValue, setCheckboxGroupValue] = useState<RoutineDaysArrayType>(getRoutineDaysStringArray(habit.routine))
    const [habitNameValue, setHabitNameValue] = useState(habit.name)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const inputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();

    const dispatch = useDispatch();

    const [updateHabit, { isLoading }] = useUpdateHabitMutation();
    const [updateSchedule, { isLoading: isScheduleLoading }] = useUpdateScheduleMutation();

    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        return (
            <>
            <MenuItem
                aria-label="Edit Habit" 
                icon={<EditIcon />} 
                onClick={onOpen}
                backgroundColor="cornflowerblue.50"
                _hover={{
                    backgroundColor: "cornflowerblue.100"
                }}
                _active={{
                    backgroundColor: "cornflowerblue.200",
                    color: "floralwhite.50"
                }}
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
                                            title: 'Habit Updated',
                                            description: `"${newHabit.name}" was successfully updated.`,
                                            status: 'success',
                                            variant: 'subtle',
                                            duration: 9000,
                                            isClosable: true,
                                            icon: <EditIcon boxSize="1.4em"/>
                                        });

                                        if (isTodayCheckInDay(checkIn) && !areDatesSameDayMonthYear(new Date(), new Date(habit.dateCreated))) {
                                            dispatch(setIsBannerDisplayed(true))
                                        } else {
                                            dispatch(setIsBannerDisplayed(false))
                                        }
                                    } catch (e) {
                                        console.error(e)
                                        toast({
                                            title: 'ERROR',
                                            description: `Unable to update Habit "${habit.name}"`,
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
                                            paddingLeft="16px"
                                            paddingRight="16px"
                                        />
                                    </Editable>
                                </FormControl>
                                
                            </Box>
                            <Box 
                                as="fieldset"
                            >
                                <FormLabel>
                                    <Flex
                                        alignItems="center"
                                        justifyContent="start"
                                    >
                                        <Text
                                        >
                                            Weekly Routine
                                        </Text>
                                        <Text 
                                            marginLeft="4px"
                                            color="red.500"
                                        >
                                            *
                                        </Text>
                                        <Text 
                                            marginLeft=".5rem" 
                                            color="darkslategray.400"
                                        >
                                            {`(select at least one)`}
                                        </Text>
                                    </Flex>
                                </FormLabel>
                                <CheckboxGroup colorScheme='stormyblue' onChange={(e: RoutineDaysArrayType) => {
                                    setCheckboxGroupValue(e);
                                }} 
                                    value={checkboxGroupValue}
                                >
                                    <Stack direction='row'>
                                        <Checkbox 
                                            isChecked={habit.routine.sunday} 
                                            value="sunday"
                                        >
                                            <Text 
                                                fontSize={{
                                                    base: ".85rem",
                                                    sm: "1rem"
                                                }}
                                            >
                                                Su
                                            </Text>
                                        </Checkbox>
                                        <Checkbox 
                                            isChecked={habit.routine.monday} 
                                            value="monday"
                                        >
                                            <Text 
                                                fontSize={{
                                                    base: ".85rem",
                                                    sm: "1rem"
                                                }}
                                            >
                                                M
                                            </Text>
                                        </Checkbox>
                                        <Checkbox 
                                            isChecked={habit.routine.tuesday} 
                                            value="tuesday"
                                        >
                                            <Text 
                                                fontSize={{
                                                    base: ".85rem",
                                                    sm: "1rem"
                                                }}
                                            >
                                                T
                                            </Text>
                                        </Checkbox>
                                        <Checkbox 
                                            isChecked={habit.routine.wednesday} 
                                            value="wednesday"
                                        >
                                            <Text 
                                                fontSize={{
                                                    base: ".85rem",
                                                    sm: "1rem"
                                                }}
                                            >
                                                W
                                            </Text>
                                        </Checkbox>
                                        <Checkbox 
                                            isChecked={habit.routine.thursday} 
                                            value="thursday"
                                        >
                                            <Text 
                                                fontSize={{
                                                    base: ".85rem",
                                                    sm: "1rem"
                                                }}
                                            >
                                                Th
                                            </Text>
                                        </Checkbox>
                                        <Checkbox 
                                            isChecked={habit.routine.friday} 
                                            value="friday"
                                        >
                                            <Text 
                                                fontSize={{
                                                    base: ".85rem",
                                                    sm: "1rem"
                                                }}
                                            >
                                                F
                                            </Text>
                                        </Checkbox>
                                        <Checkbox 
                                            isChecked={habit.routine.saturday} 
                                            value="saturday"
                                        >
                                            <Text 
                                                fontSize={{
                                                    base: ".85rem",
                                                    sm: "1rem"
                                                }}
                                            >
                                                Sa
                                            </Text>
                                        </Checkbox>
                                    </Stack>
                                </CheckboxGroup>
                            </Box>
                            <Box>
                                <FormLabel>Check-In Day</FormLabel>
                                <Menu>
                                    <MenuButton 
                                        as={Button} 
                                        rightIcon={<ChevronDownIcon />}
                                        colorScheme="stormyblue"
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
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter>
                        <ButtonGroup>
                            <Button 
                                variant="outline" 
                                colorScheme='stormyblue' 
                                mr={3} 
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                mr={3}  
                                backgroundColor="stormyblue.400"
                                _hover={{
                                    backgroundColor: "stormyblue.500",
                                }}
                                _active={{
                                    backgroundColor: "stormyblue.600",
                                    color: "floralwhite.50"
                                }}
                                type="submit"
                                form="habitForm"
                                isLoading={isLoading || isScheduleLoading}
                                isDisabled={!checkboxGroupValue.length || !habitNameValue }
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