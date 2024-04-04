import * as ROUTER from '../script.js';
import * as PRODUCTS from './products.js';
import * as HOME from './home.js';
import * as API from '../dependencies/apiMethods.js'


var listNavigation;
var toggle;
var navigation;
var table;
var content;
var tableContainer;
var cardBox;
var details;
var section;
var headTable;
var main;
var tableQueryInputs;
var tablePagination;
var tableSearch;
var dashboardQueryInput;
var skeletonTable;
var operations;
var operationInputs;

var containerEntity;
var formEntity;
var addEntityButton;

var discardChangesButton;

var saveChangesButton;

export default async () => {
    listNavigation = document.querySelectorAll(".navigation li");
    section = document.querySelector('body').classList[1];
    content = document.querySelector('.content-dashboard');
    table = document.querySelector('.table-dashboard');
    cardBox = document.querySelector('.cardBox');
    details = document.querySelector('.details');
    headTable = document.querySelector('.table-head-entity');
    tablePagination = document.querySelector('.table-pagination');
    tableSearch = document.querySelector('.table-search');
    dashboardQueryInput = document.querySelector('.search');
    skeletonTable = document.querySelector('.tg');
    operations = document.querySelector('.operations');
    formEntity = document.querySelector('#form-entity');
    addEntityButton = document.querySelector('#add-entity');
    containerEntity = document.querySelector('.entity-container');
    operationInputs = document.querySelectorAll('.operation')
    tableContainer = document.querySelector('.table-container')
    discardChangesButton = document.querySelector('#discard-changes')
    saveChangesButton = document.querySelector('#save-changes')

    ROUTER.loadPage();

    routePartials();

    functionsDashboard();
}

const functionsDashboard = () => {
    toggle = document.querySelector(".toggle");
    navigation = document.querySelector(".navigation");
    main = document.querySelector(".main");

    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };

    addEntityButton.addEventListener('click', (e) => {
        updateVist();
        formEntity.setAttribute('method', 'POST')
    })

    discardChangesButton.addEventListener('click', () => {
        updateVist();
        formEntity.removeAttribute('method')
        formEntity.removeAttribute('id-entity')
    })

    saveChangesButton.addEventListener('click', (e) => {
        document.querySelector('#form-entity-submit').click()
    })

    formEntity.addEventListener('submit', (e)=>{
        e.preventDefault()
        executeAction(e)
    })
}

export const updateVist = () => {
    containerEntity.classList.toggle('enabled');
    tableContainer.classList.toggle('disabled');
    operationInputs[0].classList.toggle('disabled');
    operationInputs[1].classList.toggle('disabled');
}

const routePartials = () => {
    if (section == 'HOME') {
        table.remove();
        operations.remove();
    } else {
        cardBox.remove();
        details.remove();
        dashboardQueryInput.remove();
    }

    switch (section) {
        case 'HOME':
            HOME.init();
            break;
        case 'PRODUCTS':
            PRODUCTS.init();
            break;
    }
}

export const loadTable = async () => {
    await new DataTable('.table-entity', {
        responsive: true,
    });

    removeSkeletonLoad()

    tableQueryInputs = document.querySelectorAll('.dt-layout-row');

    tablePagination.append(tableQueryInputs[2]);
    tableSearch.append(tableQueryInputs[0]);
}

const removeSkeletonLoad = () => {
    skeletonTable.classList.add('disabled')

    setTimeout(() => {
        skeletonTable.style.display = "none"
    }, 500);
}

export const insertHeaderTable = (header) => {
    const tr = document.createElement('tr');
    headTable.append(tr);
    header.forEach(element => {
        const th = document.createElement('th')
        th.textContent = element;

        tr.append(th);
    });
}

export const insertFieldsFormAdd = (fields) => {
    var inner = ""
    fields.forEach(fieldArray => {
        const type = fieldArray.type;
        const name = fieldArray.name;
        const label = fieldArray.label;

        if (type == 'textarea') {
            inner += `<label for="${name}">
            ${label}
            <textarea name="${name}" required></textarea>
            </label>`
        } else {
            inner += `<label for="${name}">
            ${label}
            <input type="${type}" name="${name}" required>
            </label>`
        }
    });

    inner += '<input id="form-entity-submit" name="submit" type="submit" style="display:none;">'

    formEntity.innerHTML = inner
}

const executeAction = (e) =>{
    var form= e.target;

    const method = form.getAttribute('method')
    const id = form.getAttribute('id-entity') || null

    var elements = form.elements;

    const data = '{'

    for(var i = 0; i < elements.length; i++){
        const name = elements[i].name;
        const value = elements[i].value;
        if(name !== "submit"){
            data += `'${name}': '${value}',`
        }
    }

    routerMethods(method, data, id);
}

export var router;

const routerMethods = (method, data, id) =>{
    switch(method){
        case 'POST':
            API.executeInsert(data, router)
            break;
    }
}