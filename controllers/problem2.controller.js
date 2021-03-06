const fs = require('fs');

/**
 * Método que tiene la logica principal para resolver el siguiente problema:
 * 
 * El metodo recibe un archivo de texto con los marcadores y deberá indicar el ganador
 * (no hay empates, se puede asumir siempre existe un ganador único)
 * 
 *  o La primer línea es un entero menor o igual a 10000 indicando el número de rondas
 *  o Después hay una línea por ronda con los marcadores de los dos jugadores
 * 
 * Se verifican los puntos por ronda y se obtiene el puntaje mayor para obtener la diferencia de puntos
 * y el ganador de la ronda, sacando la diferencia mayor de los dos jugadores y revisando cual es mayor.
 * 
 * La salida del programa es un archivo que contiene una línea
 *  o Esta línea contiene dos enteros, el primer entero es 1 o 2 indicando quien fue el ganador,
 *      y el segundo entero es la ventaja con la que gana ese jugador
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.problem2 = (req, res) => {
    if (req.files && req.files.fileUpload) {
        const file = req.files.fileUpload;

        const data = file.data.toString('utf8');
        const lines = data.split('\n');
        const roundsNumber = +lines[0];
        const points = [...lines].splice(1);

        const totalRounds = points.length;

        const numberRegex = /^[0-9]*$/;

        if(!lines[0].match(numberRegex)) {
            return res.render('index', { errorProblem2: 'Caracteres invalidos en el número de rondas indicadas.', errorProblem1: null, resultProblem1: null, resultProblem2: null });
        }

        if(roundsNumber < 0 || roundsNumber > 10000) {
            return res.render('index', { errorProblem2: 'El número de rondas debe de ser mayor a 0 y menor o igual a 10000.', errorProblem1: null, resultProblem1: null, resultProblem2: null });
        }

        if(totalRounds !== roundsNumber) {
            return res.render('index', { errorProblem2: 'El número de rondas encontrado no coincide con los ingresados en el archivo.', errorProblem1: null, resultProblem1: null, resultProblem2: null });
        }

        const differenceRoundes = [];

        points.forEach(p => {
            let results = p.split(' ');
            
            if(!results[0].match(numberRegex) || !results[1].match(numberRegex)) {
                return res.render('index', { errorProblem2: 'Caracteres invalidos en los puntajes de las rondas.', errorProblem1: null, resultProblem1: null, resultProblem2: null });
            }

            results = results.map(Number);
            const playerWinner = results.indexOf(Math.max(...results)) + 1;
            differenceRoundes.push([playerWinner, Math.abs(results[0] - results[1])]);

        });

        const maxPoint = differenceRoundes.map(e => Math.max.apply(null, e));
        const winner = differenceRoundes[maxPoint.indexOf(Math.max(...maxPoint))];

        const finalContent = winner.join(' ');

        return _generateFileProblem2(res, finalContent);

    }
    return res.render('index', { errorProblem2: 'No se encontro un archivo que leer.', errorProblem1: null, resultProblem1: null, resultProblem2: null });

};

_generateFileProblem2 = (res, finalContent) => {
    if (!fs.existsSync('./results')) {
        fs.mkdirSync('./results');
    }

    fs.writeFile('./results/problem2.txt', finalContent, err => {
        if (err) {
            res.render('index', { errorProblem2: 'Ocurrio un error al generar el archivo', errorProblem1: null, resultProblem1: null, resultProblem2: null });

        }

        res.render('index', {resultProblem2: finalContent, errorProblem1: null, errorProblem2: null, resultProblem1: null});
    });
};

/**
 * Método que generá el archivo dentro de la carpeta results para el problema 2.
 */
exports.dowloadFile = (req, res) => {
    const file = `./results/problem${req.body.problem}.txt`;
    res.download(file);
};