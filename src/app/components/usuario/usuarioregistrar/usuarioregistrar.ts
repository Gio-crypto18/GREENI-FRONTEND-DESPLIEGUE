import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Usuario } from '../../../models/Usuario';
import { Rol } from '../../../models/Rol';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Rolservice } from '../../../services/rolservice';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuarioregistrar',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatNativeDateModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './usuarioregistrar.html',
  styleUrl: './usuarioregistrar.css',
})
export class Usuarioregistrar {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;
  usu: Usuario = new Usuario();

  listaRoles: Rol[] = [];

  constructor(
    private uS: Usuarioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private rS: Rolservice,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.rS.list().subscribe((data) => {
      this.listaRoles = data;
    });
    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      email: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern('^[^@]+@[^@]+\\.[^@]+$'),
        ],
      ],
      activo: [false, Validators.required],
      fecha: [this.obtenerFechaActual(), Validators.required],
      biografia: ['', [Validators.required, Validators.maxLength(200)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
      rol: ['', Validators.required],
    });
  }
  obtenerFechaActual(): string {
    const fecha = new Date(Date.now());
    return fecha.toISOString().split('T')[0];
  }

  aceptar(): void {
    if (this.form.valid) {
      this.usu.id = this.form.value.codigo;
      this.usu.nombre = this.form.value.nombre;
      this.usu.email = this.form.value.email;
      this.usu.activo = this.form.value.activo;
      this.usu.fechaIni = this.form.value.fecha;
      this.usu.biografia = this.form.value.biografia;
      this.usu.password = this.form.value.password;

      this.usu.rol = new Rol();
      this.usu.rol.rolId = this.form.value.rol;

      if (this.edicion) {
        this.uS.update(this.usu).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
          });
          this.snackbar.open('Actualización exitosa', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        });
      } else {
        this.uS.insert(this.usu).subscribe(() => {
          this.uS.list().subscribe((data) => {
            this.uS.setList(data);
          });
          this.snackbar.open('Registro exitoso', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        });
      }
      this.router.navigate(['/login']);
    }
  }

  init() {
    if (this.edicion) {
      this.uS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.id),
          nombre: new FormControl(data.nombre),
          email: new FormControl(data.email),
          activo: new FormControl(data.activo),
          fecha: new FormControl(data.fechaIni),
          biografia: new FormControl(data.biografia),
          password: new FormControl(data.password),
          rol: new FormControl(data.rol.rolId),
        });
      });
    }
  }
}
