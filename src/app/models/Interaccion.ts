import { TipoInteraccion  } from "./TipoInteraccion"
import { Usuario } from "./Usuario"

export class Interaccion{
    interaccion_id:number = 0
    descripcion:string =""
    tipoInteraccion:TipoInteraccion = new TipoInteraccion();
    fecha_pub:Date =new Date()
    usuario:Usuario =new Usuario();
}