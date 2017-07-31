/**
 * server配置
 * 
 */

const config = ({ services }) => {
    Object.assign(server.services, services)
    server.db = server.services['mk-service-db']
    configServices(server)
    return server
}

const server = {
    host: "0.0.0.0",
    port: 8000,
    apiRootUrl: "/v1",
    interceptors: [],
    services: {
        // referrenced service
    },
    configs: {
        // serviceName: {}
        "mk-service-db": {
            name: "bizdata",
            type: "mysql",
            user: "root",
            pwd: "mypassword",
            host: "localhost",
            port: 3306,
            database: "bizdata_dev",
            transactionType: "auto",
        }
    },
}

function configServices(server) {
    var { services, configs } = server;
    Object.keys(services).filter(k => !!services[k].config).forEach(k => {
        let curCfg = Object.assign({ server }, configs["*"], configs[k]);
        services[k].config(curCfg);
    })
}

module.exports = config
