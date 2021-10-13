const {
    obtenerEtapaEducativa,
    obtenerGrado,
    obtenerCurso,
    reducer,
    calcularMediana,
    calcularModa
} = require('./utils');


/**
 * Calcula el número total de estudiantes con base en la etapa educativa
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @returns {number} número total de estudiantes
 */
function totalEstudiantesEtapa(etapaEducativa) {
    let totalEstudiantes = 0;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    etapa.forEach(grado => grado.map(curso => totalEstudiantes += curso.estudiantes.length));
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
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    etapa.forEach(grado => grado
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
    etapa.forEach(grado => grado
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
 * Retorna la media de las notas, filtrando por: etapa educativa y grado
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} grado
 * @returns {number}
 */
function mediaNotasEtapaGrado(etapaEducativa, gradoFiltro) {
    let sumNotas = 0;
    let totalNotas = 0;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    let grado = obtenerGrado(etapa, gradoFiltro);

    grado.map(curso => curso.estudiantes
        .map(estudiante => estudiante.asignaturas
            .map(asignatura => {
                sumNotas += Object.values(asignatura[Object.keys(asignatura)]).reduce(reducer);
                totalNotas += Object.values(asignatura[Object.keys(asignatura)]).length;
            })
        )
    )
    return (sumNotas / totalNotas)
}


/**
 * Retorna la media de las notas, filtrando por: etapa educativa, grado y curso
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @returns {number}
 */
function mediaNotasEtapaCurso(etapaEducativa, gradoFiltro, cursoFiltro) {
    let sumNotas = 0;
    let totalNotas = 0;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    let estudiantes = obtenerCurso(etapa, gradoFiltro, cursoFiltro);
    estudiantes.map(estudiante => estudiante.asignaturas
        .map(asignatura => {
            sumNotas += Object.values(asignatura[Object.keys(asignatura)]).reduce(reducer);
            totalNotas += Object.values(asignatura[Object.keys(asignatura)]).length;
        })
    )
    return (sumNotas / totalNotas)
}


/**
 * Extrae las notas de una etapa en un arreglo, para así calcular mediana y moda.
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @returns {Object} Arreglo de notas, mediana y moda
 */
function notasEtapa(etapaEducativa) {
    let arregloNotas = [];
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    etapa.forEach(grado => grado
        .map(curso => curso.estudiantes
            .map(estudiante => estudiante.asignaturas
                .map(asignatura => Object.values(asignatura[Object.keys(asignatura)]).forEach(corte => arregloNotas.push(corte)))
            )
        )
    )
    let mediana = calcularMediana(arregloNotas);
    let moda = calcularModa(arregloNotas);
    return { arregloNotas, mediana, moda };
}


/**
 * Extrae las notas del colegio en un arreglo, para así calcular mediana y moda.
 * @returns {Object} mediana y moda
 */
function notasColegio() {
    let arregloNotasColegio = notasEtapa('primaria').arregloNotas.concat(notasEtapa('secundaria').arregloNotas);
    let mediana = calcularMediana(arregloNotasColegio);
    let moda = calcularModa(arregloNotasColegio);
    return { mediana, moda };
}

/**
 * Extrae las notas de un grado en un arreglo, para así calcular mediana y moda.
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} gradoFiltro grado
 * @returns {Object} mediana y moda
 */
function notasEtapaGrado(etapaEducativa, gradoFiltro) {
    let arregloNotas = [];
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    let grado = obtenerGrado(etapa, gradoFiltro);
    grado.map(curso => curso.estudiantes
        .map(estudiante => estudiante.asignaturas
            .map(asignatura => Object.values(asignatura[Object.keys(asignatura)]).forEach(corte => arregloNotas.push(corte)))
        )
    )
    let mediana = calcularMediana(arregloNotas);
    let moda = calcularModa(arregloNotas);
    return { mediana, moda };
}

/**
 * Extrae las notas de un curso en un arreglo, para así calcular mediana y moda.
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} gradoFiltro grado
 * @param {string} cursoFiltro curso
 * @returns {Object} mediana y moda
 */
function notasEtapaCurso(etapaEducativa, gradoFiltro, cursoFiltro) {
    let arregloNotas = [];
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    let estudiantes = obtenerCurso(etapa, gradoFiltro, cursoFiltro);
    estudiantes.map(estudiante => estudiante.asignaturas
        .map(asignatura => Object.values(asignatura[Object.keys(asignatura)]).forEach(corte => arregloNotas.push(corte)))
    )
    let mediana = calcularMediana(arregloNotas);
    let moda = calcularModa(arregloNotas);
    return { mediana, moda };
}

/**
 * Calcula la media más alta en una materia y respecto a una etapa
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} materia
 * @returns {object} { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje }
 */
function mejorPromedioMateriaEtapa(etapaEducativa, materia) {
    let mayorPuntaje = 0;
    let estudianteMayorPuntaje = null;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    etapa.forEach(grado => grado.map(curso => curso.estudiantes
        .map(estudiante => {
            const promedioEstudiante = estudiante.asignaturas
                .filter(asignatura => asignatura[materia])
                .map(asignatura => Object.values(asignatura[materia]).reduce(reducer) / Object.values(asignatura[materia]).length);
            if (promedioEstudiante[0] > mayorPuntaje) {
                mayorPuntaje = promedioEstudiante[0];
                estudianteMayorPuntaje = estudiante.nombre;
            }
        })
    ));
    return { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje };
};

/**
 * Calcula la media más alta en una materia
 * @param {string} materia
 * @returns {Object} { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje }
 */
function mejorPromedioMateria(materia) {
    if (mejorPromedioMateriaEtapa('primaria', materia).promedio > mejorPromedioMateriaEtapa('secundaria', materia).promedio) {
        return mejorPromedioMateriaEtapa('primaria', materia);
    }
    return mejorPromedioMateriaEtapa('secundaria', materia);
}

/**
 * Calcula la media más alta en la etapa
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @returns {Object} { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje }
 */
function mejorPromedioEtapa(etapaEducativa) {
    let estudianteMayorPuntaje = null;
    let mayorPuntaje = null;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    etapa.forEach(grado => grado.map(curso => curso.estudiantes
        .map(estudiante => {
            const promedioEstudiante = estudiante.asignaturas.map(asignatura => {
                let promedioAsignatura = 0;
                const notasAsignatura = Object.values(asignatura[Object.keys(asignatura)]);
                promedioAsignatura += notasAsignatura.reduce(reducer) / notasAsignatura.length;
                return promedioAsignatura;
            }).reduce(reducer) / estudiante.asignaturas.length;
            if (promedioEstudiante > mayorPuntaje) {
                mayorPuntaje = promedioEstudiante;
                estudianteMayorPuntaje = estudiante.nombre;
            }
        })
    ));
    return { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje };
};

/**
 * Calcula la media más alta en un grado
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} gradoFiltro grado
 * @returns {Object} { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje }
 */
function mejorPromedioEtapaGrado(etapaEducativa, gradoFiltro) {
    let estudianteMayorPuntaje = null;
    let mayorPuntaje = null;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    let grado = obtenerGrado(etapa, gradoFiltro);
    grado.map(curso => curso.estudiantes
        .map(estudiante => {
            const promedioEstudiante = estudiante.asignaturas.map(asignatura => {
                let promedioAsignatura = 0;
                const notasAsignatura = Object.values(asignatura[Object.keys(asignatura)]);
                promedioAsignatura += notasAsignatura.reduce(reducer) / notasAsignatura.length;
                return promedioAsignatura;
            }).reduce(reducer) / estudiante.asignaturas.length;
            if (promedioEstudiante > mayorPuntaje) {
                mayorPuntaje = promedioEstudiante;
                estudianteMayorPuntaje = estudiante.nombre;
            }
        })
    );
    return { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje };
};


/**
 * Calcula la media más alta en un curso
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} gradoFiltro grado
 * @param {string} cursoFiltro curso
 * @returns {Object} { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje }
 */
function mejorPromedioEtapaCurso(etapaEducativa, gradoFiltro, cursoFiltro) {
    let estudianteMayorPuntaje = null;
    let mayorPuntaje = null;
    let etapa = obtenerEtapaEducativa(etapaEducativa);
    let estudiantes = obtenerCurso(etapa, gradoFiltro, cursoFiltro);
    estudiantes.map(estudiante => {
        const promedioEstudiante = estudiante.asignaturas.map(asignatura => {
            let promedioAsignatura = 0;
            promedioAsignatura += Object.values(asignatura[Object.keys(asignatura)]).reduce(reducer)
            return promedioAsignatura;
        }).reduce(reducer);
        if (promedioEstudiante > mayorPuntaje) {
            mayorPuntaje = promedioEstudiante;
            estudianteMayorPuntaje = estudiante.nombre;
        }
    });
    return { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje };
};


/**
 * Calcula la media más alta en el colegio
 * @param {string} etapaEducativa "primaria" | "secundaria"
 * @param {string} gradoFiltro grado
 * @returns {Object} { nombre: estudianteMayorPuntaje, promedio: mayorPuntaje }
 */
function mejorPromedioColegio() {
    const mejorPromedioPrimaria = mejorPromedioEtapa('primaria');
    const mejorPromedioSecundaria = mejorPromedioEtapa('secundaria');
    if (mejorPromedioPrimaria.promedio > mejorPromedioSecundaria.promedio) return mejorPromedioPrimaria;
    return mejorPromedioSecundaria
}

console.log(`La cantidad total de estudiantes que hay en el colegio es: ${totalEstudiantesColegio()}`);
console.log(`La cantidad total de estudiantes que hay en primaria es: ${totalEstudiantesEtapa('primaria')}`);
console.log(`La cantidad total de estudiantes que hay en secundaria es: ${totalEstudiantesEtapa('secundaria')}`);
console.log(`La cantidad de niños que hay en el colegio es: ${totalPorGeneroColegio('male')}`);
console.log(`La cantidad de niñas que hay en el colegio es: ${totalPorGeneroColegio('female')}`);
console.log(`La cantidad de niños que hay en primaria es: ${totalPorGeneroEtapa('primaria', 'male')}`);
console.log(`La cantidad de niñas que hay en primaria es: ${totalPorGeneroEtapa('primaria', 'female')}`);
console.log(`La cantidad de niños que hay en secundaria es: ${totalPorGeneroEtapa('secundaria', 'male')}`);
console.log(`La cantidad de niñas que hay en secundaria es: ${totalPorGeneroEtapa('secundaria', 'female')}`);
console.log(`La media de las notas en el colegio es: ${mediaNotasColegio()}`);
console.log(`La media de las notas en el bachillerato es: ${mediaNotasEtapa('secundaria')}`);
console.log(`La media de las notas en la primaria es: ${mediaNotasEtapa('primaria')}`);
console.log(`La media de las notas de un grado seleccionado por parametro (grado segundo): ${mediaNotasEtapaGrado('primaria', 'segundo')}`);
console.log(`La media de las notas de un curso seleccionado por parametro (grado segundo): ${mediaNotasEtapaCurso('primaria', 'segundo', 'A')}`);
console.log(`La moda de las notas en el colegio: ${notasColegio().moda}`);
console.log(`La moda de las notas en el bachillerato: ${notasEtapa('secundaria').moda}`);
console.log(`La moda de las notas en la primaria: ${notasEtapa('primaria').moda}`);
console.log(`La moda de las notas de un grado seleccionado por parametro (grado tercero): ${notasEtapaGrado('primaria', 'tercero').moda}`);
console.log(`La moda de las notas de un curso seleccionado por parametro (grado tercero B): ${notasEtapaCurso('primaria', 'tercero', 'B').moda}`);
console.log(`La mediana de las notas en el colegio: ${notasColegio().mediana}`);
console.log(`La mediana de las notas en el bachillerato: ${notasEtapa('secundaria').mediana}`);
console.log(`La mediana de las notas en la primaria: ${notasEtapa('primaria').mediana}`);
console.log(`La mediana de las notas de un grado seleccionado por parametro (grado tercero): ${notasEtapaGrado('primaria', 'tercero').mediana}`);
console.log(`La mediana de las notas de un curso seleccionado por parametro (grado tercero B): ${notasEtapaCurso('primaria', 'tercero', 'B').mediana}`);
console.log(`El estudiante con mejor nota en promedio en cada materia (fisica): ${mejorPromedioMateria('fisica').nombre}`);
console.log(`El estudiante con mejor nota en promedio en el curso (grado segundo B): ${mejorPromedioEtapaCurso('primaria', 'segundo', 'B').nombre}`);
console.log(`El estudiante con mejor nota en promedio en el grado (grado segundo): ${mejorPromedioEtapaGrado('primaria', 'segundo').nombre}`);
console.log(`El estudiante con mejor nota en promedio en primaria: ${mejorPromedioEtapa('primaria').nombre}`);
console.log(`El estudiante con mejor nota en promedio en bachillerato: ${mejorPromedioEtapa('secundaria').nombre}`);
console.log(`El estudiante con mejor nota en promedio en el colegio: ${mejorPromedioColegio().nombre}`);
