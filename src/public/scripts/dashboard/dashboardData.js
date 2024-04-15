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
    ]
}

export const partialsTitle = {
    products:"Productos / Lista",
    products_images: "Productos / Imagenes"
};