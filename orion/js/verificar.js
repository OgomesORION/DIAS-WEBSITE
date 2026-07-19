const verificationForm =
    document.getElementById("verificationForm");

verificationForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const code =
            document.getElementById("code")
                .value
                .trim();

        try {

            const response =
                await fetch("/api/verify-code", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        code
                    })

                });


            const data = await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Código inválido."
                );

                return;

            }


            // Código correto
            window.location.href =
                "/orion/feedbacks.html";


        } catch (error) {

            console.error(
                "Erro na verificação:",
                error
            );

            alert(
                "Não foi possível verificar o código."
            );

        }

    }
);