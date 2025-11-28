import { Rol } from "./Rol"

export class Usuario{
    id:number = 0
    nombre:string =""
    email:string =""
    password:string =""
    activo:boolean =false
    fechaIni:Date =new Date()
    biografia:string =""
    rol:Rol =new Rol();
}