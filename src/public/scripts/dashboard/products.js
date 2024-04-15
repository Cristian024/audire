import {setRouter, getButtonsEntity } from './dashboard.js'
import * as api from '../dependencies/apiMethods.js'
import { insertHeaders, insertData, insertFields } from './dashboardTables.js';

var data;
var tableBody;
var subpartial;
var titleSubpartial;

let headerTableListProducts = [
    'ID',
    'NOMBRE',
    'DESCRIPCIÓN',
    'PRECIO',
    'ID LOTES',
    'CANTIDAD EN STOCK',
    'NUMERO DE IMAGENES',
    'ID IMAGENES',
    'URL IMAGENES',
    'NUMERO DE COMENTARIOS',
    'CALIFICACIÓN',
    'OPERACIÓN'
];
let fieldsListProducts = [
    {
        'label': 'Nombre',
        'type': 'text',
        'name': 'name'
    },
    {
        'label': 'Precio',
        'type': 'number',
        'name': 'price'
    },
    {
        'label': 'Descripción',
        'type': 'textarea',
        'name': 'description'
    }
];

let fieldsImagesProducts = [
    {
        'label': 'Imagen',
        'type': 'file',
        'accept': 'image/*',
        'name': 'url',
        'route': 'products'
    },
    {
        'label': 'Producto',
        'type': 'select',
        'options': 'products',
        'name': 'product'
    }
];
let headerTableImagesProducts = [
    "ID",
    "URL",
    "ID PRODUCTO",
    "NOMBRE DEL PRODUCTO",
    "OPERACIÓN"
];

export const init = async () => {
    subpartial = document.querySelector('body').classList[2];
    tableBody = document.querySelector('.table-body-entity');
    titleSubpartial = document.querySelector('.title-subpartial');

    switch (subpartial) {
        case 'LIST':
            setRouter('products');
            data = await api.executeConsult(null, 'products');
            initListProducts();
            break;
        case 'IMAGES':
            setRouter('products_images');
            data = await api.executeConsult(null, 'products_images');
            initImagesProducts();
            break;
    }
}

const initImagesProducts = async () => {
    titleSubpartial.textContent = 'Productos / Imagenes';

    await insertFieldsForm(fieldsImagesProducts);

    const insertData = async () => {
        if (data == null) {
            alert('error request')
            return;
        }

        insertHeaderTable(headerTableImagesProducts);

        data.forEach(element => {
            const row = document.createElement('tr')
            tableBody.append(row)
            const row_content = `
                <td>${element.id}</td>
                <td><a href="${element.url}" target="_blank">${element.url}</a></td>
                <td>${element.product}</td>
                <td>${element.productName}</td>
            `
            row.innerHTML = row_content;

            var buttons = document.createElement('td');

            const editButton = getButtonsEntity(element.id)[0];
            const deleteButton = getButtonsEntity(element.id)[1];

            buttons.append(editButton);
            buttons.append(deleteButton);

            row.append(buttons)
        });

        await loadTable();
    }

    await insertData();
}