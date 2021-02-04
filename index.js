const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./models/http-error');

const sequelize = require('./util/db-connection');

const usersRouter = require('./routes/users-route');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Aontrol-Allow-Methods','GET','POST','PATCH','DELETE');
    next();
});

app.use('/api/users', usersRouter);

app.use((req, res, next) => {
    const error = new HttpError('Cold not find this route', 404);
    throw error;
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
    app.listen(5000);
} catch (error) {
    console.log('Unable to connect to database: ', error);
}





