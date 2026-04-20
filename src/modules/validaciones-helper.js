class ValidacionesHelper {

    getIntegerOrDefault = (value, defaultValue) => {
        let numero = parseInt(value);

        if (isNaN(numero)) {
            return defaultValue;
        }

        return numero;
    };

    getStringOrDefault = (value, defaultValue) => {
        if (value === undefined || value === null) {
            return defaultValue;
        }

        return String(value);
    };

    getDateOrDefault = (value, defaultValue) => {
        if (value === undefined || value === null) {
            return defaultValue;
        }

        let fecha = new Date(value);

        if (isNaN(fecha.getTime())) {
            return defaultValue;
        }

        return fecha;
    };

    getBooleanOrDefault = (value, defaultValue) => {
        if (value === true || value === false) {
            return value;
        }

        if (value === undefined || value === null) {
            return defaultValue;
        }

        let texto = String(value).toLowerCase();

        if (texto === "true") {
            return true;
        }

        if (texto === "false") {
            return false;
        }

        return defaultValue;
    };

    isEmail = (value) => {
        if (value === undefined || value === null) {
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(value);
    };

}

export default new ValidacionesHelper();

