import { headers, formFields, partialsTitle, editable } from './dashboardData.js';
import * as FIREBASE from '../dependencies/firebase.js';
import * as API from '../dependencies/apiMethods.js';
import { showMessagePopup, notificationConfig } from '../dependencies/notification.js';

var headTable = document.querySelector('.table-head-entity');
var tableBody = document.querySelector('.table-body-entity');
var formEntity = document.querySelector('#form-entity');
var bodyTable = document.querySelector('.table-body-entity');
var tablePagination = document.querySelector('.table-pagination');
var tableSearch = document.querySelector('.table-search');
var tableQueryInputs;
var entityTable = document.querySelector('.table-entity');
var skeletonTable = document.querySelector('.tg');
var content = document.querySelector('.content-dashboard');
var containerEntity = document.querySelector('.entity-container');
var tableContainer = document.querySelector('.table-container');
var operationInputs = document.querySelectorAll('.operation');
var dialogDelete = document.querySelector('.dialog-delete');
var acceptButton = document.querySelector('.acceptButton');
var data;
var titleSubpartial = document.querySelector('.title-subpartial');

var router;
var isEditable;

var addEntityButton = document.querySelector('#add-entity');
var discardChangesButton = document.querySelector('#discard-changes');
var saveChangesButton = document.querySelector('#save-changes');
var declineButton = document.querySelector('.declineButton');

var notification;

export const init = async (route) => {
    router = route;

    isEditable = editable.includes(route);

    titleSubpartial.textContent = partialsTitle[route];

    await insertHeaders(route);
    functionsDashboard();

    API.executeConsult(null, route).then(
        async function (value) {
            data = value
            await insertData(data);
        },
        function (error) {
            validateStatusCode(error)
        }
    )

    if (isEditable) await insertFields(route);
    if (!isEditable) addEntityButton.remove();
}

const functionsDashboard = () => {
    addEntityButton.addEventListener('click', (e) => {
        updateVist();
        formEntity.setAttribute('method', 'POST')
    })

    discardChangesButton.addEventListener('click', () => {
        updateVist();
        formEntity.removeAttribute('method')
        formEntity.removeAttribute('id-entity')

        emptyFields();
    })

    saveChangesButton.addEventListener('click', (e) => {
        document.querySelector('#form-entity-submit').click()
    })

    formEntity.addEventListener('submit', (e) => {
        e.preventDefault()
        executeAction(e)
    })

    declineButton.addEventListener('click', () => {
        dialogDelete.classList.toggle('active')
    })
}

const insertHeaders = async (router) => {
    const columns = headers[router] || null;

    headTable.innerHTML = "";
    bodyTable.innerHTML = "";

    const tr = document.createElement('tr');
    headTable.append(tr);
    columns.forEach(element => {
        const th = document.createElement('th')
        th.textContent = element;

        tr.append(th);
    });

    if (isEditable || router == 'orders') {
        const th = document.createElement('th');
        th.textContent = 'OPERACIÓN';
        tr.append(th);
    }
}

const insertData = async (data) => {
    if (data == null) {
        loadTable()
        return;
    }

    data.forEach(element => {
        const row = document.createElement('tr');
        tableBody.append(row);

        var row_content = ``
        for (var key in element) {
            row_content += `<td>${element[key]}</td>`
        }

        row.innerHTML = row_content;

        if (isEditable) {
            var buttons = document.createElement('td');

            const editButton = getButtonsEntity(element.id)[0];
            const deleteButton = getButtonsEntity(element.id)[1];

            buttons.append(editButton);
            buttons.append(deleteButton)

            row.append(buttons)
        }

        if (router == 'orders') {
            var buttons = document.createElement('td');

            if (element['state'] == 'En proceso') { buttons.appendChild(getButtonsOrders(element.id)[0]) }

            row.append(buttons)
        } else if (router == "shipments") {
            var buttons = document.createElement('td');

            if (element['stateName'] == 'En transito') { buttons.appendChild(getButtonsShipment(element.id)[0]) }

            row.append(buttons);
        }
    });

    await loadTable()
}

