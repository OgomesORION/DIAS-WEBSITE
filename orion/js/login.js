// ================================
// RELÓGIO
// ================================

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString("pt-BR");

    const clock = document.getElementById("clock");

    if (clock) {
        clock.textContent = time;
    }

}

updateClock();

setInterval(updateClock, 1000);


// ================================
// LOGIN ORION
// ================================

const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const emailInput = document.querySelector(
        'input[type="email"]'
    );

    const passwordInput = document.querySelector(
        'input[type="password"]'
    );

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {

        const response = await fetch("/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "E-mail ou senha inválidos."
            );

            return;

        }

        // Login realizado
        window.location.href = "/orion/verificar.html";

    } catch (error) {

        console.error("Erro no login:", error);

        alert(
            "Não foi possível conectar ao servidor."
        );

    }

});