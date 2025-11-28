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
import { Guia } from '../../../models/Guia';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { GuiaService } from '../../../services/guiaservice';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-guiainsertar',
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
  templateUrl: './guiainsertar.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './guiainsertar.css',
})
export class Guiainsertar implements OnInit {
  form: FormGroup = new FormGroup({});
  gi: Guia = new Guia();

  edicion: boolean = false;
  id: number = 0;

  constructor(
    private gS: GuiaService,
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
      titulo: ['', [Validators.required, Validators.maxLength(20)]],
      tipo: ['', Validators.required],
      contenido: ['', [Validators.required, Validators.maxLength(200)]],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.gi.guiaId = this.form.value.codigo;
      this.gi.tituloGuia = this.form.value.titulo;
      this.gi.tipoGuia = this.form.value.tipo;
      this.gi.contenidoGuia = this.form.value.contenido;

      if (this.edicion) {
        this.gS.update(this.gi).subscribe((data) => {
          this.gS.list().subscribe((data) => {
            this.gS.setList(data);
          });
          this.snackbar.open('Actualización exitosa', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        });
      } else {
        this.gS.insert(this.gi).subscribe((data) => {
          this.gS.list().subscribe((data) => {
            this.gS.setList(data);
          });
           this.snackbar.open('Registro exitoso', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
        });
      }
      this.router.navigate(['/app/GUIAS/listar']);
    }
  }
  init() {
    if (this.edicion) {
      this.gS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.guiaId),
          titulo: new FormControl(data.tituloGuia),
          tipo: new FormControl(data.tipoGuia),
          contenido: new FormControl(data.contenidoGuia),
        });
      });
    }
  }
}
