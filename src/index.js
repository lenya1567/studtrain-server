const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const UserController = require("../controllers/UserController");
const app = express();
const port = 3030;

var whitelist = ['http://localhost:5173']
var corsOptionsDelegate = function (req, callback) {
    var corsOptions;
    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    } else {
        corsOptions = { origin: false } // disable CORS for this request
    }
    callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(bodyParser.json());
app.use(cors(corsOptionsDelegate));

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.post("/api/user/create", UserController.createUser);
app.post("/api/user/login", UserController.loginUser);
app.get("/api/user/data", UserController.fetchUser);
app.post("/api/user/update", UserController.updateUser);
app.post("/api/user/logout", UserController.logoutUser);

app.listen(port, () => {
    console.log(`Server run at port ${port}!`);
})