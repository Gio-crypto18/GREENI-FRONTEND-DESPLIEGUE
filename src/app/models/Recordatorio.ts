import { EstadoRecordatorio } from "./EstadoRecordatorio";
import { Usuario } from "./Usuario";

export class Recordatorio{
    idRecordatorio:number = 0
    nombre:number =0
    tipo:string =""
    fechaRe:Date =new Date()
    usuario:Usuario =new Usuario();
    estado:EstadoRecordatorio =new EstadoRecordatorio ();
}