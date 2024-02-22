import { HamburgerIcon } from "@chakra-ui/icons";
import { 
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Card, 
    CardBody, 
    CardFooter, 
    CardHeader, 
    Flex, 
    HStack, 
    Heading, 
    IconButton,
    Menu,
    MenuButton,
    MenuList
} from "@chakra-ui/react";
import HabitCard from "./HabitCard.js";
import { MilestoneWithDetails } from "../../types/index.js";
import UpdateMilestoneButton from "./UpdateMilestoneButton.js";
import DeleteMilestoneButton from "./DeleteMilestoneButton.js";
import CompleteMilestoneButton from "./CompleteMilestoneButton.js";
import CancelMilestoneButton from "./CancelMilestoneButton.js";
import CreateHabitButton from "./CreateHabitButton.js";

export interface MilestoneProps {
    milestone: MilestoneWithDetails
}

const Milestone = ({milestone}: MilestoneProps) => {

    return (
        <Card
        w="50vw"
        minW="450px"
        bg={
            milestone.isCompleted ? "rgba(249, 199, 64, 0.4)" :
            milestone.isCanceled ? "rgba(212, 211, 212, 1)" :
            `rgb(247, 197, 59)`
        }
        borderRadius="20px"
      >
        <CardHeader>
          <HStack justify={"end"}>
            <Heading 
                sx={{ marginRight: "auto" }} 
                size="md"
                color={milestone.isCanceled || milestone.isCompleted ? "gray" : ""}
            >
             {milestone.name}
            </Heading>
            <Menu
                isLazy
            >
                {({ isOpen }) => 
                    <>
                        <MenuButton
                            as={IconButton}
                            aria-label="Goal options"
                            icon={<HamburgerIcon/>}
                            variant={isOpen ? "solid" : "outline"}
                            colorScheme="blue"
                            isActive={isOpen}
                        />
                        <MenuList>
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
          </HStack>
        </CardHeader>
        <Flex 
            direction={"column"} 
            align={"center"}
            >
          <CardBody>
          <Accordion defaultIndex={[0]} allowMultiple >
            {[...milestone.habits].sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
                .map(habit => {
                return (
                    <AccordionItem
                        key={habit.id}
                        borderTop="1px solid black" 
                        borderBottom="1px solid black"
                    >
                        {({ isExpanded }) => (
                            <>
                                <h2>
                                <AccordionButton>
                                    <Box 
                                        as="span" 
                                        flex='1' 
                                        textAlign='left'
                                        color={milestone.isCanceled || milestone.isCompleted ? "gray" : ""}
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
          <CardFooter>
            <CreateHabitButton milestone={milestone}/>
          </CardFooter>
        </Flex>
      </Card>
    )
}

export default Milestone;