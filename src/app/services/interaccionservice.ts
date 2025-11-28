import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Interaccion } from '../models/Interaccion';
import { ResumenInteraccionDTO } from '../models/ResumenInteraccionDTO';
import { TopInteraccionDTO } from '../models/TopInteraccionDTO';
import { environment } from '../../environments/environment';



const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class Interaccionservice {

  private url=`${base_url}/interaccion`;
  private listaCambio = new Subject<Interaccion[]>();
  constructor(private http: HttpClient) {}
  
  list(){
    return this.http.get<Interaccion[]>(this.url);
  }

  insert(d: Interaccion) {
    return this.http.post(this.url, d);
  }

  setList(listaNueva: Interaccion[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number){
    return this.http.get<Interaccion>(`${this.url}/${id}`);
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
   resumen():Observable<ResumenInteraccionDTO[]>{
    return this.http.get<ResumenInteraccionDTO[]>(`${this.url}/resumen`);
  }
  top():Observable<TopInteraccionDTO[]>{
    return this.http.get<TopInteraccionDTO[]>(`${this.url}/top`);
  }
}
