import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PaisSmall, Pais } from '../interface/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _baseUrl = 'https://restcountries.com/v3.1';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regiones(): string[] {
    return [ ...this._regiones ];
  }

  constructor(
    private _http: HttpClient
  ) { }

  getPaisesPorRegion( region: string): Observable<PaisSmall[]> {
    const url: string = `${ this._baseUrl}/region/${ region }?fields=cca3,name`
    return this._http.get<PaisSmall[]>( url );
  }

  getFronterasPorPais( pais: string ): Observable<Pais[] | null>  {
    if( !pais ){
      return of(null);
    }
    const url: string = `${ this._baseUrl}/alpha/${ pais }`
    return this._http.get<Pais[]>( url );
  }

  getArrayPaises( pais: string[] ): Observable<PaisSmall[]> {
    if( !pais ){
      return of([]);
    }
    let codes: string = '';
    pais.forEach(element => {
      if( !codes ){
        codes = element;
      } else {
        codes = `${ codes },${ element }`
      }
    });
    if( !codes ){
      return of([]);
    }
    
    const url: string = `${ this._baseUrl}/alpha?codes=${ codes }&fields=cca3,name`;
    return this._http.get<PaisSmall[]>( url );
 
  }
}
