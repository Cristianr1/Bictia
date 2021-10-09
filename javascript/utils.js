const data = require('./data');

const { primaria, secundaria } = data.data[0].colegio;

function obtenerEtapaEducativa(etapaEducativa) {
    let etapa = null;
    if (etapaEducativa === 'primaria') {
        etapa = primaria[0];
    } else {
        etapa = secundaria[0];
    }
    return new Map(Object.entries(etapa));
}

const reducer = (previousValue, currentValue) => previousValue + currentValue;

module.exports = { obtenerEtapaEducativa, reducer }