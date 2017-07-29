const options = require('./config').current;
const Sequelize = require("sequelize")
const cls = require('continuation-local-storage')
Sequelize.useCLS(cls.createNamespace('my-own-namespace'))

const api = {
    currentDB: null,
}

const dbs = {}

const getDB = (name) => { 
    return dbs[name || 'currentDB'];
}

const init = () => {

    dbs.currentDB = dbs[options.name] = newDB(options);

    if (Array.isArray(options.dbs)) {
        options.dbs.filter(d => !dbs[d.name]).forEach(d => {
            dbs[d.name] = newDB(d);
        })
    }
}

const newDB = (cfg) => new Sequelize(cfg.database, cfg.user, cfg.pwd, {
    host: cfg.host,
    port: cfg.port,
    dialect: cfg.type,
});


const interceptor = (ctx) => {
    var currentDB = null;
    var transactionType = ctx.handler.transactionType ||
        ctx.service.config && ctx.service.config.current &&
        (ctx.service.config.current.transactionType || (currentDB = ctx.service.config.current.db) && ctx.service.config.current.db.transactionType) ||
        options.transactionType;

    currentDB = currentDB || dbs.currentDB;

    if (currentDB && transactionType == 'auto' && !ctx._handler) {
        var transactionWrapper = (data, ctx) => {
            currentDB.transaction((t) => {
                try {
                    var promise = ctx._handler(data, ctx);
                    if (promise && promise.catch) {
                        promise.catch(ex => {
                            //捕获到数据库错误
                            console.log('捕获到数据库错误')
                            ctx.error(ex)
                        })
                        return promise;
                    } else {
                        console.warn('启用数据库事务，必须返回数据库查询的Promise对象才能自动回滚！')
                    }
                } catch (ex) {
                    //捕获到代码错误
                    console.log('捕获到代码错误')
                    ctx.error(ex)
                }
            })
        }
        ctx._handler = ctx.handler;
        ctx.handler = transactionWrapper;
        Object.assign(transactionWrapper, ctx._handler);
    }

    return true;
}



module.exports = Object.assign(api, { 
    getDB,
    init,
    interceptor,
});