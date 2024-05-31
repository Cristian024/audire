import * as API from '../dependencies/apiMethods.js';
import { showMessagePopup, notificationConfig } from '../dependencies/notification.js';

var visitsNumber;
var salesNumber;
var earningsNumber;

export const init = async () => {
    visitsNumber = document.querySelector('.visitsNumber');
    salesNumber = document.querySelector('.salesNumber');
    earningsNumber = document.querySelector('.earningsNumber');

    getVisits();
    getSales();
    getEarnigns();
    getRecentOrders();
    getRecentClients();
}

const getVisits = () => {
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var formatedDay = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
    API.executeConsult(formatedDay, 'visits_by_date').then(
        function (value) {
            if (value.length == 0) {
                API.executeInsert(JSON.stringify({
                    date: formatedDay,
                    quantity: 0
                }), 'visits')
                    .then(function (value) { getVisits }, function (error) { console.log(error); })
            } else {
                const visit = value[0];
                visitsNumber.textContent = visit.quantity;
            }
        },
        function (error) {
            notificationConfig.text = error.message;
            notificationConfig.background = 'red';
            showMessagePopup(notificationConfig);
        }
    )
}

const getSales = () => {
    API.executeConsult(null, 'orders').then(
        function (value) {
            salesNumber.textContent = value.length;
        },
        function (error) {
            notificationConfig.background = 'red';
            notificationConfig.text = error.message;
            showMessagePopup(notificationConfig);
        }
    )
}

const getEarnigns = () => {
    API.executeConsult(null, 'earnings').then(
        function (value) {
            if (value.length != 0) {
                var earnings = 0;
                value.forEach(element => {
                    earnings = + element.totalEarnings;
                });

                if (earnings >= 100000 && earnings < 1000000) {
                    earnings = earnings * 0.001;
                    earnings = `${+earnings}K`;
                } else if (earnings >= 1000000 && earnings < 10000000) {
                    earnings = earnings * 0.0001;
                    earnings = `${+earnings}M`;
                } else if (earnings => 10000000) {
                    earnings = earnings * 0.00001;
                    earnings = `${+earnings}M`;
                }

                earningsNumber.textContent = earnings;
            }
        },
        function (error) {
            notificationConfig.background = 'red';
            notificationConfig.text = error.message;
            showMessagePopup(notificationConfig);
        }
    )
}

const getRecentOrders = () => {
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    API.executeInsert(JSON.stringify({ date: `${year}-${month}-01` }), 'recent_orders').then(
        function (value) {
            if (value.data.length > 0) {
                value.data.forEach(element => {
                    const tr = document.createElement('tr');

                    var inner = `
                    <td>${element.userName}</td>
                    <td>$${element.price}</td>
                    <td>${element.paymenthMethod}</td>
                    <td><span class="status ${element.state.toLowerCase().replace(/ /g, "_")}">${element.state}</span></td>
                    `;

                    tr.innerHTML = inner;
                    document.querySelector('.recent_orders_table').appendChild(tr);
                });
            }
        },
        function (error) {
            notificationConfig.background = 'red';
            notificationConfig.text = error.message;
            showMessagePopup(notificationConfig);
        }
    )
}

const getRecentClients = () => {
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    API.executeInsert(JSON.stringify({ date: `${year}-${month-1}-01` }), 'recent_clients').then(
        function (value) {
            if (value.data.length > 0) {
                value.data.forEach(element => {
                    const tr = document.createElement('tr');

                    var inner = ` 
                    <td>
                        <h4>${element.userName} <br> <span>${element.registerDate || ''}</span></h4>
                    </td>`;

                    tr.innerHTML = inner;

                    document.querySelector('.recent_clients_table').append(tr);
                });
            }
        },
        function (error) {

        }
    )
}