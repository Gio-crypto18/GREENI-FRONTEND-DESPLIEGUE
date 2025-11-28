import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Especie } from '../models/Especie';
import { QuantityEspecieDTO } from '../models/QuantityEspecieDTO';
import { environment } from '../../environments/environment';

const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class Especieservice {

  private url=`${base_url}/especies`;
  private listaCambio = new Subject<Especie[]>();
  constructor(private http: HttpClient) {}
  
  list(){
    return this.http.get<Especie[]>(this.url);
  }

  insert(d: Especie) {
    return this.http.post(this.url, d);
  }

  setList(listaNueva: Especie[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number){
    return this.http.get<Especie>(`${this.url}/${id}`);
  }
  update(r: Especie) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
   getQuantity(): Observable<QuantityEspecieDTO[]> {
    return this.http.get<QuantityEspecieDTO[]>(`${this.url}/cantidadespecie`);
  }
}
