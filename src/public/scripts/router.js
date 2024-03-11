import * as INDEX from './index.js'
import * as LOGIN from './login.js'
import * as PRODUCTS from './products.js'

var NAME_SPACE

var loader
var logo

window.addEventListener('DOMContentLoaded', () => {
    NAME_SPACE = document.querySelector('body').classList[0]
    loader = document.querySelector('.loader')
    logo = document.querySelector('.logo-header')

    window.onload = () =>{
        switch(NAME_SPACE){
            case "INDEX":
                INDEX.init()
                break;
            case "LOGIN":
                LOGIN.init()
                break;
            case "PRODUCTS":
                PRODUCTS.init()
                break;
                ;
            default:
                window.location = '../'
                break;
        }

        setTimeout(() => {
            loadPage()
        }, 500);
    }

    logo.addEventListener('click', () =>{
        window.location = '../'
    })
})


const loadPage = () =>{
    loader.classList.remove('active')
    setTimeout(() => {
        loader.style.display = "none"
    }, 1000);
}




