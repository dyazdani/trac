import React, { useState } from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Button,
    Stack,
    FormLabel,
    Box,
    ButtonGroup,
    Editable,
    EditablePreview,
    EditableInput,
    FormControl,
    useToast,
  } from '@chakra-ui/react'
import { useAppSelector } from '../app/hooks.js';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useCreateGoalMutation } from '../features/api.js';
import { AddIcon } from '@chakra-ui/icons';
import { User } from '@prisma/client';

export interface CreateGoalFormProps {
    isOpenForGoal: boolean
    onCloseForGoal: () => void
}

const CreateGoalForm = ({isOpenForGoal, onCloseForGoal}: CreateGoalFormProps) => {
    const [datepickerValue, setDatepickerValue] = useState<Date | undefined>()
    const [goalNameValue, setGoalNameValue] = useState("New Goal")

    const [createGoal, {isLoading}] = useCreateGoalMutation();

    const inputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();

    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    return (
        <Drawer 
            placement='right' 
            onClose={onCloseForGoal} 
            isOpen={isOpenForGoal}
            closeOnEsc={false}
            closeOnOverlayClick={false}
            size="sm"
            initialFocusRef={inputRef}
        >
            <DrawerOverlay />
            <DrawerContent
                overflowX="hidden"
                overflowY="auto"
            >
                <DrawerHeader 
                    borderBottomWidth='1px'
                >
                    Add a Goal
                </DrawerHeader>
                <DrawerBody>
                    <Stack
                        as="form"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (currentUser && datepickerValue) {
                                try {
                                        const { goal } = await createGoal({
                                            ownerId: currentUser.id,
                                            name: goalNameValue,
                                            dueDate: datepickerValue
                                        }).unwrap()

                                        console.log(goal)

                                        onCloseForGoal()

                                        toast({
                                            title: 'Goal Added',
                                            description: `"${goal.name}" was added to your dashboard.`,
                                            status: 'success',
                                            variant: 'subtle',
                                            duration: 9000,
                                            isClosable: true,
                                            icon: <AddIcon/>
                                        })  
                                } catch (e) {
                                    console.error(e)
                                }
                            }
                        }}
                        id="goalForm"
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
                                    defaultValue='New Goal'
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
                        <FormControl isRequired>
                            <FormLabel
                                htmlFor="dueDate"
                            >
                                Due Date</FormLabel>
                            <SingleDatepicker
                                id="dueDate"
                                name="date-input"
                                propsConfigs={{
                                    popoverCompProps: {
                                    popoverBodyProps:  {
                                        maxWidth: "100dvw"
                                    }
                                    }
                                }}
                                date={datepickerValue}
                                minDate={new Date()}
                                onDateChange={(e) => {
                                    setDatepickerValue(e)
                                }}
                                configs={{
                                    dateFormat: "MM-dd-yyyy"   
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
                            color="yellow.800"
                            mr={6} 
                            onClick={(e) => {
                                e.preventDefault();
                                onCloseForGoal();
                                setDatepickerValue(undefined);
                                setGoalNameValue("New Goal");
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            mr={3}  
                            colorScheme='yellow'
                            _hover={{
                                backgroundColor: "yellow.600"
                            }}
                            _active={{
                                backgroundColor: "yellow.700"
                            }} 
                            type="submit"
                            form="goalForm"
                            isLoading={isLoading}
                            paddingX={"2rem"}
                            isDisabled={!datepickerValue || !goalNameValue}
                        >
                            Add
                        </Button>
                    </ButtonGroup>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateGoalForm;