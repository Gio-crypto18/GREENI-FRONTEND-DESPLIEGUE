import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Planta } from '../../../models/Planta';
import { PlantaService } from '../../../services/plantaservice';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Especie } from '../../../models/Especie';
import { Diagnostico } from '../../../models/Diagnostico';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Diagnosticoservice } from '../../../services/diagnosticoservice';
import { Especieservice } from '../../../services/especieservice';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../models/Usuario';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-plantainsertar',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    CommonModule,
    RouterLink,
    MatSnackBarModule,
  ],
  templateUrl: './plantainsertar.html',
  styleUrl: './plantainsertar.css',
})
export class Plantainsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  pla: Planta = new Planta();

  edicion: boolean = false;
  id: number = 0;

 tipoplantas: { value: string; viewValue: string }[] = [
  { value: 'LAVANDA', viewValue: 'Lavanda' },
  { value: 'VIOLETA', viewValue: 'Violeta ' },
  { value: 'IRIS', viewValue: 'Iris' },
  { value: 'JACINTO', viewValue: 'Jacinto Morado' },
  { value: 'PETUNIA', viewValue: 'Petunia ' }
];


  listaEspecies: Especie[] = [];
  listaUsuarios: Usuario[] = [];
  listaDiagnosticos: Diagnostico[] = [];

  constructor(
    private pS: PlantaService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice,
    private dS: Diagnosticoservice,
    private eS: Especieservice,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.eS.list().subscribe((data) => {
      this.listaEspecies = data;
    });

    this.uS.list().subscribe((data) => {
      this.listaUsuarios = data;
    });

    this.dS.list().subscribe((data) => {
      this.listaDiagnosticos = data;
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      imagen: [false, Validators.required],
      especie: ['', Validators.required],
      usuario: ['', Validators.required],
      diagnostico: ['', Validators.required],
      fecha: [this.getFechaActual(), Validators.required],
    });
  }

  getFechaActual(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  aceptar(): void {
    if (this.form.valid) {
      this.pla.idPlanta = this.form.value.codigo;
      this.pla.nombrePlanta = this.form.value.nombre;
      this.pla.fecha_reg = this.form.value.fecha;
      this.pla.imagen = this.form.value.imagen;
      this.pla.usuario.id = this.form.value.usuario;
      this.pla.diagnostico.idDiagnostico = this.form.value.diagnostico;
      this.pla.especie.idEspecie = this.form.value.especie;

      if (this.edicion) {
        this.pS.update(this.pla).subscribe(() => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data);
            this.snackbar.open('Actualización exitosa', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.router.navigate(['/app/planta/listar']);
          });
        });
      } else {
        this.pS.insert(this.pla).subscribe(() => {
          this.pS.list().subscribe((data) => {
            this.pS.setList(data);
            this.snackbar.open('Registro exitoso', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.router.navigate(['/app/planta/listar']);
          });
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.pS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idPlanta),
          imagen: new FormControl(data.imagen),
          nombre: new FormControl(data.nombrePlanta),
          especie: new FormControl(data.especie.idEspecie),
          usuario: new FormControl(data.usuario.id),
          diagnostico: new FormControl(data.diagnostico.idDiagnostico),
          fecha: new FormControl(data.fecha_reg),
        });
      });
    }
  }
}
