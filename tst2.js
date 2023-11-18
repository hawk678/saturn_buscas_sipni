// Data de nascimento no formato 'dd/mm/aaaa'
var dataNascimento = "25/09/1975";

// Divida a data de nascimento em dia, mês e ano
var partesData = dataNascimento.split('/');
var diaNascimento = parseInt(partesData[0]);
var mesNascimento = parseInt(partesData[1]) - 1;  // Lembre-se que os meses em JavaScript são baseados em zero (janeiro = 0, fevereiro = 1, etc.)
var anoNascimento = parseInt(partesData[2]);

// Crie um objeto Date para a data de nascimento e a data atual
var dataNascimentoObj = new Date(anoNascimento, mesNascimento, diaNascimento);
var dataAtual = new Date();

// Calcule a diferença entre as datas
var diferencaEmMilissegundos = dataAtual - dataNascimentoObj;

// Converta a diferença de milissegundos para anos
var anosDeIdade = Math.floor(diferencaEmMilissegundos / (365.25 * 24 * 60 * 60 * 1000));

console.log("Idade: " + anosDeIdade + " anos");

//aa