export const redirectUrl = (cards) =>{
    cards.forEach(element => {
        element.addEventListener('click', () =>{
            const id = element.id

            window.location = `../products/${id}`
        })
    });
}