import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Guiafavoritaservice } from '../../../services/Guiafavoritaservice';
import { GuiaFavorita } from '../../../models/GuiaFavorita';
import { RouterLink } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-guifavlistar',
  imports: [MatTableModule, CommonModule, MatIconModule, MatButtonModule, RouterLink, MatPaginator,MatSnackBarModule],
  templateUrl: './guifavlistar.html',
  styleUrl: './guifavlistar.css',
})
export class Guifavlistar implements OnInit {
  dataSource: MatTableDataSource<GuiaFavorita> = new MatTableDataSource();
  displayedColumns: string[] = ['a', 'b', 'c', 'd'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private gfS: Guiafavoritaservice,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.gfS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.gfS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  eliminar(id: number) {
    this.gfS.delete(id).subscribe((data) => {
      this.gfS.list().subscribe((data) => {
        this.gfS.setList(data);
        this.snackBar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 2000
        });
      });
    });
  }
}
