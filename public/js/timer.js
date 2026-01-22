let waktu = 30 * 60;
const timer = document.getElementById("timer");

setInterval(() => {
    waktu--;
    let menit = Math.floor(waktu / 60);
    let detik = waktu % 60;
    timer.innerHTML = `Waktu: ${menit}:${detik}`;
    if (waktu <= 0) document.forms[0].submit();
}, 1000);
