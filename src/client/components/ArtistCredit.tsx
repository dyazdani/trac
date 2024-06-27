import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Text,
    Box, 
    Link
} from "@chakra-ui/react";

export interface ArtistCreditProps {
    textColor: string
}

const ArtistCredit = ({ textColor }: ArtistCreditProps) => {
    
    
    return (
        <Box
            position="absolute"
            bottom=".1em"
            left=".1em"
          >
            <Text 
              fontSize="sm" 
              justifyContent="center"
              color={textColor} 
            >
            <Link 
              href="https://thenounproject.com/icon/mountain-flag-119605" 
              isExternal
            >
              Mountain Flag
              <ExternalLinkIcon 
                mr=".5em" 
                boxSize=".9em" 
              />
            </Link>
              by <Link 
                    href="https://thenounproject.com/bravo/" 
                    isExternal
                  >
                Juan Pablo Bravo
                <ExternalLinkIcon 
                  mr=".3em" 
                  boxSize="1em"
                />
              </Link> 
              is licensed under <Link 
                                  href="https://creativecommons.org/licenses/by/2.0/" 
                                  isExternal
                                >
                CC BY 2.0
                <ExternalLinkIcon 
                  mr=".5em" 
                  boxSize="1em"
                />
              </Link>
          </Text>
        </Box>
    )
}

export default ArtistCredit;