import { Encuesta } from "./encuesta.class";
import { Especialidad } from "./especialidad.class";
import { Especialista } from "./especialista.class";
import { HistoriaClinica } from "./historia-clinica.class";
import { Paciente } from "./paciente.class";

export class Turno {

    id?: string;
    fecha!: string;
    horaInicio!: string;
    horaFinal!: string;
    duracion!: number;
    fechaInicio!: number;
    fechaFinal!: number;
    estadoTurno: string = "Libre";
    paciente!: Paciente;
    comentarioPaciente: string = "";
    encuestaPaciente!: Encuesta;
    calificacionPaciente: string = "";
    especialista!: Especialista;
    especialidad!: Especialidad;
    comentarioEspecialista: string = "";
    diagnosticoEspecialista: string = "";
    comentarioAdministrador: string = "";
    historiaClinica!: HistoriaClinica;
}