import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

(() => {
    let countdown = 4.0;
    const countdownElement = document.getElementById('countdown');

    const interval = setInterval(() => {
        countdown -= 0.1; // subtract 0.1 second
        countdown = Math.max(countdown, 0); // prevent negative numbers
        countdownElement!.textContent = countdown.toFixed(1);

        if (countdown <= 0) {
            clearInterval(interval);
            window.location.href = "https://www.galaxus.ch/de/s5/product/lego-the-lord-of-the-rings-barad-dur-10333-lego-icons-lego-seltene-sets-lego-44989405";
        }
    }, 100); // update every 100ms (0.1s)
})()