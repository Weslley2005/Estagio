const express = require('express');

require('dotenv').config();
//const login = require('./login');

const PORT = process.env.PORT;
const HOST = '0.0.0.0';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

/*const url = process.env.URL;
  const empresa = process.env.EMPRESA;
  const usuario = process.env.USUARIO;
  const senha = process.env.SENHA;  

login(url, empresa, usuario, senha).then(success => {
  if (success) {
    console.log('Login bem-sucedido!');
  } else {
    console.log('Falha no login.');
  }
});*/

app.listen(PORT, HOST, () => {
    console.log(`Server Rodando`);
});