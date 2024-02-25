import { 
    Box,
    Button,
    HStack,
    Heading, 
    Spacer, 
    VStack,
    Image,
    Card,
    Flex,
    List,
    ListItem,
    ListIcon,
    Icon,
    Text
} from "@chakra-ui/react";
import AppHeader from "./AppHeader.js";
import { ChevronRightIcon, CheckCircleIcon } from "@chakra-ui/icons";

const LandingPage = () => {
    return (
        <>
            <AppHeader isBannerDisplayed/>
            <VStack
                h="100vh                                                                                                                                            0vh)"
                w="100vw"
                maxWidth="100%"
                p="1vw"
                alignItems="center"
            >
                <Heading
                    as="h1"
                    size="2xl"
                    mt="5vw"
                >
                    Your secret, goal-achieving weapon
                </Heading>
                <Heading
                    as="h2"
                    size="lg"
                    mt="2vw"
                >
                    Track your habits. Share your progress. Crush your goals.
                </Heading>
                <Button
                    rightIcon={<ChevronRightIcon/>}
                    colorScheme="blue"
                    mt="7vw"
                >
                    Get Started
                </Button>

            </VStack>
                <Box
                    w="100vw"
                    maxW="100%"
                    mt="2vw"
                    p="4vw"
                    bgColor="#eaf7fa"
                >
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
                        minW="4vw"
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
                                <ListIcon as={CheckCircleIcon} color="green" boxSize="1.6rem" mr="1rem"/>
                                Create goals with due dates.
                            </ListItem>
                            <ListItem fontSize="2xl">
                                <ListIcon as={CheckCircleIcon} color="green" boxSize="1.6rem" mr="1rem"/>
                                Track the habits needed to complete your goals.
                            </ListItem>
                        </List>
                    </Card>
                </Flex>
                </Box>
            
        </>   
    )
}

export default LandingPage;