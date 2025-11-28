import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { EstadoRecordatorio } from '../../../models/EstadoRecordatorio';
import { EstadoRecordatorioservice } from '../../../services/estado_recordatorioservice';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-estadorecordatoriolistar',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatPaginatorModule, RouterLink,MatSnackBarModule],
  templateUrl: './estadorecordatoriolistar.html',
  styleUrl: './estadorecordatoriolistar.css',
})
export class Estadorecordatoriolistar implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<EstadoRecordatorio> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dS: EstadoRecordatorioservice,    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.dS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });

    this.dS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      if (this.paginator) this.dataSource.paginator = this.paginator;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
