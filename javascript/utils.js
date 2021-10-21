import data from './data.js';

const { primaria, secundaria } = data[0].colegio;

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

function obtenerGrado(mapEtapa, gradoFiltro){
    let gradoArray;
    mapEtapa.forEach((grado, index) => {
        if(index === gradoFiltro) {
            gradoArray = grado;
    }
    });
    return gradoArray;
}

function obtenerCurso(mapEtapa, gradoFiltro, cursoFiltro){
    let grado = obtenerGrado(mapEtapa, gradoFiltro);
    return grado.find(curso => curso.curso === cursoFiltro).estudiantes;
}

/**
 * Función que calcula la mediana
 * @param {Array} notas arreglo de notas.
 * @return {number} La mediana de las notas.
 */
function calcularMediana(notas) {
    notas.sort((a, b) => a - b);
    let mediana = null;
    if(notas.length % 2 === 0) {
        mediana = (notas[notas.length/2 - 1] + notas[notas.length/2]) / 2.0;
    } else {
        mediana = notas[(notas.length-1)/2];
    }
    return mediana;
}

/**
 * Función que calcula la moda
 * @param {Array} notas arreglo de notas.
 * @return {Array} La moda de las notas
 */
 function calcularModa(notas) {
    let modas = [], count = [], i, numero, indiceMax = 0;
 
    for (i = 0; i < notas.length; i++) {
        numero = notas[i];
        count[numero] = (count[numero] || 0) + 1;
        if (count[numero] > indiceMax) {
            indiceMax = count[numero];
        }
    }
 
    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === indiceMax) {
                modas.push(Number(i));
            }
        }
 
    return modas;
}

export { obtenerEtapaEducativa, obtenerGrado, obtenerCurso, reducer, calcularMediana, calcularModa };