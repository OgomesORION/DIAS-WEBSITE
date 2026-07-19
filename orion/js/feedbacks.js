const feedbackList = document.querySelector(".feedback-list");

const modal = document.getElementById("feedbackModal");
const closeButton = document.querySelector(".close-modal");
const modalBody = document.querySelector(".modal-body");
async function verificarAutenticacao() {

    try {

        const response = await fetch("/api/auth-status");

        if (!response.ok) {

            window.location.href = "/orion/login.html";

            return false;

        }

        return true;

    } catch (error) {

        window.location.href = "/orion/login.html";

        return false;

    }

}
// ================================
// CARREGAR FEEDBACKS DO SERVIDOR
// ================================

async function carregarFeedbacks() {

    try {

        const response = await fetch("/api/feedbacks");

        if (!response.ok) {
            throw new Error("Erro ao carregar feedbacks.");
        }

        const feedbacks = await response.json();

        feedbackList.innerHTML = "";


        // Caso ainda não existam feedbacks
        if (feedbacks.length === 0) {

            feedbackList.innerHTML = `
                <div class="feedback-card">

                    <h3>Nenhum feedback recebido</h3>

                    <p>
                        As contribuições enviadas pelos usuários
                        aparecerão aqui.
                    </p>

                </div>
            `;

            return;

        }


        // Cria um card para cada feedback
        feedbacks.forEach((feedback) => {

            const card = document.createElement("div");

            card.className = "feedback-card";

            const date = new Date(feedback.data);


            card.innerHTML = `

                <div class="feedback-header">

                    <span class="tag suggestion">
                        Contribuição
                    </span>

                    <span class="date">

                        ${date.toLocaleDateString("pt-BR")}

                        •

                        ${date.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}

                    </span>

                </div>


                <h3>
                    Nova contribuição recebida
                </h3>


                <p>
                    3 respostas enviadas pelo usuário.
                </p>


                <button class="view-btn">
                    Visualizar
                </button>

            `;


            // BOTÃO VISUALIZAR

            const viewButton =
                card.querySelector(".view-btn");


            viewButton.addEventListener("click", () => {

                modalBody.innerHTML = `

                    <span class="tag suggestion">
                        Contribuição
                    </span>


                    <h3>
                        Funcionalidade sugerida
                    </h3>

                    <p>
                        ${feedback.funcionalidade}
                    </p>


                    <h3>
                        O que incomoda nas IAs atuais
                    </h3>

                    <p>
                        ${feedback.problema}
                    </p>


                    <h3>
                        Como seria a IA perfeita
                    </h3>

                    <p>
                        ${feedback.visao}
                    </p>


                    <small>

                        Enviado em

                        ${date.toLocaleDateString("pt-BR")}

                        às

                        ${date.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit"
                        })}

                    </small>

                `;


                modal.classList.add("show");

            });


            feedbackList.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Erro ao carregar feedbacks:",
            error
        );

        feedbackList.innerHTML = `

            <div class="feedback-card">

                <h3>Erro ao carregar feedbacks</h3>

                <p>
                    Não foi possível conectar ao servidor.
                </p>

            </div>

        `;

    }

}


// ================================
// FECHAR MODAL
// ================================

closeButton.addEventListener("click", () => {

    modal.classList.remove("show");

});


modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.classList.remove("show");

    }

});
async function iniciarOrion() {

    const autenticado = await verificarAutenticacao();

    if (autenticado) {
        carregarFeedbacks();
    }

}

iniciarOrion();
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        try {

            const response = await fetch("/api/logout", {
                method: "POST"
            });

            if (!response.ok) {
                throw new Error("Erro ao sair.");
            }

            window.location.href = "/orion/login.html";

        } catch (error) {

            console.error("Erro no logout:", error);

            alert("Não foi possível encerrar a sessão.");

        }

    });

}