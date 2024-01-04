import { IconButton } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";


export interface FloatingActionButtonProps {

}

const FloatingActionButton = ({}: FloatingActionButtonProps) => {
    return (
        <IconButton
            isRound={true}
            variant='solid'
            colorScheme='teal'
            aria-label='Create'
            fontSize='20px'
            icon={<AddIcon />}
            position="fixed"
            bottom="50px"
            right="50px"
        />
    )
}

export default FloatingActionButton;