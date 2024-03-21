import { loadPage } from './script.js'

/* LIST */
var exit;
var buy;

/* INFORMATION */

var form_description;

var section;
var sections
var status_list;

/* PAYMENT */

var form_payment

/* CONFIRMATION */

var confirmation_btn

export default () => {

    section = document.querySelector('body').classList[1]
    sections = document.querySelectorAll('.section-buy')

    status_list = document.querySelectorAll('.status')

    switch (section) {
        case 'list':
            toggleSection(0)
            init_list()
            break;
        case 'information':
            toggleSection(1)
            init_information()
            break;
        case 'payment':
            toggleSection(2)
            init_payment()
            break;
        case 'confirmation':
            toggleSection(3)
            init_confirmation()
            break;
        default:
            window.location = '../carlist/list'
            break;
    }

    document.querySelector('.order-btn').remove()

    loadPage()
}

const toggleSection = (pos) => {
    status_list[pos].classList.add('active')
    for (let i = 0; i < sections.length; i++) {
        console.log(`${i} ${pos}`);
        if (i != pos) {
            sections[i].remove()
        }
    }
}

const init_list = () => {
    const backToProducts = () => {
        window.location = '../products'
    }

    const nextStep = () => {
        window.location = '../carlist/information'
    }

    exit = document.querySelector('.exit')
    buy = document.querySelector('.buy')

    buy.addEventListener('click', nextStep)
    exit.addEventListener('click', backToProducts)
}

const init_information = () => {
    const nextStep = (e) => {
        window.location = '../carlist/payment'
    }

    form_description = document.querySelector('.form-description')

    form_description.addEventListener('submit', (e) => {
        e.preventDefault()

        nextStep()
    })
}

const init_payment = () => {
    const metodoPago = document.getElementById('metodo_pago');
    const tarjetaCredito = document.getElementById('tarjeta_credito');
    const paypal = document.getElementById('paypal');
    form_payment = document.querySelector('.form-payment')

    metodoPago.addEventListener('change', () => {
        console.log(metodoPago.value);
        if (metodoPago.value === 'tarjeta_credito') {
            tarjetaCredito.style.display = 'block'
        }else{
            tarjetaCredito.style.display = 'none'
        }
    })

    form_payment.addEventListener('submit', (e)=>{
        e.preventDefault()

        window.location = '../carlist/confirmation'
    })
}

const init_confirmation = () =>{
    confirmation_btn = document.querySelector('.confirmation_btn')

    confirmation_btn.addEventListener('click', (e) =>{
        window.location = '../products'
    })
}