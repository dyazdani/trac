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
import { useCreateMilestoneMutation } from '../features/api.js';
import { AddIcon } from '@chakra-ui/icons';
import { User } from '@prisma/client';

export interface CreateMilestoneFormProps {
    isOpenForMilestone: boolean
    onCloseForMilestone: () => void
}

const CreateMilestoneForm = ({isOpenForMilestone, onCloseForMilestone}: CreateMilestoneFormProps) => {
    const [datepickerValue, setDatepickerValue] = useState<Date | undefined>()
    const [milestoneNameValue, setMilestoneNameValue] = useState("New Goal")

    const [createMilestone, {isLoading}] = useCreateMilestoneMutation();

    const inputRef = React.useRef<HTMLInputElement>(null);
    const toast = useToast();

    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
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
                Add a Goal
            </DrawerHeader>
            <DrawerBody>
                <Stack
                    as="form"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (currentUser && datepickerValue) {
                            try {
                                    const { milestone } = await createMilestone({
                                        ownerId: currentUser.id,
                                        name: milestoneNameValue,
                                        dueDate: datepickerValue
                                    }).unwrap()

                                    console.log(milestone)

                                    onCloseForMilestone()

                                    toast({
                                        title: 'Goal Added',
                                        description: `"${milestone.name}" was added to your dashboard.`,
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
                    id="milestoneForm"
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
                                defaultValue='New Goal'
                            >
                                <EditablePreview />
                                <EditableInput 
                                    id="milestoneName" 
                                    ref={inputRef}
                                    onChange={(e) => {setMilestoneNameValue(e.target.value)}}
                                    value={milestoneNameValue}
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
                            onCloseForMilestone();
                            setDatepickerValue(undefined);
                            setMilestoneNameValue("New Goal");
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
                        form="milestoneForm"
                        isLoading={isLoading}
                        paddingX={"2rem"}
                        isDisabled={!datepickerValue || !milestoneNameValue}
                    >
                        Add
                    </Button>
                </ButtonGroup>
            </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateMilestoneForm;