let UserScheme = {
    name: "User",
    properties: {
        id: "string",
        login: "string",
        password_hash: "string",
        permissions: "int",
        userData: "string",
        createdDate: "string",
        loggedInDate: "string"
    },
    primaryKey: "id",
}

let UserSessionScheme = {
    name: "UserSession",
    properties: {
        id: "string",
        user: "User",
        loggedInDate: "string",
    },
    primaryKey: "id",
}

module.exports = [UserScheme, UserSessionScheme];