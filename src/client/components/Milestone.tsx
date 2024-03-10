import { 
    CloseIcon, 
    HamburgerIcon 
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
    Menu,
    MenuButton,
    MenuList,
    Spacer,
    Text
} from "@chakra-ui/react";
import HabitCard from "./HabitCard.js";
import { MilestoneWithDetails } from "../../types/index.js";
import UpdateMilestoneButton from "./UpdateMilestoneButton.js";
import DeleteMilestoneButton from "./DeleteMilestoneButton.js";
import CompleteMilestoneButton from "./CompleteMilestoneButton.js";
import CancelMilestoneButton from "./CancelMilestoneButton.js";
import CreateHabitButton from "./CreateHabitButton.js";
import areDatesSameDayMonthYear from "../utils/areDatesSameDayMonthYear.js";

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
                areDatesSameDayMonthYear(new Date(), new Date(milestone.dueDate)) ? 
                <Text 
                    textAlign="center" 
                    fontSize="lg"
                    color={textColor}
                >
                    Due {new Date(milestone.dueDate).toLocaleDateString()} { 
                        !milestone.isCompleted && 
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
                        !milestone.isCompleted && 
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
            <Menu
                isLazy
                closeOnSelect={false}
                closeOnBlur={false}
            >
                {({ isOpen }) => 
                    <>
                        <MenuButton
                            as={Button}
                            aria-label="Open Goal options menu"
                            rightIcon={isOpen ? <CloseIcon/> :<HamburgerIcon/>}
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
                            <CreateHabitButton milestone={milestone}/>
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
                    return (
                        <AccordionItem
                            key={habit.id}
                            bgColor={milestone.isCanceled ? "#CDCBCB" : "#C9E5F6"}
                            border="none"
                            width="42vw"
                            minWidth="450px"
                            mb=".5vw"
                        >
                            {({ isExpanded }) => (
                                <>
                                    <h2>
                                    <AccordionButton>
                                        <Box 
                                            as="span" 
                                            flex='1' 
                                            textAlign='left'
                                            color={milestone.isCanceled || milestone.isCompleted ? "darkslategray.400" : ""}
                                        >
                                            {isExpanded ? "" : habit.name}
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
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