export class Usuario{
    id!:string;
    fechaRegistro: number = new Date().getTime();
    nombre!:string;
    apellido!:string;
    edad!:number;
    dni!:string;
    email!:string;
    password!:string;
    img:any;
    tipo!:string;
    estado!:string;
}