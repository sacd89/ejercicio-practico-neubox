const fs = require('fs');

/**
 * Método que tiene la logica principal para resolver el siguiente problema como entrada un archivo de texto:
 * 
 * El metodo recibe un archivo de texto que contiene dos instrucciones y un mensaje,
 * y el resultado debe ser si existe o no una instrucción escondida en el mensaje
 * 
 *  La primera línea son tres enteros M1, M2 y N. M1 y M2 es el número de 
 *  caracteres de las dos instrucciones y N es el número de caracteres en el 
 *  mensaje. 
 *  ▪ N siempre estará entre 3 y 5000 inclusive
 *  ▪ M1 y M2 siempre estarán entre 2 y 50 inclusive
 *  o La segunda línea contiene la primera instrucción
 *  o La tercera línea contiene la segunda instrucción
 *  o La cuarta línea contiene el mensaje
 *   ▪ Los caracteres posibles en el mensaje son [a-zA-Z0-9]
 * 
 * Se realizan las validaciones correspondientes para seguir la regla de que el mensaje no contenga dos letras iguales seguidas
 * en caso de que se detecte.
 * 
 * Se genera el nuevo archivo con la respuesta siendo la primera linea del archivo la respuesta de si la primera instrucción
 * se encuentra escondida en el mensaje, la segunda linea del archivo la respuesta de si la segunda instrucción
 * se encuentra escondida en el mensaje.
 * 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.problem1 = (req, res) => {
    if (req.files && req.files.fileUpload) {
        const file = req.files.fileUpload;

        const data = file.data.toString('utf8');
        const lines = data.split('\n');

        if(lines.length < 3 || lines.length > 4) {
            return res.render('index', { error: 'Formato de archivo incorrecto', errorProblem2: null, resultProblem1: null, resultProblem2: null });
        }

        const numbers = lines[0].split(' ');
        const firstInstruction = lines[1];
        const secondInstruction = lines[2];
        const message = lines[3];

        if(!message.match(/^[a-zA-Z0-9_-]*$/)) {
            console.log("PERRITO");
            return res.render('index', { error: 'Error en formato de mensaje', errorProblem2: null, resultProblem1: null, resultProblem2: null });

        }

        const m1 = numbers[0]
        const m2 = numbers[1];
        const n = numbers[2];

        if ((m1 < 2 || m1 > 50)) {
            return res.render('index', { error: 'M1 no esta entre el rango de 2 a 50.', errorProblem2: null, resultProblem1: null, resultProblem2: null });

        }

        if ((m2 < 2 || m2 > 50)) {
            return res.render('index', { error: 'M2 no esta entre el rango de 2 a 50.', errorProblem2: null, resultProblem1: null, resultProblem2: null });

        }

        if (n < 3 || n > 5000) {
            return res.render('index', { error: 'N no esta entre el rango de 3 a 5000.', errorProblem2: null, resultProblem1: null, resultProblem2: null });
        }

        const messageHasError = message.split("").some((v, i, a) => {
            return v === a[i++];
        });

        let finalMessage = message;

        const ejemplo = Array.from(message);

        if (messageHasError) {

            const messageArray = [];
            ejemplo.forEach((a, i) => {
                if (_checkLetter(ejemplo, a, i)) {
                    messageArray.push(a);
                }
            })
            finalMessage = messageArray.join('');
        }

        let finalContent = '';

        if (finalMessage.includes(firstInstruction)) {
            finalContent += 'SI\n';
        } else {
            finalContent += 'NO\n';
        }

        if (finalMessage.includes(secondInstruction)) {
            finalContent += 'SI\n';
        } else {
            finalContent += 'NO\n';
        }

        return _generateFileProblem1(res, finalContent);

    }
    return res.render('index', { error: 'No se encontro un archivo que leer.', errorProblem2: null, resultProblem1: null, resultProblem2: null });

};

/**
 * Método que generá el archivo dentro de la carpeta results para el problema 1.
 */
_generateFileProblem1 = (res, finalContent) => {
    if (!fs.existsSync('./results')) {
        fs.mkdirSync('./results');
    }

    fs.writeFile('./results/problem1.txt', finalContent, err => {
        if (err) {
            return res.render('index', { error: 'Ocurrio un error al generar el archivo', errorProblem2: null, resultProblem1: null, resultProblem2: null });

        }

        return res.render('index', {resultProblem1: finalContent, errorProblem2: null, error: null, resultProblem2: null});
    });
};

/**
 * Método que revisa el array en forma de loop en caso de que se encuentre mas de 2 letras seguidas iguales.
 * Regresa true en caso de que el proceso se encuentre terminado y no encuentre mas letras seguidas iguales.
 * 
 * @param {*} array Array con todas las letras dentro del mensaje
 * @param {*} m Letra especifica dentro del array. 
 * @param {*} i Posicion en el array de m. 
 */
_checkLetter = (array, m, i) => {
    const newI = i + 1;
    if (m !== array[newI]) {

        return true;

    } else {
        _checkLetter([...array], m, newI);
    }
};

/**
 * Método que descarga el archivo del problema 1 o 2 dependiento de la variable problem enviada en el body.
 * @param {*} req 
 * @param {*} res 
 */
exports.dowloadFile = (req, res) => {
    const file = `./results/problem${req.body.problem}.txt`;
    res.download(file);
};