import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { Planta } from '../models/Planta';
import { environment } from '../../environments/environment';


const base_url = environment.base

@Injectable({
  providedIn: 'root',
})

export class PlantaService {
  private url=`${base_url}/plantas`;
  private listaCambio = new Subject<Planta[]>();

  constructor(private http:HttpClient) { }


  list(){
    return this.http.get<Planta[]>(this.url);
  }
  insert(d: Planta) {
    return this.http.post(this.url, d);
  }

  setList(listaNueva: Planta[]) {
    this.listaCambio.next(listaNueva);
  }
  getList(){
    return this.listaCambio.asObservable()
  }
   listId(id: number){
    return this.http.get<Planta>(`${this.url}/${id}`);
  }
  update(r: Planta) {
    return this.http.put(this.url, r, { responseType: 'text' });
  }
delete(id: number) {
  return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
}
getSum(): Observable<QuantitPlantaDTO[]> {
    return this.http.get<QuantitPlantaDTO[]>(`${this.url}/plantareporte`);
  }
}
