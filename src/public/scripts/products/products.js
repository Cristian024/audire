import * as CARDS from "./cards.js";
import * as API from "../dependencies/apiMethods.js";
import * as CARLIST from '../carlist/carlistController.js'
import { loadPage } from '../script.js';
import {showMessagePopup, notificationConfig} from '../dependencies/notification.js'

var lenis;
var PRODUCT_ID;

var productsSection;

var productAddcard;
var productImg;
var productName;
var productPrice;
var productDescription;

export default async () => {
    lenis = new Lenis()

    PRODUCT_ID = document.querySelector('body').classList[1]

    document.querySelector('.order-btn').remove()

    if (PRODUCT_ID != null) {
        loadProduct(PRODUCT_ID)
    } else {
        await loadProducts();
        loadPage()
    }

    requestAnimationFrame(raf)
    validateSessionButton()
    window.addEventListener('pageshow', async (e) => {
        if (e.persisted) {
            await validateSessionButton();
        }
    })
}

async function validateSession() {
    const response = await fetch('../validateSession', {
        method: 'GET'
    })

    const data = response.text();
    const data_response = await data.then(res => {
        return JSON.parse(res);
    })

    return data_response;
}

async function validateSessionButton() {
    const data_response = await validateSession();

    const buttonLogoutV = document.querySelector('.button-logout') || null;
    if (!data_response.sessionExpires) {
        if (buttonLogoutV == null) {
            const buttonLogout = document.createElement('button');
            buttonLogout.classList.add('button-logout')
            buttonLogout.textContent = 'Cerrar sesión';

            buttonLogout.addEventListener('click', () => {
                buttonLogout.remove();
                window.location = '../logout';
            })

            document.querySelector('.menu-side').insertBefore(buttonLogout, document.querySelector('.menu-label'));
        }
    } else {
        if (buttonLogoutV != null) {
            buttonLogoutV.remove()
        }
    }
}

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

async function loadProducts() {
    productsSection = document.querySelector('.products')

    await API.executeConsult(null, 'products')
        .then(
            async function (value) {
                await showProducts(value);
            },
            function (error) {
                notificationConfig.text = "Error en el servidor"
                notificationConfig.background = "Red"
                showMessagePopup(notificationConfig)
            }
        )
}

async function showProducts(value) {
    await value.forEach(element => {
        var imageData;
        if (parseInt(element.quantityImages) > 0) {
            const images = element.imagesURL;
            const arrayImages = images.split(',');
            imageData = arrayImages[0]
        } else {
            imageData = ''
        }

        const data = {
            id: element.id,
            name: element.name,
            price: element.price,
            url: imageData
        };

        const elementList = CARDS.initCardProducts(data);
        productsSection.appendChild(elementList);
    });
}


async function loadProduct(id) {
    productAddcard = document.querySelector('#product-addcard');
    productImg = document.querySelector('#product-img');
    productName = document.querySelector('#product-name');
    productPrice = document.querySelector('#product-price');
    productDescription = document.querySelector('#product-description');

    await API.executeConsult(id, 'products')
        .then(
            async function (value) {
                if (value.length > 0) {
                    const prod = value[0];
                    var imageData;
                    if (parseInt(prod.quantityImages) > 0) {
                        const images = prod.imagesURL;
                        const arrayImages = images.split(',');
                        imageData = arrayImages[0]
                    } else {
                        imageData = ''
                    }

                    productImg.setAttribute('src', imageData);
                    productName.innerHTML = prod.name;
                    productPrice.innerHTML = `$${prod.price}`;
                    productDescription.innerHTML = prod.description;
                } else {
                    window.location = '../products';
                }
            },
            function (error) {
                notificationConfig.text = "Error en el servidor"
                notificationConfig.background = "Red"
                showMessagePopup(notificationConfig)
            }
        )

    loadPage()

    productAddcard.addEventListener('click', () => {
        addToCart(id)
    })
}

const addToCart = async(id) => {
    const data_response = await validateSession();

    if(data_response.sessionExpires){
        window.location = '../login';
    }else{
        if(!data_response.isClient){
            notificationConfig.background = "red"
            notificationConfig.text = "Eres administrador, no puedes añadir productos al carrito"
            showMessagePopup(notificationConfig);
        }else{
            CARLIST.getOrder().then(
                async function(value){
                    await CARLIST.addOrder({id: id, quantity: 1})
                    .then(
                        function(value){
                            window.location = '../carlist/list';
                        },
                        function(error){
                            notificationConfig.background = "red";
                            notificationConfig.text = error.reason;
                            showMessagePopup(notificationConfig); 
                        }
                    )
                },
                function(error){
                    notificationConfig.background = "red";
                    notificationConfig.text = `Error en el servidor`;
                    showMessagePopup(notificationConfig)
                }
            )
        }
    }
}