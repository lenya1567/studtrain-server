const UserService = require("../services/UserService")

module.exports = {
    createUser: async (req, res) => {
        let result = await UserService.createUser(req.body.login, req.body.password);
        console.log("[ DEBUG ]: REG:", req.body, "RESULT", result);
        console.log();
        res.json(result);
    },

    loginUser: async (req, res) => {
        
        let result = await UserService.loginUser(req.body.login, req.body.password);
        console.log("[ DEBUG ]: LOGIN", req.body, "RESULT", result);
        console.log();
        res.json(result);
    },

    fetchUser: async (req, res) => {
        let result = await UserService.getUserBySessionId(req.query.sessionId);
        console.log("[ DEBUG ]: GET", req.query.sessionId, "RESULT", result);
        console.log();
        res.json(result);
    },

    updateUser: async (req, res) => {
        let result = await UserService.updateUser(req.body.sessionId, req.body.data);
        console.log("[ DEBUG ]: UPDATE", req.body.sessionId, "DATA:", req.body.data, "RESULT", result);
        console.log();
        res.json(result);
    },

    logoutUser: async (req, res) => {
        let result = await UserService.logoutUser(req.body.sessionId);
        console.log("[ DEBUG ]: LOGOUT", req.body.sessionId, "RESULT", result);
        console.log();
        res.json(result);
    }
}