import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  MaxLengthValidator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Especie } from '../../../models/Especie';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Especieservice } from '../../../services/especieservice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-especieregistrar',
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
  templateUrl: './especieregistrar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './especieregistrar.css',
})
export class Especieregistrar implements OnInit {
  form: FormGroup = new FormGroup({});
  es: Especie = new Especie();

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private eS: Especieservice,
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
      nombre: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }
  aceptar(): void {
    if (this.form.valid) {
      this.es.idEspecie = this.form.value.codigo;
      this.es.nombreC = this.form.value.nombre;

      if (this.edicion) {
        this.eS.update(this.es).subscribe((data) => {
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
        this.eS.insert(this.es).subscribe((data) => {
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
      this.router.navigate(['/app/especie']);
    }
  }
  init() {
    if (this.edicion) {
      this.eS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idEspecie),
          nombre: new FormControl(data.nombreC),
        });
      });
    }
  }
}
