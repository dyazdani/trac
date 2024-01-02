//Theme.js file
//1. Import extendTheme
import { extendTheme } from "@chakra-ui/react";

//2. Theme object containing custom styling
const themes = {
    styles: {
        global: {
            body: {
                height: '100vh',
                display: 'flex',
                'alignItems': 'center',
                'backgroundColor': '#b9eefe',
            },
        },
    },
}

//3. Export theme
const theme = extendTheme(themes);
export default theme;