import React from "react";
import ReactDOM from "react-dom/client";
import { Box, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux";
import theme from "../theme.js";

import App from "./App.js";
import { store } from './app/store.js'

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme} >
        <Provider store={store}>
          <Box
            maxHeight="100%"
            maxWidth="100%"
            backgroundColor="blue.50"
          >
            <App />
            </Box>
        </Provider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);
