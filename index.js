const express = require('express');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { loginServico } = require('./src/acessoPontoServico');
const { loginPecas } = require('./src/acessoPontoPecas');
const { verificarPontoServico } = require('./src/verificaPontoServico');
const { verificarPontoPecas } = require('./src/verificaPontoPecas');

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
const empresaPecas = process.env.EMPRESAPECAS;
const usuarioPecas = process.env.USUARIOPECAS;
const senhaPecas = process.env.SENHAPECAS;
const emailDe = process.env.EMAIL_DE;
const emailPara = process.env.EMAIL_PARA;
const emailSenha = process.env.EMAIL_SENHA;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailDe,
        pass: emailSenha
    }
});
console.log('Transportador de e-mail configurado');

function enviarEmail(funcionariosSemPonto, funcionariosSemPontoPecas) {
    console.log('Preparando para enviar e-mail');
    const mailOptions = {
        from: emailDe,
        to: emailPara.join(','),
        subject: 'Funcionários que não bateram o ponto',
        text: `Os seguintes funcionários não bateram o ponto SouzaMaq Serviços:\n${funcionariosSemPonto.join('\n')}\n\n` +
              `Os seguintes funcionários não bateram o ponto SouzaMaq Peças:\n${funcionariosSemPontoPecas.join('\n')}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar e-mail:', error);
            return;
        }
        console.log('E-mail enviado:', info.response);
    });
}

async function executarVerificacaoDePontoServico(pontoIndex) {
    console.log(`Iniciando processo de verificação de ponto para pontos_${pontoIndex}...`);

    try {
        const success = await loginServico(url, empresa, usuario, senha);
        if (success) {
            console.log('Login bem-sucedido! Verificando ponto...');
            const funcionariosSemPonto = await verificarPontoServico(pontoIndex);
            if (funcionariosSemPonto && funcionariosSemPonto.length > 0) {
                console.log(`Funcionários que não bateram o ponto SouzaMaq Serviços: ${funcionariosSemPonto.join(', ')}`);
                return funcionariosSemPonto;
            } else {
                console.log('Todos os funcionários bateram o ponto.');
            }
        } else {
            console.log('Falha no login.');
        }
    } catch (err) {
        console.error('Erro ao tentar realizar login:', err);
    }
    return [];
}

async function executarVerificacaoDePontoPecas(pontoIndex) {
    console.log(`Iniciando processo de verificação de ponto para pontos_${pontoIndex}...`);

    try {
        const success = await loginPecas(url, empresaPecas, usuarioPecas, senhaPecas);
        if (success) {
            console.log('Login bem-sucedido! Verificando ponto...');
            const funcionariosSemPontoPecas = await verificarPontoPecas(pontoIndex);
            if (funcionariosSemPontoPecas && funcionariosSemPontoPecas.length > 0) {
                console.log(`Funcionários que não bateram o ponto SouzaMaq Peças: ${funcionariosSemPontoPecas.join(', ')}`);
                return funcionariosSemPontoPecas;
            } else {
                console.log('Todos os funcionários bateram o ponto.');
            }
        } else {
            console.log('Falha no login.');
        }
    } catch (err) {
        console.error('Erro ao tentar realizar login:', err);
    }
    return [];
}

const horarios = [
    { horario: '10 07 * * *', pontoIndex: 0 },
    { horario: '10 11 * * *', pontoIndex: 1 },
    { horario: '10 13 * * *', pontoIndex: 2 },
    { horario: '43 17 * * *', pontoIndex: 3 },
];

horarios.forEach(({ horario, pontoIndex }) => {
    console.log(`Agendando tarefa para o horário: ${horario}`);
    cron.schedule(horario, async () => {
        const funcionariosSemPonto = await executarVerificacaoDePontoServico(pontoIndex);
        const funcionariosSemPontoPecas = await executarVerificacaoDePontoPecas(pontoIndex);
        if (funcionariosSemPonto.length > 0 || funcionariosSemPontoPecas.length > 0) {
            enviarEmail(funcionariosSemPonto, funcionariosSemPontoPecas);
        }
    }, {
        scheduled: true,
        timezone: "America/Campo_Grande"
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server rodando em http://${HOST}:${PORT}`);
});
