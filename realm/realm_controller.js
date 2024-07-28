const Realm = require('realm');
const realmSchema = require('./scheme');

module.exports = getDatabase = async () => {
    return await Realm.open({
        schema: realmSchema,
        schemaVersion: 2,
    });
}