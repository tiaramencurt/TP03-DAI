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

app.get('/matematica/dividir',(req,res)=>{
    let n1 = Number(req.query.n1);
    let n2 = Number(req.query.n2);
    if(n2 == 0){
        res.status(400).send("El divisor no puede ser cero");
        return;
    }
    res.status(200).send({
        resultado: dividir(n1,n2)
    });
});

app.get('/omdb/searchcomplete', async (req,res)=>{
    let search = req.query.search;
    let resultado = await OMDBSearchComplete(search);
    res.status(200).send(resultado);
});

const alumnosArray = [];

alumnosArray.push(new Alumno("Esteban Dido","22888444",20));
alumnosArray.push(new Alumno("Matias Queroso","28946255",51));
alumnosArray.push(new Alumno("Elba Calao","32623391",18));

app.get('/alumnos',(req,res)=>{
    res.status(200).send(alumnosArray);
});

app.get('/alumnos/:dni',(req,res)=>{
    let alumno = alumnosArray.find(a=>a.dni==req.params.dni);
    if(alumno){
        res.status(200).send(alumno);
    }
    else{
        res.status(404).send("Alumno no encontrado");
    }
});

app.post('/alumnos',(req,res)=>{
    let nuevoAlumno = new Alumno(
        req.body.username,
        req.body.dni,
        req.body.edad
    );
    alumnosArray.push(nuevoAlumno);
    res.status(201).send("Alumno creado");
});

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
    console.log("Server corriendo");
});