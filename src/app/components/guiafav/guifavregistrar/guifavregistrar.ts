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
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { GuiaFavorita } from '../../../models/GuiaFavorita';
import { Usuario } from '../../../models/Usuario';
import { Guia } from '../../../models/Guia';
import { Guiafavoritaservice } from '../../../services/Guiafavoritaservice';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { Usuarioservice } from '../../../services/usuarioservice';
import { GuiaService } from '../../../services/guiaservice';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-guifavregistrar',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatIconModule,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './guifavregistrar.html',
  styleUrl: './guifavregistrar.css',
})
export class Guifavregistrar implements OnInit {
  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;
  guiaf: GuiaFavorita = new GuiaFavorita();

  listaUsuarios: Usuario[] = [];
  listaGuia: Guia[] = [];

  constructor(
    private guiafavoritaS: Guiafavoritaservice,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private uS: Usuarioservice,
    private guiaS: GuiaService,
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
      console.log('Usuarios disponibles:', data);
    });

    this.guiaS.list().subscribe((data) => {
      this.listaGuia = data;
      console.log('Guías disponibles:', data);
    });

    this.form = this.formBuilder.group({
      codigo: [''],
      usuarios: ['', Validators.required],
      guias: ['', Validators.required],
    });
  }

  aceptar(): void {
    if (this.form.valid) {
      this.guiaf.GuiaFavoritaId = this.form.value.codigo;
      this.guiaf.guia.guiaId = this.form.value.guias;
      this.guiaf.usuario.id = this.form.value.usuarios;

      this.guiafavoritaS.insert(this.guiaf).subscribe((data) => {
        this.guiafavoritaS.list().subscribe((data) => {
          this.guiafavoritaS.setList(data);
        });
        this.snackbar.open('Registro exitoso', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      });
      this.router.navigate(['/app/guiafav/listar']);
    }
  }

  init() {
    if (this.edicion) {
      this.guiafavoritaS.listId(this.id).subscribe((data) => {
        this.form = new FormGroup({
          codigo: new FormControl(data.GuiaFavoritaId),
          usuarios: new FormControl(data.usuario.id),
          guias: new FormControl(data.guia.guiaId),
        });
      });
    }
  }
}
