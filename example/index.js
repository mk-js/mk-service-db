const { config, start } = require("mk-server")
const serverConfig = require( "./config")

const mk_service_db = require("./services/mk-service-db/index.js")

const user = require("./services/user/index.js")


const services = {
	
    [mk_service_db.name]: mk_service_db,
	
    [user.name]: user,

}


config(serverConfig({services}))

start()