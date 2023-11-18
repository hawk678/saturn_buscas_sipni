const express = require('express');
const fs = require('fs');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const fetch = require('node-fetch'); // Se você estiver usando Node.js
const colors = require("colors");
const cfonts = require('cfonts')
const morgan = require('morgan'); //kkk
const cron = require('node-cron');

const app = express();

// Middleware para contar os requests totais
let totalRequestCount = 0;
app.use((req, res, next) => {
  totalRequestCount++;
  const requestPath = req.path;

  // Rastreie os diretórios acessados
  if (!directories[requestPath]) {
    directories[requestPath] = {
      total: 1,
      daily: 1,
    };
  } else {
    directories[requestPath].total++;
    directories[requestPath].daily++;
  }

  next();
});

// Middleware para reiniciar as contagens diárias à meia-noite
const directories = {};

// Agendar a reinicialização diária à meia-noite
cron.schedule('0 0 * * *', () => {
  for (const dir in directories) {
    directories[dir].daily = 0;
  }
});

// Rota para obter a contagem de requests totais
app.get('/total-count', (req, res) => {
  res.json({ totalRequests: totalRequestCount });
});

// Rota para obter a contagem de requests do dia
app.get('/daily-count', (req, res) => {
  const requestPath = req.path;
  res.json({
    dailyRequests: directories[requestPath] ? directories[requestPath].daily : 0,
  });
});

// Rota para obter a contagem de requests por diretório
app.get('/directory-count', (req, res) => {
  res.json(directories);
});


app.use(morgan('--------------------------\n> Nova Request Detectada!\nIp: :remote-addr\nMétodo: :method\nDiretório: :url\nHttpCode: :status\nTempo De Resposta :response-time ms\nData: :date[web]\n--------------------------'));

__path = process.cwd()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(flash());
app.set('trust proxy', 1);app.use(compression())
app.set('json spaces', 4);

const sipniRouter = require('./controller/sipniRouter.js');

const banner1 = cfonts.render(('saturn|buscas'), {
  font: 'block',
  color: 'candy',
  align: 'center',
  gradient: ["red","blue"],
  lineHeight: 3
    });
  
  console.log(banner1.string);
  console.log(`[Api - System] Servidor ON!! Rodando No: http://localhost:${port}!`)
  console.log("[Api -  Creditos] Versão Remod Em Js Da Api Em Php Do @kvntstore - Remod By @hawkdev")

app.get('/', (req, res) => {

res.json({
status: 200,
creator: "@hawkdev (telegram)",
sobre_o_projeto: "bom, poderia vim aqui e falar que fiz do 0 porem não. sou certo pelo certo! peguei uma source que soltaram no grupo do ms e analisei muito os sistemas, e reformulei ele completamente, (em outra linguagem), e bom o resultado está aí kkk, apesar de eu não ter feito do zero absoluto, tive um trabalho consideravel (2 dias) ate deixar ele completinho e perfeito! com a intenção de soltar gratis! porque tem poucas apis (free) de consultas on por ai. esse projeto vai ficar um bom tempo on então aproveitem e espero que gostem :)",
para_negociações_da_source: "@saturngroup1 (telegram)",
como_consiguir_um_token: "@SaturnBuscas_Robot (telegram)",
diretorios_base_sipni: {
consultar_cpf: "/api/sus/sipni/puxar/cpf?q=cpfaqui&t=tokendeacessoaqui",
consultar_vacinas_covid: "/api/sus/sipni/puxar/vacinas/covid?q=cpfaqui&t=tokendeacessoaqui",
consultar_vacinas_outras: "/api/sus/sipni/puxar/vacinas?q=cpfaqui&t=tokendeacessoaqui",
},
modos_de_uso: {
modo_de_uso1: "copie o diretorio que deseja (copie apenas o que esta dentro das aspas) e cole na frente do link do site",
modo_de_uso2: "coloque o cpf que deseja consultar dps do = exemplo: q=0000000000",
modo_de_uso3: "coloque o token de acesso depois do = exemplo: t=newsearch"
},
})
})

app.use('/api/sus/sipni', sipniRouter);

app.listen(port, () => {
    console.log(`> Bom Uso :)`);
  });
  
