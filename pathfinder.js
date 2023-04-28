const http = require('http');
const path = require("path");
const express = require("express");   /* Accessing express module */
const app = express();
const portNumber = 3000;
const httpSuccessStatus = 200;
const bodyParser = require("body-parser");
var server = http.createServer(app);
app.set("views", path.resolve(__dirname, "templates"));

/* view/templating engine */
app.set("view engine", "ejs");


app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (request, response) => {
    response.render("index");
});

app.use((request, response) => {
    const httpNotFoundStatusCode = 404;
    response.status(httpNotFoundStatusCode).send("Resource not found");
});

app.listen(portNumber);

process.stdout.write(`Web server is running at http://localhost:${portNumber}\n`);
process.stdin.setEncoding("utf8");




