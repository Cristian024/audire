import * as CARDS from "./cards.js"

var cards;

var lenis;
var PRODUCT_ID;

var productAddcard;

export default () => {
    lenis = new Lenis()

    PRODUCT_ID = document.querySelector('body').classList[1]

    document.querySelector('.order-btn').remove()

    if (PRODUCT_ID != null) {
        loadProduct(PRODUCT_ID)
    } else {
        cards = document.querySelectorAll('.product')
        CARDS.redirectUrl(cards)
    }

    requestAnimationFrame(raf)
}

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

function loadProduct(id) {
    productAddcard = document.querySelector('#product-addcard')

    productAddcard.addEventListener('click', () =>{
        addToCart(id)
    })
}

const addToCart = (id) =>{
    window.location = '../carlist'
}