const stars = document.querySelector(".stars");

for(let i = 0; i < 120; i++){

    const star = document.createElement("span");

    star.classList.add("star");

    star.style.left = Math.random()*100 + "%";

    star.style.top = Math.random()*100 + "%";

    star.style.animationDelay = Math.random()*8 + "s";

    star.style.animationDuration = (3 + Math.random()*6) + "s";

    stars.appendChild(star);

}
function createMeteor(){

    const meteor = document.createElement("img");

    meteor.src = "assets/images/meteor.png";

    meteor.className = "meteor";

    meteor.style.top = Math.random() * 40 + "%";

    meteor.style.left = "-250px";

    document.body.appendChild(meteor);

    setTimeout(() => {

        meteor.remove();

    }, 7000);

}

function scheduleMeteor(){

    const delay = 30000 + Math.random() * 60000;

    setTimeout(() => {

        createMeteor();

        scheduleMeteor();

    }, delay);

}

createMeteor();

scheduleMeteor();
function createSatellite(){

    const satellite = document.createElement("img");

    satellite.src = "assets/images/satellite.png";

    satellite.className = "satellite";

    satellite.style.top = "90px";

    satellite.style.right = "-120px";

    document.body.appendChild(satellite);

    setTimeout(() => {

        satellite.remove();

    },12000);

}

function scheduleSatellite(){

    const delay = 120000 + Math.random() * 180000;

    setTimeout(() => {

        createSatellite();

        scheduleSatellite();

    }, delay);

}

scheduleSatellite();

const launchDate = new Date("2027-07-16T00:00:00");

function updateCountdown(){

    const now = new Date();

    const difference = launchDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

    const minutes = Math.floor((difference / (1000 * 60)) % 60);

    const seconds = Math.floor((difference / 1000) % 60);

    document.getElementById("days").textContent = days;

    document.getElementById("hours").textContent = hours;

    document.getElementById("minutes").textContent = minutes;

    document.getElementById("seconds").textContent = seconds;

}

updateCountdown();

setInterval(updateCountdown,1000);