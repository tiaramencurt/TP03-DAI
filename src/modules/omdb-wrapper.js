import axios from "axios";

const APIKEY = "fd5f9e56";

const OMDBSearchByPage = async (searchText, page = 1) => {
    let returnObject = {
        respuesta: false,
        cantidadTotal: 0,
        datos: []
    };
    try {
        const requestString = `http://www.omdbapi.com/?apikey=${APIKEY}&s=${searchText}&page=${page}`;
        const apiResponse = await axios.get(requestString);
        if (apiResponse.data.Response === "True") {
            returnObject.respuesta = true;
            returnObject.cantidadTotal = parseInt(apiResponse.data.totalResults);
            returnObject.datos = apiResponse.data.Search;
        }
    }
    catch (error) {
        returnObject.respuesta = false;
    }
    return returnObject;
};

const OMDBSearchComplete = async (searchText) => {
    let returnObject = {
        respuesta: false,
        cantidadTotal: 0,
        datos: []
    };
    try {
        const firstPage = await OMDBSearchByPage(searchText, 1);
        if (!firstPage.respuesta) {
            return returnObject;
        }
        returnObject.respuesta = true;
        returnObject.cantidadTotal = firstPage.cantidadTotal;
        returnObject.datos = [];
        // Copiamos los datos de la primera página al array final
        for (let i = 0; i < firstPage.datos.length; i++) {
            returnObject.datos.push(firstPage.datos[i]);
        }
        let totalPages = Math.ceil(firstPage.cantidadTotal / 10);
        // Recorremos desde la página 2 hasta la última
        for (let i = 2; i <= totalPages; i++) {
            let pageData = await OMDBSearchByPage(searchText, i);
            for (let j = 0; j < pageData.datos.length; j++) {
                returnObject.datos.push(pageData.datos[j]);
            }
        }
    }
    catch (error) {
        returnObject.respuesta = false;
    }
    return returnObject;
};



const OMDBGetByImdbID = async (imdbID) => {
    let returnObject = {
        respuesta: false,
        cantidadTotal: 0,
        datos: {}
    };
    try {
        const requestString = `http://www.omdbapi.com/?apikey=${APIKEY}&i=${imdbID}`;
        const apiResponse = await axios.get(requestString);
        if (apiResponse.data.Response === "True") {
            returnObject.respuesta = true;
            returnObject.cantidadTotal = 1;
            returnObject.datos = apiResponse.data;
        }
    }
    catch (error) {
        returnObject.respuesta = false;
    }
    return returnObject;
};



export {
    OMDBSearchByPage,
    OMDBSearchComplete,
    OMDBGetByImdbID
};