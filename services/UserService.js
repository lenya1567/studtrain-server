const sha1 = require("sha1");

const RealmController = require("../realm/realm_controller");
const { generate, generateHash } = require("../functions/functions");
const {
    REQUEST_FORM_ERROR,
    LOGIN_IS_BUSY_ERROR,
    NO_ERROR,
    NO_USER_ERROR,
    USER_SESSION_INVALID
} = require("../functions/errors");

module.exports = {
    createUser: (login, password) => {
        return new Promise(async (resolve, reject) => {
            if (!login || !password || login.includes('"')) {
                resolve({ error: REQUEST_FORM_ERROR, message: "Request form error!" });
                return;
            }
            const realm = await RealmController();
            if (realm.objects("User").filtered(`login == "${login}"`).length != 0) {
                resolve({
                    error: LOGIN_IS_BUSY_ERROR,
                    message: "Пользователь с таким именем уже есть!",
                });
                return;
            }

            let nowTime = new Date(Date.now()).toISOString();

            realm.write(() => {
                let newUser = realm.create("User", {
                    id: generate(10),
                    login: login,
                    password_hash: generateHash(login, password),
                    permissions: 0,
                    userData: JSON.stringify({ name: "" }),
                    createdDate: nowTime,
                    loggedInDate: nowTime,
                });
                let newSession = realm.create("UserSession", {
                    id: generate(20),
                    user: newUser,
                    loggedInDate: nowTime,
                });
                resolve({
                    error: NO_ERROR,
                    sessionId: newSession.id,
                    userData: newUser.userData,
                });
            });
        });
    },

    loginUser: async (login, password) => {
        return new Promise(async (resolve, reject) => {
            if (!login || !password || login.includes('"')) {
                resolve({ error: REQUEST_FORM_ERROR, message: "Request form error!" });
                return;
            }

            const realm = await RealmController();
            const passwordHash = generateHash(login, password);

            const searchResult = realm
                .objects("User")
                .filtered(`login == "${login}" && password_hash == "${passwordHash}"`);

            if (searchResult.length == 0) {
                resolve({ error: NO_USER_ERROR, message: "Пользователь не найден!" });
                return;
            }

            let nowUser = searchResult[0];
            let nowTime = new Date(Date.now()).toISOString();

            realm.write(() => {
                nowUser.loggedInDate = nowTime;
                let newSession = realm.create("UserSession", {
                    id: generate(20),
                    user: nowUser,
                    loggedInDate: nowTime,
                });
                resolve({
                    error: NO_ERROR,
                    sessionId: newSession.id,
                    userData: nowUser.userData,
                });
            });
        });
    },

    updateUser: async (sessionId, { name }) => {
        return new Promise(async (resolve, reject) => {
            if (!sessionId) {
                resolve({ error: REQUEST_FORM_ERROR, message: "Request form error!" });
                return;
            }
            const realm = await RealmController();
            const searchResult = realm.objects("UserSession").filtered(`id == "${sessionId}"`);
            if (searchResult.length != 0) {
                let session = searchResult[0];
                realm.write(() => {
                    session.user.userData = JSON.stringify({ name: name });
                    resolve({ error: NO_ERROR, forCookie: JSON.stringify({ id: sessionId, data: { name } }) });
                });
            } else {
                resolve({ error: REQUEST_FORM_ERROR, message: "No such session!" });
            }
        });
    },

    logoutUser: async (sessionId) => { 
        return new Promise(async (resolve, reject) => {
            if (!sessionId) {
                resolve({ error: REQUEST_FORM_ERROR, message: "Request form error!" });
                return;
            }
            const realm = await RealmController();
            const searchResult = realm.objects("UserSession").filtered(`id == "${sessionId}"`);
            if (searchResult.length != 0) {
                let session = searchResult[0];
                realm.write(() => {
                    realm.delete(session);
                    resolve({ error: NO_ERROR });
                });
            } else {
                resolve({ error: REQUEST_FORM_ERROR, message: "No such session!" });
            }
        });
    },

    getUserBySessionId: async (sessionId) => { 
        if (!sessionId) {
            return { error: REQUEST_FORM_ERROR, message: "Request form error!" };
        }
        const realm = await RealmController();
        const searchResult = realm.objects("UserSession").filtered(`id == "${sessionId}"`);
        if (searchResult.length != 0) {
            let session = searchResult[0];
            return { error: NO_ERROR, data: {
                name: JSON.parse(session.user.userData).name,
                login: session.user.login,
                status: session.user.permissions == 2 ? "Администратор" : "Стандартный пользователь",
            }};
        } else {
            return { error: USER_SESSION_INVALID, message: "No such session!" };
        }
    },
};
