const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')

router.get('/', (req, res) => {
    res.render('dashboard.html', { pagina: 'DASHBOARD', partial: 'HOME' })
})

router.get('/products', (req,res) =>{
    res.render('dashboard.html', { pagina: 'DASHBOARD', partial: 'PRODUCTS' })
})

router.get('/productsImages', (req,res) =>{
    res.render('dashboard.html', {pagina: 'DASHBOARD', partial: 'PRODUCTS_IMAGES'})
})

module.exports = router;