const getButtonsOrders = (id) => {
    const creteShipment = document.createElement('ion-icon');
    creteShipment.setAttribute('name', 'send');

    creteShipment.addEventListener('click', async () => {
        await newShipment(id).then(
            function (value) {
                notificationConfig.background = 'green';
                notificationConfig.text = 'Envio generado con exito';
                showMessagePopup(notificationConfig)
                setTimeout(() => {
                    location.reload();
                }, 1000);
            },
            function (error) {
                notificationConfig.background = 'red';
                notificationConfig.text = error.reason;
                showMessagePopup(notificationConfig)
            }
        )
    })

    return [creteShipment]
}

const getButtonsShipment = (id) => {
    const button = document.createElement('ion-icon');
    button.setAttribute('name', 'bag-check');

    button.addEventListener('click', () => {
        completeShipment(id).then(
            function (value) {
                notificationConfig.background = 'green';
                notificationConfig.text = 'Paquete entregado con exito';
                showMessagePopup(notificationConfig)
                setTimeout(() => {
                    location.reload();
                }, 1000);
            },
            function (error) {
                notificationConfig.background = 'red';
                notificationConfig.text = error.reason;
                showMessagePopup(notificationConfig);
            }
        )
    })

    return [button]
}

const newShipment = async (id) => {
    return new Promise(function (resolve, reject) {
        API.executeConsult(id, 'orders').then(
            function (value) {
                const order = value[0];
                API.executeConsult(order.id, 'orders_detail_by_order').then(
                    function (value) {
                        const details = value[0];

                        API.executeConsult(order.city, 'companies_by_city').then(
                            function (value) {
                                if (value.length > 0) {
                                    const company = value[0];

                                    API.executeConsult(order.city, 'depot_by_product').then(
                                        function (value) {
                                            const depot = value[0];

                                            var date = new Date();

                                            var year = date.getFullYear();
                                            var month = date.getMonth() + 1;
                                            var day = date.getDate();

                                            var formatedDay = year + '/' + month.toString().padStart(2, '0') + '/' + day.toString().padStart(2, '0');

                                            var shipment = {
                                                actualUbication: `{longitude: ${depot.longitude}, latitude: ${depot.latitude}}`,
                                                originUbication: `{longitude: ${depot.longitude}, latitude: ${depot.latitude}}`,
                                                shipmentUbication: `{longitude: ${order.longitude}, latitude: ${order.latitude}}`,
                                                shipmentDate: formatedDay,
                                                deliveryDate: null,
                                                state: 1,
                                                company: company.id,
                                                orderid: order.id,
                                                delivery: null
                                            }

                                            API.executeInsert(JSON.stringify(shipment), 'shipments').then(
                                                function (value) {
                                                    API.executeUpdate(JSON.stringify({ state: 2 }), order.id, 'orders').then(
                                                        function (value) {
                                                            resolve();
                                                        },
                                                        function (error) {
                                                            reject({ reason: error.message })
                                                        }
                                                    )
                                                },
                                                function (error) {
                                                    reject({ reason: error.message });
                                                }
                                            )
                                            resolve()
                                        },
                                        function (error) {
                                            reject({ reason: `No hay depositos disponibles para la ciudad de ${order.cityName}` })
                                        }
                                    )
                                } else {
                                    reject({ reason: `No hay compañias disponibles para la ciudad de ${order.cityName}` })
                                }
                            },
                            function (error) {
                                reject({ reason: error.message });
                            }
                        )
                    },
                    function (error) {
                        reject({ reason: error.message });
                    }
                )
            },
            function (error) {
                reject({ reason: error.message });
            })
    })
}

const completeShipment = async (id) => {
    return new Promise(function (resolve, reject) {
        API.executeConsult(id, 'shipments').then(
            function (value) {
                const shipment = value[0];

                API.executeConsult(shipment.company, 'companies').then(
                    function (value) {
                        const company = value[0];

                        API.executeConsult(shipment.order, 'orders').then(
                            function (value) {
                                const order = value[0];

                                var earning = {
                                    totalSale: order.totalPrice,
                                    orderid: order.id,
                                    totalEarnings: parseFloat(order.totalPrice) - (parseFloat(order.totalPrice) * company.shipingDiscount / 100),
                                    company: company.id
                                }

                                API.executeUpdate(JSON.stringify({ state: 3 }), shipment.id, 'shipments').then(
                                    function (value) {
                                        API.executeInsert(JSON.stringify(earning), 'earnings').then(
                                            function (value) {
                                                resolve();
                                            },
                                            function (error) {
                                                reject({ reason: error.message });
                                            }
                                        )
                                    },
                                    function (error) {
                                        reject({ reason: error.message });
                                    }
                                )

                            },
                            function (error) {
                                reject({ reason: error.message })
                            }
                        )
                    },
                    function (error) {
                        reject({ reason: error.message })
                    }
                )
            },
            function (error) {
                reject({ reason: error.message })
            }
        )
    })
}

