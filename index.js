const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const dbConfig = require("./Config/mongoDBConfig.js");


const routes = require("./Routes/routes.js");

dotenv.config();

app.set("view engine", "pug"); 
app.set("views", "C:/Users/USER/Documents/VD_Kalathi/Docs/Scheduler/views");

app.use(express.static("C:/Users/USER/Documents/VD_Kalathi/Docs/Scheduler/public"));

const portNumber = process.env.PORT || 3113;

app.use(morgan("dev"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/", routes) 

app.listen(portNumber, () => console.log(`Node Server run in http://127.0.0.1:${portNumber}/home !`));

