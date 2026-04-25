import express from "express";
import cors from "cors";
import Alumno from "./models/alumno.js";
import {sumar, restar, multiplicar, dividir} from "./modules/matematica.js";
import {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID} from "./modules/omdb-wrapper.js";
import ValidacionesHelper from "./modules/validaciones-helper.js";
import DateTimeHelper from "./modules/datetime-helper.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//a1
app.get('/', (req,res)=>{
    res.status(200).send("Ya estoy respondiendo!");
});

//a2
app.get("/saludar/:nombre", (req, res) => {
    let nombre = ValidacionesHelper.getStringOrDefault(req.params.nombre, "Anónimo");
    res.status(200).send("Hola " + nombre);
});


//a3
app.get("/validarfecha/:ano/:mes/:dia", (req, res) => {
    let ano = ValidacionesHelper.getIntegerOrDefault(req.params.ano, 0);
    let mes = ValidacionesHelper.getIntegerOrDefault(req.params.mes, 0);
    let dia = ValidacionesHelper.getIntegerOrDefault(req.params.dia, 0);
    if (ano === 0 || mes === 0 || dia === 0) {
        res.status(400).send("Fecha inválida");
        return;
    }
    let fecha = new Date(ano, mes, dia);
    if (!DateTimeHelper.isDate(fecha)) {
        res.status(400).send("Fecha inválida");
        return;
    }
    res.status(200).send("Fecha válida");
});


//b1
app.get("/matematica/sumar", (req, res) => {
    let n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    let n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);
    if (n1 === null || n2 === null) {
        res.status(400).send("n1 y n2 tienen que ser números");
        return;
    }
    res.status(200).send({
        resultado: sumar(n1, n2)
    });
});


//b2
app.get("/matematica/restar", (req, res) => {
    let n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    let n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);
    if (n1 === null || n2 === null) {
        res.status(400).send("n1 y n2 tienen que ser números");
        return;
    }
    res.status(200).send({
        resultado: restar(n1, n2)
    });
});


//b3
app.get("/matematica/multiplicar", (req, res) => {
    let n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    let n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);
    if (n1 === null || n2 === null) {
        res.status(400).send("n1 y n2 tienen que ser números");
        return;
    }
    res.status(200).send({
        resultado: multiplicar(n1, n2)
    });
});


//b4
app.get("/matematica/dividir", (req, res) => {
    let n1 = ValidacionesHelper.getIntegerOrDefault(req.query.n1, null);
    let n2 = ValidacionesHelper.getIntegerOrDefault(req.query.n2, null);
    if (n1 === null || n2 === null) {
        res.status(400).send("n1 y n2 tienen que ser números");
        return;
    }
    if (n2 === 0) {
        res.status(400).send("El divisor no puede ser cero");
        return;
    }
    res.status(200).send({
        resultado: dividir(n1, n2)
    });
});

// c1
app.get("/omdb/searchbypage", async (req, res) => {
    let search = ValidacionesHelper.getStringOrDefault(req.query.search, "");
    let p = ValidacionesHelper.getIntegerOrDefault( req.query.p, 1);
    let resultado = await OMDBSearchByPage(search, p);
    res.status(200).send(resultado);
});

// c2
app.get("/omdb/searchcomplete", async (req, res) => {
    let search = ValidacionesHelper.getStringOrDefault(req.query.search, "");
    if (search === "") {res.status(400).send("Falta search"); return;
    }
    let resultado = await OMDBSearchComplete(search);
    res.status(200).send(resultado);
});


// c3
app.get("/omdb/getbyimdbid", async (req, res) => {
    let imdbID = ValidacionesHelper.getStringOrDefault(req.query.imdbID, "");
    if (imdbID === "") {
        res.status(400).send("Falta imdbID");
        return;
    }
    let resultado = await OMDBGetByImdbID(imdbID);
    res.status(200).send(resultado);
});



