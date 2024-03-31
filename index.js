const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const routes = require('./src/routes/routes')

const port = process.env.PORT || 5000

app.set('views', path.join(__dirname, 'src/views'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', routes)

app.use(express.static(path.join(__dirname, 'src/public')))

app.listen(port, ()=>{
    console.log('Puerto lanzado en ', port)
})
