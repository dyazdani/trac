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
    useBreakpointValue,
} from "@chakra-ui/react";
import AppHeader from "./AppHeader.js";
import { 
    ChevronRightIcon, 
    CheckCircleIcon, 
} from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import ArtistCredit from "./ArtistCredit.js";

const LandingPage = () => {
    const navigate = useNavigate();
    const query = useBreakpointValue(
        {
            base: [
                'Check-In',
                'Report', 
                'social', 
                'accountability'
            ],
            sm: [
                'Check-In Report', 
                'social accountability'
            ]
        }, 
        {ssr: false}
    )
    const src = useBreakpointValue(
        {
            base: "/images/new_trac_screenshot_4.png",
            md: "/images/new_trac_screenshot_3.png"
        },
        {ssr: false}
    )

    return (
        <Box 
            minHeight="100dvh"
        >
            <AppHeader 
                isBannerDisplayed={false}
            />
            <Flex
                direction="column"
            >
                <Flex
                    flexFlow="column"
                    alignItems="center"
                    bgImage="url('/images/landing_page_bg_image.jpg')"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                    bgSize="cover" 
                >
                    <Heading
                        as="h1"
                        size="3xl"
                        marginTop="4vw"
                        textAlign="center"
                        width="90%"
                    >
                        Your secret, goal-achieving weapon.
                    </Heading>
                    <Text
                        fontSize="xl"
                        mt="2vw"
                        textAlign="center"
                        width="90%"
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
                            backgroundColor="peach.300"
                            color="#353231"
                            _hover={{
                                backgroundColor: "peach.500"
                            }}
                            _active={{
                                backgroundColor: "peach.600",
                                color: "floralwhite.50"
                            }}
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
                </Flex>
                <VStack
                    padding="2rem"
                    paddingBottom="0"
                    backgroundColor="floralwhite.50"
                >
                    <Heading 
                        as="h2" 
                        textAlign="center"
                        paddingBottom="2rem"
                        w="80vw"
                        lineHeight={{
                            base: "3rem",
                            md: "4rem"
                        }}
                    >
                        <Highlight
                            query={[
                                'Goals', 
                                'Goal', 
                                'Habits', 
                                'Habit'
                            ]}
                            styles={{ 
                                px: '3', 
                                py: '1', 
                                rounded: 'xl', 
                                bg: 'cornflowerblue.50', 
                                color: '#353231' 
                            }}
                        >
                            Create Goals and the Habits required to meet them. Check off your Habits each day you practice until your Goals have been met. 
                        </Highlight>
                    </Heading>
                    <Flex
                        justifyContent="center"
                        alignItems={{
                            base: "center",
                            xl: "start"
                        }}
                        flexFlow={{
                            base: "column",
                            xl: "row"
                        }}
                    >
                        <Card
                            boxShadow="2xl"
                            height="fit-content"
                            minWidth="fit-content"
                            bgColor="transparent"
                            borderRadius="20px"
                        >
                            <Image
                                src="/images/new_trac_screenshot_1.png"
                                alt="Trac screenshot"
                                borderRadius="20px"
                                maxWidth="100%"
                            />
                        </Card>
                        <Spacer
                            minW="6vw"
                            maxW="10%"
                        />
                        <Card
                            padding="1rem"
                            boxShadow="2xl"
                            bgColor="floralwhite.50"
                            height="fit-content"
                            marginTop={{
                                base: "2.5rem",
                                xl: "0"
                            }}
                        >
                            <List
                                spacing="1vw"
                            >
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="cornflowerblue.100" boxSize="1.6rem" mr="1rem"/>
                                    Assign a due date for each Goal.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="cornflowerblue.100" boxSize="1.6rem" mr="1rem"/>
                                    Choose weekly Routine Days to practice each Habit. 
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="cornflowerblue.100" boxSize="1.6rem" mr="1rem"/>
                                    Record your progress. 
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="cornflowerblue.100" boxSize="1.6rem" mr="1rem"/>
                                    Make revisions as needed, even to past dates.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="cornflowerblue.100" boxSize="1.6rem" mr="1rem"/>
                                    Complete or cancel your Goals.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="cornflowerblue.100" boxSize="1.6rem" mr="1rem"/>
                                    Edit or delete Habits or Goals at any time.
                                </ListItem>
                            </List>
                        </Card>
                    </Flex>
                    <Heading 
                        as="h2" 
                        textAlign="center"
                        paddingBottom="2rem"
                        paddingTop="3rem"
                        w="80vw"
                        lineHeight={{
                            base: "3rem",
                            md: "4rem"
                        }}
                    >
                        <Highlight
                            query={
                                query ? 
                                query : [
                                'Check-In',
                                'Report', 
                                'social', 
                                'accountability'
                            ]}
                            styles={{ 
                                px: '3', 
                                py: '1', 
                                rounded: 'xl', 
                                bg: 'gold.100',
                                color: '#353231' 
                            }}
                        >
                            Send a Check-In Report to your friends every week to share your progress. Research shows that social accountability works. 
                        </Highlight>
                    </Heading>
                    <Flex
                        justifyContent="center"
                        alignItems={{
                            base: "center",
                            xl: "start"
                        }}
                        flexFlow={{
                            base: "column",
                            xl: "row"
                        }}
                    >
                        <Card
                            boxShadow="2xl"
                            height="fit-content"
                            width="fit-content"
                            bgColor="transparent"
                            borderRadius="20px"
                        >
                            <Image
                                src="/images/new_trac_screenshot_2.png"
                                alt="status report button screenshot"
                                borderRadius="20px"
                                maxWidth="100%"
                            />
                        </Card>
                        <Spacer
                            minW="6vw"
                            maxW="10%"
                        />
                        <Card
                            padding="1rem"
                            boxShadow="2xl"
                            bgColor="floralwhite.50"
                            height="fit-content"
                            marginTop={{
                                base: "2.5rem",
                                xl: "0"
                            }}
                        >
                            <List
                                spacing="1vw"
                            >
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="gold.400" boxSize="1.6rem" mr="1rem"/>
                                    Choose day of the week for Habit's Check-In Day.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="gold.400" boxSize="1.6rem" mr="1rem"/>
                                    "Send Check-In Report" button and banner appear when it is time to send a Check-In Report.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="gold.400" boxSize="1.6rem" mr="1rem"/>
                                    Receive in-app and email reminders to send Check-In Reports.
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="gold.400" boxSize="1.6rem" mr="1rem"/>
                                    Editable text pre-populates the Check-In Report form, making it easy to compose a message quickly. 
                                </ListItem>
                                <ListItem fontSize="2xl">
                                    <ListIcon as={CheckCircleIcon} color="gold.400" boxSize="1.6rem" mr="1rem"/>
                                    Add emails of everyone you want to send Check-in Report to and click "Send".
                                </ListItem>
                            </List>
                        </Card>
                    </Flex>
                    <Card
                        boxShadow="2xl"
                        height="fit-content"
                        width="fit-content"
                        mt="5vw"
                        bgColor="transparent"
                        borderRadius="20px"
                    >
                        <Image
                            src={src}
                            alt="check-in report form drawer screenshot"
                            borderRadius="20px"
                            maxWidth="100%"
                        />
                    </Card>
                    <Heading 
                        as="h2" 
                        mb="3vw"
                        mt="5vw"
                        borderRadius="xl"
                        backgroundColor="cornflowerblue.50"
                        px={3}
                        py={1}
                    >
                        Dream.
                    </Heading>
                    <Heading 
                        as="h2" 
                        mb="3vw"
                        borderRadius="xl"
                        backgroundColor="gold.100"
                        px={3}
                        py={1}
                    >
                        Achieve.
                    </Heading>
                    <Heading 
                        as="h2" 
                        mb="3vw"
                        borderRadius="xl"
                        backgroundColor="peach.100"
                        px={3}
                        py={1}
                    >
                        Inspire.
                    </Heading>
                    <Flex
                        gap="0.5rem"
                        alignItems="center"
                        justifyContent="center"
                        marginBottom="5rem"
                    >
                        <Text fontSize="4xl">trac</Text>
                        <Image
                        src="/images/trac_logo.png"
                        alt="Trac mountain logo"
                        h="2.5rem"
                        maxWidth="100%"
                        />
                    </Flex>
                    <ArtistCredit textColor="stormyblue.700"/>
                </VStack>
            </Flex>   
        </Box>   
    )
}

export default LandingPage;