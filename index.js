const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')

const csrfMiddleware = csrf({ cookie: true })

app.set('port', 4000)
app.set('views', path.join(__dirname, 'src/views'))
/*app.set('jsonpath', path.join(__dirname, 'src/json'))*/
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(csrfMiddleware)


app.use(require('./src/routes/routes'))

app.all('*', (req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    next()
})

app.use(express.static(path.join(__dirname, 'src/public')))
/*app.use(express.static(path.join(__dirname, 'src/json')))*/

app.listen(app.get('port'), () => {
    console.log('Puerto lanzado en ', app.get('port'))
})