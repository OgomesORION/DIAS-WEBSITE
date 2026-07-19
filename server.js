const express = require("express");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const nodemailer = require("nodemailer");
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();

const PORT = process.env.PORT || 3000;
const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});
const FEEDBACKS_FILE = path.join(
    __dirname,
    "data",
    "feedbacks.json"
);


// Permite receber JSON
app.use(express.json());
app.use(session({

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,

    cookie: {

        httpOnly: true,

        sameSite: "lax",

        secure: process.env.NODE_ENV === "production",

        maxAge: 1000 * 60 * 60 * 8

    }

}));


// Disponibiliza os arquivos do site
app.use(express.static(__dirname));


// ================================
// RECEBER FEEDBACK
// ================================

app.post("/api/feedbacks", (req, res) => {

    try {

        const feedback = req.body;

        const feedbacks = JSON.parse(
            fs.readFileSync(FEEDBACKS_FILE, "utf8")
        );

        const newFeedback = {

            id: Date.now(),

            funcionalidade: feedback.funcionalidade,

            problema: feedback.problema,

            visao: feedback.visao,

            data: new Date().toISOString()

        };

        feedbacks.push(newFeedback);

        fs.writeFileSync(
            FEEDBACKS_FILE,
            JSON.stringify(feedbacks, null, 2)
        );

        res.status(201).json({
            success: true,
            message: "Feedback recebido com sucesso."
        });

    } catch (error) {

        console.error("Erro ao salvar feedback:", error);

        res.status(500).json({
            success: false,
            message: "Erro ao salvar feedback."
        });

    }

});


// ================================
// LISTAR FEEDBACKS
// ================================
// ================================
// LOGIN ORION
// ================================

app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const admins = [

            {
                email: process.env.ADMIN1_EMAIL,
                passwordHash: process.env.ADMIN1_PASSWORD_HASH
            },

            {
                email: process.env.ADMIN2_EMAIL,
                passwordHash: process.env.ADMIN2_PASSWORD_HASH
            }

        ];

        const admin = admins.find(
            user =>
                user.email &&
                user.email.toLowerCase() === email?.toLowerCase()
        );

        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "E-mail ou senha inválidos."
            });

        }

        const validPassword = await bcrypt.compare(
            password,
            admin.passwordHash
        );

        if (!validPassword) {

            return res.status(401).json({
                success: false,
                message: "E-mail ou senha inválidos."
            });

        }

        // Gera código de 6 dígitos
const verificationCode = Math.floor(
    100000 + Math.random() * 900000
).toString();


// Salva temporariamente na sessão
req.session.pendingEmail = admin.email;
req.session.verificationCode = verificationCode;
req.session.codeExpires = Date.now() + (5 * 60 * 1000);


// Envia o código por e-mail
await transporter.sendMail({

    from: `"CTL ORION" <${process.env.EMAIL_USER}>`,

    to: admin.email,

    subject: "Código de acesso ao CTL ORION",

    text: `
Seu código de acesso ao CTL ORION é:

${verificationCode}

Este código expira em 5 minutos.

Se você não tentou acessar o ORION, ignore este e-mail.
    `

});


res.json({
    success: true,
    requiresVerification: true
});
    } catch (error) {

        console.error("Erro no login:", error);

        res.status(500).json({
            success: false,
            message: "Erro interno."
        });

    }

});
// ================================
// VERIFICAR CÓDIGO ORION
// ================================

app.post("/api/verify-code", (req, res) => {

    const { code } = req.body;

    // Verifica se existe um login aguardando confirmação
    if (
        !req.session.pendingEmail ||
        !req.session.verificationCode ||
        !req.session.codeExpires
    ) {

        return res.status(401).json({
            success: false,
            message: "Nenhuma verificação pendente."
        });

    }


    // Verifica se o código expirou
    if (Date.now() > req.session.codeExpires) {

        delete req.session.pendingEmail;
        delete req.session.verificationCode;
        delete req.session.codeExpires;

        return res.status(401).json({
            success: false,
            message: "Código expirado. Faça login novamente."
        });

    }


    // Verifica se o código está correto
    if (
        String(code) !==
        String(req.session.verificationCode)
    ) {

        return res.status(401).json({
            success: false,
            message: "Código inválido."
        });

    }


    // Código correto: libera o ORION
    req.session.authenticated = true;
    req.session.email = req.session.pendingEmail;


    // Apaga os dados temporários
    delete req.session.pendingEmail;
    delete req.session.verificationCode;
    delete req.session.codeExpires;


    res.json({
        success: true
    });

});
function requireAuth(req, res, next) {

    if (req.session.authenticated) {
        return next();
    }

    return res.status(401).json({
        success: false,
        message: "Acesso não autorizado."
    });

}
app.get("/api/feedbacks", requireAuth, (req, res) => {

    try {

        const feedbacks = JSON.parse(
            fs.readFileSync(FEEDBACKS_FILE, "utf8")
        );

        res.json(feedbacks);

    } catch (error) {

        console.error("Erro ao carregar feedbacks:", error);

        res.status(500).json({
            success: false,
            message: "Erro ao carregar feedbacks."
        });

    }

});


// ================================
// INICIAR SERVIDOR
// ================================

// ================================
// VERIFICAR SESSÃO ORION
// ================================

app.get("/api/auth-status", (req, res) => {

    if (req.session.authenticated) {

        return res.json({
            authenticated: true
        });

    }

    return res.status(401).json({
        authenticated: false
    });

});
// ================================
// LOGOUT ORION
// ================================

app.post("/api/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {
            return res.status(500).json({
                success: false,
                message: "Erro ao encerrar sessão."
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            success: true
        });

    });

});
app.listen(PORT, () => {

    console.log(
        `DIAS Website rodando em http://localhost:${PORT}`
    );

});