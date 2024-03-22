import { Especialidad } from "./especialidad.class";
import { Horarios } from "./horarios.class";
import { Usuario } from "./usuario.class";

export class Especialista extends Usuario{
    especialidades!:Array<Especialidad>;
    horarios: Array<Horarios> = [];
}