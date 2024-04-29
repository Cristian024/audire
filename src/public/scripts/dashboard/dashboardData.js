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
    lot: [
        'ID',
        'CANTIDAD EN STOCK',
        'CANTIDAD ALMACENADA',
        'ID DEPOSITO',
        'NOMBRE DEPOSITO',
        'CIUDAD PEPOSITO',
        'ID PRODUCTO',
        'NOMBRE PRODUCTO'
    ],
    depot: [
        "ID",
        "NOMBRE",
        "DIRECCION",
        "LATITUD",
        "LONGITUD",
        "ID CIUDAD",
        "CIUDAD",
        "NUMERO DE LOTES",
        "LOTES"
    ],
    orders: [
        'ID',
        'FECHA PEDIDO',
        'FECHA CANCELACIÓN',
        'RAZON DE CANCELACIÓN',
        'PRECIO TOTAL',
        'SUB TOTAL',
        'PRECIO DE ENVIO',
        'DIRECCION',
        'LATITUD',
        'LONGITUD',
        'CIUDAD',
        'METODO DE PAGO',
        'ESTADO',
        'ID USUARIO',
        'USUARIO',
        'NUMERO DE PEDIDOS',
        'ID PEDIDOS'
    ],
    orders_detail: [
        'ID',
        'CANITDAD PEDIDA',
        'PRECIO TOTAL',
        'ID PRODUCTO',
        'PRODUCTO',
        'PRECIO PRODUCTO',
        'ID PEDIDO'
    ],
    comments: [
        "ID",
        "COMENTARIO",
        "CALIFICACION",
        "ID USUARIO",
        "USUARIO",
        "ID PRODUCTO",
        "PRODUCTO"
    ],
    users: [
        "ID",
        "NOMBRE",
        "CORREO",
        "CONTRASEÑA",
        "DIRECCION",
        "CIUDAD",
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
    ],
    companies: [
        'ID',
        'NOMBRE',
        'CELULAR',
        'CORREO',
        'DESCUENTO POR ENVIO',
        'ID CIUDAD',
        'CIUDAD'
    ],
    shipments: [
        'ID',
        'UBICACIÓN ACTUAL',
        'UBICACIÓN ORIGEN',
        'UBICACIÓN ENVIO',
        'FECHA DE ENVIO',
        'FECHA DE ENTREGA',
        'ESTADO',
        'ID COMPAÑIA',
        'COMPAÑIA',
        'CIUDAD COMPAÑIA',
        'ID PEDIDO',
        'ID REPARTIDOR',
        'REPARTIDOR'
    ],
    earnings: [
        'ID',
        'TOTAL VENTA',
        'TOTAL INGRESOS',
        'DESCUENTO COMPAÑIA DE ENVIO',
        'CIUDAD',
        'ID COMPAÑIA',
        'COMPAÑIA',
        'ID PEDIDO',
        'FECHA PEDIDO'
    ]
}

export const formFields = {
    products: [
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
    lot: [
        {
            'label': 'Cantidad en stock',
            'type': 'number',
            'name': 'quantityStock'
        },
        {
            'label': 'Cantidad almacenada',
            'type': 'number',
            'name': 'quantityStored'
        },
        {
            'label': 'Deposito',
            'type': 'select',
            'options': 'depot',
            'name': 'depot'
        },
        {
            'label': 'Producto',
            'type': 'select',
            'options': 'products',
            'name': 'product'
        }
    ],
    depot: [
        {
            'label': 'Nombre',
            'type': 'text',
            'name': 'name'
        },
        {
            'label': 'Dirección',
            'type': 'text',
            'name': 'direction'
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
            'label': 'Ciudad',
            'type': 'select',
            'options': 'cities',
            'name': 'city',
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
            'label': 'Ciudad',
            'type': 'select',
            'options': 'cities',
            'name': 'city'
        }
    ],
    companies: [
        {
            'label': 'Nombre',
            'type': 'text',
            'name': 'name'
        },
        {
            'label': 'Numero telefonico',
            'type': 'number',
            'name': 'cellphone'
        },
        {
            'label': 'Correo',
            'type': 'email',
            'name': 'email'
        },
        {
            'label': 'Descuento por envio',
            'type': 'number',
            'name': 'shipingDiscount'
        },
        {
            'label': 'Ciudad',
            'type': 'select',
            'options': 'cities',
            'name': 'city'
        }
    ]
}

export const partialsTitle = {
    products: "Productos / Lista",
    products_images: "Productos / Imagenes",
    lot: "Productos / Lotes",
    depot: "Productos / Depositos",
    orders: "Pedidos / Lista de pedidos",
    orders_details: "Pedidos / Detalles",
    companies: "Compañias de envio / Lista de compañias",
    shipments: "Compañias de envio / Envios",
    comments: "Usuarios / Comentarios",
    users: "Usuarios / Lista de usuarios",
    earnings: "Ingresos"
}

export const editable = [
    'products',
    'products_images',
    'lot',
    'depot',
    'users',
    'companies'
]