import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { GiovanniDTO } from '../models/GiovanniDTO';
import { Giovanni2DTO } from '../models/Giovanni2DTO';
import { environment } from '../../environments/environment';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class Usuarioservice {

  private url=`${base_url}/usuarios`;
  
  private listaCambio = new Subject<Usuario[]>();
  constructor(private http: HttpClient) {}
  
  list(){
    return this.http.get<Usuario[]>(this.url);
  }

  insert(d: Usuario) {
    return this.http.post(`${this.url}/insertar`, d); 
  }

  setList(listaNueva: Usuario[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number){
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }
  update(r: Usuario) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
  getQuantity(): Observable<GiovanniDTO[]> {
    return this.http.get<GiovanniDTO[]>(`${this.url}/reporte-rol`);
  }
  getActive(): Observable<Giovanni2DTO[]> {
    return this.http.get<Giovanni2DTO[]>(`${this.url}/reporte-activo`);
  }
}
