const puppeteer = require('puppeteer');
require('dotenv').config();

async function login(url, empresa, usuario, senha) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Acessando a URL...');
    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('URL acessada com sucesso.');

    await page.setViewport({ width: 1366, height: 768 });

    console.log('Preenchendo formulário de login...');
    await page.type('#loginEmpresa', empresa);
    await page.type('#loginUsuario', usuario);
    await page.type('#loginSenha', senha);
    console.log('Formulário preenchido.');

    console.log('Enviando formulário de login...');
    await page.click('#btnSubmit');
    console.log('Formulário enviado.');

    console.log('Aguardando redirecionamento após o login...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 100000 });
    console.log('Redirecionamento concluído.');
    
    console.log('Verificando sucesso do login...');
    const success = await page.evaluate(() => {
      return !!document.querySelector('.perfect-scrollbar-on');
    });

    if (!success) {
      throw new Error('Login não foi bem-sucedido');
    }

    console.log('Acessando URL de ponto...');
    await page.goto(process.env.URLPONTO, { waitUntil: 'networkidle2' });

    console.log('Selecionando campo de data e inserindo a data de hoje...');
    const today = new Date();
    const formattedDate = (`0${today.getDate()}`).slice(-2) + '/' + 
                          (`0${today.getMonth() + 1}`).slice(-2) + '/' + 
                          today.getFullYear(); 
    await page.evaluate((date) => {
      document.querySelector('.datepicker').value = date;
    }, formattedDate);
    console.log('Data de hoje inserida.');

    console.log('Clicando no botão Exibir...');
    await page.click('#btnExibir');
    console.log('Botão Exibir clicado.');

    console.log('Fechando navegador...');
    await browser.close();
    console.log('Navegador fechado.');
    
    return success
  } catch (error) {
    console.error('Erro no login:', error);
    console.log('Fechando navegador após erro...');
    await browser.close();
    console.log('Navegador fechado após erro.');
}
}
module.exports = { login };
