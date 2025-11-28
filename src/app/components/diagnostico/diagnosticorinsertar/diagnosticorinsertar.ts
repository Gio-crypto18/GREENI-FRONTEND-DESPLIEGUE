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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Diagnostico } from '../../../models/Diagnostico';
import { Diagnosticoservice } from '../../../services/diagnosticoservice';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-diagnosticorinsertar',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './diagnosticorinsertar.html',
  styleUrl: './diagnosticorinsertar.css',
  providers: [provideNativeDateAdapter()],
})
export class Diagnosticorinsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  dia: Diagnostico = new Diagnostico();

  edicion: boolean = false;
  id: number = 0;


  constructor(
    private dS: Diagnosticoservice,
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
      seve: ['', [Validators.required, this.numberRangeValidator(1, 10)]],
      ace: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.dia.idDiagnostico = this.form.value.codigo;
      this.dia.severidad = this.form.value.seve;
      this.dia.acciones = this.form.value.ace;
      this.dia.fechadia = new Date(Date.now());

      if (this.edicion) {
        this.dS.update(this.dia).subscribe((data) => {
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
          });
          this.snackbar.open('Actualización exitosa', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        });
      } else {
        this.dS.insert(this.dia).subscribe((data) => {
          this.dS.list().subscribe((data) => {
            this.dS.setList(data);
          });
           this.snackbar.open('Registro exitoso', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        });
      }
      this.router.navigate(['/app/diagnostico/listar']);
    }
  }

  numberRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const num = Number(value);

      if (num >= min && num <= max) {
        return null; // Válido
      }

      return { range: true };
    };
  }

  init() {
    if (this.edicion) {
      this.dS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idDiagnostico),
          seve: new FormControl(data.severidad),
          ace: new FormControl(data.acciones),
        });
      });
    }
  }
}
