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
    Button,
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
import { MilestoneWithDetails } from "../../types/index.js";
import UpdateMilestoneButton from "./UpdateMilestoneButton.js";
import DeleteMilestoneButton from "./DeleteMilestoneButton.js";
import CompleteMilestoneButton from "./CompleteMilestoneButton.js";
import CancelMilestoneButton from "./CancelMilestoneButton.js";
import CreateHabitButton from "./CreateHabitButton.js";
import areDatesSameDayMonthYear from "../utils/areDatesSameDayMonthYear.js";
import isMostRecentStatusReportSent from "../utils/isMostRecentStatusReportSent.js";
import getFirstCheckInDayDate from "../utils/getFirstCheckInDayDate.js";
import { motion } from "framer-motion";
import isHabitRoutineDay from "../utils/isHabitRoutineDay.js";

export interface MilestoneProps {
    milestone: MilestoneWithDetails
}

const Milestone = ({milestone}: MilestoneProps) => {
    const textColor = milestone.isCanceled || milestone.isCompleted ? "darkslategray.400" : ""

    return (
        <Card
        w="50vw"
        minW="570px"
        background={milestone.isCanceled ? "#C3C1C1" : "linear-gradient(0deg, rgba(183,186,251, 1) 0%, rgba(193,232,240, 1) 100%)"}
        borderRadius="20px"
        >
        <CardHeader>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            gap="1vw"
          >
            <Heading 
                size="xl"
                color={textColor}
                as="h2"
                textAlign="center"
            >
             {milestone.name}
            </Heading>
            {
                milestone.isCompleted ? 
                <>
                    <Spacer/>
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                    >
                        <CheckCircleIcon
                            boxSize="1.3rem"
                            marginRight=".5rem"
                            color={milestone.isCanceled ? "darkslategray.400" : "darkslategray.800"}
                        />
                        <Text
                            fontSize="2rem"
                            as="b"
                            marginRight=".5rem"
                            color={milestone.isCanceled ? "darkslategray.400" : "darkslategray.800"}
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
                !milestone.isCompleted ?
                <>
                    {
                        areDatesSameDayMonthYear(new Date(), new Date(milestone.dueDate)) ? 
                        <Text 
                            textAlign="center" 
                            fontSize="lg"
                            color={textColor}
                        >
                            Due {new Date(milestone.dueDate).toLocaleDateString()} {  
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
                        new Date().getTime() > new Date(milestone.dueDate).setHours(23, 59, 59, 999) ?
                        <Text  
                            textAlign="center"
                            fontSize="lg"
                            color={textColor}
                        >
                            Due {new Date(milestone.dueDate).toLocaleDateString()} {  
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
                            Due {new Date(milestone.dueDate).toLocaleDateString()}
                        </Text>
                    }
                    <Spacer
                        minWidth="20px"
                    />
                </>
                 :
                ""
            }
            
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
                            {milestone.habits.length ? <CreateHabitButton milestone={milestone}/> : ""}
                            <UpdateMilestoneButton milestone={milestone}/>
                            <DeleteMilestoneButton milestone={milestone}/>
                            <CancelMilestoneButton milestone={milestone}/>
                        </MenuList>
                    </>
                }
            </Menu>
            <CompleteMilestoneButton
                milestone={milestone}
            />
          </Flex>
        </CardHeader>
        <Flex 
            direction={"column"} 
            align={"center"}
        >
          <CardBody>
            {
                milestone.habits.length ?
                <Heading 
                    as="h3"
                    size="lg"
                    mb=".5vw"
                    color= {milestone.isCanceled || milestone.isCompleted ? "darkslategray.400" : ""}
                >
                    Habits
                </Heading> : 
                ""
            }
            
            {
                !milestone.habits.length ?
                <Text fontSize="xl">You currently have no Habits for this Goal.</Text> : 
                ""
              }
            <Accordion
                allowMultiple
            >
                {[...milestone.habits].sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
                    .map(habit => {
                        const isStatusReportSent = isMostRecentStatusReportSent(habit);

                        const midnightOfFirstCheckIn = getFirstCheckInDayDate(habit)?.setHours(0, 0, 0, 0)
                        const isTodayBeforeFirstCheckInDayDate = midnightOfFirstCheckIn && Date.now() < midnightOfFirstCheckIn


                        const animationKeyframes = keyframes`to { background-position-x: 0% }`;
                        const animation = `${animationKeyframes} 1s infinite linear`; 

                    return (
                        <AccordionItem
                            key={habit.id}
                            as={motion.div}
                            _last={{
                                borderBottomWidth: "7px"
                            }}
                            paddingLeft="8px"
                            animation={
                                milestone && milestone.isCompleted || milestone.isCanceled ? "" :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? animation : ""
                            }
                            bg={
                                milestone && milestone.isCanceled ? "#CDCBCB" :
                                milestone && milestone.isCompleted ? "#C9E5F6" :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "linear-gradient(-45deg, #C9E5F6 40%, #DCEEF9 50%, #C9E5F6 60%)" : "#C9E5F6"
                            }
                            border={
                                milestone && milestone.isCompleted ||
                                milestone.isCanceled ? 
                                "none" :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
                                "7px ridge rgba(249, 199, 31, 0.6)" : 
                                "none"
                            }
                            backgroundSize={
                                milestone && milestone.isCompleted || 
                                milestone.isCanceled ? 
                                "" :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
                                "300%" : 
                                ""
                            }
                            sx={
                                milestone && milestone.isCompleted || 
                                milestone.isCanceled ? 
                                {} :
                                !isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
                                {
                                    backgroundPositionX: '100%'
                                } : 
                                {}
                            }
                            width="42vw"
                            minWidth="450px"
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
                                            borderRadius: "20px"
                                        }}
                                    >
                                        <Box 
                                            as="span" 
                                            flex='1' 
                                            textAlign='left'
                                            color={milestone.isCanceled || milestone.isCompleted ? "darkslategray.400" : ""}
                                        >
                                            {
                                                isExpanded ? 
                                                "" : 
                                                habit.name
                                            }
                                            {
                                                !isExpanded && 
                                                isHabitRoutineDay(habit, new Date()) && 
                                                !milestone.isCompleted && 
                                                !milestone.isCanceled ?
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
                                            milestone={milestone}
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
                    !milestone.habits.length ?
                    <CreateHabitButton milestone={milestone}/> :
                    ""
                }
            </CardFooter>
        </Flex>
      </Card>
    )
}

export default Milestone;