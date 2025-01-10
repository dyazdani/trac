import { 
    CheckCircleIcon,
    CheckIcon,
    SettingsIcon
} from "@chakra-ui/icons";
import { 
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Card, 
    CardBody, 
    CardFooter, 
    CardHeader, 
    Flex, 
    Heading, 
    IconButton, 
    Menu,
    MenuButton,
    MenuList,
    Spacer,
    Text,
    keyframes
} from "@chakra-ui/react";
import HabitCard from "./HabitCard.js";
import { GoalWithDetails } from "../../types/index.js";
import UpdateGoalButton from "./UpdateGoalButton.js";
import DeleteGoalButton from "./DeleteGoalButton.js";
import CompleteGoalButton from "./CompleteGoalButton.js";
import CancelGoalButton from "./CancelGoalButton.js";
import CreateHabitButton from "./CreateHabitButton.js";
import areDatesSameDayMonthYear from "../utils/areDatesSameDayMonthYear.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";
import { motion } from "framer-motion";
import isHabitRoutineDay from "../utils/isHabitRoutineDay.js";

export interface GoalProps {
    goal: GoalWithDetails
}

const Goal = ({goal}: GoalProps) => {
    const textColor = goal.isCanceled || goal.isCompleted ? "darkslategray.400" : ""

    return (
        <Card
        width={{
            base: "90dvw",
            lg: "55dvw"
        }}
        maxWidth="800px"
        background={goal.isCanceled ? "#C3C1C1" : "linear-gradient(0deg, rgba(183,186,251, 1) 0%, rgba(193,232,240, 1) 100%)"}
        borderRadius="20px"
        >
        <CardHeader>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            gap="1vw"
            flexFlow={{
                base: "column",
                lg: "row"
            }}
          >
            <Heading 
                size="xl"
                color={textColor}
                as="h2"
                textAlign="center"
            >
             {goal.name}
            </Heading>
            {
                goal.isCompleted ? 
                <>
                    <Spacer/>
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CheckCircleIcon
                            boxSize="1.3rem"
                            marginRight=".5rem"
                            color={goal.isCanceled ? "darkslategray.400" : "darkslategray.800"}
                        />
                        <Text
                            fontSize="2rem"
                            as="b"
                            marginRight=".5rem"
                            color={goal.isCanceled ? "darkslategray.400" : "darkslategray.800"}
                        >
                            Done! 
                        </Text>
                        <Text
                            fontSize="1.8rem"
                        >
                            🎉
                        </Text>
                    </Flex>
                    <Spacer/>
                </>
                 :
                "" 
            }
            {
                !goal.isCompleted ?
                <>
                    {
                        areDatesSameDayMonthYear(new Date(), new Date(goal.dueDate)) ? 
                        <Text 
                            textAlign="center" 
                            fontSize="lg"
                            color={textColor}
                        >
                            Due {new Date(goal.dueDate).toLocaleDateString()} {  
                                <Badge 
                                    colorScheme="yellow" 
                                    variant="solid" 
                                    color="darkslategray.800" 
                                    ml=".5rem"
                                >
                                    TODAY!
                                </Badge> 
                            }
                        </Text> : 
                        new Date().getTime() > new Date(goal.dueDate).setHours(23, 59, 59, 999) ?
                        <Text  
                            textAlign="center"
                            fontSize="lg"
                            color={textColor}
                        >
                            Due {new Date(goal.dueDate).toLocaleDateString()} {  
                                <Badge 
                                    colorScheme="red" 
                                    variant="solid" 
                                    ml=".5rem"
                                >
                                    OVERDUE!
                                </Badge> 
                            }
                        </Text> : 
                        <Text 
                            textAlign="center"
                            fontSize="lg"
                            color={textColor}
                        >
                            Due {new Date(goal.dueDate).toLocaleDateString()}
                        </Text>
                    }
                    <Spacer
                        minWidth="20px"
                    />
                </>
                 :
                ""
            }
            <Flex
                justifyContent="space-between"
                alignItems="center"
                gap="1vw"
            >
                <Menu
                    isLazy
                    closeOnSelect={false}
                    closeOnBlur={false}
                >
                    {({ isOpen }) => 
                        <>
                            <MenuButton
                                as={IconButton}
                                aria-label="Open Goal options menu"
                                icon={<SettingsIcon/>}
                                backgroundColor="turquoise.300"
                                _hover={{
                                    backgroundColor: "turquoise.400"
                                }}
                                _active={{
                                    backgroundColor: "turquoise.600",
                                    color: "floralwhite.50"    

                                }} 
                                flexShrink="0"
                                isActive={isOpen}
                            >Menu</MenuButton>
                            <MenuList
                                backgroundColor="turquoise.50"
                            >   
                                {goal.habits.length ? <CreateHabitButton goal={goal}/> : ""}
                                <UpdateGoalButton goal={goal}/>
                                <DeleteGoalButton goal={goal}/>
                                <CancelGoalButton goal={goal}/>
                            </MenuList>
                        </>
                    }
                </Menu>
                <CompleteGoalButton
                    goal={goal}
                />
            </Flex>
          </Flex>
        </CardHeader>
        <Flex 
            direction={"column"} 
            align={"center"}
        >
          <CardBody
            width={{
                base: "90dvw",
                lg: "55dvw"
            }}
            maxWidth="800px"
          >
            {
                goal.habits.length ?
                <Heading
                    as="h3"
                    size="lg"
                    mb=".5vw"
                    color= {goal.isCanceled || goal.isCompleted ? "darkslategray.400" : ""}
                >
                    Habits
                </Heading> : 
                ""
            }
            
            {
                !goal.habits.length ?
                <Text 
                fontSize="xl" 
                textAlign="center"
                >
                    You currently have no Habits for this Goal.
                </Text> : 
                ""
              }
            <Accordion
                allowMultiple           
            >
                {[...goal.habits].sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
                    .map(habit => {
                        const isStatusReportSent = isMostRecentStatusReportSent(habit);

                        const midnightOfFirstCheckIn = getFirstCheckInDayDate(habit)?.setHours(0, 0, 0, 0)
                        const isTodayBeforeFirstCheckInDayDate = midnightOfFirstCheckIn && Date.now() < midnightOfFirstCheckIn


                        const animationKeyframes = keyframes`to { background-position-x: 0% }`;
                        const animation = `${animationKeyframes} 1s infinite linear`; 

                    return (
                        <AccordionItem
                            display="flex"
                            flexFlow="column"  
                            alignItems="center"
                            key={habit.id}
                            as={motion.div}
                            _last={{
                                borderBottomWidth: "7px"
                            }}
                            animation={
                                goal && goal.isCompleted || goal.isCanceled ? "" :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? animation : ""
                            }
                            bg={
                                goal && goal.isCanceled ? "#CDCBCB" :
                                goal && goal.isCompleted ? "#C9E5F6" :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "linear-gradient(-45deg, #C9E5F6 40%, #DCEEF9 50%, #C9E5F6 60%)" : "#C9E5F6"
                            }
                            border={
                                goal && goal.isCompleted ||
                                goal.isCanceled ? 
                                "none" :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
                                "7px ridge rgba(249, 199, 31, 0.6)" : 
                                "none"
                            }
                            backgroundSize={
                                goal && goal.isCompleted || 
                                goal.isCanceled ? 
                                "" :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
                                "300%" : 
                                ""
                            }
                            sx={
                                goal && goal.isCompleted || 
                                goal.isCanceled ? 
                                {} :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
                                {
                                    backgroundPositionX: '100%'
                                } : 
                                {}
                            }
                            width="100%"
                            minWidth="248px"
                            mb=".5vw"
                            borderRadius="20px"
                            boxShadow="2xl"
                        >
                            {({ isExpanded }) => (
                                <>
                                    <AccordionButton
                                        _focusVisible={{
                                            borderRadius: "20px"
                                        }}
                                        _hover={{
                                            borderRadius: "20px",
                                            backgroundColor: "#B9DDF3"
                                        }}
                                    >
                                        <Box 
                                            as="span" 
                                            flex='1' 
                                            textAlign='left'
                                            color={goal.isCanceled || goal.isCompleted ? "darkslategray.400" : ""}
                                        >
                                            {
                                                isExpanded ? 
                                                "" : 
                                                habit.name
                                            }
                                            {
                                                !isExpanded && 
                                                isHabitRoutineDay(habit, new Date()) && 
                                                !goal.isCompleted && 
                                                !goal.isCanceled ?
                                                <Badge
                                                    colorScheme="peach"
                                                    color="darkslategray.800" 
                                                    variant="solid" 
                                                    ml=".5rem"
                                                >
                                                    {
                                                        !!habit.datesCompleted.find(el => areDatesSameDayMonthYear(new Date(el), new Date())) ?
                                                        <Text><CheckIcon/>  Routine Day</Text> : 
                                                        "Routine Day"
                                                    }
                                                </Badge> :
                                                ""
                                            }
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    <AccordionPanel 
                                        padding="0"
                                    >
                                        <HabitCard 
                                            habit={habit}
                                            goal={goal}
                                        />
                                    </AccordionPanel>
                                </>
                            )}    
                </AccordionItem>
                    )
                })}     
            </Accordion>
        </CardBody>
            <CardFooter
                marginBottom="2rem"    
            >
                {
                    !goal.habits.length ?
                    <CreateHabitButton goal={goal}/> :
                    ""
                }
            </CardFooter>
        </Flex>
      </Card>
    )
}

export default Goal;