class DateTimeHelper {

    isDate = (fecha) => {
        return fecha instanceof Date && !isNaN(fecha.getTime());
    };

    getOnlyDate = (fecha = new Date()) => {
        let copia = new Date(fecha);
        copia.setHours(0, 0, 0, 0);
        return copia;
    };

    getEdadActual = (fechaNacimiento) => {
        if (!this.isDate(fechaNacimiento)) {
            return -1;
        }
        let hoy = new Date();
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        let mesActual = hoy.getMonth();
        let diaActual = hoy.getDate();
        let mesNac = fechaNacimiento.getMonth();
        let diaNac = fechaNacimiento.getDate();
        if (mesActual < mesNac || (mesActual === mesNac && diaActual < diaNac)) {
            edad--;
        }
        return edad;
    };

    getDiasHastaMiCumple = (fechaNacimiento) => {
        if (!this.isDate(fechaNacimiento)) {
            return -1;
        }
        let hoy = this.getOnlyDate(new Date());
        let proximoCumple = new Date(hoy.getFullYear(), fechaNacimiento.getMonth(), fechaNacimiento.getDate());
        if (proximoCumple < hoy) {proximoCumple.setFullYear(proximoCumple.getFullYear() + 1);
        }
        let diferencia = proximoCumple.getTime() - hoy.getTime();
        let dias = Math.ceil(diferencia / (1000 * 60 * 60 * 24));
        return dias;
    };

    getDiaTexto = (fecha, retornarAbreviacion = false) => {
        if (!this.isDate(fecha)) {
            return "";
        }
        const dias = [
            "Domingo",
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado"
        ];
        const diasAbr = [
            "Dom",
            "Lun",
            "Mar",
            "Mié",
            "Jue",
            "Vie",
            "Sáb"
        ];
        if (retornarAbreviacion) {
            return diasAbr[fecha.getUTCDay()];
        }
        return dias[fecha.getUTCDay()];
    };

    getMesTexto = (fecha, retornarAbreviacion = false) => {
        if (!this.isDate(fecha)) {
            return "";
        }
        const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        ];
        const mesesAbr = [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic"
        ];
        if (retornarAbreviacion) {
            return mesesAbr[fecha.getMonth()];
        }
        return meses[fecha.getMonth()];
    };
}
export default new DateTimeHelper();

