import { loadPage } from '../script.js';
import { showMessagePopup, notificationConfig } from '../dependencies/notification.js';
import * as CONTROLLER from './carlistController.js';
import * as API from '../dependencies/apiMethods.js';

/* LIST */
var exit;
var buy;
var carProducts;

/* INFORMATION */

var form_description;
var subtotalCar;

var section;
var sections
var status_list;
var map_div;
var map;
var userPos;
var geoPoints = [];
var shippingPrice;
var totalPrice;
var order;

/* PAYMENT */

var form_payment

/* CONFIRMATION */

var confirmation_btn

export default async () => {
    section = document.querySelector('body').classList[1]
    sections = document.querySelectorAll('.section-buy')

    status_list = document.querySelectorAll('.status')

    switch (section) {
        case 'list':
            toggleSection(0)
            await init_list()
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
    status_list[pos].classList.add('active');

    status_list[0].addEventListener('click', () => {
        window.location = '../carlist/list';
    })
    status_list[1].addEventListener('click', () => {
        window.location = '../carlist/information';
    })
    status_list[2].addEventListener('click', () => {
        window.location = '../carlist/payment';
    })
    status_list[3].addEventListener('click', () => {
        window.location = '../carlist/confirmation';
    })

    for (let i = 0; i < sections.length; i++) {
        if (i != pos) {
            sections[i].remove()
        }
    }
}

const init_list = async () => {
    exit = document.querySelector('.exit');
    buy = document.querySelector('.buy');
    carProducts = document.querySelector('.car-products');

    const showListProducts = async (data) => {
        data.forEach(element => {
            API.executeConsult(element.product, 'products').then(
                function (value) {
                    if (value[0] != null) {
                        var order
                        data.forEach(element => {
                            if (element.product == value[0].id) {
                                order = element;
                                return
                            }
                        });
                        const div = getProductCard(value[0], order);

                        carProducts.append(div);
                    }
                },
                function (error) {
                    notificationConfig.background = 'red';
                    notificationConfig.text = 'Error al cargar los productos';
                    showMessagePopup(notificationConfig);
                }
            )
        });
    }

    const updateProduct = async (productId, price, div, operation, priceDiv) => {
        try {
            var quantity;
            if (operation == 'add') {
                quantity = parseInt(div.textContent) + 1;
            } else if (operation == 'sub') {
                quantity = parseInt(div.textContent) - 1
            }

            if (quantity < 1) {
                notificationConfig.background = 'Red';
                notificationConfig.text = 'La cantidad debe ser mayor a 0';
                showMessagePopup(notificationConfig);
                return;
            }

            CONTROLLER.updateOrderDetail(productId, price, quantity)
                .then(
                    function (value) {
                        div.textContent = quantity;
                        priceDiv.textContent = `$${value.price}`;
                        notificationConfig.text = value.message;
                        notificationConfig.background = 'green';
                        updateOrder()
                    },
                    function (error) {
                        notificationConfig.text = error.reason;
                        notificationConfig.background = 'red';
                    }
                ).finally(
                    function () {
                        showMessagePopup(notificationConfig);
                    }
                )
        } catch (error) {
            notificationConfig.background = 'red';
            notificationConfig.text = 'Error en el servidor';
            showMessagePopup(notificationConfig);
        }
    }

    const deleteProduct = async (productId, div) => {
        CONTROLLER.deleteOrderDetail(productId)
            .then(
                function (value) {
                    div.remove();
                    updateOrder();
                    notificationConfig.background = 'green',
                        notificationConfig.text = value.message;
                },
                function (error) {
                    notificationConfig.background = 'red';
                    notificationConfig.text = error.reason;
                })
            .finally(function () {
                showMessagePopup(notificationConfig)
            })
    }

    const updateOrder = async () => {
        const subtotal = document.querySelector('.subtotal-car');
        const total = document.querySelector('.total-car');
        CONTROLLER.updateOrder().then(
            function (value) {
                notificationConfig.text = value.message;
                notificationConfig.background = 'green';
                subtotal.textContent = `$${value.subtotal}`;
                total.textContent = `$${value.subtotal}`;
            },
            function (error) {
                notificationConfig.text = value.reason;
                notificationConfig.background = 'red';
            }
        ).finally(function () {
            showMessagePopup(notificationConfig);
        })
    }

    const getProductCard = (data, order) => {
        const div = document.createElement('div')
        div.classList.add('car-product');

        var imageData;
        if (parseInt(data.quantityImages) > 0) {
            const images = data.imagesURL;
            const arrayImages = images.split(',');
            imageData = arrayImages[0]
        } else {
            imageData = ''
        }

        const iconDelete = document.createElement('ion-icon');
        iconDelete.setAttribute('name', 'close-outline');
        iconDelete.classList.add('delete');
        iconDelete.addEventListener('click', () => {
            deleteProduct(order.product, div);
        })

        div.innerHTML = `
            <img src="${imageData}">
            <h2 class="product-name">${data.name}</h2>
        `
        div.insertBefore(iconDelete, div.querySelector('img'));

        const divPC = document.createElement('div');
        divPC.classList.add('product-cuantity');
        divPC.innerHTML = `
        <h2 class="product-price">$${parseInt(data.price) * order.quantity}</h2>
        `

        const divIN = document.createElement('div');
        divIN.classList.add('product-indicator');
        divIN.innerHTML = `
            <p>${order.quantity}</p>
        `

        const addButton = document.createElement('ion-icon');
        addButton.setAttribute('name', 'add-circle-outline');

        addButton.addEventListener('click', () => {
            updateProduct(data.id, data.price, divIN.querySelector('p'), 'add', divPC.querySelector('h2'));
        })

        const subButton = document.createElement('ion-icon');
        subButton.setAttribute('name', 'remove-circle-outline');

        subButton.addEventListener('click', () => {
            updateProduct(data.id, data.price, divIN.querySelector('p'), 'sub', divPC.querySelector('h2'));
        })

        divIN.insertBefore(addButton, divIN.querySelector('p'));
        divIN.append(subButton)

        divPC.append(divIN);
        div.append(divPC);
        return div;
    }

    CONTROLLER.getOrder().then(
        function (value) {
            const subtotal = document.querySelector('.subtotal-car');
            const total = document.querySelector('.total-car');
            const price = value.subTotal || 0;

            subtotal.textContent = `$${price}`;
            total.textContent = `$${price}`;
        },
        function (error) {

        }
    )

    CONTROLLER.getOrderDetails().then(
        function (value) {
            showListProducts(value);
        },
        function (error) {
            notificationConfig.background = 'red';
            notificationConfig.text = error.reason;
            showMessagePopup(notificationConfig);
        }
    )

    const nextStep = () => {
        var clientContinue = false;
        CONTROLLER.getOrderDetails()
            .then(
                function (value) {
                    clientContinue = true;
                },
                function (error) {

                }
            ).finally(function () {
                if (clientContinue) {
                    window.location = '../carlist/information';
                } else {
                    notificationConfig.background = 'red';
                    notificationConfig.text = 'No has añadido productos al carrito';
                    showMessagePopup(notificationConfig);
                }
            })

    }

    const backToProducts = () => {
        window.location = '../products';
    }

    buy.addEventListener('click', nextStep);
    exit.addEventListener('click', backToProducts);
}

var mapConfig = {
    latitude: 3.3984486,
    longitude: -73.5723,
    zoom: 3
}
const init_information = async () => {
    map_div = document.querySelector('.map');
    subtotalCar = document.querySelector('.subtotal-car');
    shippingPrice = document.querySelector('.shippingPrice');
    totalPrice = document.querySelector('.total-car');

    const drawPolygon = (points, id) => {
        console.log([points, id]);
        map.addSource(id, {
            'type': 'geojson',
            'data': {
                'type': 'FeatureCollection',
                "features": [{
                    "type": "Feature",
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [
                            points
                        ]
                    },
                    'properties': {
                    }
                }]
            }
        })

        map.addLayer({
            'id': `polygon_${id}`,
            'type': 'fill',
            'source': id,
            'layout': {},
            'paint': {
                'fill-color': '#FFAA01',
                'fill-opacity': 0.5
            }
        })
    }

    const initMap = async () => {
        maptilersdk.config.apiKey = 'cILWEoKejn0Dv5sjODMS';

        map = await new maptilersdk.Map({
            container: map_div,
            style: maptilersdk.MapStyle.STREETS,
            center: [mapConfig.longitude, mapConfig.latitude], // starting position [lng, lat]
            zoom: mapConfig.zoom,
        });

        map.on('load', async function () {
            await API.executeConsult(null, 'cities').then(
                function (value) {
                    value.forEach(element => {
                        var points = element.points;
                        var id = element.id;
                        var name = element.name;
                        if (points != null && points != "") {
                            points = JSON.parse(points);
                            geoPoints.push({
                                id: id,
                                name: name,
                                points: points
                            });
                            drawPolygon(points, `geoPoint_${id}_`);
                        }
                    });
                },
                function (error) {
                    notificationConfig.text = "Error al cargar los puntos geograficos";
                    notificationConfig.background = "red";
                    showMessagePopup(notificationConfig);
                }
            )
        })
    }

    const initUserPos = (config) => {
        userPos = new maptilersdk.Marker({
            draggable: true,
            color: "#FFFFFF"
        })
            .setLngLat([config.longitude, config.latitude])
            .addTo(map)

        userPos.on('dragend', function (e) {
            const lngLat = userPos.getLngLat();
            updatePriceOrder(lngLat, geoPoints);
        });
    }

    const updatePriceOrder = (userPos, geoPoints) => {
        CONTROLLER.hasCoverage(userPos, geoPoints).then(
            function (value) {
                notificationConfig.text = `Tiene cobertura en la ciudad de ${value.name}`;
                notificationConfig.background = 'green';
                showMessagePopup(notificationConfig);
                shippingPrice.textContent = value.shippingPrice;
                totalPrice.textContent = value.shippingPrice + order.subTotal;
            },
            function (error) {
                notificationConfig.text = error.reason;
                notificationConfig.background = 'red';
                showMessagePopup(notificationConfig);
            }
        )
    }

    const initOrder = async () => {
        await initMap();

        var userPosition = {
            longitude: mapConfig.longitude,
            latitude: mapConfig.latitude
        };
        await CONTROLLER.getUserData().then(
            function (value) {
                const latitude = value.latitude;
                const longitude = value.longitude;
                const city = value.city

                if ((latitude !== null && latitude !== "0" && latitude !== 0) &&
                    (longitude !== null && longitude !== "0" && longitude !== 0) &&
                    (city !== null)) {
                    mapConfig.latitude = latitude;
                    mapConfig.longitude = longitude;
                    mapConfig.zoom = 10;

                    userPosition.latitude = latitude;
                    userPosition.longitude = longitude;
                }
            },
            function (error) {
                notificationConfig.text = error.reason;
                notificationConfig.background = 'red';
                showMessagePopup(notificationConfig);
            }
        ).finally(function () {
            initUserPos(userPosition)
        })

        await CONTROLLER.getOrder().then(
            function (value) {
                order = value;
                subtotalCar.textContent = value.subTotal;
                totalPrice.textContent = value.subTotal;
            },
            function (error) {
                notificationConfig.text = error.reason;
                notificationConfig.background = 'red';
                showMessagePopup(notificationConfig);
            }
        )
    }

    initOrder();

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
        } else {
            tarjetaCredito.style.display = 'none'
        }
    })

    form_payment.addEventListener('submit', (e) => {
        e.preventDefault()

        window.location = '../carlist/confirmation'
    })
}

const init_confirmation = () => {
    confirmation_btn = document.querySelector('.confirmation_btn')

    confirmation_btn.addEventListener('click', (e) => {
        window.location = '../products'
    })
}