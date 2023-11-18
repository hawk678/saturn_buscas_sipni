const fetch = require('node-fetch'); // Se você estiver usando Node.js
const fs = require('fs');
const { getBearerSipni } = require('../get_bearer');
const { formatCPF, contemNumeros, validarTokenBearer, formatarData, substituirBooleanos, formatarDataPtBR, getInfoMunicipioSipni, getInfoMunicipio2Sipni, somarIdade, getVacinasSipni } = require('./functions');
const getBearer = JSON.parse(fs.readFileSync(`./sessão.json`))

const getTokens = JSON.parse(fs.readFileSync(`./lib/tokens.json`))

async function getInfoVacinas(req, res) {
const cpf = req.query.q
if (!cpf) return res.json({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, error_msg: "Por favor, Insira Um Cpf No Parametro: q. tente novamente com um cpf válido ou reporte @suportenewsearch ou @ms40gg caso bugs."})
const t = req.query.t
if (!t) return res.json({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, error_msg: "Por favor, Insira Um Token De Acessp No Parametro: t. não sabe ou não tem? chame @SaturnBuscas_Robot ou @saturngroup1 (telegram) (grátis)."})
if(getTokens.includes(t) == false) return res.json({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, error_msg: "Por favor, Insira Um Token Válido No Parametro: t. não sabe ou não tem? chame @SaturnBuscas_Robot ou @saturngroup1 (telegram) (grátis)."})
const cpfReplaced = cpf.replace(/[^0-9]/g, '');
if (cpfReplaced.length !== 11) return res.json({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, query_consulta: formatCPF(cpfReplaced), error_msg: "Por favor, digite um CPF válido. tente novamente com um cpf válido ou reporte @suportenewsearch ou @ms40gg caso bugs."})
if (contemNumeros(cpfReplaced) == false) return res.json ({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, query_consulta: formatCPF(cpfReplaced), error_msg: "Por favor, Insira Apenas Numeros No Cpf. tente novamente com um cpf válido ou reporte @suportenewsearch ou @ms40gg caso bugs."})

const apiUrl = 'https://servicos-cloud.saude.gov.br/pni-bff/v1/calendario/cpf/' + cpfReplaced;

const bearerToken = getBearer.tokenDeSessãoSipni; // Substitua pelo seu token de autorização
const randomWindowsVersion = Math.floor(Math.random() * 89) + 11;
const randomWebKitVersion = `${Math.floor(Math.random() * 881) + 111}.${Math.floor(Math.random() * 89) + 11}`;
const randomChromeVersion = Math.floor(Math.random() * 89) + 11;
  
const headers = new Headers();
headers.append("User-Agent", `Mozilla/5.0 (Windows NT ${randomWindowsVersion}.0; Win64; x64) AppleWebKit/${randomWebKitVersion} (KHTML, like Gecko) Chrome/${randomChromeVersion}.0.0.0 Safari/537.36`);
headers.append("Authorization", `Bearer ${bearerToken}`);
headers.append("DNT", "1");
headers.append("Referer", "https://si-pni.saude.gov.br/");

const requestOptions = {
method: 'GET',
headers: headers
};

const response2 = await fetch(apiUrl, requestOptions);
const data2 = await response2.json();

if (data2['http-status'] == 401 && data2['mensagem-negocio'] == "Não autorizado") {
  console.log("A SESSÃO BEARER FOI EXPIRADA!! GERANDO OUTRO TOKEN...")
  try {
    checkT = true;
    const tokenNovo = await getBearerSipni();
    tNovo = tokenNovo;
    const requestOptions2 = { method: 'GET', headers: { 'Authorization': 'Bearer ' + tokenNovo } }; // Atualize aqui
    const response = await fetch(apiUrl, requestOptions2);
    data = await response.json();
    console.log("Novo Token Bearer Gerado Com Sucesso e Salvo No Arquivo De Sessão!")
    getBearer.tokenDeSessãoSipni = tokenNovo;
    console.log(`[System - /lib/cpf-sipni] Codigo De Sessão: ${getBearer.tokenDeSessãoSipni}`);
  } catch (e) {
    console.log(e);
    console.log("Erro Ao Gerar Um Novo Token Bearer! Confira os logs do app.")
  }
} else {
  const response = await fetch(apiUrl, requestOptions); // Use a variável `requestOptions` original aqui
  data = await response.json();
  checkT = false;
}

if (data.status == 400) {
  return res.json({
    creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)",
    status: 404,
    query_consulta: formatCPF(cpfReplaced),
    error_msg: "CPF não encontrado na base de dados do sipni. tente novamente ou reporte @hawkdev ou @saturngroup1 (telegram) caso bugs."
    })
    } else {


// Faça uma solicitação AJAX para a API usando o token Bearer obtido
const apiUrl2 = 'https://servicos-cloud.saude.gov.br/pni-bff/v1/cidadao/cpf/' + cpfReplaced;

const requestOptions2 = {
method: 'GET',
headers: {
'Authorization': 'Bearer ' + await getBearer.tokenDeSessãoSipni,
},
};

const responsee = await fetch(apiUrl2, requestOptions2);
const info = await responsee.json();

//res.json(data.record)

const imunobiologicos = data.record.imunizacoesCampanha.imunobiologicos;

const vacinasCovid = [];

for (const vacina of imunobiologicos) {
  const imunizacoes = vacina.imunizacoes;
  for (const imunizacao of imunizacoes) {
    const vacinaCovid = {
      sigla: vacina.sigla,
      abreviatura: vacina.abreviatura,
      nome: vacina.nome,
      dose: imunizacao.esquemaDose.tipoDoseDto.descricao,
      local: {
        dataAplicacao: imunizacao.dataAplicacao,
        lote: imunizacao.lote,
        nomeDoEstabelecimento: imunizacao.nomeEstabelecimentoSaude,
        aplicador: {
          nome: imunizacao.nomeProfissionalSaude,
          descriçãoCargo: imunizacao.descricaoGrupoAtendimento
        },
        razãoSocial: imunizacao.razaoSocial,
        fabricante: imunizacao.fabricante
      }
    };
    vacinasCovid.push(vacinaCovid);
  }
}

let getIn;

if (data.record.indigena == true) {
getIn = "SIM"
} else {
getIn = "NÃO"
}

const nascimento = await formatarDataPtBR(info.records[0].dataNascimento)

res.json({
creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)",
status: 200,
cns: data.record.cns,
cpf: formatCPF(cpfReplaced),
nome: info.records[0].nome,
dataNascimento: nascimento,
idade: await somarIdade(nascimento),
indigena: getIn,
obito: info.records[0].obito = info.records[0].obito ? "SIM" : "NÃO",
vacinasCovid: vacinasCovid,
})
}
}

module.exports = { getInfoVacinas }