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
    Highlight
} from "@chakra-ui/react";
import AppHeader from "./AppHeader.js";
import { 
    ChevronRightIcon, 
    CheckCircleIcon 
} from "@chakra-ui/icons";
import { useNavigate } from "react-router";

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <>
            <AppHeader isBannerDisplayed/>
            <VStack
                h="100vh                                                                                                                                            0vh)"
                w="100vw"
                maxWidth="100%"
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
                        Your secret, goal-achieving weapon
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
            </VStack>
                <VStack
                    w="100vw"
                    maxW="100%"
                    p="4vw"
                    bgColor="orange.50"
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
                    >
                        <Card
                            boxShadow="2xl"
                            height="fit-content"
                            width="fit-content"
                        >
                            <Image
                                src="/images/trac_screenshot.jpg"
                                alt="trac screenshot"
                                maxH="80vh"
                                minH="20vh"
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
                        pt="4vw"
                        w="60vw"
                    >
                        <Highlight
                            query={['Progress Report', 'Check-In Day', 'social accountability']}
                            styles={{
                                color: '#979EF6'
                            }}
                        >
                            Email a Progress Report to your friends every week on your Habit's Check-In Day. Research shows that social accountability works. 
                        </Highlight>
                    </Heading>
                </VStack>
            
        </>   
    )
}

export default LandingPage;