const planet = document.getElementById("planet");

let angle = 0;

function rotatePlanet(){

    angle += 0.005;

    planet.style.transform = `rotate(${angle}deg)`;

    requestAnimationFrame(rotatePlanet);

}

rotatePlanet();