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
            storage.setItem('orderDetails', JSON.stringify([]));
            storage.setItem('order', JSON.stringify(orderObject));
            orderObject = JSON.parse(storage.getItem('order'));
            resolve(orderObject);
        } else {
            orderObject = JSON.parse(storage.getItem('order'));
            resolve(orderObject);
        }
    })
}

export const addOrderDetail = async (data) => {
    return new Promise(async function (resolve, reject) {
        orderDetails = JSON.parse(storage.getItem('orderDetails'));
        API.executeConsult(data.id, 'products')
        .then(
            function(value){
                const product = value[0];
                const order = orderDetail;

                const price = parseInt(product.price);

                order.orderId = null;
                order.product = product.id;
                order.quantity = data.quantity;
                order.totalPrice = price * data.quantity;

                if(orderDetails.length > 0){
                    var exits = false;
                    orderDetails.forEach(element => {
                        if(element.product == order.product){
                            exits = true;
                            reject({reason: 'El producto ya está añadido'})
                            return;
                        }
                    });

                    if(!exits) orderDetails.push(order);
                }else{
                    orderDetails.push(order);
                }

                storage.setItem('orderDetails', JSON.stringify(orderDetails));
                resolve()
            },
            function(error){
                reject()
            }
        )
    })
}

export const deleteOrderDetail = (productId) =>{
    return new Promise(function(resolve, reject){
        getOrderDetails().then(
            function(value){
                
                var exists = false;
                value.forEach(function(element, index) {
                    if (element.product == productId){
                        exists = true;

                        value.splice(index, 1);

                        storage.setItem('orderDetails', JSON.stringify(value));
                        return;
                    }
                });

                if(exists) resolve({message: 'Producto eliminado con exito'}) ?? reject({reason: 'No se pudo eliminar el producto'});
            },
            function(error){
                reject({reason: 'No se pudo eliminar el producto'})
            }
        )
    })
}

export const getOrderDetails = async () =>{
    return new Promise(function(resolve, reject){
        orderDetails = JSON.parse(storage.getItem('orderDetails'));

        if(orderDetails == null || orderDetails.length == 0){
            reject({reason: 'No hay productos añadidos al carrito'})
        }else{
            resolve(orderDetails);
        }
    })
}

export const updateOrderDetail = async (productId, price, quantity) =>{
    return new Promise(function(resolve,reject){
        getOrderDetails().then(
            function(value){    
                var exists = false;
                var priceReturn;
                value.forEach(function(element, index) {
                    if (element.product == productId){
                        exists = true;

                        element.totalPrice = price*quantity;
                        element.quantity = quantity;

                        priceReturn = element.totalPrice;

                        storage.setItem('orderDetails', JSON.stringify(value));
                        return;
                    }
                });

                if(exists) resolve({message: 'Producto actualizado con exito', price: priceReturn}) ?? reject({reason: 'No se pudo actualizar el producto'});
            },
            function(error){
                reject({reason: 'No se pudo actualizar el producto'});
            }
        )
    })
}