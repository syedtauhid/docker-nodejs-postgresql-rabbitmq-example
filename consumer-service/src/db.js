const Pg = require('pg');
const Format = require('pg-format');
const Utils = require('./utils');

var myClient;

module.exports.connect = (host, database, user, password) => {
    return new Promise((resolve, reject) => {
        const pool = new Pg.Pool({
            host: host,
            user: user,
            database: database,
            password: password,
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 6000
        });

        connectToPostgres(pool).then(client => {
            console.log('Successfully connected to Postgres');
            myClient = client;
            resolve();
        });
    });
}

function connectToPostgres(pool) {
    return new Promise((resolve, reject) => {

        const timerPromise = new Promise((resolve, reject) => {
            setTimeout(() => null, 5000);
        });

        const connectPromise = new Promise((resolve, reject) => {
            attemptConnection(pool).then(client => {
                resolve(client);
            }).catch(err => {
                console.log('Error connecting to Postgres [%s]', err);
                resolve(null);
            });
        });


        // Had to do this because sometimes when the service attempts to connect to
        // Postgres server while it is being started, the connect call never returns
        Promise.race([timerPromise, connectPromise]).then(client => {
            if (null != client) {
                resolve(client);
                return;
            }
            console.log('Postgres connection failure. Retrying in 3 seconds');

            Utils.delay(3000, pool).then((pool) => {
                connectToPostgres(pool).then(client => resolve(client));
            })
        });
    });
}

function attemptConnection(pool) {
    return new Promise((resolve, reject) => {
        console.log('Connecting to Postgres');

        pool.connect((err, client, done) => {
            if (err) {
                reject(err);
            } else {
                resolve(client);
            }
        });
    });
}

module.exports.query = (query => {
    return new Promise((resolve, reject) => {
        if (null == myClient) {
            reject('Not connected');
        }
        myClient.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
});
