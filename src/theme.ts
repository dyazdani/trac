//Theme.js file
//1. Import extendTheme
import { extendTheme } from "@chakra-ui/react";

//2. Theme object containing custom styling
const themes = {
    breakpoints: {
        base: '0px',
        sm: '368px',
        'smaller-md': '415px',
        'sm-md': '525px',
        md: '649px',
        lg: '800px',
        xl: '1200px',
        '2xl': '1536px',
      },
    fonts: {
        body: "Gabarito, sans-serif",
        heading: "Gabarito, sans-serif",
    },
    "colors": {
        "yellow": {
            "50": "#FEF8E6",
            "100": "#FDEBBA",
            "200": "#FBDE8D",
            "300": "#FAD161",
            "400": "#F9C434",
            "500": "#F9C311",
            "600": "#DBA906",
            "700": "#B28A06",
            "800": "#8B6B04",
            "900": "#634d03"
        },
        gold: {
            50: '#fef9e6',
            100: '#fdecb4',
            200: '#fce083',
            300: '#fbd351',
            400: '#f9c71f',
            500: '#e0ad06',
            600: '#ae8704',
            700: '#7c6003',
            800: '#4b3a02',
            900: '#191301',
        },
        turquoise: {
            50: '#eaf7fa',
            100: '#c1e8f0',
            200: '#98d9e6',
            300: '#6fcadc',
            400: '#46bad2',
            500: '#2da1b9',
            600: '#237d90',
            700: '#195967',
            800: '#0f363e',
            900: '#051215',
        },
        stormyblue: {
            50: '#ecf4f8',
            100: '#c6ddeb',
            200: '#a1c6de',
            300: '#7bb0d1',
            400: '#5599c3',
            500: '#3c7faa',
            600: '#2e6384',
            700: '#21475e',
            800: '#142a39',
            900: '#070e13',
        },
        skyblue: {
            50: '#e9f4fc',
            100: '#bcdff5',
            200: '#90caef',
            300: '#63b5e8',
            400: '#37a0e1',
            500: '#1e86c8',
            600: '#17689c',
            700: '#104a6f',
            800: '#0a2d43',
            900: '#030f16',
        },
        peach: {
            50: '#fef1e7',
            100: '#fbd5b7',
            200: '#f8ba86',
            300: '#f59e56',
            400: '#F4903E',            
            500: '#f38226',
            600: '#a9510a',
            700: '#793a07',
            800: '#482304',
            900: '#180c01',
        },
        cornflowerblue: {
            50: '#e7e8fe',
            100: '#b7bafb',
            200: '#878bf8',
            300: '#575df5',
            400: '#262ff2',
            500: '#0d15d9',
            600: '#0a11a8',
            700: '#070c78',
            800: '#040748',
            900: '#010218',
        },
        floralwhite: {
            50: '#f8f6ed',
            100: '#e9e5c9',
            200: '#dad4a5',
            300: '#cbc381',
            400: '#bcb25c',
            500: '#a39943',
            600: '#7e7734',
            700: '#5a5525',
            800: '#363316',
            900: '#121107',
        },
        bisque: {
            50: '#fdf2e7',
            100: '#fad8b7',
            200: '#f7bd87',
            300: '#f4a358',
            400: '#f18928',
            500: '#d76f0e',
            600: '#a7560b',
            700: '#783e08',
            800: '#482505',
            900: '#180c02',
        },
        "gray": {
        "50": "#F3F2F2",
        "100": "#DDDADA",
        "200": "#C6C3C2",
        "300": "#B0ABAA",
        "400": "#9A9493",
        "500": "#847C7B",
        "600": "#6A6462",
        "700": "#4F4B4A",
        "800": "#353231",
        "900": "#1A1919"
        },
        darkslategray: {
            50: '#f3f2f2',
            100: '#dad8d7',
            200: '#c2bebd',
            300: '#a9a4a2',
            400: '#918a88',
            500: '#77716e',
            600: '#5d5856',
            700: '#423f3d',
            800: '#282625',
            900: '#0d0d0c',
        },
        "orange": {
        "50": "#FFF2EB",
        "100": "#FFE5D6",
        "200": "#FFCBAD",
        "300": "#FFB185",
        "400": "#FFA570",
        "500": "#FF8B47",
        "600": "#FF600A",
        "700": "#E04F00",
        "800": "#A33900",
        "900": "#7A2B00"
        },
        "pink": {
        "50": "#FFE6F9",
        "100": "#FEB9ED",
        "200": "#FD8BE2",
        "300": "#FD5ED6",
        "400": "#FC31CB",
        "500": "#FB04BF",
        "600": "#C90399",
        "700": "#970273",
        "800": "#64024D",
        "900": "#320126"
        },
        "green": {
        "50": "#ECF9ED",
        "100": "#C9EECE",
        "200": "#A6E3AE",
        "300": "#83D88F",
        "400": "#60CD6F",
        "500": "#3DC24F",
        "600": "#319B3F",
        "700": "#247530",
        "800": "#184E20",
        "900": "#0C2710"
        },
        "purple": {
        "50": "#F6EFF4",
        "100": "#E5D2DF",
        "200": "#D3B5CB",
        "300": "#C298B7",
        "400": "#B17BA2",
        "500": "#A05F8E",
        "600": "#804C72",
        "700": "#603955",
        "800": "#402639",
        "900": "#20131C"
        },
        "red": {
        "50": "#FFE5ED",
        "100": "#FFB8CD",
        "200": "#FF8AAD",
        "300": "#FF5C8D",
        "400": "#FF2E6D",
        "500": "#B61B1B",
        "600": "#CC003D",
        "700": "#99002E",
        "800": "#66001F",
        "900": "#33000F"
        },
        "blue": {
        "50": "#EDEFF7",
        "100": "#CED3E9",
        "200": "#AEB7DB",
        "300": "#8E9ACD",
        "400": "#6E7EBF",
        "500": "#4F62B0",
        "600": "#3F4E8D",
        "700": "#2F3B6A",
        "800": "#1F2747",
        "900": "#101423"
        }
    },
    styles: {
        global: {
        },
    },
}

//3. Export theme
const theme = extendTheme(themes);
export default theme;