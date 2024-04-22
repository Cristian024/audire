const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')

router.get('/', (req, res) => {
    render(res, 'HOME')
})

router.get('/products', (req, res) => {
    render(res, 'PRODUCTS')
})

router.get('/productsImages', (req, res) => {
    render(res, 'PRODUCTS_IMAGES')
})

router.get('/comments', (req, res) => {
    render(res, 'COMMENTS')
})

router.get('/users', (req, res) => {
    render(res, 'USERS')
})

router.get('/lots', (req, res) => {
    render(res, 'LOT');
})

router.get('/depots', (req, res) => {
    render(res, 'DEPOT');
})

router.get('/orders', (req, res) => {
    render(res, 'ORDERS');
})

router.get('/ordersDetails', (req, res) =>{
    render(res, 'ORDERS_DETAIL')
})

router.get('/companies', (req ,res) =>{
    render(res, 'COMPANIES')
})

router.get('/shipments', (req,res) =>{
    render(res, 'SHIPMENTS')
})

router.get('/earnings', (req, res) =>{
    render(res, 'EARNINGS')
})

const render = (res, partial) => {
    res.render('dashboard.html', { pagina: 'DASHBOARD', partial: partial })
}

module.exports = router;