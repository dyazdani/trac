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
import {  useUpdateMilestoneMutation } from "../features/api.js";
import React, { useState } from "react";
import { useAppSelector } from "../app/hooks.js";
import { MilestoneWithDetails } from "../../types/index.js";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

export interface UpdateMilestoneMenuItemProps{
    milestone: MilestoneWithDetails
}

const UpdateMilestoneButton = ({milestone}: UpdateMilestoneMenuItemProps) => {
    const [datepickerValue, setDatepickerValue] = useState<Date | undefined>(new Date(milestone.dueDate))
    const [milestoneNameValue, setMilestoneNameValue] = useState(milestone.name)
    const { isOpen: isOpenForUpdateMilestone, onClose: onCloseForUpdateMilestone, onOpen: onOpenForUpdateMilestone} = useDisclosure();

    const [updateMilestone, { isLoading }] = useUpdateMilestoneMutation();

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
                        Edit a Goal
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
                                                title: `Goal Updated`,
                                                description: `"${milestone.name}" was successfully updated.`,
                                                status: 'success',
                                                duration: 9000,
                                                isClosable: true,
                                                icon: <EditIcon boxSize="1.4em"/>
                                            })  
                                    } catch (e) {
                                        console.error(e)
                                        toast({
                                            title: 'ERROR',
                                            description: `Unable to update Goal "${milestone.name}"`,
                                            status: 'error',
                                            duration: 4000,
                                            isClosable: true
                                        })
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
                                onClick={onCloseForUpdateMilestone}
                            >
                                Cancel
                            </Button>
                            <Button 
                                mr={3}  
                                colorScheme='yellow' 
                                type="submit"
                                form="updateMilestoneForm"
                                isLoading={isLoading}
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