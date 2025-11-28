import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { Recordatorio } from '../../../models/Recordatorio';
import { Usuario } from '../../../models/Usuario';
import { EstadoRecordatorio } from '../../../models/EstadoRecordatorio';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Recordatorioservice } from '../../../services/recordatorioservice';
import { Usuarioservice } from '../../../services/usuarioservice';
import { EstadoRecordatorioservice } from '../../../services/estado_recordatorioservice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recordatorioregistrar',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatIconModule,
    RouterLink,
    MatSnackBarModule,
  ],
  templateUrl: './recordatorioregistrar.html',
  styleUrl: './recordatorioregistrar.css',
})
export class Recordatorioregistrar {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;
  re: Recordatorio = new Recordatorio();

  listaUsuarios: Usuario[] = [];
  listaEstados: EstadoRecordatorio[] = [];

  constructor(
    private rS: Recordatorioservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice,
    private eS: EstadoRecordatorioservice,
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

    this.eS.list().subscribe((data) => {
      this.listaEstados = data;
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(15)]],
      fecha: ['', [Validators.required, this.fechaNoPasadaValidator]],
      Usuario: ['', Validators.required],
      tipo: ['', [Validators.required, Validators.maxLength(10)]],
      Estado: ['', Validators.required],
    });
  }

  fechaNoPasadaValidator(control: AbstractControl) {
    if (!control.value) return null;

    const fechaSeleccionada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      return { fechaPasada: true };
    }
    return null;
  }

  aceptar(): void {
    if (this.form.valid) {
      this.re.idRecordatorio = this.form.value.codigo;
      this.re.nombre = this.form.value.nombre;
      this.re.tipo = this.form.value.tipo;
      this.re.fechaRe = this.form.value.fecha;

      this.re.usuario = new Usuario();
      this.re.usuario.id = this.form.value.Usuario;

      this.re.estado = new EstadoRecordatorio();
      this.re.estado.idEstadoRecordatorio = this.form.value.Estado;

      if (this.edicion) {
        this.rS.update(this.re).subscribe(() => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
          this.snackbar.open('Actualización exitosa', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
          this.router.navigate(['/app/recordatorio/listar']);
        });
      } else {
        this.rS.insert(this.re).subscribe(() => {
          this.rS.list().subscribe((data) => {
            this.rS.setList(data);
          });
          this.snackbar.open('Registro exitoso', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
          this.router.navigate(['/app/recordatorio/listar']);
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.rS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idRecordatorio),
          nombre: new FormControl(data.nombre, [Validators.required, Validators.maxLength(15)]),
          fecha: new FormControl(data.fechaRe, [Validators.required, this.fechaNoPasadaValidator]),
          tipo: new FormControl(data.tipo, [Validators.required, Validators.maxLength(10)]),
          Usuario: new FormControl(data.usuario.id, Validators.required),
          Estado: new FormControl(data.estado.idEstadoRecordatorio, Validators.required),
        });
      });
    }
  }
}
