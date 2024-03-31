import { loadTable, insertHeaderTable } from './dashboard.js'
import * as api from '../dependencies/apiMethods.js'

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

export const init = async () => {
    subpartial = document.querySelector('body').classList[2]
    tableBody = document.querySelector('.table-body-entity')
    titleSubpartial = document.querySelector('.title-subpartial')

    switch (subpartial) {
        case 'LIST':
            data = await api.executeConsult(null, 'products')
            initListProducts()
            break;
        case 'IMAGES':
            break;
    }
}

const initListProducts = async() =>{
    titleSubpartial.textContent = `Productos/Lista de productos`

    const insertData = async () => {

        if (data == null) {
            alert('error request')
            return;
        }

        insertHeaderTable(headerTableListProducts)
    
        data.forEach(element => {
            const row = document.createElement('tr')
            tableBody.append(row)
            const row_content = `
                <td>${element.id}</td>
                <td>${element.name}</td>
                <td>${element.description}</td>
                <td>${element.price}</td>
                <td>${element.lots}</td>
                <td>${element.quantityStock}</td>
                <td>${element.quantityImages}</td>
                <td>${element.images}</td>
                <td>${element.imagesURL}</td>
                <td>${element.quantityComments}</td>
                <td>${element.rate}</td>
                <td></td>
            `
            row.innerHTML = row_content
        });
    
        await loadTable();
    }

    await insertData();
}

