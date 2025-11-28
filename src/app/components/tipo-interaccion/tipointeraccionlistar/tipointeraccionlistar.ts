import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import {
  MatPaginator,
  MatPaginatorModule,
  MatPaginatorIntl,
} from '@angular/material/paginator';

import { TipoInteraccion } from '../../../models/TipoInteraccion';
import { TipoInteraccionservice } from '../../../services/tipointeraccionservice';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-tipointeraccionlistar',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    MatPaginatorModule,
  ],
  templateUrl: './tipointeraccionlistar.html',
  styleUrl: './tipointeraccionlistar.css',
  providers: [
    {
      provide: MatPaginatorIntl,
    },
  ],
})
export class Tipointeraccionlistar implements OnInit {
  dataSource: MatTableDataSource<TipoInteraccion> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dS: TipoInteraccionservice, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.dS.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });

    this.dS.getList().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
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
}
