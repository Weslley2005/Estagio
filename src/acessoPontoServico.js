const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config();

async function loginServico(url, empresa, usuario, senha) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Acessando a URL...');
    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('URL acessada com sucesso.');

    await page.setViewport({ width: 1366, height: 768 });

    console.log('Preenchendo formulário de login...');
    await page.type('#loginEmpresa', empresa);
    console.log('Empresa preenchida:', empresa);
    await page.type('#loginUsuario', usuario);
    console.log('Usuário preenchido:', usuario);
    await page.type('#loginSenha', senha);
    console.log('Senha preenchida.');

    console.log('Enviando formulário de login...');
    await page.click('#btnSubmit');
    console.log('Formulário enviado.');

    console.log('Aguardando redirecionamento após o login...');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 100000 });
    console.log('Redirecionamento concluído.');

    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Verificando sucesso do login...');
    const success = await page.evaluate(() => {
      return !!document.querySelector('.perfect-scrollbar-on');
    });

    if (!success) {
      throw new Error('Login não foi bem-sucedido');
    }
    console.log('Login bem-sucedido.');

  
    console.log('Acessando URL de ponto...');
    if (!process.env.URLPONTO) {
      throw new Error('URLPONTO não está definida nas variáveis de ambiente');
    }
    await page.goto(process.env.URLPONTO, { waitUntil: 'networkidle2' });
    console.log('URL de ponto acessada.');

    await page.reload();

    console.log('Selecionando campo de data e inserindo a data de hoje...');
    const today = new Date();
    const formattedDate = (`0${today.getDate()}`).slice(-2) + '/' +
                          (`0${today.getMonth() + 1}`).slice(-2) + '/' +
                          today.getFullYear(); 
    await page.evaluate((date) => {
      document.querySelector('.datepicker').value = date;
    }, formattedDate);
    console.log('Data de hoje inserida:', formattedDate);

    console.log('Clicando no botão Exibir...');
    await page.click('#btnExibir');
    console.log('Botão Exibir clicado.');

    console.log('Configurando interceptação de requisições XHR para o link desejado...');
    await page.setRequestInterception(true);

    page.on('request', request => {
      if (request.url().includes(process.env.URLAPI)) {
        console.log('Requisição interceptada:', request.url());
        request.continue();
      } else {
        request.continue();
      }
    });

    let responseProcessed = false;
    let dadosInput;

    page.on('response', async response => {
      const url = response.url();
      if (url.includes(process.env.URLAPI)) {
        const text = await response.text();
        const $ = cheerio.load(text);
        
        dadosInput = $('#dadosTabela').val();
        //console.log('Valor do input hidden:', dadosInput);
        responseProcessed = true;
      }
    });

    await new Promise((resolve, reject) => {
      const checkResponse = setInterval(() => {
        if (responseProcessed) {
          clearInterval(checkResponse);
          resolve();
        }
      }, 1000);
      
      setTimeout(() => {
        clearInterval(checkResponse);
        reject(new Error('Timeout ao aguardar a resposta da requisição'));
      }, 30000);
    });

    if (dadosInput) {
      console.log('Salvando dados no arquivo Dados.json...');
      const dados = JSON.parse(dadosInput);
      fs.writeFileSync('Dados.json', JSON.stringify(dados, null, 2));
      console.log('Dados salvos com sucesso.');
    }

    console.log('Fechando navegador...');
    await browser.close();
    console.log('Navegador fechado.');

    return success;

  } catch (error) {
    console.error('Erro no login:', error);
    console.log('Fechando navegador após erro...');
    await browser.close();
    console.log('Navegador fechado após erro.');
    throw error;
  }
}

module.exports = { loginServico };
