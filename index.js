const express = require('express');
//const login = require('./login');

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

/*const url = 'https://client.ezpointweb.com.br/';
const empresa = 'suaEmpresa'; 
const usuario = 'seuUsuario'; 
const senha = 'suaSenha';     

login(url, empresa, usuario, senha).then(success => {
  if (success) {
    console.log('Login bem-sucedido!');
  } else {
    console.log('Falha no login.');
  }
});*/

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});