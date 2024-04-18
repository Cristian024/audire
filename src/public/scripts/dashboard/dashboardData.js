export const headers = {
    products: [
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
    ],
    products_images: [
        "ID",
        "URL",
        "ID PRODUCTO",
        "NOMBRE DEL PRODUCTO",
    ],
    users: [
        "ID",
        "NOMBRE",
        "CORREO",
        "CONTRASEÑA",
        "DIRECCION",
        "TIPO DE DOCUMENTO",
        "DOCUMENTO",
        "TELEFONO",
        "FECHA DE REGISTRO",
        "FECHA ULTIMA COMPRA",
        "FECHA ULTIMA VISITA",
        "LATITUD",
        "LONGITUD",
        "ROL ID",
        "ROL",
        "ID ESTADO",
        "ESTADO",
    ]
}

export const formFields = {
    products:[
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
    ],
    products_images: [
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
    ],
    users: [
        {
            'label': 'Nombre',
            'type': 'text',
            'name': 'name'
        },
        {
            'label': 'Correo',
            'type': 'text',
            'name': 'email'
        },
        {
            'label': 'Contraseña',
            'type': 'text',
            'name': 'password'
        },
        {
            'label': 'Dirección',
            'type': 'text',
            'name': 'direction',
        },
        {
            'label': 'Tipo de documento',
            'type': 'text',
            'name': 'documentType'
        },
        {
            'label': 'Documento',
            'type': 'text',
            'name': 'document'
        },
        {
            'label': 'Numero telefonico',
            'type': 'number',
            'name': 'cellphone'
        },
        {
            'label': 'Fecha de registro',
            'type': 'date',
            'name': 'registerDate'
        },
        {
            'label': 'Fecha ultima compra',
            'type': 'date',
            'name': 'lastBuyDate'
        },
        {
            'label': 'Fecha ultima visita',
            'type': 'date',
            'name': 'lastVisitDate'
        },
        {
            'label': 'Latitud',
            'type': 'number',
            'name': 'latitude'
        },
        {
            'label': 'Longitud',
            'type': 'number',
            'name': 'longitude'
        },
        {
            'label': 'Rol',
            'type': 'select',
            'options': 'users_roles',
            'name': 'role'
        },
        {
            'label': 'Estado',
            'type': 'select',
            'options': 'users_states',
            'name': 'state'
        },
        {
            'label': 'City',
            'type': 'select',
            'options': 'cities',
            'name': 'city'
        }
    ]
}

export const partialsTitle = {
    products:"Productos / Lista",
    products_images: "Productos / Imagenes",
    users: "Usuarios"
};