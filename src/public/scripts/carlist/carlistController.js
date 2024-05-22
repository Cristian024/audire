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

export const validateOrder = () =>{
    return new Promise(function (resolve, reject){
        const order = JSON.parse(storage.getItem('order')) || null;
        if(order == null){
            reject();
        }else{
            resolve(order);
        }
    })
}

export const getOrder = () => {
    return new Promise(async function (resolve, reject) {
        const order = JSON.parse(storage.getItem('order')) || null;
        if (order == null) {
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
        getOrderDetails().then(
            function (value) {
                orderDetails = value;
            },
            function (error) {
                storage.setItem('orderDetails', JSON.stringify([]));
                orderDetails = JSON.parse(storage.getItem('orderDetails'));
            }
        )
            .finally(function () {
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

export const updateOrderShipping = async (data) => {
    return new Promise(async function (resolve, reject) {
        getOrder().then(
            function (value) {
                orderObject = value;
                if ((data.latitude == "" || data.latitude == null) || (data.longitude == "" || data.longitude == null)) {
                    reject({ reason: 'Debes indicar tu ubicación actual' });
                } else {
                    getSubTotalOrderAndShippingPrice({ lat: data.latitude, lng: data.longitude }, data.geopoints).then(
                        function (value) {
                            orderObject.subTotal = value.subTotal;
                            orderObject.cancelDate = null;
                            orderObject.cancelReason = null;
                            orderObject.city = value.city;
                            orderObject.direction = data.direction;
                            orderObject.latitude = data.latitude;
                            orderObject.longitude = data.longitude;
                            orderObject.orderDate = null;
                            orderObject.paymentMethod = null;
                            orderObject.shippingPrice = value.shippingPrice;
                            orderObject.state = 1;
                            orderObject.totalPrice = (value.subTotal + value.shippingPrice);

                            API.executeUpdate(JSON.stringify({
                                'name': data.name,
                                'email': data.mail,
                                'cellphone': data.cellphone,
                                'city': value.city,
                                'direction': data.direction,
                                'latitude': orderObject.latitude,
                                'longitude': orderObject.longitude,
                                'document': data.identification,
                                'documentType': data.document_type
                            }), orderObject.user, 'users').then(
                                function (value) {
                                    setUserData(orderObject.user).then(
                                        function (value) {
                                            storage.setItem('order', JSON.stringify(orderObject));
                                            resolve({ message: 'Orden actualizada con exito' });
                                        },
                                        function (error) {
                                            reject({ reason: 'Error al actualizar la información del usuario' })
                                        }
                                    )
                                },
                                function (error) {
                                    reject({ reason: 'Error al generar la orden' })
                                }
                            )
                        },
                        function (error) {
                            reject({ reason: error.reason });
                        }
                    )
                }
            },
            function (error) {
                reject({ reason: 'No se pudo obtener la orden' });
            }
        )
    })
}

export const getSubTotalOrderAndShippingPrice = async (point, geopoints) => {
    return new Promise(function (resolve, reject) {
        getOrderDetails().then(
            function (value) {
                orderDetails = value;
                var subTotal = 0;
                orderDetails.forEach(element => {
                    subTotal += element.totalPrice;
                });
                hasCoverage(point, geopoints).then(
                    function (value) {
                        resolve({ subTotal: subTotal, shippingPrice: value.shippingPrice, city: value.id });
                    }, function (error) {
                        reject({ reason: 'No se pudo determinar la ubicación actual' });
                    })
            },
            function (error) {
                reject({ reason: 'No se pudo obtener el detalle de la orden' });
            }
        )
    })
}

export const setPaymentMethod = (data) => {
    storage.setItem('paymentMethod', JSON.stringify(data));
}

export const getPaymenthMethod = () => {
    return new Promise(function (resolve, reject) {
        const method = storage.getItem('paymentMethod');

        if (method == null) {
            reject({ reason: 'Debes indicar el metodo de pago' });
        } else {
            resolve(JSON.parse(method));
        }
    })
}

export const getAccountPaymenthUser = async () => {
    return new Promise(function (resolve, reject) {
        getUserData().then(
            async function (value) {
                var nequiAccount = null;
                var bancolombiaAccount = null;

                await API.executeConsult(value.id, 'nequi_accounts_by_user').then(
                    function (value) {
                        if (value.length > 0) {
                            nequiAccount = value[0];
                            storage.setItem('nequi', JSON.stringify(nequiAccount));
                        } else {
                            storage.removeItem('nequi');
                        }
                    }
                )

                await API.executeConsult(value.id, 'bancolombia_accounts_by_user').then(
                    function (value) {
                        if (value.length > 0) {
                            bancolombiaAccount = value[0];
                            storage.setItem('bancolombia', JSON.stringify(bancolombiaAccount));
                        } else {
                            storage.removeItem('bancolombia');
                        }
                    }
                )

                if (nequiAccount == null && bancolombiaAccount == null) {
                    resolve(null);
                } else {
                    resolve({ nequi: nequiAccount, bancolombia: bancolombiaAccount });
                }
            },
            function (error) {
                reject({ reason: error.reason })
            }
        )
    })
}

export const updateOrderPayment = async (fields) => {
    return new Promise(async function (resolve, reject) {
        await getPaymenthMethod().then(
            async function (payment) {
                await getOrder().then(
                    function (value) {
                        orderObject = value;
                        orderObject.paymentMethod = payment.id;
                        storage.setItem('order', JSON.stringify(orderObject));
                    },
                    function (error) {
                        reject({ reason: error.reason });
                        return;
                    }
                )

                await getUserData().then(
                    function (user) {
                        switch (payment.id) {
                            case 1:
                                resolve();
                                break;
                            case 2:
                                modifyAccountBancolombia(fields, user).then(
                                    function (value) {
                                        resolve();
                                    },
                                    function (error) {
                                        reject({ reason: error.reason });
                                    }
                                )
                                break;
                            case 3:
                                modifyAccountNequi(fields, user).then(
                                    function (value) {
                                        resolve();
                                    },
                                    function (error) {
                                        reject({ reason: error.reason })
                                    }
                                )
                                break;
                        }
                    },
                    function (error) {
                        reject({ reason: error.reason })
                    }
                )

            },
            function (error) {
                reject({ reason: error.reason });
            }
        )
    })
}

const modifyAccountNequi = async (fields, user) => {
    return new Promise(async function (resolve, reject) {
        var data = {
            'cellphone': fields['numero_celular'].value,
            'document': fields['documento_nequi'].value,
            'email': fields['email'].value,
            'user': user.id
        }

        var nequi = storage.getItem('nequi');
        if (nequi == null) {
            API.executeInsert(JSON.stringify(data), 'nequi_accounts').then(
                function (value) {
                    data.id = value.insertId;
                    storage.setItem('nequi', JSON.stringify(data));
                    resolve()
                },
                function (error) {
                    reject({ reason: 'No se pudo actualizar la información del usuario' })
                }
            )
        } else {
            nequi = JSON.parse(storage.getItem('nequi'));
            API.executeUpdate(JSON.stringify(data), nequi.id, 'nequi_accounts').then(
                function (value) {
                    data.id = nequi.id;
                    storage.setItem('nequi', JSON.stringify(data));
                    resolve();
                },
                function (error) {
                    reject({ reason: 'No se pudo actualizar la información del usuario' })
                }
            )
        }
    })
}

const modifyAccountBancolombia = async (fields, user) => {
    return new Promise(async function (resolve, reject) {
        var data = {
            accountNumber: fields['numero_cuenta'].value,
            document: fields['documento_bancolombia'].value,
            accountTitularName: fields['nombre_titular'].value,
            user: user.id
        }

        var bancolombia = storage.getItem('bancolombia');
        if (bancolombia == null) {
            API.executeInsert(JSON.stringify(data), 'bancolombia_accounts').then(
                function (value) {
                    data.id = value.insertId;
                    storage.setItem('bancolombia', JSON.stringify(data));
                    resolve()
                },
                function (error) {
                    reject({ reason: 'No se pudo actualizar la información del usuario' })
                }
            )
        } else {
            bancolombia = JSON.parse(storage.getItem('bancolombia'));
            API.executeUpdate(JSON.stringify(data), bancolombia.id, 'bancolombia_accounts').then(
                function (value) {
                    data.id = bancolombia.id;
                    storage.setItem('bancolombia', JSON.stringify(data));
                    resolve()
                },
                function (error) {
                    reject({ reason: 'No se pudo actualizar la información del usuario' })
                }
            )
        }
    })
}

export const newOrder = async () => {
    return new Promise(async function (resolve, reject) {
        getOrder().then(
            function (order) {
                var date = new Date();

                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();

                var formatedDay = year + '/' + month.toString().padStart(2, '0') + '/' + day.toString().padStart(2, '0');
                order.orderDate = formatedDay;

                delete order.id;
                API.executeInsert(JSON.stringify(order), 'orders').then(
                    function (value) {
                        const orderId = value.insertId;
                        getOrderDetails().then(
                            async function (orders) {
                                var count = 0;

                                for (const element of orders) {
                                    element.orderId = orderId;
                                    delete element.id;

                                    await API.executeInsert(JSON.stringify(element), 'orders_detail').then(
                                        function (value) {
                                            count++;
                                        },
                                        function (error) {
                                            console.log(error);
                                        }
                                    )
                                }

                                if (count == orders.length) {
                                    storage.removeItem('order');
                                    storage.removeItem('orderDetails');
                                    storage.removeItem('paymentMethod');
                                    resolve()
                                } else {
                                    reject({ reason: 'No se pudo crear la orden' });
                                }
                            },
                            function (error) {
                                reject({ reason: 'No se pudo crear la orden' })
                            }
                        )
                    },
                    function (error) {
                        console.log(error);
                        reject({ reason: 'No se pudo crear la orden' });
                    }
                )
            },
            function (error) {
                reject({ reason: 'No se pudo obtener la orden' });
            }
        )
    })
}

export const validateProgress = async (route) => {
    return new Promise(async function (resolve, reject) {
        var order = null;
        var userData = null;
        var orderDetails = null;
        var paymentMethod = null;

        await validateOrder().then(function (value) { order = value }, function (error) { order = null });
        await getOrderDetails().then(function (value) { orderDetails = value }, function (error) { orderDetails = null });
        await getUserData().then(function (value) { userData = value }, function (error) { userData = null });
        await getPaymenthMethod().then(function (value) { paymentMethod = value }, function (error) { paymentMethod = null });

        if (userData == null) reject({ reason: 'No se encontró la información del usuario', allowed: false });
        if (order == null) reject({ reason: 'No se encontró la orden', allowed: false });
        if (orderDetails == null || orderDetails.length < 1) reject({ reason: 'No se encontraron los productos', allowed: true });
        if (paymentMethod == null && route == 'confirmation') reject({ reason: 'No se encontró el metodo de pago', allowed: true });

        if (paymentMethod !== null && route == 'confirmation') {
            switch (paymentMethod.id) {
                case 2:
                    if (storage.getItem('bancolombia') == null) reject({ reason: 'No se encontraron los datos de Bancolombia', allowed: true });
                    break;
                case 3:
                    if (storage.getItem('nequi') == null) reject({ reason: 'No se encontraron los datos de Nequi', allowed: true });
                    break;
            }
        }

        if (order !== null && route == 'confirmation') {
            if ((order.latitude == null || order.latitude == "") ||
                order.longitude == null || order.longitude == "") reject({ reason: "No se encontró la ubicación del usuario", allowed: true });

            if (order.direction == null || order.direction == "") reject({ reason: "No se encontró la dirección del usuario", allowed: true });
        }

        resolve();
    })
}