const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const dbConfig = require("./Config/mongoDBConfig.js");
var cors = require('cors');

app.use(cors());


const routes = require("./Routes/routes.js");

dotenv.config();


const portNumber = process.env.PORT || 3113;

app.use(morgan("dev"));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/", routes) 

app.get('/',((req,res)=>{
    res.send('Backend of VD')
}))
app.listen(portNumber, () => console.log(`Node Server run in http://127.0.0.1:${portNumber} !`));

