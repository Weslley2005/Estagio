const login = require('./acessoPonto');
require('dotenv').config();

describe('Login Functionality', () => {
  jest.setTimeout(60000);

  it('Credenciais correta', async () => {
    const url = process.env.URL;
    const empresa = process.env.EMPRESA;
    const usuario = process.env.USUARIO;
    const senha = process.env.SENHA;

    const success = await login(url, empresa, usuario, senha);
    expect(success).toBe(true);
  });

  it('Credenciais incorretas', async () => {
    const url = process.env.URL;
    const empresa = 'TESTE';
    const usuario = 'teste1';
    const senha = 'teste2';

    const success = await login(url, empresa, usuario, senha);
    expect(success).toBe(false);
  });
});
