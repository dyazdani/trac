import React, { useState, useRef } from "react";
import {
    NotificationIconButton,
    NotificationFeedPopover
} from "@knocklabs/react-notification-feed";
import "@knocklabs/react-notification-feed/dist/index.css"
import { Button, ButtonGroup } from "@chakra-ui/react";

type MessagesMenuProps = {
    label?: string
}

const MessagesMenu = ({label}: MessagesMenuProps) =>  {
    const [isVisible, setIsVisible] = useState(false);
    const notifButtonRef = useRef(null);
    return(
        <>
            <ButtonGroup
                isAttached
                variant="unstyled"
                borderRadius=".5rem"
                alignItems="center"
                p=".25vw"
                _hover={{
                    backgroundColor: "turquoise.200"
                }}
                _active={{
                    backgroundColor: "turquoise.300"
                }}
                >
                {label ? 
                (<Button
                    ref={notifButtonRef}
                    onClick={(e) => setIsVisible(!isVisible)}
                    ml=".5vw"
                >{label}</Button>) : 
                (
                    ""
                )
                }
                <NotificationIconButton
                    ref={notifButtonRef}
                    onClick={(e) => setIsVisible(!isVisible)}
                />
            </ButtonGroup>
            
            <NotificationFeedPopover
                buttonRef={notifButtonRef}
                isVisible={isVisible}
                onClose={() => setIsVisible(false)}
                placement="auto"
            />
      </>
    );
}

export default MessagesMenu;