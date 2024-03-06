
var button_login

export const init = () =>{
    button_login = document.querySelector('.login_button')

    button_login.addEventListener('click', button_login_Clistener)
}

const button_login_Clistener = () =>{
    window.location = "../login"
}
