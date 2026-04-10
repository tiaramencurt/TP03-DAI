import express from "express";
import cors from "cors";
import Alumno from "./models/alumno.js";
import {sumar, restar, multiplicar, dividir} from "./modules/matematica.js";
import {OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID} from "./modules/omdb-wrapper.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
    res.status(200).send("Ya estoy respondiendo!");
});

app.get('/saludar/:nombre',(req,res)=>{
    res.status(200).send("Hola " + req.params.nombre);
});

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

app.get('/matematica/sumar',(req,res)=>{
    let n1 = Number(req.query.n1);
    let n2 = Number(req.query.n2);
    res.status(200).send({
        resultado: sumar(n1,n2)
    });
});



app.listen(port,()=>{
    console.log("Server corriendo");
});