import {Toast} from "bootstrap";

const showToast = () => {
    const toastEl = document.getElementById('advertisement');

    if(toastEl) {
        const toast = new Toast(toastEl, {delay: 8_000});
        toast.show();
    }
}

export default showToast;