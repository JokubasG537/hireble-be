const express = require("express");
const process = require("process");
require("dotenv").config();
require("./db.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
require("dotenv").config();


const usersApi = require("./api/users.js");
const jobPostsApi = require("./api/jobPosts.js");
const savedJobsApi = require("./api/savedJobs.js");
const resumeApi = require("./api/resume.js");
const companiesApi = require("./api/company.js");

app.use("/jobPosts", jobPostsApi);
app.use("/savedJobs", savedJobsApi);
app.use("/users", usersApi);
app.use("/resume", resumeApi);
app.use("/companies", companiesApi);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}🚀`));