const fetch = require('node-fetch'); // Se você estiver usando Node.js
const fs = require('fs');
const getBearer = JSON.parse(fs.readFileSync(`./sessão.json`))

const apiUrl = 'https://servicos-cloud.saude.gov.br/pni-bff/v1/calendario/cpf/' + "706109578421160";

const bearerToken = getBearer.tokenDeSessãoSipni; // Substitua pelo seu token de autorização
const randomWindowsVersion = Math.floor(Math.random() * 89) + 11;
const randomWebKitVersion = `${Math.floor(Math.random() * 881) + 111}.${Math.floor(Math.random() * 89) + 11}`;
const randomChromeVersion = Math.floor(Math.random() * 89) + 11;

const headers = new Headers();
headers.append("User-Agent", `Mozilla/5.0 (Windows NT ${randomWindowsVersion}.0; Win64; x64) AppleWebKit/${randomWebKitVersion} (KHTML, like Gecko) Chrome/${randomChromeVersion}.0.0.0 Safari/537.36`);
headers.append("Authorization", `Bearer ${bearerToken}`);
headers.append("DNT", "1");
headers.append("Referer", "https://si-pni.saude.gov.br/");

fetch(apiUrl, {
  method: "GET", // ou outro método HTTP que você estiver usando
  headers: headers,
})
  .then(response => {
    if (!response.ok) {
    }
    return response.json();
  })
  .then(data => {
    // Faça algo com os dados da resposta
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });