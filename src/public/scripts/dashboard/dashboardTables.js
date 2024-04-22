import { headers, formFields, partialsTitle, editable } from './dashboardData.js'
import * as FIREBASE from '../dependencies/firebase.js'
import * as API from '../dependencies/apiMethods.js'

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

var addEntityButton = document.querySelector('#add-entity');;
var discardChangesButton = document.querySelector('#discard-changes');;
var saveChangesButton = document.querySelector('#save-changes');;
var declineButton = document.querySelector('.declineButton');;

var notification;

var notificationConfig = {
    "text": null,
    "background": null
}

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

    if (isEditable) {
        const th = document.createElement('th')
        th.textContent = 'OPERACIÓN'
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
    });

    await loadTable()
}

const insertFields = async (route) => {
    const fields = formFields[route] || null;
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

        if (type == 'textarea') {
            inner += `<label for="${name}">
            ${label}
            <textarea name="${name}" class="field" required></textarea>
            </label>`;
        } else if (type == 'text' || type == 'password' || type == 'date') {
            inner += `<label for="${name}">
            ${label}
            <input type="${type}" name="${name}" class="field" required>
            </label>`;
        } else if (type == 'number') {
            inner += `<label for="${name}">
            ${label}
            <input type="${type}" name="${name}" class="field" step="any" required>
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
        }
    }));

    inner += '<input id="form-entity-submit" name="submit" type="submit" style="display:none;">';

    formEntity.innerHTML = inner
    setListenersFields();
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
                const type = element.getAttribute('type')
                for (var key in data) {
                    if (key == name) {
                        if (type == "file") {
                            element.setAttribute('url', data[key])
                        } else if (type === "select") {
                            if (!isNaN(data[key])) {
                                element.value = data[key];
                            } else {
                                const options = element.querySelectorAll('option')
                                console.log(options);
                                console.log(`Key: ${key} Value: ${data[key]}`);
                                options.forEach(option => {
                                    if (option.textContent == data[key]) {
                                        element.value = option.value
                                    }
                                });
                            }
                        } else {
                            element.value = data[key];
                        }
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
    const method = form.getAttribute('method')
    const id = form.getAttribute('id-entity') || null

    var elements = form.elements;

    var data = '{'

    for (var i = 0; i < elements.length; i++) {
        const name = elements[i].name;
        const value = elements[i].value;
        const type = elements[i].getAttribute('type');

        if (type == "file") {
            const url = elements[i].getAttribute('url');

            countFiles = true;

            if (url !== null) {
                loaded = true;
            }
            data += `"${name}": "${url}",`;
        } else {
            if (name !== "submit") {
                data += `"${name}": "${value}",`
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
    } else {
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

const showMessagePopup = (config) => {
    notification = Toastify({
        text: config.text,
        style: {
            background: `linear-gradient(to right, ${config.background}, ${config.background})`
        },
        gravity: "bottom",
        position: "right",
        close: true,
        stopOnFocus: true
    }).showToast()
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

        inner += `<option value="${id}">${name}</option>`
    });

    return inner;
}
