const Rabbit = require('./rabbit');
const Db = require('./db');
const RabbitHelper = require('./rabbitHelper');
const ExitHandler = require('./exitHandler')
const Express = require('express');

const rabbit = new Rabbit();
const app = Express();


function onConnected() {
    console.log("Ready");
    rabbit.receiveMessages(onMessageReceived);
}

function onMessageReceived(msg) {
    console.log("Message received [%s]", msg);
    var json = JSON.parse(msg);
    const query = "INSERT INTO data (msg, tid) VALUES ('" + json.word + "', " + json.timestamp + ");";
    Db.query(query)
        .then(() => console.log('Inserted into database'));
}

function createTable() {
    Db.query("CREATE TABLE data (id SERIAL PRIMARY KEY, msg TEXT, tid BIGINT);").then(() => console.log('table created'));
}

function getData() {
    return new Promise((resolve, reject) => {
        Db.query('SELECT * FROM data').then((result) => {
            resolve(result.rows);
        })
    });
}

ExitHandler.setExitHandler(rabbit.disconnect);

app.get('/', (request, result) => {
    getData().then(data => {
        result.send(JSON.stringify(data));
    });
});
app.listen(3000, () => console.log('Webserver listening on port 3000'));

var rabbitConnection = RabbitHelper.connectRabbit(rabbit, RabbitHelper.getRabbitHost());
var dbConnection = Db.connect(process.env['POSTGRES_HOST'], process.env['POSTGRES_DB'], process.env['POSTGRES_USER'], process.env['POSTGRES_PASSWORD']);

Promise.all([rabbitConnection, dbConnection]).then(() => {
    createTable();
    onConnected();
});
