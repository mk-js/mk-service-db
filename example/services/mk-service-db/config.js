
const config = (options) => {
    if (Array.isArray(options)) {
        current.dbs = options;
        options = options[0];
    }
    Object.assign(current, options)
    current.init();
    return current;
}


const current = {
    init: () => { },
    name: "bizdata",
    type: "mysql",
    user: "root",
    pwd: "mydbpassword",
    host: "localhost",
    port: 3306,
    database: "bizdata_dev",
    transactionType: "auto",
    dbs: [],
}

module.exports = Object.assign(config, {
    current,
})
