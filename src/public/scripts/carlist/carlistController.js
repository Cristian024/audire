import * as API from '../dependencies/apiMethods.js'
import index from '../index/index.js';

const storage = window.localStorage;

var orderObject = {
    id: null,
    orderDate: null,
    cancelDate: null,
    totalPrice: 0,
    subTotal: 0,
    shippingPrice: 0,
    direction: '',
    latitude: 0,
    longitude: 0,
    cancelReason: null,
    city: null,
    paymentMethod: null,
    state: null,
    user: null,
}

var orderDetail = {
    id: null,
    quantity: 0,
    totalPrice: 0,
    product: null,
    orderId: null
};

var userData = {
    id: null,
    name: null,
    email: null,
    password: null,
    direction: null,
    documentType: null,
    document: null,
    cellphone: null,
    registerDate: null,
    lastBuyDate: null,
    lastVisitDate: null,
    latitude: null,
    longitude: null,
    role: null,
    state: null,
    city: null
}

var orderDetails = [];

export const emptyOrder = () => {
    storage.removeItem('order');
}

export const emptyOrderDetails = () => {
    storage.removeItem('orderDetails');
}

export const getOrder = () => {
    return new Promise(async function (resolve, reject) {
        const order = JSON.parse(storage.getItem('order')) || null;
        if (order == null) {
            /*
            var date = new Date();
    
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
    
            var formatedDay = year + '/' + month.toString().padStart(2, '0') + '/' + day.toString().padStart(2, '0');
            orderObject.orderDate = formatedDay;
            */
            getUserData().then(
                function (value) {
                    orderObject.user = value.id;
                    storage.setItem('orderDetails', JSON.stringify([]));
                    storage.setItem('order', JSON.stringify(orderObject));
                    orderObject = JSON.parse(storage.getItem('order'));
                    resolve(orderObject);
                },
                function (error) {
                    reject({ reason: 'No se pudo crear la orden' });
                }
            )
        } else {
            orderObject = JSON.parse(storage.getItem('order'));
            resolve(orderObject);
        }
    })
}

export const updateOrder = () => {
    return new Promise(function (resolve, reject) {
        getOrder().then(
            function (value) {
                const order = value;
                getOrderDetails().then(
                    function (value) {
                        var total = 0;
                        value.forEach(element => {
                            const subtotal = parseInt(element.totalPrice);
                            total = total + subtotal;
                        });

                        order.subTotal = total;
                        storage.setItem('order', JSON.stringify(order));
                        resolve({ message: 'Orden actualizada', subtotal: total });
                    },
                    function (error) {
                        order.subTotal = 0;
                        storage.setItem('order', JSON.stringify(order));
                        resolve({ message: 'Orden actualizada', subtotal: 0 });
                    }
                )
            },
            function (error) {
                reject({ reason: 'No se pudo actualizar la orden' });
            }
        )
    })
}

export const addOrderDetail = async (data) => {
    return new Promise(async function (resolve, reject) {
        orderDetails = JSON.parse(storage.getItem('orderDetails'));
        API.executeConsult(data.id, 'products')
            .then(
                function (value) {
                    const product = value[0];
                    const order = orderDetail;

                    const price = parseInt(product.price);

                    order.orderId = null;
                    order.product = product.id;
                    order.quantity = data.quantity;
                    order.totalPrice = price * data.quantity;

                    if (orderDetails.length > 0) {
                        var exits = false;
                        orderDetails.forEach(element => {
                            if (element.product == order.product) {
                                exits = true;
                                reject({ reason: 'El producto ya está añadido' });
                                return;
                            }
                        });

                        if (!exits) orderDetails.push(order);
                    } else {
                        orderDetails.push(order);
                    }

                    storage.setItem('orderDetails', JSON.stringify(orderDetails));
                    resolve()
                },
                function (error) {
                    reject()
                }
            )
    })
}

export const deleteOrderDetail = (productId) => {
    return new Promise(function (resolve, reject) {
        getOrderDetails().then(
            function (value) {

                var exists = false;
                value.forEach(function (element, index) {
                    if (element.product == productId) {
                        exists = true;

                        value.splice(index, 1);

                        storage.setItem('orderDetails', JSON.stringify(value));
                        return;
                    }
                });

                if (exists) resolve({ message: 'Producto eliminado con exito' }) ?? reject({ reason: 'No se pudo eliminar el producto' });
            },
            function (error) {
                reject({ reason: 'No se pudo eliminar el producto' });
            }
        )
    })
}

