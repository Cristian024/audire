var exit;
var buy;

export default () =>{
    document.querySelector('.order-btn').remove()

    exit = document.querySelector('.exit')

    exit.addEventListener('click', backToProducts)
}

const backToProducts = () =>{
    window.location = '../products'
}