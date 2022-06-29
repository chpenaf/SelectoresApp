import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

import { PaisesService } from '../services/paises.service';
import { PaisSmall } from '../interface/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  constructor(
    private _fb: FormBuilder,
    private _ps: PaisesService
  ) { }

  miFormulario: FormGroup = this._fb.group(
    {
      region   : ['', [ Validators.required ] ],
      pais     : ['', [ Validators.required ] ],
      frontera : ['', [ Validators.required ] ]
    }
  )

  // Selectores
  regiones: string[]     = [];
  paises: PaisSmall[]    = [];
  fronteras: PaisSmall[] = []; 

  // UI
  cargando: boolean = false;

  ngOnInit(): void {

    this.regiones = this._ps.regiones;
    
    // Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        } ), // Limpia pais al cambiar continente
        switchMap( region => this._ps.getPaisesPorRegion( region ) ) 
      )
      .subscribe( paises => { 
        this.paises = paises;
        this.cargando = false;
      } );

    // Cuando cambie el pais
    this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.miFormulario.get('frontera')?.reset('');
          this.fronteras = [];
          this.cargando = true;
          }
        ),
        switchMap( pais => this._ps.getFronterasPorPais( pais ) ),
        switchMap( pais => this._ps.getArrayPaises( pais?.[0].borders  || [] ) )
      )
      .subscribe(
        pais => { 
          this.fronteras = pais || [];
          this.cargando = false;
        }
      )
  }

  guardar(): void {}

}
