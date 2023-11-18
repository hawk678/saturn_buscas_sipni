const fetch = require('node-fetch'); // Se você estiver usando Node.js
const fs = require('fs');
const { getBearerSipni } = require('../get_bearer');
const getBearer = JSON.parse(fs.readFileSync(`./sessão.json`))

function formatCPF(cpf) {
cpf = cpf.replace(/\D/g, '');
return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function contemNumeros(texto) {
  var expressaoRegular = /[0-9]/;
  return expressaoRegular.test(texto);
}

async function formatarDataPtBR(dataStr) {
const [ano, mes, dia] = dataStr.split('-');
  
return `${dia}/${mes}/${ano}`;
  }
  

function substituirBooleanos(obj) {
for (const chave in obj) {
  if (typeof obj[chave] === 'object') {
// Se o valor for um objeto, chame a função recursivamente
substituirBooleanos(obj[chave]);
  } else if (typeof obj[chave] === 'boolean') {
// Se o valor for booleano, substitua "true" por "sim" e "false" por "não"
obj[chave] = obj[chave] ? 'sim' : 'não';
  }
}
  }

  async function getInfoMunicipioSipni(codigoMunicipio, bearerTokenAccount) {

const apiUrl = 'https://servicos-cloud.saude.gov.br/pni-bff/v1/municipio/' + codigoMunicipio;
  
const bearerToken = getBearer.tokenDeSessãoSipni; // Substitua pelo seu token de autorização
const randomWindowsVersion = Math.floor(Math.random() * 89) + 11;
const randomWebKitVersion = `${Math.floor(Math.random() * 881) + 111}.${Math.floor(Math.random() * 89) + 11}`;
const randomChromeVersion = Math.floor(Math.random() * 89) + 11;
  
const headers = new Headers();
headers.append("User-Agent", `Mozilla/5.0 (Windows NT ${randomWindowsVersion}.0; Win64; x64) AppleWebKit/${randomWebKitVersion} (KHTML, like Gecko) Chrome/${randomChromeVersion}.0.0.0 Safari/537.36`);
headers.append("Authorization", `Bearer ${bearerTokenAccount}`);
headers.append("DNT", "1");
headers.append("Referer", "https://si-pni.saude.gov.br/");
  
return fetch(apiUrl, {
method: "GET", // ou outro método HTTP que você estiver usando
headers: headers,
  })
  .then(response => {
if (!response.ok) {
  throw new Error("Erro na solicitação HTTP");
}
return response.json();
  })
  .catch(error => {
console.error(error);
throw error;
  });
  }

  async function getInfoMunicipio2Sipni(codigoMunicipio, bearerTokenAccount) {

const apiUrl = 'https://servicos-cloud.saude.gov.br/pni-bff/v1/municipio/' + codigoMunicipio;
  
const bearerToken = getBearer.tokenDeSessãoSipni; // Substitua pelo seu token de autorização
const randomWindowsVersion = Math.floor(Math.random() * 89) + 11;
const randomWebKitVersion = `${Math.floor(Math.random() * 881) + 111}.${Math.floor(Math.random() * 89) + 11}`;
const randomChromeVersion = Math.floor(Math.random() * 89) + 11;
  
const headers = new Headers();
headers.append("User-Agent", `Mozilla/5.0 (Windows NT ${randomWindowsVersion}.0; Win64; x64) AppleWebKit/${randomWebKitVersion} (KHTML, like Gecko) Chrome/${randomChromeVersion}.0.0.0 Safari/537.36`);
headers.append("Authorization", `Bearer ${bearerTokenAccount}`);
headers.append("DNT", "1");
headers.append("Referer", "https://si-pni.saude.gov.br/");
  
return fetch(apiUrl, {
method: "GET", // ou outro método HTTP que você estiver usando
headers: headers,
  })
  .then(response => {
if (!response.ok) {
  throw new Error("Erro na solicitação HTTP");
}
return response.json();
  })
  .catch(error => {
console.error(error);
throw error;
  });
  }

async function somarIdade(datadenascimento) {
var dataNascimento = datadenascimento

var partesData = dataNascimento.split('/');
var diaNascimento = parseInt(partesData[0]);
var mesNascimento = parseInt(partesData[1]) - 1;  // Lembre-se que os meses em JavaScript são baseados em zero (janeiro = 0, fevereiro = 1, etc.)
var anoNascimento = parseInt(partesData[2]);
var dataNascimentoObj = new Date(anoNascimento, mesNascimento, diaNascimento);
var dataAtual = new Date();
var diferencaEmMilissegundos = dataAtual - dataNascimentoObj;
var anosDeIdade = Math.floor(diferencaEmMilissegundos / (365.25 * 24 * 60 * 60 * 1000));
return anosDeIdade
  }

  async function getVacinasSipni(cpf) {

    const apiUrl = 'https://servicos-cloud.saude.gov.br/pni-bff/v1/calendario/cpf/' + cpf;
      
    const bearerToken = getBearer.tokenDeSessãoSipni; // Substitua pelo seu token de autorização
    const randomWindowsVersion = Math.floor(Math.random() * 89) + 11;
    const randomWebKitVersion = `${Math.floor(Math.random() * 881) + 111}.${Math.floor(Math.random() * 89) + 11}`;
    const randomChromeVersion = Math.floor(Math.random() * 89) + 11;
      
    const headers = new Headers();
    headers.append("User-Agent", `Mozilla/5.0 (Windows NT ${randomWindowsVersion}.0; Win64; x64) AppleWebKit/${randomWebKitVersion} (KHTML, like Gecko) Chrome/${randomChromeVersion}.0.0.0 Safari/537.36`);
    headers.append("Authorization", `Bearer ${bearerToken}`);
    headers.append("DNT", "1");
    headers.append("Referer", "https://si-pni.saude.gov.br/");
      
    return fetch(apiUrl, {
    method: "GET", // ou outro método HTTP que você estiver usando
    headers: headers,
      })
      .then(response => {
    if (!response.ok) {
      throw new Error("Erro na solicitação HTTP");
    }
    return response.json();
      })
      .catch(error => {
    console.error(error);
    throw error;
      });
      }

module.exports = { formatCPF, contemNumeros, formatarDataPtBR, substituirBooleanos, getInfoMunicipioSipni, getInfoMunicipio2Sipni, somarIdade, getVacinasSipni }