import { Gradient } from '../dependencies/Gradient.js'
import {loadPage} from '../script.js'

var button_login;

export default () => {
    document.querySelector('.order-btn').remove()
    button_login = document.querySelector('.login_btn')

    const gradient = new Gradient()

    gradient.initGradient('#canvas-gradient')

    loadPage()

    button_login.addEventListener('click', () => {
        window.location = '../products'
    })

    window.addEventListener('keydown', (e) =>{
        if(e.key.toLowerCase() != 'd'){
            return
        }

        window.location = '../dashboard'
    })
    
}