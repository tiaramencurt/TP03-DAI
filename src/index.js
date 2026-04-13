import express from "express";
import cors from "cors";
import Alumno from "./models/alumno.js";
import {sumar, restar, multiplicar, dividir} from "./modules/matematica.js";
import {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID} from "./modules/omdb-wrapper.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//a1
app.get('/', (req,res)=>{
    res.status(200).send("Ya estoy respondiendo!");
});

//a2
app.get('/saludar/:nombre',(req,res)=>{
    res.status(200).send("Hola " + req.params.nombre);
});

//a3
app.get('/validarfecha/:ano/:mes/:dia',(req,res)=>{
    let fecha = req.params.ano + "-" + req.params.mes + "-" + req.params.dia;
    console.log(fecha)
    let resultado = Date.parse(fecha);
    if(isNaN(resultado)){
        res.status(400).send("Fecha inválida");
    }
    else{
        res.status(200).send("Fecha válida");
    }
});

//b1
app.get('/matematica/sumar',(req,res)=>{
    let n1 = Number(req.query.n1);
    let n2 = Number(req.query.n2);
    res.status(200).send(sumar(n1,n2));
});

//b2
app.get('/matematica/restar',(req,res)=>{
    let n1 = Number(req.query.n1);
    let n2 = Number(req.query.n2);
    res.status(200).send(restar(n1,n2));
});

//b3
app.get('/matematica/multiplicar',(req,res)=>{
    let n1 = Number(req.query.n1);
    let n2 = Number(req.query.n2);
    res.status(200).send(multiplicar(n1,n2));
});

//b4
app.get('/matematica/dividir',(req,res)=>{
    let n1 = Number(req.query.n1);
    let n2 = Number(req.query.n2);
    if(n2 == 0){
        res.status(400).send("El divisor no puede ser cero");
        return;
    }
    res.status(200).send(dividir(n1,n2));
});

// c1
app.get('/omdb/searchbypage', async (req, res) => {
  const search = req.query.search;
  const p      = req.query.p;

  try {
    const resultado = await OMDBSearchByPage(search, p);
    res.status(200).send(resultado);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send({ respuesta: false, cantidadTotal: 0, datos: [] });
  }
});

// c2
app.get('/omdb/searchcomplete', async (req, res) => {
  const search = req.query.search;

  try {
    const resultado = await OMDBSearchComplete(search);
    res.status(200).send(resultado);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send({ respuesta: false, cantidadTotal: 0, datos: [] });
  }
});

// c3
app.get('/omdb/getbyomdbid', async (req, res) => {
  const imdbID = req.query.imdbID;

  try {
    const resultado = await OMDBGetByImdbID(imdbID);
    res.status(200).send(resultado);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send({ respuesta: false, datos: null });
  }
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
app.get('/alumnos/:dni',(req,res)=>{
    let alumno = alumnosArray.find(a=>a.dni==req.params.dni);
    if(alumno){
        res.status(200).send(alumno);
    }
    else{
        res.status(404).send("Alumno no encontrado");
    }
});


app.use(express.urlencoded({extend:true}));

//d3
app.post('/alumnos', (req, res) => {
    const { username, dni, edad } = req.body;
    if (!username || !dni || !edad) {
        return res.status(400).send("Faltan datos");
    }
    const existe = alumnosArray.find(alumno => alumno.dni === dni);
    if (existe) {
        return res.status(400).send("Ya existía");
    }
    let nuevoAlumno = new Alumno(username, dni, edad);
    alumnosArray.push(nuevoAlumno);
    res.status(200).send("Alumno creado");
});

//d4
app.delete('/alumnos',(req,res)=>{
    let index = alumnosArray.findIndex(a=>a.dni==req.body.dni);
    if(index>=0){
        alumnosArray.splice(index,1);
        res.status(200).send("Alumno eliminado");
    }
    else{
        res.status(404).send("Alumno no encontrado");
    }
});

app.listen(port,()=>{
    console.log(`Listening on http://localhost:${port}`);
});