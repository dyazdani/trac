import { Image } from "@chakra-ui/react";
import diamond from '../../../images/diamond-pink.png'

const DiamondImage = () => {
    return (
        <Image
            src={diamond}
            alt="pink diamond"
            maxW="100px"
            maxH="100%"
            h="25px"
            objectFit="cover"
            position="absolute"
            top="-30px" 
        />

                

        
            
    

    )
}

export default DiamondImage;