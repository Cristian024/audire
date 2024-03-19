import { Gradient } from './Gradient.js'

var button_login;

export const init = () => {
    document.querySelector('.order-btn').remove()
    button_login = document.querySelector('.login_btn')

    const gradient = new Gradient()

    gradient.initGradient('#canvas-gradient')

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