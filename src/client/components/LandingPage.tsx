import { 
    Box,
    Button,
    Heading, 
    Spacer, 
    VStack,
    Image,
    Card,
    Flex,
    List,
    ListItem,
    ListIcon,
    Text,
    Highlight,
    Show,
    Link
} from "@chakra-ui/react";
import AppHeader from "./AppHeader.js";
import { 
    ChevronRightIcon, 
    CheckCircleIcon, 
    ExternalLinkIcon
} from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import ArtistCredit from "./ArtistCredit.js";

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <Show 
                below="md"
            >
                <Heading 
                    as="h1" 
                    size="lg" 
                    textAlign="center" 
                    backgroundColor="yellow.500"
                    padding="1vw"
                >
                    Trac not yet optimized for tablet or mobile devices. Please switch to desktop for optimum experience.
                </Heading>
            </Show>
            <AppHeader isBannerDisplayed={false}/>
\            <VStack
                h="100vh"                                                                                                                                          
                w="100vw"
                maxWidth="100%"
                spacing="0"
            >
                <Box
                    w="100vw"
                    maxWidth="100%"
                    bgImage="url('/images/landing_page_bg_image.jpg')"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                    bgSize="cover" 
                >
                    <Heading
                        as="h1"
                        size="3xl"
                        mt="4vw"
                        textAlign="center"
                    >
                        Your secret, goal-achieving weapon.
                    </Heading>
                    <Text
                        fontSize="xl"
                        mt="2vw"
                        textAlign="center"
                    >
                        Track your habits. Share your progress. Crush your goals.
                    </Text>
                    <Flex
                        direction="column"
                        w="100%"
                        alignItems="center"
                    >
                        <Button
                            rightIcon={<ChevronRightIcon/>}
                            colorScheme="orange"
                            color="#000000"
                            mt="8vw"
                            mb="4vw"
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/register');
                            }}
                        >
                            Get Started
                        </Button> 
                    </Flex>
                </Box>
                <VStack
                    w="100vw"
                    maxW="100%"
                    p="4vw"
                    bgColor="orange.50"
                    pb="0"

                >
                    <Heading 
                        as="h2" 
                        textAlign="center"
                        pb="4vw"
                        w="60vw"
                    >
                        <Highlight
                            query={['Goals', 'Goal', 'Habits', 'Habit']}
                            styles={{
                                color: '#979EF6'
                            }}
                        >
                            Create Goals and the Habits required to meet them. Check off each day you practice your Habit. Mark your Goal as complete when it's finished. 
                        </Highlight>
                    </Heading>
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Card
                            boxShadow="2xl"
                            height="fit-content"
                            width="fit-content"
                        >
                            <Image
                                src="/images/trac_screenshot.jpg"
                                alt="trac screenshot"
                                maxH="60vh"
                                minH="40vh"
                            />
                        </Card>
                        <Spacer
                            minW="6vw"
                            maxW="10vw"
                        />
                        <Card
                            p="2vw"
                            boxShadow="2xl"
                            bgColor="#fef8e6"
                            h="fit-content"
                        >

                            <List
                                spacing="1vw"
                            >
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="#979EF6" boxSize="1.6rem" mr="1rem"/>
                                    Assign a due date for each Goal.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="#979EF6" boxSize="1.6rem" mr="1rem"/>
                                    Choose which days of the week to practice each Habit. 
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="#979EF6" boxSize="1.6rem" mr="1rem"/>
                                    Record your progress. 
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="#979EF6" boxSize="1.6rem" mr="1rem"/>
                                    Make revisions as needed, even to past days.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="#979EF6" boxSize="1.6rem" mr="1rem"/>
                                    Complete or cancel your Goal.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="#979EF6" boxSize="1.6rem" mr="1rem"/>
                                    Edit or delete Habits and/or Goals at any time.
                                </ListItem>
                            </List>
                        </Card>
                    </Flex>
                    <Heading 
                        as="h2" 
                        textAlign="center"
                        pb="4vw"
                        pt="5vw"
                        w="60vw"
                    >
                        <Highlight
                            query={['Status Report', 'Check-In Day', 'social accountability']}
                            styles={{
                                color: 'orange.500'
                            }}
                        >
                            Email a Status Report to your friends every week on your Habit's Check-In Day. Research shows that social accountability works. 
                        </Highlight>
                    </Heading>
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Card
                            p="2vw"
                            boxShadow="2xl"
                            bgColor="#fef8e6"
                            h="fit-content"
                            maxW="50vw"
                        >
                            <List
                                spacing="1vw"
                            >
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="orange.500" boxSize="1.6rem" mr="1rem"/>
                                    <Text as="b">Send Status Report</Text> button appears when it is a Check-In Day.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="orange.500" boxSize="1.6rem" mr="1rem"/>
                                    Receive in-app and email reminders to send status reports as well.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="orange.500" boxSize="1.6rem" mr="1rem"/>
                                    Editable text pre-populates the status report form, making it easy to compose a message quickly. 
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="orange.500" boxSize="1.6rem" mr="1rem"/>
                                    Add emails of everyone you want to send status report to and click <Text as="b">Send</Text>.
                                </ListItem>
                            </List>
                        </Card>
                        <Spacer
                            minW="6vw"
                            maxW="10vw"
                        />
                        <Card
                            boxShadow="2xl"
                            height="fit-content"
                            width="fit-content"
                        >
                            <Image
                                src="/images/status_report_button_screenshot.png"
                                alt="status report button screenshot"
                                maxH="80vh"
                                minH="50vh"
                            />
                        </Card>
                    </Flex>
                    <Card
                        boxShadow="2xl"
                        height="fit-content"
                        width="fit-content"
                        mt="5vw"
                    >
                        <Image
                            src="/images/status_report_form_drawer_screenshot.png"
                            alt="status report form drawer screenshot"
                            minW="70vw"
                        />
                    </Card>
                    <Heading 
                        as="h2" 
                        textAlign="center"
                        pb="3vw"
                        pt="4vw"
                        w="60vw"
                    >
                        <Text color="#979EF6" mb="2vw">Dream.</Text>
                        <Text color="green.500" mb="2vw">Achieve.</Text> 
                        <Text color="orange.500" mb="2vw">Inspire.</Text>
                        trac 
                    </Heading>
                    <Image
                        src="/images/trac_logo.png"
                        alt="trac mountain logo"
                        mb="5vw"
                    /> 
                    <ArtistCredit textColor="blue.500" position="center"/>
                </VStack>
            </VStack>  
        </>   
    )
}

export default LandingPage;