//d
const alumnosArray = [];
alumnosArray.push(new Alumno("Esteban Dido","22888444",20));
alumnosArray.push(new Alumno("Matias Queroso","28946255",51));
alumnosArray.push(new Alumno("Elba Calao","32623391",18));

//d1
app.get('/alumnos',(req,res)=>{
    res.status(200).send(alumnosArray);
});

//d2
app.get("/alumnos/:dni", (req, res) => {
    let dni = ValidacionesHelper.getStringOrDefault(req.params.dni, "");
    let alumno = alumnosArray.find(a => a.dni == dni);
    if (alumno) {
        res.status(200).send(alumno);
    } else {
        res.status(404).send("Alumno no encontrado");
    }
});



app.use(express.urlencoded({extend:true}));

//d3
app.post("/alumnos", (req, res) => {
    let username = ValidacionesHelper.getStringOrDefault(req.body.username,"");
    let dni = ValidacionesHelper.getStringOrDefault(req.body.dni, "");
    let edad = ValidacionesHelper.getIntegerOrDefault(req.body.edad,0);
    if (username === "" || dni === "" || edad <= 0) {
        res.status(400).send("Datos inválidos");
        return;
    }
    let nuevoAlumno = new Alumno(username, dni, edad);
    alumnosArray.push(nuevoAlumno);
    res.status(201).send("Alumno creado");
});


//d4
app.delete("/alumnos", (req, res) => {
    let dni = ValidacionesHelper.getStringOrDefault(req.body.dni,"");
    let index = alumnosArray.findIndex(a => a.dni == dni);
    if (index >= 0) {
        alumnosArray.splice(index, 1);
        res.status(200).send("Alumno eliminado");
    } else {
        res.status(404).send("Alumno no encontrado");
    }
});

app.get("/fechas/isDate", (req, res) => {
    let fecha = ValidacionesHelper.getDateOrDefault(
        req.query.fecha,
        null
    );

    res.status(200).send({
        valido: DateTimeHelper.isDate(fecha)
    });
});

app.get("/fechas/getEdadActual", (req, res) => {
    let fechaNacimiento =
        ValidacionesHelper.getDateOrDefault(
            req.query.fechaNacimiento,
            null
        );

    if (!DateTimeHelper.isDate(fechaNacimiento)) {
        res.status(400).send("Fecha inválida");
        return;
    }

    res.status(200).send({
        edad: DateTimeHelper.getEdadActual(
            fechaNacimiento
        )
    });
});

app.get("/fechas/getDiasHastaMiCumple", (req, res) => {
    let fechaNacimiento =
        ValidacionesHelper.getDateOrDefault(
            req.query.fechaNacimiento,
            null
        );

    if (!DateTimeHelper.isDate(fechaNacimiento)) {
        res.status(400).send("Fecha inválida");
        return;
    }

    res.status(200).send({
        diasRestantes:
            DateTimeHelper.getDiasHastaMiCumple(
                fechaNacimiento
            )
    });
});

app.get("/fechas/getDiaTexto", (req, res) => {
    let fecha = ValidacionesHelper.getDateOrDefault(
        req.query.fecha,
        null
    );

    let abr =
        ValidacionesHelper.getBooleanOrDefault(
            req.query.abr,
            false
        );

    if (!DateTimeHelper.isDate(fecha)) {
        res.status(400).send("Fecha inválida");
        return;
    }

    res.status(200).send({
        dia: DateTimeHelper.getDiaTexto(
            fecha,
            abr
        )
    });
});

app.get("/fechas/getMesTexto", (req, res) => {
    let fecha = ValidacionesHelper.getDateOrDefault(
        req.query.fecha,
        null
    );

    let abr =
        ValidacionesHelper.getBooleanOrDefault(
            req.query.abr,
            false
        );

    if (!DateTimeHelper.isDate(fecha)) {
        res.status(400).send("Fecha inválida");
        return;
    }

    res.status(200).send({
        mes: DateTimeHelper.getMesTexto(
            fecha,
            abr
        )
    });
});

app.listen(port,()=>{
    console.log(`Listening on http://localhost:${port}`);
});