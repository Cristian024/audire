const express = require('express');
const router = express.Router();
const products = require('./products/products')

router.get('/', (req, res) => {
    res.render('dashboard/dashboard.html', { pagina: 'DASHBOARD' })
})

router.use('/products', products)

module.exports = router;