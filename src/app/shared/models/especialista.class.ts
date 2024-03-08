import { Especialidad } from "./especialidad.class";
import { Usuario } from "./usuario.class";

export class Especialista extends Usuario{
    especialidades!:Array<Especialidad>;
    
}