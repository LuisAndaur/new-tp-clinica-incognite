export class HistoriaClinica {
    altura!: number;
    peso!: number;
    temperatura!: number;
    presion!: number;
    d1: Dinamico = new Dinamico();
    d2: Dinamico = new Dinamico();
    d3: Dinamico = new Dinamico();
    d4: Dinamico = new Dinamico();
    d5: Dinamico = new Dinamico();
    d6: Dinamico = new Dinamico();
}

export class Dinamico{
    clave!:string;
    valor!:string;
}