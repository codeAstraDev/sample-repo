import express from "express";
import { config } from "./src/config/config";
import { userRouter } from "./src/router/userRouter";

const app = express();
app.use(express.json())

app.use("/user",userRouter)

app.listen(config.PORT, () =>
  console.log(`Server is running on PORT:${config.PORT}`)
);