const insertFields = async (route) => {
    const fields = formFields[route] || null;
    var haveMap = false;
    var mapFunction = '';

    var inner = ""
    if (fields == null) {
        return
    }

    await Promise.all(fields.map(async (fieldArray) => {
        const type = fieldArray.type;
        const name = fieldArray.name;
        const label = fieldArray.label;
        const accept = fieldArray.accept || null;
        const options = fieldArray.options || null;
        const route = fieldArray.route || null;
        const disabled = fieldArray.disabled || '';

        if (type == 'textarea') {
            inner += `<label for="${name}">
            ${label}
            <textarea name="${name}" class="field" required></textarea>
            </label>`;
        } else if (type == 'text' || type == 'password' || type == 'date') {
            inner += `<label for="${name}">
            ${label}
            <input type="${type}" name="${name}" class="field ${name}" required ${disabled}>
            </label>`;
        } else if (type == 'number') {
            inner += `<label for="${name}">
            ${label}
            <input type="${type}" name="${name}" class="field ${name}" step="any" required ${disabled}>
            </label>`;
        } else if (type == 'file') {
            inner += `<label for="${name}">
            ${label}
            <input type="${type}" name="${name}" accept="${accept}" class="field" route="${route}" required >
            <progress class="progress-${name}" max="100" value="0"></progress>
            </label>`;
        } else if (type == 'select') {
            const optionsForm = await getOptionsSelect(options);
            inner += `<label for="${name}">
            ${label}
            <select name="${name}" class="field" type="select" required>
                ${optionsForm}
            </select>
            </label>`;
        } else if (type == 'map_points') {
            haveMap = true;
            mapFunction = 'map_points';
            inner += `<label>
            Mapa
            </label>
            <div class="field map" name="points"></div>`
        } else if (type == 'map_point') {
            haveMap = true;
            mapFunction = 'map_point';
            inner += `<label>
            Mapa
            </label>
            <div class="field map" name="point"></div>`
        }
    }));

    inner += '<input id="form-entity-submit" name="submit" type="submit" style="display:none;">';

    formEntity.innerHTML = inner
    if (haveMap) await initMap(formEntity, mapFunction);
    setListenersFields();
}

var mapConfig = {
    latitude: 3.3984486,
    longitude: -73.5723,
    zoom: 3
}

var map;
var pointsGeographic = null;
var draw = null;
var marker = null

const initMap = async (form, fun) => {
    maptilersdk.config.apiKey = 'cILWEoKejn0Dv5sjODMS';
    const mapDiv = form.querySelector('.map');

    map = await new maptilersdk.Map({
        container: mapDiv, // container's id or the HTML element to render the map
        style: maptilersdk.MapStyle.STREETS,
        center: [mapConfig.longitude, mapConfig.latitude], // starting position [lng, lat]
        zoom: mapConfig.zoom, // starting zoom
    });

    switch (fun) {
        case 'map_points':
            draw = new MapboxDraw({
                displayControlsDefault: false,
                controls: {
                    polygon: true,
                    trash: true
                }
            });
            map.addControl(draw);

            const drawControls = document.querySelectorAll(".mapboxgl-ctrl-group.mapboxgl-ctrl");
            drawControls.forEach((elem) => {
                elem.classList.add('maplibregl-ctrl', 'maplibregl-ctrl-group');
            });

            map.on('draw.create', updateArea);
            map.on('draw.delete', updateArea);
            map.on('draw.update', updateArea);

            function updateArea(e) {
                var data = draw.getAll();
                pointsGeographic = data.features[0].geometry.coordinates[0];
                form.querySelector(`.points`).value = JSON.stringify(pointsGeographic);
            }
            break;
        case 'map_point':
            marker = new maptilersdk.Marker({
                draggable: true,
                color: "#FFFFFF"
            })
                .setLngLat([-73.5723, 3.3984486])
                .addTo(map)

            marker.on('dragend', function (e) {
                const lngLat = marker.getLngLat();
                formEntity.querySelector('.latitude').value = lngLat.lat;
                formEntity.querySelector('.longitude').value = lngLat.lng;
            });
            break;
    }
}

