import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Recordatorio } from '../../../models/Recordatorio';
import { Recordatorioservice } from '../../../services/recordatorioservice';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recordatoriolistar',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './recordatoriolistar.html',
  styleUrl: './recordatoriolistar.css',
})
export class Recordatoriolistar implements OnInit {
  dataSource: MatTableDataSource<Recordatorio> = new MatTableDataSource();
  displayedColumns: string[] = ['a', 'b', 'c', 'd', 'usuario', 'estadorecordatorio', 'i', 'j'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rS: Recordatorioservice, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.rS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });

    this.rS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  eliminar(id: number) {
    this.rS.delete(id).subscribe(() => {
      this.rS.list().subscribe((data) => {
        this.rS.setList(data);

        this.snackBar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 2000
        });
      });
    });
  }
}
