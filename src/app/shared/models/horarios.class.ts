import { Especialidad } from "./especialidad.class";

export class Horarios {
    dia!: string;
    diaNumero!: number;
    duracion!: number;
    horaInicio!: number;
    horaFinal!: number;
    especialidad!: Especialidad;
    id?: string;
}