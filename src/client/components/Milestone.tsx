import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
    IconButton
} from "@chakra-ui/react";
import HabitCard from "./HabitCard.js";
import { DayOfTheWeek } from "@prisma/client";
import { MilestoneWithDetails } from "../../types/index.js";
import UpdateMilestoneButton from "./UpdateMilestoneButton.js";
import DeleteMilestoneButton from "./DeleteMilestoneButton.js";
import CompleteMilestoneButton from "./CompleteMilestoneButton.js";

export interface MilestoneProps {
    milestone: MilestoneWithDetails
}

const Milestone = ({milestone}: MilestoneProps) => {

    return (
        <Card
        // as={motion.div}
        // animation={!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? animation : ""}
        w="30vw" 
        maxW="500px"
        minW="320px"
        bg={milestone.isCompleted ? `rgba(255,192,203, 0.2)` : `rgb(255,192,203)`}
        borderRadius="20px"
        // border={!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "2mm ridge rgba(255,215,0, .6)" : ""}
        // backgroundSize={!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? "300%" : ""}
        // sx={!isStatusReportSent && !isTodayBeforeFirstCheckInDayDate ? 
        //   {backgroundPositionX: '100%'} : 
        //   {}
        // }
      >
        <CardHeader>
          <HStack justify={"end"}>
            <Heading 
                sx={{ marginRight: "auto" }} 
                size="md"
            >
             {milestone.name}
            </Heading>
            <UpdateMilestoneButton
                milestone={milestone}
            />
            <DeleteMilestoneButton
                milestone={milestone}
            />
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
          <Accordion defaultIndex={[0]} allowMultiple>
            {milestone.habits.map(habit => {
                return (
                    <AccordionItem
                        key={habit.id}
                        w="450px"
                    >
                        {({ isExpanded }) => (
                            <>
                                <h2>
                                <AccordionButton>
                                    <Box as="span" flex='1' textAlign='left'>
                                        {isExpanded ? "" : habit.name}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                    <HabitCard 
                                        habit={habit}
                                        milestone={milestone}
                                        handleClick={() => {console.log(habit)}}
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
            
          </CardFooter>
          
        </Flex>
      </Card>
    )
}

export default Milestone;