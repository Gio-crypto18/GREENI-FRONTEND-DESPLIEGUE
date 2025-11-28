import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Rol } from '../../../models/Rol';
import { Rolservice } from '../../../services/rolservice';
import { ActivatedRoute, Router, Params, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rolinsertar',
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
  providers: [provideNativeDateAdapter()],
  templateUrl: './rolinsertar.html',
  styleUrl: './rolinsertar.css',
})
export class rolinsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  rol: Rol = new Rol();

  id: number = 0;
  edicion: boolean = false;

  typeDevices: { value: string; viewValue: string }[] = [
    { value: 'ADMIN', viewValue: 'ADMIN' },
    { value: 'PLANTLOVER', viewValue: 'PLANTLOVER' },
    { value: 'CIENTIFICO', viewValue: 'CIENTIFICO' },
  ];

  constructor(
    private dS: Rolservice,
    private formBuilder: FormBuilder,
    private router: Router,
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
      tipo: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.rol.rolId = this.form.value.codigo;
      this.rol.tipo = this.form.value.tipo;

      if (this.edicion) {
        this.dS.update(this.rol).subscribe((data) => {
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
        this.dS.insert(this.rol).subscribe((data) => {
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
      this.router.navigate(['/app/rol']);
    }
  }

  init() {
    if (this.edicion) {
      this.dS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.rolId),
          tipo: new FormControl(data.tipo),
        });
      });
    }
  }
}