export const getOrderDetails = async () => {
    return new Promise(function (resolve, reject) {
        orderDetails = JSON.parse(storage.getItem('orderDetails'));

        if (orderDetails == null || orderDetails.length == 0) {
            reject({ reason: 'No hay productos añadidos al carrito' });
        } else {
            resolve(orderDetails);
        }
    })
}

export const updateOrderDetail = async (productId, price, quantity) => {
    return new Promise(function (resolve, reject) {
        getOrderDetails().then(
            function (value) {
                var exists = false;
                var priceReturn;
                value.forEach(function (element, index) {
                    if (element.product == productId) {
                        exists = true;

                        element.totalPrice = price * quantity;
                        element.quantity = quantity;

                        priceReturn = element.totalPrice;

                        storage.setItem('orderDetails', JSON.stringify(value));
                        return;
                    }
                });

                if (exists) resolve({ message: 'Producto actualizado con exito', price: priceReturn }) ?? reject({ reason: 'No se pudo actualizar el producto' });
            },
            function (error) {
                reject({ reason: 'No se pudo actualizar el producto' });
            }
        )
    })
}

export const setUserData = async (id) => {
    return new Promise(function (resolve, reject) {
        API.executeConsult(id, 'users').then(
            function (value) {
                userData = value[0];
                storage.setItem('userData', JSON.stringify(userData));
                resolve();
            },
            function (error) {
                reject({ reason: 'No se encontraron las credenciales' });
            }
        )
    })
}

export const getUserData = async () => {
    return new Promise(function (resolve, reject) {
        const userInfo = JSON.parse(storage.getItem('userData')) || null;

        if (userInfo != null) {
            resolve(userInfo);
        } else {
            reject({ reason: 'No se pudo obtener la información del usuario' });
        }
    })
}

export const hasCoverage = (point, geoPoints) => {
    return new Promise(function (resolve, reject) {
        if (geoPoints.length == 0) {
            reject({ reason: 'No hay servicio de entrega disponible', hasCities: false });
        } else {
            var coverage;
            var inside = false;
            geoPoints.forEach(element => {
                const geoPoint = element.points
                var x = point.lng;
                var y = point.lat;
                for (var i = 0, j = geoPoint.length - 1; i < geoPoint.length; j = i++) {
                    var xi = geoPoint[i][0];
                    var yi = geoPoint[i][1];
                    var xj = geoPoint[j][0];
                    var yj = geoPoint[j][1];
                    var intersect = ((yi > y) != (yj > y)) &&
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) {
                        inside = true;
                        coverage = {
                            'id': element.id,
                            'name': element.name,
                            'shippingPrice': 0
                        }
                    }
                }
            });

            if (inside) {
                resolve(coverage);
            } else {
                getShippingPrice(point, geoPoints).then(
                    function (value) {
                        resolve(value)
                    },
                    function (error) {
                        reject(error);
                    }
                )
            }
        }
    })
}

const getShippingPrice = (point, geoPoints) => {
    return new Promise(function (resolve, reject) {
        var zones = [];
        geoPoints.forEach(zone => {
            var middlePointLat = 0;
            var middlePointLon = 0;
            zone.points.forEach(element => {
                middlePointLon += element[0];
                middlePointLat += element[1];
            });

            middlePointLat = middlePointLat / zone.points.length;
            middlePointLon = middlePointLon / zone.points.length;
            zones.push({
                'id': zone.id,
                'name': zone.name,
                'middlePointLat': middlePointLat,
                'middlePointLon': middlePointLon
            })
        });

        if (zones.length == 0) {
            reject({ reason: 'No hay covertura en ninguna ciudad' })
        } else {
            var zoneCoverture;
            var coverage;
            var distances = [];

            var posLon = point.lng;
            var posLat = point.lat;

            for (let index = 0; index < zones.length; index++) {
                var zoneLat = zones[index].middlePointLat;
                var zoneLon = zones[index].middlePointLon;

                var distance = Math.sqrt(Math.pow((posLat - zoneLat), 2) + Math.pow((posLon - zoneLon), 2));
                distances.push({
                    'index': index,
                    'distance': distance
                })
            }

            var min = distances[0];
            distances.forEach(element => {
                if (element.distance < min.distance) {
                    min = element;
                }
            });

            zoneCoverture = zones[min.index];
            coverage = {
                'id': zoneCoverture.id,
                'name': zoneCoverture.name,
                'shippingPrice': parseInt((min.distance * 8000))
            }
            resolve(coverage)
        }
    })
}