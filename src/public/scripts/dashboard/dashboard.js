import * as ROUTER from '../script.js';
import * as PRODUCTS from './products.js';
import * as HOME from './home.js';


var listNavigation;
var toggle;
var navigation;
var table;
var content;
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

export default async() => {
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
    

    ROUTER.loadPage();

    routePartials();

    functionSideBar();
}

const functionSideBar = () =>{
    function activeLink() {
        listNavigation.forEach((item) => {
            item.classList.remove("hovered");
        });
        this.classList.add("hovered");
    }

    listNavigation.forEach((item) => item.addEventListener("mouseover", activeLink));

    toggle = document.querySelector(".toggle");
    navigation = document.querySelector(".navigation");
    main = document.querySelector(".main");

    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };
}

const routePartials = () =>{
    if(section == 'HOME'){
        table.remove();
        operations.remove();
    }else{
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

export const loadTable = async() =>{
    await new DataTable('.table-entity', {
        responsive: true,
    });

    removeSkeletonLoad()

    tableQueryInputs = document.querySelectorAll('.dt-layout-row');

    tablePagination.append(tableQueryInputs[2]);
    tableSearch.append(tableQueryInputs[0]);
}

const removeSkeletonLoad = () =>{
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