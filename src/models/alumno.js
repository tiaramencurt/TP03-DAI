class Alumno{
    constructor(username="", dni="", edad=0){
        this.username = username;
        this.dni = dni;
        this.edad = edad;
    }
    toString(){
        return `${this.username} ${this.dni} ${this.edad}`;
    }
}
export default Alumno;