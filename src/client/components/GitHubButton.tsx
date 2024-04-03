import { 
    Flex, 
    Image, 
    LinkBox,
    LinkOverlay
} from "@chakra-ui/react";

export interface GitHubButtonProps {
    isAbsolutePosition: boolean
}

const GitHubButton = (
    {isAbsolutePosition}: GitHubButtonProps
    ) => {
    return (
        <LinkBox
            as="button"
            position={isAbsolutePosition ? "absolute" : undefined}
            top={isAbsolutePosition ? "5vh" : undefined}
            right={isAbsolutePosition ? "30px" : undefined}
            backgroundColor="transparent"
            padding=".2rem"
            borderRadius="8px"
            height="40px"
            _hover={{
                backgroundColor: "#c2bebd"
            }}
            _active={{
                backgroundColor: "#918a88"
            }}
            border="1px #0d0d0c solid"
            >
            <LinkOverlay
                isExternal={true}
                href="https://github.com/dyazdani/trac"
            >
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                >
                    <Image
                        src="/images/github-mark.png"
                        alt="GitHub mark"
                        height="100%"
                    />
                    <Image
                        src="/images/GitHub_Logo.png"
                        alt="GitHub logo"
                        height="100%"
                    />
                </Flex>
            </LinkOverlay>
        </LinkBox>
    )
}

export default GitHubButton;