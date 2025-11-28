import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Tratamiento } from '../../../models/Tratamiento';
import { Tratamientoservice } from '../../../services/tratamientoservice';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Diagnosticoservice } from '../../../services/diagnosticoservice';
import { Diagnostico } from '../../../models/Diagnostico';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tratamientoregistrar',
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDatepicker,
    RouterLink,
  ],
  templateUrl: './tratamientoregistrar.html',
  styleUrl: './tratamientoregistrar.css',
})
export class Tratamientoregistrar implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;
  sof: Tratamiento = new Tratamiento();
  listaDiagnostico: Diagnostico[] = [];

  constructor(
    private tS: Tratamientoservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private dS: Diagnosticoservice,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dS.list().subscribe((data) => {
      this.listaDiagnostico = data;
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', Validators.required],
      duracion: ['', Validators.required],
      fechainicio: ['', [Validators.required, this.fechaNoPasadaValidator]],
      fechafin: ['', [Validators.required, this.fechaFinMayorValidator]],
      diagnostico: ['', Validators.required],
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = this.id != null;
      this.init();
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.sof.idTratamiento = this.form.value.codigo;
      this.sof.nombre = this.form.value.nombre;
      this.sof.duracion = this.form.value.duracion;
      this.sof.fechainicio = this.form.value.fechainicio;
      this.sof.fechafin = this.form.value.fechafin;
      this.sof.diagnostico.idDiagnostico = this.form.value.diagnostico;

      if (this.edicion) {
        this.tS.update(this.sof).subscribe(() => {
          this.tS.list().subscribe((data) => {
            this.tS.setList(data);
          });
          this.snackbar.open('Actualización exitosa', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        });
      } else {
        this.tS.insert(this.sof).subscribe(() => {
          this.tS.list().subscribe((data) => {
            this.tS.setList(data);
          });
          this.snackbar.open('Registro exitoso', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        });
      }

      this.router.navigate(['/app/tratamiento/listar']);
    }
  }

  init() {
    if (this.edicion) {
      this.tS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idTratamiento),
          nombre: new FormControl(data.nombre),
          duracion: new FormControl(data.duracion),
          fechainicio: new FormControl(data.fechainicio),
          fechafin: new FormControl(data.fechafin),
          diagnostico: new FormControl(data.diagnostico.idDiagnostico),
        });
      });
    }
  }

  fechaNoPasadaValidator(control: FormControl) {
    const value = control.value;
    if (!value) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fecha = new Date(value);
    fecha.setHours(0, 0, 0, 0);

    return fecha < hoy ? { fechaPasada: true } : null;
  }

 fechaFinMayorValidator(control: FormControl) {
  if (!control.parent) return null; // evita error antes de montar el form

  const inicio = control.parent.get('fechainicio')?.value;
  const fin = control.value;

  if (!inicio || !fin) return null;

  const fInicio = new Date(inicio);
  const fFin = new Date(fin);

  return fFin < fInicio ? { fechaAnteriorInicio: true } : null;
}
}
