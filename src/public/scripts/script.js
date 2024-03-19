import { Gradient } from './Gradient.js'

var NAME_SPACE

var loader;
var logo;
var LOGIN;

LOGIN = {
    button_login: null,
    init: function () {
        document.querySelector('.order-btn').remove()
        LOGIN.button_login = document.querySelector('.login_btn')

        const gradient = new Gradient()

        gradient.initGradient('#canvas-gradient')

        LOGIN.button_login.addEventListener('click', () => {
            window.location = '../products'
        })

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() != 'd') {
                return
            }

            window.location = '../dashboard'
        })
    }
}

window.addEventListener('DOMContentLoaded', () => {
    NAME_SPACE = document.querySelector('body').classList[0]
    loader = document.querySelector('.loader')
    logo = document.querySelector('.logo-header')

    window.onload = () => {
        switch (NAME_SPACE) {
            case "INDEX":
                INDEX.init()
                break;
            case "LOGIN":
                LOGIN.init()
                break;
            case "PRODUCTS":
                PRODUCTS.init()
                break;
            case "DASHBOARD":
                DASHBOARD.init()
                break;
            default:
                window.location = '../'
                break;
        }

        setTimeout(() => {
            loadPage()
        }, 500);
    }

    logo?.addEventListener('click', () => {
        window.location = '../'
    })
})

const loadPage = () => {
    loader.classList.remove('active')
    setTimeout(() => {
        loader.style.display = "none"
    }, 1000);
}




