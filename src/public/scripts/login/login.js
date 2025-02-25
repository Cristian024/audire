import { Gradient } from '../dependencies/Gradient.js'
import { loadPage } from '../script.js'
import { showMessagePopup } from '../dependencies/notification.js'
import * as API from '../dependencies/apiMethods.js';
import * as CACONTROLLER from '../carlist/carlistController.js';

var notificationConfig = {
    "text": null,
    "background": null
}
var formUser = document.querySelector('.form_user')

export const initLogin = () => {
    const gradient = new Gradient();

    gradient.initGradient('#canvas-gradient');

    loadPage();

    formUser.addEventListener('submit', (e) => {
        e.preventDefault();

        var form = e.target;
        var elements = form.elements;
        var data = {
            'email': elements['name_input_l'].value,
            'password': elements['password_input_l'].value
        };

        loginUser(data);
    })
}

export const initRegister = () => {
    const gradient = new Gradient()

    gradient.initGradient('#canvas-gradient')

    loadPage()

    formUser.addEventListener('submit', (e) => {
        e.preventDefault()

        registerUser(e)
    })
}

const registerUser = async (e) => {
    var form = e.target;
    var elements = form.elements;
    var data = {
        'name': elements['name_input_r'].value,
        'email': elements['email_input_r'].value,
        'password': elements['password_input_r'].value
    };

    API.executeInsert(JSON.stringify(data), 'user_register')
        .then(
            function (value) {
                notificationConfig.text = "Usuario registrado con exito";
                notificationConfig.background = 'green';
                setTimeout(() => {
                    loginUser(data);
                }, 1500);
            },
            function (error) {
                switch (error.status) {
                    case 201:
                        notificationConfig.text = "El usuario ya existe";
                        break;
                    case 500:
                        notificationConfig.text = "Error en el servidor";
                        break;
                }
                notificationConfig.background = "red"
            }
        )
        .finally(() => {
            showMessagePopup(notificationConfig);
        })
}

const loginUser = async (data) => {
    localStorage.clear();
    API.consultLogin(data)
        .then(
            async function (value) {
                const dataPost = {
                    email: data.email,
                    password: data.password,
                    role: value.role,
                    userId: value.userId
                }

                const response = await fetch('../login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify(dataPost)
                })

                const dataR = response.text();
                const data_response = await dataR.then(res => {
                    return JSON.parse(res);
                })

                CACONTROLLER.setUserData(value.userId)
                    .then(function (value) {
                        window.location = data_response.url;
                    }, function (error) {
                        notificationConfig.background = "red";
                        notificationConfig.text = error.reason;
                        showMessagePopup(notificationConfig);
                    })
            },
            function (error) {
                notificationConfig.background = "red";
                notificationConfig.text = error.message;
                showMessagePopup(notificationConfig);
            })
}