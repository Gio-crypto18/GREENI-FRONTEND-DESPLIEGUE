import { TipoInteraccion  } from "./TipoInteraccion"
import { Usuario } from "./Usuario"

export class Interaccionm{
    interaccion_id:number = 0
    descripcion:string =""
    tipointeraccion:TipoInteraccion = new TipoInteraccion();
    fecha_pub:Date =new Date()
    usuario:Usuario =new Usuario();
}