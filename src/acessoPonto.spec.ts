const {login } = require('./acessoPonto');
require('dotenv').config();

describe('Login Functionality', () => {
  jest.setTimeout(60000);

  test('Credenciais correta', async () => {
    const url = process.env.URL;
    const empresa = process.env.EMPRESA;
    const usuario = process.env.USUARIO;
    const senha = process.env.SENHA;

    const success = await login(url, empresa, usuario, senha);
    expect(success).toBe(true);
  });
});

/*test('Deve coletar dados de ponto', async () => {
  const registros = await login();
  expect(registros).toBeInstanceOf(Array);
});*/

/*test('Deve verificar ausências de ponto', async () => {
  const ausentes = await verificarAusencias('07:10');
  expect(ausentes).toBeInstanceOf(Array);
});*/
