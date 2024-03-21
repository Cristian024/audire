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

router.get('/products/:id', (req, res) => {
    const id = req.params.id

    res.render('product.html', { pagina: 'PRODUCTS', product: id })
})

router.get('/dashboard', (req, res) => {
    res.render('dashboard.html', { pagina: 'DASHBOARD' })
})

router.get('/carlist/:id', (req, res) => {
    const list = req.params.id

    res.render('carlist.html', { pagina: 'CARLIST', section: list })
})

module.exports = router