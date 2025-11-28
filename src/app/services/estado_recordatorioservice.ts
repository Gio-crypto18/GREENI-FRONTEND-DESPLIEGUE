import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { EstadoRecordatorio } from '../models/EstadoRecordatorio';
import { CantidadRecordatorioPorEstadoDTO } from '../models/CantidadRecordatorioPorEstadoDTO';
import { environment } from '../../environments/environment';



const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class EstadoRecordatorioservice {

  private url=`${base_url}/estado_recordatorio`;
  private listaCambio = new Subject<EstadoRecordatorio[]>();
  constructor(private http: HttpClient) {}
  
  list(){
    return this.http.get<EstadoRecordatorio[]>(this.url);
  }

  insert(d: EstadoRecordatorio) {
    return this.http.post(this.url, d);
  }

  setList(listaNueva: EstadoRecordatorio[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number){
    return this.http.get<EstadoRecordatorio>(`${this.url}/${id}`);
  }
  update(r: EstadoRecordatorio) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  getAmount():Observable<CantidadRecordatorioPorEstadoDTO[]>{
    return this.http.get<CantidadRecordatorioPorEstadoDTO[]>(`${this.url}/cantidadporestado`)
  }
}
