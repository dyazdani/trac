import app from "./app.js";
import ViteExpress from "vite-express";

const {PORT = 3000} = process.env; 

ViteExpress.listen(app, Number(PORT), () =>
  console.log(`Server is listening at http://localhost:${PORT}`),
);
