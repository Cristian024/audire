import * as ROUTER from '../script.js';
import * as HOME from './home.js';
import * as API from '../dependencies/apiMethods.js'
import * as FIREBASE from '../dependencies/firebase.js'
import * as TABLES from './dashboardTables.js'


var toggle;
var navigation;
var table;
var content;
var tableContainer;
var cardBox;
var details;
var section;
var headTable;
var bodyTable;
var entityTable;
var main;
var tablePagination;
var tableSearch;
var dashboardQueryInput;
var operations;
var operationInputs;

var containerEntity;
var formEntity;
var addEntityButton;

var discardChangesButton;

var saveChangesButton;

var notification;

var dialogDelete;
var declineButton;
var acceptButton;

var subpartial;

export default async () => {
    section = document.querySelector('body').classList[1];
    content = document.querySelector('.content-dashboard');
    table = document.querySelector('.table-dashboard');
    cardBox = document.querySelector('.cardBox');
    details = document.querySelector('.details');
    headTable = document.querySelector('.table-head-entity');
    bodyTable = document.querySelector('.table-body-entity');
    entityTable = document.querySelector('.table-entity')
    tablePagination = document.querySelector('.table-pagination');
    tableSearch = document.querySelector('.table-search');
    dashboardQueryInput = document.querySelector('.search');
    operations = document.querySelector('.operations');
    formEntity = document.querySelector('#form-entity');
    addEntityButton = document.querySelector('#add-entity');
    containerEntity = document.querySelector('.entity-container');
    operationInputs = document.querySelectorAll('.operation');
    tableContainer = document.querySelector('.table-container');
    discardChangesButton = document.querySelector('#discard-changes');
    saveChangesButton = document.querySelector('#save-changes');
    dialogDelete = document.querySelector('.dialog-delete');
    declineButton = document.querySelector('.declineButton');
    acceptButton = document.querySelector('.acceptButton');

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
}

const routePartials = () => {
    section = section.toLowerCase();

    if (section == 'home') {
        table.remove();
        operations.remove();
    } else {
        cardBox.remove();
        details.remove();
        dashboardQueryInput.remove();
    }

    TABLES.init(section)
}
