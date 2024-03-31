const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')

router.get('/', (req, res) => {
    res.render('dashboard.html', { pagina: 'DASHBOARD', partial: 'HOME', subpartial: '' })
})

router.get('/products', (req,res) =>{
    res.render('dashboard.html', { pagina: 'DASHBOARD', partial: 'PRODUCTS', subpartial: 'LIST' })
})

module.exports = router;