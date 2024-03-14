const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index.html', { pagina: 'INDEX' })
})

router.get('/login', (req, res) => {
    res.render('login.html', { pagina: 'LOGIN' })
})

router.get('/products', (req, res) => {
    res.render('products.html', { pagina: 'PRODUCTS' })
})

router.get('/dashboard', (req, res) => {
    res.render('dashboard.html', { pagina: 'DASHBOARD' })
})

module.exports = router