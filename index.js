const express = require('express');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { login } = require('./src/acessoPonto');
const { verificarPonto } = require('./src/verificaPonto');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log('Rota / foi acessada');
});

const url = process.env.URL;
const empresa = process.env.EMPRESA;
const usuario = process.env.USUARIO;
const senha = process.env.SENHA;
const emailDe = process.env.EMAIL_DE;
const emailPara = process.env.EMAIL_PARA.split(',');
const emailSenha = process.env.EMAIL_SENHA;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailDe,
        pass: emailSenha
    }
});
console.log('Transportador de e-mail configurado');

function enviarEmail(funcionariosSemPonto) {
    console.log('Preparando para enviar e-mail');
    const mailOptions = {
        from: emailDe,
        to: emailPara.join(','),
        subject: 'Funcionários que não bateram o ponto',
        text: `Os seguintes funcionários não bateram o ponto: ${funcionariosSemPonto.join(', ')}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar e-mail:', error);
            console.error('Detalhes do erro:', error);
            return;
        }
        console.log('E-mail enviado:', info.response);
    });
}

async function executarVerificacaoDePonto(pontoIndex) {
    console.log(`Iniciando processo de verificação de ponto para pontos_${pontoIndex}...`);

    try {
        const success = await login(url, empresa, usuario, senha);
        if (success) {
            console.log('Login bem-sucedido! Verificando ponto...');
            const funcionariosSemPonto = await verificarPonto(pontoIndex);
            if (funcionariosSemPonto && funcionariosSemPonto.length > 0) {
                console.log(`Funcionários que não bateram o ponto: ${funcionariosSemPonto.join(', ')}`);
                enviarEmail(funcionariosSemPonto);
            } else {
                console.log('Todos os funcionários bateram o ponto.');
            }
        } else {
            console.log('Falha no login.');
        }
    } catch (err) {
        console.error('Erro ao tentar realizar login:', err);
    }
}

const horarios = [
    { horario: '10 07 * * *', pontoIndex: 0 },
    { horario: '10 11 * * *', pontoIndex: 1 },
    { horario: '10 13 * * *', pontoIndex: 2 },
    { horario: '10 17 * * *', pontoIndex: 3 },
];

horarios.forEach(({ horario, pontoIndex }) => {
    console.log(`Agendando tarefa para o horário: ${horario}`);
    cron.schedule(horario, () => executarVerificacaoDePonto(pontoIndex), {
        scheduled: true,
        timezone: "America/Campo_Grande"
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server rodando em http://${HOST}:${PORT}`);
});
