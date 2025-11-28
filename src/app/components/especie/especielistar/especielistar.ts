import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Especieservice } from '../../../services/especieservice';
import { Especie } from '../../../models/Especie';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Loginservice } from '../../../services/loginservice';

@Component({
  selector: 'app-especielistar',
  imports: [
    MatTableModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatPaginator,
    MatSnackBarModule,
  ],
  templateUrl: './especielistar.html',
  styleUrl: './especielistar.css',
})
export class Especielistar implements OnInit {
  role: string = '';
  dataSource: MatTableDataSource<Especie> = new MatTableDataSource();
  displayedColumns: string[] = ['c1', 'c2', 'c4'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private eS: Especieservice,
    private snackBar: MatSnackBar,
    private loginService: Loginservice
  ) {}

  ngOnInit(): void {
    this.eS.list().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });
    this.eS.getList().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
    });

    if (this.loginService.verificar()) {
      this.role = this.loginService.showRole();
    }
  }

  eliminar(id: number) {
    this.eS.delete(id).subscribe((data) => {
      this.eS.list().subscribe((data) => {
        this.eS.setList(data);
        this.snackBar.open('Se eliminó correctamente', 'Cerrar', {
          duration: 2000,
        });
      });
    });
  }

  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }

  puedeEditarEspecie(): boolean {
    const rolUser = this.loginService.showRole();
    return rolUser === 'ADMIN' || rolUser === 'CIENTIFICO';
  }
}
