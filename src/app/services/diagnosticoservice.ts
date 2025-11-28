import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Diagnostico } from '../models/Diagnostico';
import { QuantityDTO } from '../models/QuantityDTO';
import { environment } from '../../environments/environment';


const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class Diagnosticoservice {

  [x: string]: any;
  private url=`${base_url}/diagnostico`;
  private listaCambio = new Subject<Diagnostico[]>();
  constructor(private http: HttpClient) {}
  
  list(){
    return this.http.get<Diagnostico[]>(this.url);
  }

  insert(d: Diagnostico) {
    return this.http.post(this.url, d);
  }

  setList(listaNueva: Diagnostico[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number){
    return this.http.get<Diagnostico>(`${this.url}/${id}`);
  }
  update(r: Diagnostico) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
   getQuantity():Observable<QuantityDTO[]>{
    return this.http.get<QuantityDTO[]>(`${this.url}/cantidadseveridad`)
  }
  
}
