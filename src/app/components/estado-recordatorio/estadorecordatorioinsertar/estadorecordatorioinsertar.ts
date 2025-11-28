import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { EstadoRecordatorio } from '../../../models/EstadoRecordatorio';
import { EstadoRecordatorioservice } from '../../../services/estado_recordatorioservice';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-estadorecordatorioinsertar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormField,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './estadorecordatorioinsertar.html',
  styleUrl: './estadorecordatorioinsertar.css',
})
export class Estadorecordatorioinsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  est: EstadoRecordatorio = new EstadoRecordatorio();

  edicion: boolean = false;
  id: number = 0;
  tiporecordatorio: { value: string; viewValue: string }[] = [
    { value: 'Alarma', viewValue: 'Alarma' },
    { value: 'Riego', viewValue: 'Riego' },
  ];

  constructor(
    private eS: EstadoRecordatorioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.est.idEstadoRecordatorio = this.form.value.codigo;
      this.est.nombre = this.form.value.nombre;
      if (this.edicion) {
        this.eS.update(this.est).subscribe((data) => {
          this.eS.list().subscribe((data) => {
            this.eS.setList(data);
          });
          this.snackbar.open('Actualización exitosa', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        });
      } else {
        this.eS.insert(this.est).subscribe((data) => {
          this.eS.list().subscribe((data) => {
            this.eS.setList(data);
          });
          this.snackbar.open('Registro exitoso', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        });
      }
      this.router.navigate(['/app/calendario']);
    }
  }
  init() {
    if (this.edicion) {
      this.eS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idEstadoRecordatorio),
          nombre: new FormControl(data.nombre),
        });
      });
    }
  }
}
