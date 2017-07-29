const config = require('./config')
const api = require('./api')

module.exports = {
    apiRootUrl: false,
    name: "mk-service-db",
    version: "",
    description: "",
    author: "lsg",
    config: (options) => {
        config(options);
        api.init();
    },
    api,
}