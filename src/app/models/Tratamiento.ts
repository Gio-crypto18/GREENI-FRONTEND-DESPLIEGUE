import { Diagnostico } from "./Diagnostico"

export class Tratamiento{
    idTratamiento:number = 0
    nombre:string =""
    duracion:number =0
    fechainicio:Date =new Date()
    fechafin:Date =new Date()
    diagnostico:Diagnostico =new Diagnostico();
}