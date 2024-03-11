const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index.html', { pagina: 'INDEX' })
})

router.get('/login', (req, res) => {
    res.render('login.html', { pagina: 'LOGIN' })
})

router.get('/products', (req, res) =>{
    res.render('products.html', { pagina: 'PRODUCTS' })
})

module.exports = router