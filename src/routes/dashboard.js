const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const session = require('express-session');

router.get('/', (req, res) => {
    render(res, 'HOME', req)
})

router.get('/products', (req, res) => {
    render(res, 'PRODUCTS', req)
})

router.get('/productsImages', (req, res) => {
    render(res, 'PRODUCTS_IMAGES', req)
})

router.get('/comments', (req, res) => {
    render(res, 'COMMENTS', req)
})

router.get('/users', (req, res) => {
    render(res, 'USERS', req)
})

router.get('/lots', (req, res) => {
    render(res, 'LOT', req);
})

router.get('/depots', (req, res) => {
    render(res, 'DEPOT', req);
})

router.get('/orders', (req, res) => {
    render(res, 'ORDERS', req);
})

router.get('/ordersDetails', (req, res) =>{
    render(res, 'ORDERS_DETAIL', req);
})

router.get('/companies', (req ,res) =>{
    render(res, 'COMPANIES', req);
})

router.get('/shipments', (req,res) =>{
    render(res, 'SHIPMENTS', req);
})

router.get('/earnings', (req, res) =>{
    render(res, 'EARNINGS', req);
})

router.get('/cities', (req, res) =>{
    render(res, 'CITIES', req)
})

const render = (res, partial, req) => {
    const loggedin = req.session.loggedin;
    const role = req.session.role;

    res.render('dashboard.html', { pagina: 'DASHBOARD', partial: partial });
    /*if(loggedin && role === 205){
        res.render('dashboard.html', { pagina: 'DASHBOARD', partial: partial });        
    }else{
        res.redirect('../');
    }*/
}

module.exports = router;