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
    useToast
  } from '@chakra-ui/react'
import { useAppSelector } from '../app/hooks.js';
import { SingleDatepicker } from 'chakra-dayzed-datepicker';
import { useCreateMilestoneMutation } from '../features/api.js';

export interface CreateMilestoneFormProps {
    isOpenForMilestone: boolean
    onCloseForMilestone: () => void
}

const CreateMilestoneForm = ({isOpenForMilestone, onCloseForMilestone}: CreateMilestoneFormProps) => {
    const [datepickerValue, setDatepickerValue] = useState<Date | null>(null)
    const [milestoneNameValue, setMilestoneNameValue] = useState("")

    const [createMilestone] = useCreateMilestoneMutation();

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
                                        title: 'Milestone created.',
                                        description: 'Your new Milestone was created and added to your dashboard.',
                                        status: 'success',
                                        duration: 9000,
                                        isClosable: true
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