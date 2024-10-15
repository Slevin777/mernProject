import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/dbConn";
import { logEvents, logger } from "./middleware/logger";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import path from "path";
import errorHandler from "./middleware/errorHandler";
import "dotenv/config";
import mongoose from "mongoose";

console.log(process.env.NODE_ENV);

connectDB();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

app.all("*", (req: Request, res: Response) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({
      message: "404 Not Found",
    });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

mongoose.connection.on(
  "error",
  (err: { no: any; code: any; syscall: any; hostname: any }) => {
    console.log(err);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log"
    );
  }
);
