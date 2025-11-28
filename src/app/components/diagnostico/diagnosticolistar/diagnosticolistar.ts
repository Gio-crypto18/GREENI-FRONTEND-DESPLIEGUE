import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Diagnostico } from '../../../models/Diagnostico';
import { Diagnosticoservice } from '../../../services/diagnosticoservice';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Loginservice } from '../../../services/loginservice';

@Component({
  selector: 'app-diagnosticolistar',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterLink,
    CommonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './diagnosticolistar.html',
  styleUrl: './diagnosticolistar.css',
})
export class Diagnosticolistar implements OnInit {
       role: string = '';
  dataSource: MatTableDataSource<Diagnostico> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dS: Diagnosticoservice,private snackBar: MatSnackBar,private loginService: Loginservice) {}

  ngOnInit(): void {
    this.dS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Diagnósticos por página';
      });
    });
    this.dS.getList().subscribe((data) => {
      this.dataSource.data = data;
    });

     if (this.loginService.verificar()) {
    this.role = this.loginService.showRole();
    }
  }
  eliminar(id: number) {
    this.dS.delete(id).subscribe(() => {
      this.dS.list().subscribe((data) => {
        this.dS.setList(data);
        this.snackBar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 2000
        });
      });

    });
  }

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }
  isAdmin() {
    return this.role === 'ADMIN';
  }

  isCientifico() {
    return this.role === 'CIENTIFICO';
  }

  isPlantLover() {
    return this.role === 'PLANTLOVER';
  }
  
}
