var notification;

export const showMessagePopup = (config) => {
    notification = Toastify({
        text: config.text,
        style: {
            background: `linear-gradient(to right, ${config.background}, ${config.background})`
        },
        gravity: "bottom",
        position: "right",
        close: true,
        stopOnFocus: true
    }).showToast()
}