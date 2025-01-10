import { 
    Box, 
    Button, 
    ButtonGroup, 
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
    MenuItem,  
    Stack, 
    useDisclosure, 
    useToast 
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import {  useUpdateGoalMutation } from "../features/api.js";
import React, { useState } from "react";
import { useAppSelector } from "../app/hooks.js";
import { GoalWithDetails } from "../../types/index.js";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { User } from "@prisma/client";

export interface UpdateGoalMenuItemProps{
    goal: GoalWithDetails
}

const UpdateGoalButton = ({goal}: UpdateGoalMenuItemProps) => {
    const [datepickerValue, setDatepickerValue] = useState<Date | undefined>(new Date(goal.dueDate))
    const [goalNameValue, setGoalNameValue] = useState(goal.name)
    const { isOpen: isOpenForUpdateGoal, onClose: onCloseForUpdateGoal, onOpen: onOpenForUpdateGoal} = useDisclosure();

    const [updateGoal, { isLoading }] = useUpdateGoalMutation();

    const inputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();


    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        return (
            <>
                <MenuItem
                    aria-label="Edit Goal" 
                    icon={<EditIcon/>}
                    onClick={onOpenForUpdateGoal}
                    backgroundColor="turquoise.50"
                    _hover={{
                        backgroundColor: "turquoise.100"
                    }}
                    _active={{
                        backgroundColor: "turquoise.200"
                    }}
                >Edit Goal</MenuItem>
                <Drawer 
                    placement='right' 
                    onClose={onCloseForUpdateGoal} 
                    isOpen={isOpenForUpdateGoal}
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
                        Edit a Goal
                    </DrawerHeader>
                    <DrawerBody>
                        <Stack
                            as="form"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (currentUser && datepickerValue) {
                                    try {
                                            const { goal: updatedGoal } = await updateGoal({
                                                ownerId: currentUser.id,
                                                goalId: goal.id,
                                                newGoal: {
                                                    name: goalNameValue,
                                                    dueDate: datepickerValue,
                                                    isCompleted: goal.isCompleted,
                                                    isCanceled: goal.isCanceled
                                                }
                                            }).unwrap()

                                            console.log(updatedGoal)

                                            onCloseForUpdateGoal()

                                            toast({
                                                title: `Goal Updated`,
                                                description: `"${goal.name}" was successfully updated.`,
                                                status: 'success',
                                                variant: 'subtle',
                                                duration: 9000,
                                                isClosable: true,
                                                icon: <EditIcon boxSize="1.4em"/>
                                            })  
                                    } catch (e) {
                                        console.error(e)
                                        toast({
                                            title: 'ERROR',
                                            description: `Unable to update Goal "${goal.name}"`,
                                            status: 'error',
                                            duration: 4000,
                                            isClosable: true
                                        })
                                    }
                                }
                            }}
                            id="updateGoalForm"
                            spacing="3vw"
                        >
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel
                                        htmlFor="goalName"
                                    >
                                        Name
                                    </FormLabel>
                                    <Editable
                                        defaultValue={goal.name}
                                    >
                                        <EditablePreview />
                                        <EditableInput 
                                            id="goalName" 
                                            ref={inputRef}
                                            onChange={(e) => {setGoalNameValue(e.target.value)}}
                                            value={goalNameValue}
                                            paddingLeft="16px"
                                            paddingRight="16px"
                                        />
                                    </Editable>
                                </FormControl>  
                            </Box>
                            <Box>
                            <FormControl 
                                isRequired
                            >
                                <FormLabel
                                    htmlFor="dueDate"
                                >
                                    Due Date</FormLabel>
                                    <SingleDatepicker
                                        id="dueDate"
                                        configs={{
                                            dateFormat: "MM-dd-yyyy"   
                                        }}
                                        propsConfigs={{
                                            popoverCompProps: {
                                            popoverBodyProps:  {
                                                maxWidth: "100dvw"
                                            }
                                            }
                                        }}
                                        name="date-input"
                                        date={datepickerValue}
                                        minDate={new Date()}
                                        onDateChange={(e) => {
                                            setDatepickerValue(e)
                                        }}
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
                                onClick={onCloseForUpdateGoal}
                            >
                                Cancel
                            </Button>
                            <Button 
                                mr={3}  
                                colorScheme='yellow' 
                                type="submit"
                                form="updateGoalForm"
                                isLoading={isLoading}
                                isDisabled={!datepickerValue || !goalNameValue}
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

export default UpdateGoalButton;