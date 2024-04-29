const express = require('express')
const dashboard = require('./dashboard')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index.html', { pagina: 'INDEX' })
})

router.get('/register', (req, res) => {
    res.render('register.html', { pagina: 'REGISTER' })
})

router.get('/login', (req, res) => {
    res.render('login.html', { pagina: 'LOGIN' })
})

router.post('/login', (req, res) =>{
    let userName = req.body.email;
    let userPassword = req.body.password;
    let userRole = req.body.role

    req.session.loggedin = true;
    req.username = userName;
    req.password = userPassword;
    req.role = userRole;

    if(userRole == 204){
        res.redirect('./');
    }else if(userRole == 205){
        res.redirect('./dashboard');
    }
})

router.get('/products', (req, res) => {
    res.render('products.html', { pagina: 'PRODUCTS' })
})

router.get('/products/:id', (req, res) => {
    const id = req.params.id

    res.render('product.html', { pagina: 'PRODUCTS', product: id })
})

router.get('/carlist/:id', (req, res) => {
    const list = req.params.id

    res.render('carlist.html', { pagina: 'CARLIST', section: list })
})

router.use('/dashboard', dashboard)

module.exports = router