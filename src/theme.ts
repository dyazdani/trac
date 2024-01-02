//Theme.js file
//1. Import extendTheme
import { extendTheme } from "@chakra-ui/react";

//2. Theme object containing custom styling
const themes = {
    styles: {
        global: {
        },
    },
}

//3. Export theme
const theme = extendTheme(themes);
export default theme;