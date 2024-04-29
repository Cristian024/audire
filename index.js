const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./src/routes/routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());

app.use(session({
    secret: "vibras",
    saveUninitialized: true,
    cookie: {
        maxAge: 24000 * 60 * 60
    },
    resave: false
}))

app.set('views', path.join(__dirname, 'src/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', routes);

app.use(express.static(path.join(__dirname, 'src/public')));

app.listen(port, () => {
    console.log('Puerto lanzado en ', port);
})
