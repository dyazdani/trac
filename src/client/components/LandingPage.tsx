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
    ListIcon
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
                    <Heading
                        as="h2"
                        size="lg"
                        mt="2vw"
                        textAlign="center"
                    >
                        Track your habits. Share your progress. Crush your goals.
                    </Heading>
                    <Flex
                        direction="column"
                        w="100%"
                        alignItems="center"
                    >
                        <Button
                            rightIcon={<ChevronRightIcon/>}
                            colorScheme="orange"
                            color="#000000"
                            mt="10vw"
                            mb="3vw"
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
                {/* <Heading as="h3" size="md" >Create goals and</Heading> */}
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