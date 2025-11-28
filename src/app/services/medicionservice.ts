import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Medicion } from '../models/Medicion';
import { environment } from '../../environments/environment';



const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class Medicionservice {
  private url=`${base_url}/medicion`;
  private listaCambio = new Subject<Medicion[]>();

  constructor(private http:HttpClient) { }

  
  list(){
    return this.http.get<Medicion[]>(this.url);
  }
  insert(d: Medicion) {
    return this.http.post(this.url, d);
  }

  setList(listaNueva: Medicion[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number){
    return this.http.get<Medicion>(`${this.url}/${id}`);
  }
  update(r: Medicion) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