const drawPosition = (point) => {
    marker.setLngLat([point.longitude, point.latitude]);
}

var polygons;

const drawPolygon = (points) => {
    emptyMap()

    polygons = map.addSource('source', {
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
        'id': 'polygons',
        'type': 'fill',
        'source': 'source',
        'layout': {},
        'paint': {
            'fill-color': '#FFAA01',
            'fill-opacity': 0.5
        }
    })
}

const emptyMap = () => {

    if (draw != null) {
        draw.deleteAll();
        if (polygons != null) {
            map.removeLayer('polygons')
            map.removeSource('source');
            polygons = null;
        }
    }
}

var dataTable;
const loadTable = async () => {
    dataTable = await new DataTable(entityTable, {
        responsive: true,
    });

    removeSkeletonLoad()

    tableQueryInputs = content.querySelectorAll('.dt-layout-row');

    tablePagination.append(tableQueryInputs[2]);
    tableSearch.append(tableQueryInputs[0])
}

const removeSkeletonLoad = () => {
    skeletonTable.classList.add('disabled')

    setTimeout(() => {
        skeletonTable.style.display = "none"
    }, 500);
}

const setListenersFields = () => {
    const inputFiles = formEntity.querySelectorAll('input[type="file"]');

    inputFiles.forEach(element => {
        element.addEventListener('change', (e) => {
            const input = e.target;
            const reference = input.getAttribute('route')
            const progress = formEntity.querySelector(`.progress-${input.getAttribute('name')}`)

            if (!input.files.length) return
            const file = input.files[0];

            uploadFile(reference, file, input, progress);
        })
    });
}

const getButtonsEntity = (id) => {
    const editButton = document.createElement('ion-icon');
    editButton.setAttribute('name', 'create-outline');
    const deleteButton = document.createElement('ion-icon');
    deleteButton.setAttribute('name', 'trash-outline');

    deleteButton.addEventListener('click', () => {
        dialogDelete.classList.toggle('active');
        acceptButton.onclick = function () {
            routerMethods('DELETE', null, id);
        }
    })

    editButton.addEventListener('click', async () => {
        formEntity.setAttribute('id-entity', (id));
        formEntity.setAttribute('method', 'UPDATE');
        insertDataFormUpdate(id)
    })

    return [
        editButton, deleteButton
    ]
}

const routerMethods = async (method, data, id) => {
    var response = null;

    switch (method) {
        case 'POST':
            response = API.executeInsert(data, router);
            response.then(
                function (value) {
                    validateStatusCode(value)
                },
                function (error) {
                    validateStatusCode(error)
                }
            ).finally(function () {
                updateVist()
            })
            break;
        case 'DELETE':
            response = API.executeDelete(id, router)
            response.then(
                function (value) {
                    validateStatusCode(value)
                },
                function (error) {
                    validateStatusCode(error)
                }
            ).finally(function () {
                dialogDelete.classList.toggle('active');
            })
            break;
        case 'UPDATE':
            response = API.executeUpdate(data, id, router);
            response.then(
                function (value) {
                    validateStatusCode(value)
                },
                function (error) {
                    validateStatusCode(error)
                }
            ).finally(function () {
                updateVist()
            })
            break;
    }
}

