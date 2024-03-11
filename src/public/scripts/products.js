
var lenis;

export const init = () =>{
    lenis = new Lenis()

    document.querySelector('.order-btn').remove()

    requestAnimationFrame(raf)
}

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}