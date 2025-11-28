import { Diagnostico } from "./Diagnostico";
import { Especie } from "./Especie";
import { Usuario } from "./Usuario";

export class Planta {
    idPlanta: number = 0;
    fecha_reg: Date = new Date();
    imagen: boolean = false;
    nombrePlanta: string = "";
    especie:Especie =new Especie();
    usuario:Usuario =new Usuario();
    diagnostico:Diagnostico =new Diagnostico();
}