const insertDataFormUpdate = (id) => {
    API.executeConsult(id, router).then(
        function (response) {
            const data = response[0];

            const fields = formEntity.querySelectorAll('.field');

            fields.forEach(element => {
                const name = element.getAttribute('name');
                const type = element.getAttribute('type');
                const subClas = element.classList[1];
                for (var key in data) {
                    if (key == name) {
                        if (type == "file") {
                            element.setAttribute('url', data[key])
                        } else if (type === "select") {
                            if (!isNaN(data[key])) {
                                element.value = data[key];
                            } else {
                                const options = element.querySelectorAll('option')
                                options.forEach(option => {
                                    if (option.textContent == data[key]) {
                                        element.value = option.value
                                    }
                                });
                            }
                        } else if (subClas == "map" && name == 'points') {
                            if (data['points'] != null && data['points'] != "") {
                                const points = JSON.parse(data['points']);
                                drawPolygon(points);
                            } else {
                                emptyMap();
                            }
                        }
                        else {
                            element.value = data[key];
                        }
                    }
                }
                if (subClas == "map" && name == 'point') {
                    if ((data['latitude'] != null && data['latitude'] != "") &&
                        data['longitude'] != null && data['longitude'] != "") {
                        const point = {
                            longitude: data['longitude'],
                            latitude: data['latitude']
                        }
                        drawPosition(point);
                    } else {
                        drawPosition({
                            longitude: 3.3984486,
                            latitude: -73.5723
                        });
                    }
                }
            });

            updateVist()
        },
        function (error) {
            validateStatusCode(error)
        }
    )
}

export const updateVist = () => {
    containerEntity.classList.toggle('enabled');
    tableContainer.classList.toggle('disabled');
    operationInputs[0].classList.toggle('disabled');
    operationInputs[1].classList.toggle('disabled');
}

const executeAction = (e) => {
    var form = e.target;

    var loaded = false;
    var countFiles = false;

    var haveMap = false;
    var countPoints = false;

    const method = form.getAttribute('method')
    const id = form.getAttribute('id-entity') || null

    var elements = form.elements;

    var data = '{'

    for (var i = 0; i < elements.length; i++) {
        const name = elements[i].name || null;
        const value = elements[i].value;
        const type = elements[i].getAttribute('type');

        if (name != null) {
            if (type == "file") {
                const url = elements[i].getAttribute('url');

                countFiles = true;

                if (url !== null) {
                    loaded = true;
                }
                data += `"${name}": "${url}",`;
            } else if (name == "points") {
                haveMap = true;

                if (pointsGeographic != null) {
                    countPoints = true;
                }
                data += `"${name}": "${JSON.stringify(pointsGeographic)}",`
            } else {
                if (name !== "submit") {
                    data += `"${name}": "${value}",`
                }
            }
        }
    }

    data = data.substring(0, data.length - 1);

    data += "}"

    if (countFiles) {
        if (loaded) {
            routerMethods(method, data, id);
        } else {
            notificationConfig.background = "red";
            notificationConfig.text = "El archivo se está cargando";
            showMessagePopup(notificationConfig);
        }
    } else if (haveMap) {
        if (countPoints) {
            routerMethods(method, data, id);
        } else {
            notificationConfig.background = "red";
            notificationConfig.text = "Especifica las coordenadas";
            showMessagePopup(notificationConfig);
        }
    }
    else {
        routerMethods(method, data, id);
    }
}

const validateStatusCode = (response) => {
    switch (response.status) {
        case 200:
            notificationConfig.text = response.message;
            notificationConfig.background = "green";
            setTimeout(() => {
                location.reload();
            }, 1500);
            break;
        case 400:
            console.log(response.message);
            notificationConfig.text = response.message;
            notificationConfig.background = "red";
            break;
        case 500:
            notificationConfig.text = response.message;
            notificationConfig.background = "red";
            break;
    }

    showMessagePopup(notificationConfig)
    emptyFields()
}

const emptyFields = () => {
    const fields = formEntity.querySelectorAll('.field');
    fields.forEach(element => {
        const type = element.getAttribute('type');

        if (type == "file") element.removeAttribute('url');
        element.value = "";

    });

    const progressBars = formEntity.querySelectorAll('progress');
    progressBars.forEach(element => {
        element.value = "0"
    });

    if (draw != null) {
        emptyMap();
    }
}

const uploadFile = async (reference, file, input, progress) => {
    try {
        const fileURL = await FIREBASE.uploadFileToStorage(reference, file, progress);

        input.setAttribute('url', fileURL);
    } catch (error) {
        validateStatusCode({
            status: 500,
            message: error
        })
    }
}

const getOptionsSelect = async (route) => {
    const data = await API.executeConsult(null, route);

    var inner = '<option value=""></option>'

    data.forEach(element => {
        const id = element.id;
        const name = element.name || null;

        if (route == 'orders') {
            inner += `<option value="${id}">${id}. ${element.userName}</option>`
        } else {
            inner += `<option value="${id}">${name}</option>`
        }
    });

    return inner;
}
