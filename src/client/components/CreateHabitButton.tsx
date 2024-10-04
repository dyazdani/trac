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
    useToast,
    Text,
    Flex
} from "@chakra-ui/react";
import { 
    AddIcon, 
    ChevronDownIcon
} from "@chakra-ui/icons";
import { useCreateHabitMutation, useCreateScheduleMutation } from "../features/api.js";
import { DayOfTheWeek, User } from "@prisma/client";
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
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    const [createHabit, {isLoading}] = useCreateHabitMutation();
    const [
        createSchedule, 
        {
            isLoading: isScheduleLoading,
            error: scheduleError
        }
    ] = useCreateScheduleMutation();

    if (currentUser) {
        return (
            <>
                {milestone.habits.length ?
                <MenuItem
                    aria-label="Add Habit" 
                    icon={<AddIcon/>}
                    display={milestone && milestone.isCompleted || milestone.isCanceled ? "none" : ""}
                    onClick={onOpen}
                    backgroundColor="turquoise.50"
                    _hover={{
                        backgroundColor: "turquoise.100"
                    }}
                    _active={{
                        backgroundColor: "turquoise.200"
                    }}
                >
                    Add Habit
                </MenuItem> :
                <Button 
                    minWidth="80%"
                    aria-label="Add Habit" 
                    leftIcon={<AddIcon />} 
                    isDisabled={milestone && milestone.isCompleted || milestone.isCanceled}
                    variant="solid"
                    onClick={onOpen}
                    backgroundColor="turquoise.50"
                    _hover={{
                        backgroundColor: "turquoise.100"
                    }}
                    _active={{
                        backgroundColor: "turquoise.200"
                    }}
                >
                    {`Add first Habit to "${milestone.name}"`}
                </Button>
                }
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
                                                title: 'Habit Created',
                                                description: `"${habit.name}" added to Goal "${milestone.name}"`,
                                                variant: 'subtle',
                                                status: 'success',
                                                duration: 9000,
                                                isClosable: true,
                                                icon: <AddIcon />
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
                                    <CheckboxGroup 
                                        colorScheme='stormyblue' 
                                        onChange={(e: RoutineDaysArrayType) => {
                                            setCheckboxGroupValue(e);
                                        }} 
                                        value={checkboxGroupValue}
                                    >
                                        <Stack direction='row'>
                                            <Checkbox 
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
                                <Checkbox
                                    isChecked
                                    isDisabled
                                >I agree to have Trac email me a weekly reminder on my Check-In Day (unsubscribing from these emails not available at this time).</Checkbox>
                            </Stack>
                        </DrawerBody>
                        <DrawerFooter>
                            <ButtonGroup>
                                <Button 
                                    variant="outline" 
                                    colorScheme='stormyblue' 
                                    mr={3} 
                                    onClick={e => {
                                        onClose();
                                        setMenuValue('Monday');
                                        setCheckboxGroupValue([]);
                                        setHabitNameValue('New Habit');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    mr={3}  
                                    type="submit"
                                    form="habitForm"
                                    paddingX={"2rem"}
                                    isLoading={isLoading || isScheduleLoading}
                                    backgroundColor="stormyblue.400"
                                    _hover={{
                                        backgroundColor: "stormyblue.500",
                                    }}
                                    _active={{
                                        backgroundColor: "stormyblue.600",
                                        color: "floralwhite.50"
                                    }}
                                    isDisabled={!checkboxGroupValue.length || !habitNameValue }
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