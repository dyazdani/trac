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
    MenuItem, 
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
    useUpdateScheduleMutation, 
    useUpdateMilestoneMutation
} from "../features/api.js";
import { DayOfTheWeek } from "@prisma/client";
import React, { useState } from "react";
import getBooleanRoutineDays from "..//utils/getBooleanRoutineDays.js";
import { useAppSelector } from "../app/hooks.js";
import { HabitWithDetails, MilestoneWithDetails, RoutineDaysArrayType } from "../../types/index.js";
import getRoutineDaysStringArray from "..//utils/getRoutineDaysStringArray.js";
import { DaysOfWeek } from "@knocklabs/node";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

export interface UpdateMilestoneMenuItemProps{
    milestone: MilestoneWithDetails
}

const UpdateMilestoneButton = ({milestone}: UpdateMilestoneMenuItemProps) => {
    const [datepickerValue, setDatepickerValue] = useState<Date | null>(milestone.dueDate)
    const [milestoneNameValue, setMilestoneNameValue] = useState(milestone.name)
    const { isOpen: isOpenForUpdateMilestone, onClose: onCloseForUpdateMilestone, onOpen: onOpenForUpdateMilestone} = useDisclosure();

    const [updateMilestone] = useUpdateMilestoneMutation();

    const inputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();


    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        return (
            <>
                <MenuItem
                    aria-label="Edit Goal" 
                    icon={<EditIcon/>}
                    onClick={onOpenForUpdateMilestone}
                >Edit Goal</MenuItem>
                <Drawer 
                    placement='right' 
                    onClose={onCloseForUpdateMilestone} 
                    isOpen={isOpenForUpdateMilestone}
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
                        Edit a Milestone
                    </DrawerHeader>
                    <DrawerBody>
                        <Stack
                            as="form"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (currentUser && datepickerValue) {
                                    try {
                                            const { milestone: updatedMilestone } = await updateMilestone({
                                                ownerId: currentUser.id,
                                                milestoneId: milestone.id,
                                                newMilestone: {
                                                    name: milestoneNameValue,
                                                    dueDate: datepickerValue,
                                                    isCompleted: milestone.isCompleted,
                                                    isCanceled: milestone.isCanceled
                                                }
                                            }).unwrap()

                                            console.log(updatedMilestone)

                                            onCloseForUpdateMilestone()

                                            toast({
                                                title: 'Milestone updated.',
                                                description: 'Your new Milestone was updated.',
                                                status: 'success',
                                                duration: 9000,
                                                isClosable: true
                                            })  
                                    } catch (e) {
                                        console.error(e)
                                    }
                                }
                            }}
                            id="updateMilestoneForm"
                            spacing="3vw"
                        >
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel
                                        htmlFor="milestoneName"
                                    >
                                        Name
                                    </FormLabel>
                                    <Editable
                                        defaultValue={milestone.name}
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
                            <FormControl isRequired>
                                <FormLabel
                                    htmlFor="dueDate"
                                >
                                    Due Date</FormLabel>
                                <SingleDatepicker
                                    date={new Date()}
                                    onDateChange={setDatepickerValue}
                                />
                            </FormControl>
                            </Box>
                        </Stack>
                    </DrawerBody>
                    <DrawerFooter>
                        <ButtonGroup>
                            <Button 
                                variant="outline" 
                                colorScheme='yellow' 
                                mr={3} 
                                onClick={onCloseForUpdateMilestone}
                            >
                                Cancel
                            </Button>
                            <Button 
                                mr={3}  
                                colorScheme='yellow' 
                                type="submit"
                                form="updateMilestoneForm"
                            >
                                Update
                            </Button>
                        </ButtonGroup>
                    </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
        )
    }
}

export default UpdateMilestoneButton;