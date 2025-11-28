import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Recordatorio } from '../models/Recordatorio';
import { QuantityRecordatorioDTO } from '../models/QuantityRecordatorioDTO';
import { environment } from '../../environments/environment';



const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class Recordatorioservice {

  private url=`${base_url}/recordatorio`;
  private listaCambio = new Subject<Recordatorio[]>();
  constructor(private http: HttpClient) {}
  
  list(){
    return this.http.get<Recordatorio[]>(this.url);
  }

  insert(d: Recordatorio) {
    return this.http.post(this.url, d);
  }

  setList(listaNueva: Recordatorio[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number){
    return this.http.get<Recordatorio>(`${this.url}/${id}`);
  }
  update(r: Recordatorio) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  getQuantity():Observable<QuantityRecordatorioDTO[]>{
    return this.http.get<QuantityRecordatorioDTO[]>(`${this.url}/cantidadtipo`)
  }
}
