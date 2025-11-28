import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Guia } from '../models/Guia';
import { environment } from '../../environments/environment';



const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class GuiaService {

  private url=`${base_url}/guia`;
  private listaCambio = new Subject<Guia[]>();
  constructor(private http: HttpClient) {}
  
  list(){
    return this.http.get<Guia[]>(this.url);
  }

  insert(d: Guia) {
    return this.http.post(this.url, d);
  }

  setList(listaNueva: Guia[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
  listId(id: number){
    return this.http.get<Guia>(`${this.url}/${id}`);
  }
  update(r: Guia) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }
  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}
