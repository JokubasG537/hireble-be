const express = require("express");
const process = require("process");
require("dotenv").config();
require("./db.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


const usersApi = require("./api/users.js");

app.use("/users", usersApi);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}🚀`));