const express = require('express');
const router = express.Router();
const input = require("input");
const axios = require('axios');

// ========= Diretorios Das Consultas - SI-PNI ROUTER ========= \\

const { getInfoCpf } = require("../lib/cpf-sipni");
const { getInfoVacinas } = require('../lib/vacinas-sipni');
const { getInfoVacinas2 } = require('../lib/vacinas-sipni-2');

// ========= Consultas - SI-PNI ROUTER ========= \\

router.get('/puxar/cpf', getInfoCpf)
router.get('/puxar/vacinas/covid', getInfoVacinas)
router.get('/puxar/vacinas', getInfoVacinas2)

module.exports = router;