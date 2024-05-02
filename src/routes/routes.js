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

router.post('/login', (req, res) => {
    let userName = req.body.email;
    let userRole = req.body.role

    req.session.loggedin = true;
    req.session.username = userName;
    req.session.role = userRole;

    if (userRole == 204) {
        res.send({ url: '../products' });
    } else if (userRole == 205) {
        res.send({ url: '../dashboard' });
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('../');
})

router.get('/validateSession', (req, res) => {
    if (req.session !== undefined) {
        const loggedin = req.session.loggedin || false;
        if (!loggedin) {
            res.send({ sessionExpires: true });
        } else {
            const userRole = req.session.role;
            var url;
            var isClient;
            if (userRole == 204) {
                url = '../products'
                isClient = true;
            } else if (userRole == 205) {
                url = '../dashboard'
                isClient = false;
            }
            res.send({ sessionExpires: false, url: url, isClient: isClient });
        }
    } else {
        res.send({ sessionExpires: true });
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