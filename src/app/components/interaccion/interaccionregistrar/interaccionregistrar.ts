import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Interaccion } from '../../../models/Interaccion';
import { Usuario } from '../../../models/Usuario';
import { TipoInteraccion } from '../../../models/TipoInteraccion';
import { Interaccionservice } from '../../../services/interaccionservice';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Usuarioservice } from '../../../services/usuarioservice';
import { TipoInteraccionservice } from '../../../services/tipointeraccionservice';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-interaccionregistrar',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
    MatIconModule,
    RouterLink,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './interaccionregistrar.html',
  styleUrl: './interaccionregistrar.css',
})
export class Interaccionregistrar implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;
  inte: Interaccion = new Interaccion();

  listaUsuarios: Usuario[] = [];
  listatipo: TipoInteraccion[] = [];

constructor(
    private iS: Interaccionservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice,
    private tP: TipoInteraccionservice,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

        this.tP.list().subscribe((data) => {
      this.listatipo = data;
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      descripcion: ['', [Validators.required,Validators.maxLength(100)]],
      FK:['',Validators.required],
      FK2:['',Validators.required]
    });
  }

aceptar(): void {
  if (this.form.valid) {
    
    this.inte.interaccion_id = this.form.value.codigo;
    this.inte.descripcion = this.form.value.descripcion;
    this.inte.fecha_pub = new Date();
    this.inte.usuario.id = this.form.value.FK
    this.inte.tipoInteraccion.tipoInteraccion_Id = this.form.value.FK2

    this.iS.insert(this.inte).subscribe(() => {
      this.iS.list().subscribe((data) => {
        this.iS.setList(data);
      });
      this.snackbar.open('Registro exitoso', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      this.router.navigate(['/app/interaccion/listar']);
    });
  }
}


  init() {
  if (this.edicion) {
    this.iS.listId(this.id).subscribe((data) => {
      this.form = new FormGroup({
        codigo: new FormControl(data.interaccion_id),
        descripcion: new FormControl(data.descripcion),
        FK: new FormControl(data.usuario.id),
        FK2: new FormControl(data.tipoInteraccion.tipoInteraccion_Id),
      });
    });
  }
}
}
