const express = require("express");
const app = express();
const morgan = require("morgan");
const expressvalidator = require("express-validator");
const dotenv = require("dotenv");
const dbConfig = require("./Config/mongoDBConfig.js");
const cors = require("cors");


const routes = require("./Routes/routes.js");


dotenv.config();

app.set("view engine", "pug"); 
app.set("views", "/Users/USER/Desktop/VueData_Meeting_scheduler/views");

app.use(cors()); 
app.use(express.static("/Users/USER/Desktop/VueData_Meeting_scheduler/public"));

const portNumber = process.env.PORT || 3113;

app.use(morgan("dev"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 



app.use("/", routes) 




app.listen(portNumber);
console.log(`Server runs in http://127.0.0.1:${portNumber}`);
