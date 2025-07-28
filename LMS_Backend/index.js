const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const db = require("./db");
const route = require("./route");
const path = require("path");

app.use(cors());
app.use(bodyparser.json());
app.use('/',route);
app.use('/contact', express.static(path.join(__dirname,'contact')));
app.use('/teacher', express.static(path.join(__dirname,'teacher')));
app.use('/student', express.static(path.join(__dirname,'student')));
app.use('/book', express.static(path.join(__dirname,'book')));

const port = 5001;

app.listen(port,()=>{
    console.log(`Server is running on ${port}.`);
})
