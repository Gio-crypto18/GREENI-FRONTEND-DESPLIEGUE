import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../models/Usuario';
import { Usuarioservice } from '../../../services/usuarioservice';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-usuariolistar',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './usuariolistar.html',
  styleUrl: './usuariolistar.css',
})
export class Usuariolistar implements OnInit {
  dataSource: MatTableDataSource<Usuario> = new MatTableDataSource();
  displayedColumns: string[] = ['a', 'b', 'c', 'e', 'f', 'g', 'FK', 'i', 'j'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private uS: Usuarioservice,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.uS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });

    this.uS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  eliminar(id: number) {
    this.uS.delete(id).subscribe(() => {
      this.uS.list().subscribe((data) => {
        this.uS.setList(data);
        this.snackBar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      });
    });
  }
}
