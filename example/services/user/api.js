const config = require("./config").current

const ping = (dto) => true

const version = (data, ctx) => {
    var db = config.db.api.getDB();
    return db.query("SELECT version() version", { type: db.QueryTypes.SELECT })
        .then(version => {
            ctx.return(version);
        })
}

module.exports = {
    ping,
    version,
}

