export const redirectUrl = (cards) => {
    cards.forEach(element => {
        element.addEventListener('click', () => {
            const id = element.id

            window.location = `../products/${id}`
        })
    });
}

export const initCardIndex = (data) => {
    const div = document.createElement('div');
    div.classList.add('splide_item');

    div.innerHTML = `
    <div class="image skeleton" id="${data.id}">
            <img src="${data.url}">
        </div>
        <p class="satoshi light">Precio - $${data.price}</p>
        <h2 class="satoshi">${data.name}</h2>
    `;

    div.addEventListener('click', () => {
        window.location = `../products/${data.id}`
    })

    const image = document.createElement('img');
    image.src = data.url;
    image.onload = function () {
        document.getElementById(data.id).classList.remove('skeleton')
    }

    return div;
}

export const initCardProducts = (data) => {
    const div = document.createElement('div');
    div.classList.add('product');
    div.setAttribute('id', data.id);

    div.innerHTML = `
        <img src="${data.url}">
        <hr>
        <div class="description">
            <h2 class="satoshi">${data.name}</h2>
            <p class="satoshi light">$${data.price}</p>
        </div>
    `

    const image = document.createElement('img');
    image.src = data.url;
    image.onload = function () {
        document.getElementById(data.id).classList.remove('skeleton')
    }

    div.addEventListener('click', () => {
        window.location = `../products/${data.id}`
    })

    return div;
}

/*
<div class="product" id="12345">
        <img src="../images/1.webp" alt="">
        <hr>
        <div class="description">
            <h2 class="satoshi">Audifonos Unitec</h2>
            <p class="satoshi light">$350.000</p>
        </div>
    </div>*/ 