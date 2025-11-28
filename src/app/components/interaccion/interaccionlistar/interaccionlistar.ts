import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Interaccionservice } from '../../../services/interaccionservice';
import { MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { Interaccion } from '../../../models/Interaccion';
import {MatDividerModule} from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-interaccionlistar',
  imports: [
    MatTableModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatPaginator,
    RouterLink,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './interaccionlistar.html',
  styleUrl: './interaccionlistar.css',
})
export class Interaccionlistar implements OnInit {
  dataSource: MatTableDataSource<Interaccion> = new MatTableDataSource();
  displayedColumns: string[] = ['a', 'b', 'd', 'FK', 'fk2', 'j'];

  constructor(private iS: Interaccionservice,    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.iS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.iS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }
  eliminar(id: number) {
    this.iS.delete(id).subscribe((data) => {
      this.iS.list().subscribe((data) => {
        this.iS.setList(data);
        this.snackBar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 2000
        });
      });
    });
  }
}
