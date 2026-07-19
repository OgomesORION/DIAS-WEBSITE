const feedbackForm = document.getElementById("feedbackForm");

feedbackForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const feedback = {
        funcionalidade: document.getElementById("funcionalidade").value,
        problema: document.getElementById("problema").value,
        visao: document.getElementById("visao").value
    };

    try {

        const response = await fetch("/api/feedbacks", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(feedback)

        });

        if (!response.ok) {
            throw new Error("Erro ao enviar feedback.");
        }

        alert("Contribuição enviada com sucesso!");

        feedbackForm.reset();

    } catch (error) {

        console.error(error);

        alert("Não foi possível enviar sua contribuição. Tente novamente.");

    }

});