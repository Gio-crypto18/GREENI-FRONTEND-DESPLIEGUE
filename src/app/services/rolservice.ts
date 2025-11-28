import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Rol } from '../models/Rol';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';


const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class Rolservice {

  private url=`${base_url}/rol`;
  private listaCambio = new Subject<Rol[]>();
  constructor(private http: HttpClient) {}
  
  list(){
    return this.http.get<Rol[]>(`${this.url}/info`);
  }

  insert(d: Rol) {
    return this.http.post(`${this.url}/insertar`, d); 
  }

  setList(listaNueva: Rol[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number){
    return this.http.get<Rol>(`${this.url}/${id}`);
  }
  update(r: Rol) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }
  deleteD(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
