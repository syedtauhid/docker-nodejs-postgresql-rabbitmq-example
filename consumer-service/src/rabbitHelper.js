const Utils = require('./utils');

function connect(rabbit, connectionString) {
    return new Promise((resolve, reject) => {
        console.log('Connecting to [%s]', connectionString);
        rabbit.connect(connectionString).then(() => {
            console.log('Successfully connected to [%s]', connectionString);
            resolve();
        }).catch(err => {
            console.log('Rabbit connection failure. Retrying in 3 seconds');
            Utils.delay(3000, rabbit, connectionString).then(() => {
                connect(rabbit, connectionString).then(() => resolve());
            });
        });
    });
}

module.exports.connectRabbit = connect;

module.exports.getRabbitHost = () => {
    let connectionString = '';
    const cmdArg = process.env['RABBIT_HOST'];
    if (null != cmdArg) {
        connectionString = cmdArg;
    } else {
        connectionString = 'amqp://localhost';
    }
    return connectionString;
}
