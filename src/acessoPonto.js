const puppeteer = require('puppeteer');

async function login(url, empresa, usuario, senha) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('Acessando a URL:', url);
    await page.goto(url, { waitUntil: 'networkidle2' });
    console.log('URL acessada com sucesso.');

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
      return !!document.querySelector('.deshboard');
    });

    console.log('Fechando navegador...');
    await browser.close();
    console.log('Navegador fechado.');

    return success;
  } catch (error) {
    console.error('Erro no login:', error);
    console.log('Fechando navegador após erro...');
    await browser.close();
    console.log('Navegador fechado após erro.');
    return false;
  }
}

module.exports = login;
