const axios = require('axios');
const fs = require('fs');

async function getBearerSipni() {
    const login = 'taniapenafiel@bol.com.br:pedro123';
    const base64Login = Buffer.from(login).toString('base64');
  
    try {
      const response = await axios.post('https://servicos-cloud.saude.gov.br/pni-bff/v1/autenticacao/tokenAcesso', null, {
        headers: {
          'Accept': 'application/json',
          'DNT': 1,
          'Referer': 'https://si-pni.saude.gov.br/',
          'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': 'Windows',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
          'X-Authorization': `Basic ${base64Login}`,
        },
      });
      const tokenData = { tokenDeSessãoSipni: response.data.refreshToken };
      fs.writeFileSync('sessão.json', JSON.stringify(tokenData))
      return response.data.refreshToken
      
    } catch (error) {
      console.error('Erro ao obter o token de acesso:', error);
      return null;
    }
  };

module.exports = { getBearerSipni }
  