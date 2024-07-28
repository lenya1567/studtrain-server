const { customAlphabet } = require("nanoid");
const sha1 = require("sha1");

module.exports = {
    secretCode: "TR!dD83^oEwUdAa&@ag",
    generate: customAlphabet("abcdefghijklmnopqrstvuwxyz0123456789"),
    generateHash: (login, password) => {
        return sha1(login + this.secretCode + password + 'password');
    }
};