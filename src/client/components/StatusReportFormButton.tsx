import React, { useState } from 'react';
import { useSendStatusReportMutation } from '../features/api.js';
import { 
    Button, 
    ButtonGroup 
} from '@chakra-ui/button';
import { 
    Box, 
    Drawer, 
    DrawerBody, 
    DrawerContent, 
    DrawerFooter, 
    DrawerHeader, 
    DrawerOverlay, 
    FormControl, 
    FormLabel,
    Input, 
    Stack, 
    Textarea, 
    useDisclosure, 
    useToast 
} from '@chakra-ui/react';
import { useAppSelector } from '../app/hooks.js';
import { HabitWithDetails, MilestoneWithDetails } from '../../types/index.js';
import getDefaultStatusReportMessage from '..//utils/getDefaultStatusReportMessage.js';
import getMostRecentCheckInDayDate from '..//utils/getMostRecentCheckInDayDate.js';
import { EmailIcon } from '@chakra-ui/icons';
import { User } from '@prisma/client';


export interface StatusReportFormButtonProps {
    habit: HabitWithDetails
    milestone: MilestoneWithDetails
    textContent: string
}

const StatusReportFormButton = ({habit, milestone, textContent}: StatusReportFormButtonProps) => {
    const localStorageUser = localStorage.getItem("user")
    const appSelectorUser = useAppSelector(state => state.auth.user)
    const currentUser: Omit<User, "password"> | null = localStorageUser ? JSON.parse(localStorageUser) : appSelectorUser
    
    if (currentUser) {
        const [emails, setEmails] = useState<string[]>([])
        const [message, setMessage] = useState(getDefaultStatusReportMessage(habit, milestone, currentUser.username))
        const { isOpen, onOpen, onClose } = useDisclosure()
        const inputRef = React.useRef<HTMLInputElement>(null);
        const toast = useToast();

        const [sendStatusReport, {isLoading}] = useSendStatusReportMutation();
        
        const checkInDate = getMostRecentCheckInDayDate(habit);

        const handleSubmit = async () => {
            try {
                onClose();
                if (checkInDate) {
                    const { statusReport } = await sendStatusReport({
                        id: currentUser?.id,
                        habitId: habit.id,
                        user: currentUser?.username,
                        habitName: habit.name,
                        emails,
                        message,
                        checkInDate
                    }).unwrap()
                if (statusReport) {
                    toast({
                        title: 'Check-In Report Sent',
                        description: `Your Check-In Report email for "${habit.name}" was sent.`,
                        status: 'success',
                        variant: 'subtle',
                        duration: 9000,
                        isClosable: true,
                        icon: <EmailIcon boxSize="1.4em"/>
                    })
                } else {
                    toast({
                        title: 'Sending Failed',
                        description: `Your Check-In Report for "${habit.name}" failed to send.`,
                        status: 'error',
                        duration: 9000,
                        isClosable: true
                    })
                }}
            } catch (error) {
                console.error(error)
            }
            
        }
        
        return (
            <>
            <Button
            backgroundColor="yellow.500"
            _hover={{
                backgroundColor: "yellow.600"
            }}
            _active={{
                backgroundColor: "yellow.700"
            }} 
            aria-label='send Check-In Report form'
            fontSize='20px'
            border="2mm ridge rgba(249, 199, 31, 0.6)"
            onClick={(e) => {
                e.preventDefault();
                if (!message) {
                    setMessage(getDefaultStatusReportMessage(habit, milestone, currentUser.username))
                }
                onOpen();
            }}
            >
                {textContent}
            </Button>
            <Drawer 
                placement='right' 
                onClose={onClose} 
                isOpen={isOpen}
                closeOnEsc={false}
                closeOnOverlayClick={false}
                size="md"
                initialFocusRef={inputRef}
            >

                    <DrawerOverlay />
                    <DrawerContent>
                    <DrawerHeader 
                        borderBottomWidth='1px'
                    >
                        Send a Check-In Report
                    </DrawerHeader>
                    <DrawerBody>
                        <Stack
                            as="form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit()
                            }}
                            id="check-in-report-form"
                            spacing="3vw"
                        >
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel
                                        htmlFor="emails"
                                    >
                                        Email Check-in Report To:
                                    </FormLabel>
                                    <Input
                                        placeholder="example@gmail.com, example_two@mail.com, etc."
                                        isRequired
                                        type="email"
                                        id="emails" 
                                        ref={inputRef}
                                        multiple
                                        onChange={(e) => {setEmails(e.target.value.split(","))}}
                                        value={emails}
                                        />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel
                                        htmlFor='check-in-report-message'
                                    >
                                        Check-In Report Email Body:
                                    </FormLabel>
                                    <Textarea
                                        isRequired
                                        id="check-in-report-message"
                                        size="lg"
                                        placeholder={`Dear Friends, \n\nThis past week I completed my Habit everyday.  \n\n Cheers!`}
                                        value={message}
                                        onChange={(e) => {setMessage(e.target.value)}}
                                        minHeight="20rem"
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
                                mr={3} 
                                onClick={(e) => {
                                    e.preventDefault();
                                    onClose();
                                    setMessage("");
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                mr={3}  
                                backgroundColor="yellow.500"
                                _hover={{
                                    backgroundColor: "yellow.600"
                                }}
                                _active={{
                                    backgroundColor: "yellow.700"
                                }} 
                                type="submit"
                                form="check-in-report-form"
                                isLoading={isLoading}
                                isDisabled={!message || !emails.length}
                            >
                                Send
                            </Button>
                        </ButtonGroup>
                    </DrawerFooter>
                    </DrawerContent>
            </Drawer>
            </>
        )
    }
    
}

export default StatusReportFormButton;