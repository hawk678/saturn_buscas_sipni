const fetch = require('node-fetch'); // Se você estiver usando Node.js
const fs = require('fs');
const { getBearerSipni } = require('../get_bearer');
const { formatCPF, contemNumeros, validarTokenBearer, formatarData, substituirBooleanos, formatarDataPtBR, getInfoMunicipioSipni, getInfoMunicipio2Sipni, somarIdade, getVacinasSipni } = require('./functions');
const getBearer = JSON.parse(fs.readFileSync(`./sessão.json`))
const getTokens = JSON.parse(fs.readFileSync(`./lib/tokens.json`))

async function getInfoCpf(req, res) {
const cpf = req.query.q
if (!cpf) return res.json({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, error_msg: "Por favor, Insira Um Cpf No Parametro: q. tente novamente com um cpf válido ou reporte @suportenewsearch ou @ms40gg caso bugs."})
const cpfReplaced = cpf.replace(/[^0-9]/g, '');
if (cpfReplaced.length !== 11) return res.json({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, query_consulta: formatCPF(cpfReplaced), error_msg: "Por favor, digite um CPF válido. tente novamente com um cpf válido ou reporte @suportenewsearch ou @ms40gg caso bugs."})
if (contemNumeros(cpfReplaced) == false) return res.json ({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, query_consulta: formatCPF(cpfReplaced), error_msg: "Por favor, Insira Apenas Numeros No Cpf. tente novamente com um cpf válido ou reporte @suportenewsearch ou @ms40gg caso bugs."})
const t = req.query.t
if (!t) return res.json({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, error_msg: "Por favor, Insira Um Token De Acessp No Parametro: t. não sabe ou não tem? chame @SaturnBuscas_Robot ou @saturngroup1 (telegram) (grátis)."})
if(getTokens.includes(t) == false) return res.json({ creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)", status: 400, error_msg: "Por favor, Insira Um Token Válido No Parametro: t. não sabe ou não tem? chame @SaturnBuscas_Robot ou @saturngroup1 (telegram) (grátis)."})

try {
// Faça uma solicitação AJAX para a API usando o token Bearer obtido
const apiUrl = 'https://servicos-cloud.saude.gov.br/pni-bff/v1/cidadao/cpf/' + cpfReplaced;

const requestOptions = {
method: 'GET',
headers: {
'Authorization': 'Bearer ' + await getBearer.tokenDeSessãoSipni,
},
};

const response2 = await fetch(apiUrl, requestOptions);
const data2 = await response2.json();

let checkT;
let tNovo;
let data;

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



if (data.records.length === 0) {
return res.json({
creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)",
status: 404,
query_consulta: formatCPF(cpfReplaced),
error_msg: "CPF não encontrado na base de dados do sipni. tente novamente ou reporte @hawkdev ou @saturngroup1 (telegram) caso bugs."
})
} else {
const citizenDataSD = data.records[0];
dataFormatada = await formatarDataPtBR(citizenDataSD.dataNascimento)
somarId = await somarIdade(dataFormatada)

const citizenData = {
  nome: citizenDataSD.nome,
  cpf: citizenDataSD.cpf,
  dataNascimento: citizenDataSD.dataNascimento,
  idade: somarId,
  sexo: citizenDataSD.sexo,
  nomeMae: citizenDataSD.nomeMae,
  nomePai: citizenDataSD.nomePai,
  grauQualidade: citizenDataSD.grauQualidade,
  ativo: citizenDataSD.ativo,
  obito: citizenDataSD.obito,
  partoGemelar: citizenDataSD.partoGemelar,
  raçaCor: citizenDataSD.racaCor,
};

// Copiar citizenDataSD inteiro
const dadosRestantes = { ...citizenDataSD };

// Excluir as propriedades já incluídas em dadosPessoais
delete dadosRestantes.nome;
delete dadosRestantes.cpf;
delete dadosRestantes.dataNascimento;
delete dadosRestantes.sexo;
delete dadosRestantes.nomeMae;
delete dadosRestantes.nomePai;
delete dadosRestantes.grauQualidade;
delete dadosRestantes.ativo;
delete dadosRestantes.obito;
delete dadosRestantes.partoGemelar;
delete dadosRestantes.vip;
delete dadosRestantes.racaCor;

// Adicionar os dados restantes a dadosPessoais
Object.assign(citizenData, dadosRestantes);

delete citizenData.cnsProvisorio;
delete citizenData.vip;
format = await formatarDataPtBR(citizenData.dataNascimento)
citizenData.dataNascimento = format
const racaCorMapping = {
  "01": "BRANCA",
  "02": "PRETA",
  "03": "AMARELA",
  "04": "PARDA",
  "05": "INDIGENA"
};
if (citizenData.raçaCor in racaCorMapping) {
  citizenData.raçaCor = racaCorMapping[citizenData.raçaCor];
}
const mapeamentoValores = {
  pais: {
    "1": "BRASIL",
    "2": "ESTADOS UNIDOS",
    // Adicione mais países conforme necessário
  },
  tipoEndereco: {
    1: "RESIDENCIAL",
    2: "COMERCIAL",
    // Adicione mais tipos de endereço conforme necessário
  },
  paisNascimento: {
    "1": "BRASIL",
    "2": "ESTADOS UNIDOS",
    // Adicione mais países conforme necessário
  },
  nacionalidade: {
    1: "BRASILEIRA",
    2: "AMERICANA",
    // Adicione mais nacionalidades conforme necessário
  },
};
citizenData.endereco.pais = mapeamentoValores.pais[citizenData.endereco.pais] || "Desconhecido";
citizenData.endereco.tipoEndereco = mapeamentoValores.tipoEndereco[citizenData.endereco.tipoEndereco] || "Desconhecido";
citizenData.nacionalidade.paisNascimento = mapeamentoValores.paisNascimento[citizenData.nacionalidade.paisNascimento] || "Desconhecido";
citizenData.nacionalidade.nacionalidade = mapeamentoValores.nacionalidade[citizenData.nacionalidade.nacionalidade] || "Desconhecido";
await substituirBooleanos(citizenData)
let getinfoMun;
let getinfoMun2;
try {
if (checkT == false) {
getinfoMun = await getInfoMunicipioSipni(citizenData.nacionalidade.municipioNascimento, getBearer.tokenDeSessãoSipni)
getinfoMun2 = await getInfoMunicipio2Sipni(citizenData.endereco.municipio, getBearer.tokenDeSessãoSipni)
} else {
getinfoMun = await getInfoMunicipioSipni(citizenData.nacionalidade.municipioNascimento, tNovo)
getinfoMun2 = await getInfoMunicipio2Sipni(citizenData.endereco.municipio, tNovo)
}
const arrayMun = [getinfoMun.record];
citizenData.nacionalidade.Municipio = arrayMun
} catch {
console.log("CODIGO DO MUNICIPIO NÃO ENCONTRADO! ENVIEI ARRAY VAZIA...")
citizenData.nacionalidade.Municipio = []
}
citizenData.endereco.siglaUf = getinfoMun2.record.siglaUf;
citizenData.endereco.cidade = getinfoMun2.record.nome;

function formatarTipoTelefone(tipo) {
  switch (tipo) {
    case 1:
      return "Telefone Residencial";
    case 2:
      return "Telefone Celular";
    case 3:
      return "Telefone Comercial";
    default:
      return "Tipo Desconhecido";
  }
}

// Suponha que citizenData seja o objeto JSON que você mencionou
if (citizenData.telefone && Array.isArray(citizenData.telefone)) {
  for (let i = 0; i < citizenData.telefone.length; i++) {
    citizenData.telefone[i].tipo = formatarTipoTelefone(citizenData.telefone[i].tipo);
  }
}

citizenData.endereco.cidade = getinfoMun2.record.nome;

// Criar um Map para preservar a ordem dos campos
var updatedData = new Map();

// Adicionar o novo campo no início
updatedData.set("cns", citizenData.cnsDefinitivo);

// Adicionar os campos existentes ao Map
for (const [key, value] of Object.entries(citizenData)) {
  updatedData.set(key, value);
}

// Converter o Map de volta para um objeto JSON
citizenData2 = Object.fromEntries(updatedData);

delete citizenData2.nacionalidade.municipioNascimento;
delete citizenData2.nacionalidade.nacionalidade

citizenData2.localNascimento = citizenData2.nacionalidade;
delete citizenData2.nacionalidade;

delete citizenData2.cnsDefinitivo

res.json({
  creditos: "@hawkdev - @SaturnBuscas_Robot - @saturngroup1 (telegram)",
  status: 200,
  cpf_informado: formatCPF(cpfReplaced),
  HawkData: citizenData2
})

}
} catch (error) {
console.log(error)
if (error.message.includes('Erro de autenticação')) {
console.log('Erro de autenticação. Renovar token.');
// Lide com a renovação do token de autenticação aqui, se necessário
} else {
console.error('Erro na solicitação:', error);
}
}
}

module.exports = { getInfoCpf }