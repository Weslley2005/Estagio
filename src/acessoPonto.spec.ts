const login = require('./acessoPonto');

describe('Login Functionality', () => {
  jest.setTimeout(60000);

  it('Credenciais correta', async () => {
    const url = 'https://client.ezpointweb.com.br/';
    const empresa = 'your-username';
    const usuario = 'your-username';
    const senha = 'your-password';

    const success = await login(url, empresa, usuario, senha);
    expect(success).toBe(true);
  });

  it('Credenciais incorretas', async () => {
    const url = 'https://client.ezpointweb.com.br/';
    const empresa = 'your-username';
    const usuario = 'wrong-username';
    const senha = 'wrong-password';

    const success = await login(url, empresa, usuario, senha);
    expect(success).toBe(false);
  });
});
