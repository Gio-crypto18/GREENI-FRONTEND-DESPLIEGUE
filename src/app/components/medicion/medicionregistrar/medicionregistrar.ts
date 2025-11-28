import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Medicion } from '../../../models/Medicion';
import { Planta } from '../../../models/Planta';
import { Medicionservice } from '../../../services/medicionservice';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { PlantaService } from '../../../services/plantaservice';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-medicionregistrar',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './medicionregistrar.html',
  styleUrl: './medicionregistrar.css',
})
export class Medicionregistrar implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;
  med: Medicion = new Medicion();
  ListaPlantas: Planta[] = [];

  constructor(
    private mS: Medicionservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private pS: PlantaService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.init();
    });

    this.pS.list().subscribe((data) => {
      this.ListaPlantas = data;
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      humedad: [
        '',
        [
          Validators.required,
          Validators.pattern(/^-?\d*(\.\d+)?$/),
          Validators.min(0),
          Validators.max(100),
        ],
      ],
      temperatura: [
        '',
        [
          Validators.required,
          Validators.pattern(/^-?\d*(\.\d+)?$/),
          Validators.min(-50),
          Validators.max(40),
        ],
      ],
      ph: [
        '',
        [
          Validators.required,
          Validators.pattern(/^-?\d*(\.\d+)?$/),
          Validators.min(0),
          Validators.max(14),
        ],
      ],
      planta: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.med.idMedicion = this.form.value.codigo;
      this.med.humedad = this.form.value.humedad;
      this.med.temperatura = this.form.value.temperatura;
      this.med.ph = this.form.value.ph;
      this.med.fecha_med = new Date();
      this.med.planta.idPlanta = this.form.value.planta;

      if (this.edicion) {
        this.mS.update(this.med).subscribe(() => {
          this.mS.list().subscribe((data) => {
            this.mS.setList(data);
            this.snackbar.open('Actualización exitosa', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.router.navigate(['/app/medicion/listar']);
          });
        });
      } else {
        this.mS.insert(this.med).subscribe(() => {
          this.mS.list().subscribe((data) => {
            this.mS.setList(data);
            this.snackbar.open('Registro exitoso', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
            this.router.navigate(['/app/medicion/listar']);
          });
        });
      }
    }
  }

  init() {
    if (this.edicion) {
      this.mS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.idMedicion),
          humedad: new FormControl(data.humedad),
          temperatura: new FormControl(data.temperatura),
          ph: new FormControl(data.ph),
          planta: new FormControl(data.planta.idPlanta),
        });
      });
    }
  }
}
