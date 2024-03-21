import * as INDEX from './index.js'
import * as LOGIN from './login.js'
import * as PRODUCTS from './products.js'
import * as DASHBOARD from './dashboard.js'
import * as CARLIST from './carlist.js'

var NAME_SPACE

var loader
var logo

window.addEventListener('load', () => {
    NAME_SPACE = document.querySelector('body').classList[0]
    loader = document.querySelector('.loader')
    logo = document.querySelector('.logo-header')

    switch (NAME_SPACE) {
        case "INDEX":
            INDEX.default()
            break;
        case "LOGIN":
            LOGIN.default()
            break;
        case "PRODUCTS":
            PRODUCTS.default()
            break;
        case "DASHBOARD":
            DASHBOARD.default()
            break;
        case "CARLIST":
            CARLIST.default()
            break;
        default:
            window.location = '../'
            break;
    }


    logo?.addEventListener('click', () => {
        window.location = '../'
    })
})


export const loadPage = () => {
    loader.classList.remove('active')
    setTimeout(() => {
        loader.style.display = "none"
    }, 1000);
}
