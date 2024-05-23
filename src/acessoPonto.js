const puppeteer = require('puppeteer');

async function login(url, empresa, usuario, senha) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.type('#loginUsuario', empresa);
    await page.type('#loginUsuario', usuario);
    await page.type('#loginSenha', senha);
    await page.click('#btnSubmit');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const success = await page.evaluate(() => {
      return !!document.querySelector('.dashboard');
    });

    await browser.close();
    return success;
  } catch (error) {
    console.error('Erro no login:', error);
    await browser.close();
    return false;
  }
}

module.exports = login;
