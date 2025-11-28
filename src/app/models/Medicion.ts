import { Planta } from "./Planta"

export class Medicion{
    idMedicion: number = 0; 
    humedad: string = ''; 
    temperatura: string = ''; 
    ph: string = '';
    fecha_med: Date = new Date(); 
    planta: Planta = new Planta(); 
}