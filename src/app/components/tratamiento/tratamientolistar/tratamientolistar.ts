import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatCellDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Tratamiento } from '../../../models/Tratamiento';
import { Tratamientoservice } from '../../../services/tratamientoservice';
import { RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Loginservice } from '../../../services/loginservice';

@Component({
  selector: 'app-tratamientolistar',
  imports: [
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatIconModule,
    RouterLink,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatCardModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './tratamientolistar.html',
  styleUrl: './tratamientolistar.css',
})
export class Tratamientolistar implements OnInit {
   role: string = '';
  dataSource: MatTableDataSource<Tratamiento> = new MatTableDataSource();
  displayedColumns: string[] = ['a', 'b', 'c', 'f', 'g', 'FK', 'i', 'j'];

  form: FormGroup = new FormGroup({});
  edicion: boolean = false;
  id: number = 0;
  tra: Tratamiento = new Tratamiento();
  listaTratamiento: Tratamiento[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private tS: Tratamientoservice,private snackBar: MatSnackBar,private loginService: Loginservice) {}

  ngOnInit(): void {
    this.tS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.tS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.tS.delete(id).subscribe(() => {
      this.tS.list().subscribe((data) => {
        this.tS.setList(data);
          this.snackBar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      });
    });
  }

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

puedeEditarTratamiento(): boolean {
    const rolUser = this.loginService.showRole();
    return rolUser === 'ADMIN' || rolUser === 'CIENTIFICO';
}
}
