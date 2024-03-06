import * as INDEX from './index.js'
import * as LOGIN from './login.js'

var NAME_SPACE

var loader

window.addEventListener('DOMContentLoaded', () => {
    NAME_SPACE = document.querySelector('body').classList[0]

    loader = document.querySelector('.loader')

    switch(NAME_SPACE){
        case "INDEX":
            INDEX.init()
            break;
        case "LOGIN":
            LOGIN.init()
            break;
        default:
            window.location = '../'
            break;
    }

    setTimeout(() => {
        loadPage()
    }, 1000);
})


const loadPage = () =>{
    loader.classList.remove('active')
    setTimeout(() => {
        loader.style.display = "none"
    }, 1000);
}




