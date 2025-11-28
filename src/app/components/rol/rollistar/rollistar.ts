import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Rolservice } from '../../../services/rolservice';
import { Rol } from '../../../models/Rol';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rollistar',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    RouterLink,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './rollistar.html',
  styleUrl: './rollistar.css',
})
export class Rollistar implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Rol> = new MatTableDataSource<Rol>();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private rS: Rolservice, private location: Location,    private snackBar: MatSnackBar) {}

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
  volver(): void {
    this.location.back();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  eliminar(id: number) {
    this.rS.deleteD(id).subscribe(() => {
      this.rS.list().subscribe((data) => {
        this.rS.setList(data);
        this.snackBar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 2000
        });
      });
    });
  }
}
