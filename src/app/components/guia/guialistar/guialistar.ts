import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

import { GuiaService } from '../../../services/guiaservice';
import { Guia } from '../../../models/Guia';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Loginservice } from '../../../services/loginservice';

export function getGuiasPaginatorIntl() {
  const intl = new MatPaginatorIntl();

  intl.itemsPerPageLabel = 'Guías por página';
  intl.nextPageLabel = 'Siguiente';
  intl.previousPageLabel = 'Anterior';
  intl.firstPageLabel = 'Primera página';
  intl.lastPageLabel = 'Última página';
  intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return '0 de ' + length;
    }
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} de ${length}`;
  };

  return intl;
}

@Component({
  selector: 'app-guialistar',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
    MatCardModule,
    CommonModule,
    MatSnackBarModule
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: getGuiasPaginatorIntl }],
  templateUrl: './guialistar.html',
  styleUrl: './guialistar.css',
})
export class Guialistar implements OnInit, AfterViewInit {
       role: string = '';
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  dataSource: MatTableDataSource<Guia> = new MatTableDataSource<Guia>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dS: GuiaService,    private snackbar: MatSnackBar,private loginService: Loginservice) {}

  ngOnInit(): void {
    this.dS.list().subscribe((data) => {
      this.dataSource.data = data;
    });

    this.dS.getList().subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  eliminar(id: number) {
    this.dS.delete(id).subscribe(() => {
      this.dS.list().subscribe((data) => {
        this.dS.setList(data);
        this.snackbar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 2000
        });
      });
    });
  }
  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }
  // En tu componente.ts

puedeEditarGuia(): boolean {
    const rolUser = this.loginService.showRole();
    return rolUser === 'ADMIN' || rolUser === 'CIENTIFICO';
}
}
