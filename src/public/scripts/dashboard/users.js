import { loadTable, insertHeaderTable, insertFieldsForm, setRouter, getButtonsEntity } from './dashboard.js';
import * as api from '../dependencies/apiMethods.js';

var data;
var tableBody;
var subpartial;
var titleSubpartial;

let headerTableUsers = [
    'ID',
    'NOMBRE',
    'EMAIL',
    'PASSWORD',
    
]

export const init = async () => {
    subpartial = document.querySelector('body').classList[2];
    tableBody = document.querySelector('.table-body-entity');
    titleSubpartial = document.querySelector('.title-subpartial');

    switch (subpartial) {
        case 'USERS':
            setRouter('products');
            data = await api.executeConsult(null, 'users');
            initUsers();
            break;
    }
}

const initUsers = async() =>{
    titleSubpartial.textContent = `Usuarios`;

    await insertFieldsForm(fieldsListProducts);

    const insertData = async() => {
        if(data == null){
            alert('error request');
            return;
        }

        insertHeaderTable()
    }
}