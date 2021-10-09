const { obtenerEtapaEducativa, reducer } = require('./utils');


/**
 * Calcula el número total de estudiantes con base en la etapa educativa
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @returns {number} número total de estudiantes
 */
function totalEstudiantesEtapa(etapaEducativa) {
    let totalEstudiantes = 0;
    let mapEtapa = obtenerEtapaEducativa(etapaEducativa);
    mapEtapa.forEach(grado => grado.map(curso => totalEstudiantes += curso.estudiantes.length));
    return totalEstudiantes;
};

/**
 * Adiciona el total de estudiantes de las dos etapas educativas (primaria y secundaria)
 * @returns {number} número total de estudiantes en el Colegio
 */
function totalEstudiantesColegio() {
    return totalEstudiantesEtapa('primaria') + totalEstudiantesEtapa('secundaria');
}

/**
 * Calcula el número total de estudiantes en la etapa educativa, filtrando por el género
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} genero "male" | "female"
 * @returns {number} número total de estudiantes de un mismo género
 */
function totalPorGeneroEtapa(etapaEducativa, genero) {
    let totalEstudiantes = 0;
    let mapEtapa = obtenerEtapaEducativa(etapaEducativa);
    mapEtapa.forEach(grado => grado
        .map(curso => curso.estudiantes
            .filter(estudiante => estudiante.genero === genero)
            .map(_estudiante => ++totalEstudiantes)));
    return totalEstudiantes;
}

/**
 * Adiciona el total de estudiantes de las dos etapas educativas (primaria y secundaria), filtrando por el género
 * @param {string} genero "male" | "female"
 * @returns {number} número total de estudiantes de un mismo género en el colegio
 */
function totalPorGeneroColegio(genero) {
    return totalPorGeneroEtapa('primaria', genero) + totalPorGeneroEtapa('secundaria', genero);
}

/**
 * Retorna la media de las notas, filtrando por etapa educativa
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @returns {number}
 */
function mediaNotasEtapa(etapaEducativa) {
    let sumNotas = 0;
    let totalNotas = 0;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    etapa.forEach((_grado, index) => etapa.get(index)
        .map(curso => curso.estudiantes
            .map(estudiante => estudiante.asignaturas
                .map(asignatura => {
                    sumNotas += Object.values(asignatura[Object.keys(asignatura)]).reduce(reducer);
                    totalNotas += Object.values(asignatura[Object.keys(asignatura)]).length;
                })
            )
        )
    )
    return (sumNotas / totalNotas)
}

/**
 * Retorna la media de las notas en el colegio
 * @returns {number}
 */
function mediaNotasColegio() {
    return (mediaNotasEtapa('primaria') + mediaNotasEtapa('secundaria')) / 2;
}

/**
 * Retorna la media de las notas, filtrando por etapa educativa y grado
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} grado
 * @returns {number}
 */
function mediaNotasEtapaGrado(etapaEducativa, grado) {
    let sumNotas = 0;
    let totalNotas = 0;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    etapa.forEach((_gra, index) => index === grado && etapa.get(index)
        .map(curso => curso.estudiantes
            .map(estudiante => estudiante.asignaturas
                .map(asignatura => {
                    sumNotas += Object.values(asignatura[Object.keys(asignatura)]).reduce(reducer);
                    totalNotas += Object.values(asignatura[Object.keys(asignatura)]).length;
                })
            )
        )
    )
    return (sumNotas / totalNotas)
}

/**
 * Función 6
 * Retorna la media de las notas, filtrando por etapa educativa, grado y curso
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @returns {number}
 */
function mediaNotasEtapaCurso(etapaEducativa, grado, cursoFiltro) {
    let sumNotas = 0;
    let totalNotas = 0;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    etapa.forEach((_gra, index) => index === grado && etapa.get(index)
        .map(curso => curso.curso === cursoFiltro && curso.estudiantes
            .map(estudiante => estudiante.asignaturas
                .map(asignatura => {
                    sumNotas += Object.values(asignatura[Object.keys(asignatura)]).reduce(reducer);
                    totalNotas += Object.values(asignatura[Object.keys(asignatura)]).length;
                })
            )
        )
    )
    return (sumNotas / totalNotas)
}

/**
 * Retorna un arreglo, en la primer posición está el nombre del estudiante con mayor puntaje,
 * en la segunda posición está el puntaje obtenido por el estudiante.
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} materia
 * @returns {number}
 */
function mejorPromedioMateriaEtapa(etapaEducativa, materia) {
    let mayorPuntaje = 0;
    let estudianteMayorPuntaje = null;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    etapa.forEach((_grado, index) => {
        etapa.get(index)
            .map(curso => curso.estudiantes
                .map(estudiante => {
                    const promedioAsignaturas = estudiante.asignaturas
                        .map(asignatura => ({ [Object.keys(asignatura)]: Object.values(asignatura[Object.keys(asignatura)]).reduce(reducer) / 4.0 }))
                    return { estudiante: estudiante.nombre, asignaturas: [...promedioAsignaturas] };
                })
                .map(nuevoArreglo => [nuevoArreglo.estudiante, nuevoArreglo.asignaturas.find(asignatura => asignatura[materia])[materia]])
                .forEach(nuevoArreglo2 => {
                    if (nuevoArreglo2[1] > mayorPuntaje) {
                        estudianteMayorPuntaje = nuevoArreglo2[0];
                        mayorPuntaje = nuevoArreglo2[1];
                    }
                })
            )
    })
    return [estudianteMayorPuntaje, mayorPuntaje];
}

/**
 * Retorna la media de las notas en el colegio
 * @param {string} materia
 * @returns {number}
 */
 function mejorPromedioMateria(materia) {
    if (mejorPromedioMateriaEtapa('primaria', materia)[1] > mejorPromedioMateriaEtapa('secundaria', materia)[1]){
        return mejorPromedioMateriaEtapa('primaria', materia);
    }
    return mejorPromedioMateriaEtapa('secundaria', materia)[1];
}

console.log(mejorPromedioMateria('historia'))
