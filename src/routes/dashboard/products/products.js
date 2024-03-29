const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('dashboard/products.html', { pagina: 'DASHBOARD', partial: 'PRODUCTS' })
})

module.exports = router