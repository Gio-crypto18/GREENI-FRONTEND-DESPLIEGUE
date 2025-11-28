import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout';
import { Index } from './components/index/index';
import { HomeComponent } from './components/home/home';
import { Planta } from './components/plantas/plantas';
import { Diagnostico } from './components/diagnostico/diagnostico';
import { CalendarComponent } from './components/calendar/calendar';
import { ComunidadComponent } from './components/comunidad/comunidad';
import { PerfilComponent } from './components/perfil/perfil';
import { Plantazona } from './components/plantazona/plantazona';
import { Diagnosticozona } from './components/diagnosticozona/diagnosticozona';
import { Guiazona } from './components/guiazona/guiazona';

import { Plantaslistar } from './components/plantas/plantaslistar/plantaslistar';
import { Plantainsertar } from './components/plantas/plantainsertar/plantainsertar';

import { Diagnosticolistar } from './components/diagnostico/diagnosticolistar/diagnosticolistar';
import { Diagnosticorinsertar } from './components/diagnostico/diagnosticorinsertar/diagnosticorinsertar';

import { Usuariolistar } from './components/usuario/usuariolistar/usuariolistar';
import { Usuarioregistrar } from './components/usuario/usuarioregistrar/usuarioregistrar';
import { Usuario } from './components/usuario/usuario';

import { Medicion } from './components/medicion/medicion';
import { Medicionlistar } from './components/medicion/medicionlistar/medicionlistar';
import { Medicionregistrar } from './components/medicion/medicionregistrar/medicionregistrar';

import { Guiainsertar } from './components/guia/guiainsertar/guiainsertar';
import { Guialistar } from './components/guia/guialistar/guialistar';

import { PlantIdentifierComponent } from './components/apidiagnostico/apidiagnostico';
import { Rol } from './components/rol/rol';
import { Rollistar } from './components/rol/rollistar/rollistar';
import { rolinsertar } from './components/rol/rolinsertar/rolinsertar';
import { Guiafav } from './components/guiafav/guiafav';
import { Guifavlistar } from './components/guiafav/guifavlistar/guifavlistar';
import { Guifavregistrar } from './components/guiafav/guifavregistrar/guifavregistrar';
import { GuidesComponent } from './components/guia/guia';
import { TipoInteraccion } from './components/tipo-interaccion/tipo-interaccion';
import { Tipointeraccionlistar } from './components/tipo-interaccion/tipointeraccionlistar/tipointeraccionlistar';
import { Tipointeraccionrinsertar } from './components/tipo-interaccion/tipointeraccionrinsertar/tipointeraccionrinsertar';
import { Recordatorio } from './components/recordatorio/recordatorio';
import { Recordatoriolistar } from './components/recordatorio/recordatoriolistar/recordatoriolistar';
import { Recordatorioregistrar } from './components/recordatorio/recordatorioregistrar/recordatorioregistrar';
import { Interaccion } from './components/interaccion/interaccion';
import { Interaccionlistar } from './components/interaccion/interaccionlistar/interaccionlistar';
import { Interaccionregistrar } from './components/interaccion/interaccionregistrar/interaccionregistrar';
import { EstadoRecordatorio } from './components/estado-recordatorio/estado-recordatorio';
import { Estadorecordatoriolistar } from './components/estado-recordatorio/estadorecordatoriolistar/estadorecordatoriolistar';
import { Estadorecordatorioinsertar } from './components/estado-recordatorio/estadorecordatorioinsertar/estadorecordatorioinsertar';
import { Especie } from './components/especie/especie';
import { Especielistar } from './components/especie/especielistar/especielistar';
import { Especieregistrar } from './components/especie/especieregistrar/especieregistrar';
import { Tratamiento } from './components/tratamiento/tratamiento';
import { Tratamientolistar } from './components/tratamiento/tratamientolistar/tratamientolistar';
import { Tratamientoregistrar } from './components/tratamiento/tratamientoregistrar/tratamientoregistrar';
import { Autenticador } from './components/autenticador/autenticador';

import { Reportes } from './components/reportes/reportes';
import { guardGuard } from '../guard/seguridad-guard';
import { ReportesUsuario } from './components/reportesusuarios/reportes';
import { Reportecantidaddiagnostico } from './components/reportecantidaddiagnostico/reportecantidaddiagnostico';

export const routes: Routes = [
  { path: '', component: Index },
  {
    path: 'login',
    component: Autenticador,
  },
  { path: 'usuario/agregar', component: Usuarioregistrar },

  { path: 'home', redirectTo: 'app/home', pathMatch: 'full' },
  { path: 'mis-plantas', redirectTo: 'app/mis-plantas', pathMatch: 'full' },
  { path: 'diagnostico', redirectTo: 'app/diagnostico', pathMatch: 'full' },
  { path: 'calendario', redirectTo: 'app/calendario', pathMatch: 'full' },
  { path: 'guias', redirectTo: 'app/guias', pathMatch: 'full' },
  { path: 'comunidad', redirectTo: 'app/comunidad', pathMatch: 'full' },
  { path: 'perfil', redirectTo: 'app/perfil', pathMatch: 'full' },
  { path: 'reportes', redirectTo: 'app/reportes', pathMatch: 'full' },

  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [guardGuard],
    children: [
      {
        path: 'reporteusuario',
        component: ReportesUsuario,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN'] },
      },
      {
        path: 'reportediagnostico',
        component: Reportecantidaddiagnostico,
         canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO'] },
      }
      ,
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
      },

      {
        path: 'mis-plantas',
        component: Plantazona,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
      },

      {
        path: 'diagnostico',
        component: Diagnosticozona,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
      },

      {
        path: 'comunidad',
        component: ComunidadComponent,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'PLANTLOVER'] },
      },

      {
        path: 'perfil',
        component: PerfilComponent,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
      },
      {
        path: 'calendario',
        component: CalendarComponent,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'PLANTLOVER'] },
      },

      {
        path: 'reportes',
        component: Reportes,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN'] },
      },
      { path: 'guias', component: Guiazona },

      {
        path: 'usuario',
        component: Usuario,
        children: [
          {
            path: 'listar',
            component: Usuariolistar,
            canActivate: [guardGuard],
          },
          {
            path: 'editar/:id',
            component: Usuarioregistrar,
            canActivate: [guardGuard],
          },
        ],
      },

      {
        path: 'planta',
        component: Planta,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Plantaslistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Plantainsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
          },
          {
            path: 'editar/:id',
            component: Plantainsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
          },
        ],
      },
      {
        path: 'rol',
        component: Rol,
        children: [
          {
            path: 'listar',
            component: Rollistar,
          },
          {
            path: 'agregar',
            component: rolinsertar,
          },
          {
            path: 'editar/:id',
            component: rolinsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN'] },
          },
        ],
      },
      {
        path: 'diagnostico',
        component: Diagnostico,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Diagnosticolistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Diagnosticorinsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
          {
            path: 'editar/:id',
            component: Diagnosticorinsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
        ],
      },
      {
        path: 'tratamiento',
        component: Tratamiento,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Tratamientolistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Tratamientoregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
          {
            path: 'editar/:id',
            component: Tratamientoregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
        ],
      },
      {
        path: 'diagnostico-admin',
        component: Diagnostico,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Diagnosticolistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Diagnosticorinsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
          {
            path: 'editar/:id',
            component: Diagnosticorinsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
        ],
      },

      {
        path: 'especie',
        component: Especie,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Especielistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Especieregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
          },
          {
            path: 'editar/:id',
            component: Especieregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
          },
        ],
      },
      {
        path: 'tipointeraccion',
        component: TipoInteraccion,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Tipointeraccionlistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Tipointeraccionrinsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'editar/:id',
            component: Tipointeraccionrinsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
        ],
      },
      {
        path: 'recordatorio',
        component: Recordatorio,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Recordatoriolistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Recordatorioregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'editar/:id',
            component: Recordatorioregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
        ],
      },
      {
        path: 'interaccion',
        component: Interaccion,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Interaccionlistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Interaccionregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'editar/:id',
            component: Interaccionregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
        ],
      },
      {
        path: 'estadorecordatorio',
        component: EstadoRecordatorio,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Estadorecordatoriolistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Estadorecordatorioinsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'editar/:id',
            component: Estadorecordatorioinsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
        ],
      },

      {
        path: 'medicion',
        component: Medicion,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Medicionlistar,
            canActivate: [guardGuard],
            data: { rol: ['PLANTLOVER','ADMIN', 'CIENTIFICO'] },
          },
          {
            path: 'agregar',
            component: Medicionregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
          {
            path: 'editar/:id',
            component: Medicionregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
        ],
      },

      {
        path: 'GUIAS',
        component: GuidesComponent,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'CIENTIFICO', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Guialistar,
            canActivate: [guardGuard],
            data: { rol: ['PLANTLOVER','ADMIN', 'CIENTIFICO'] },
          },
          {
            path: 'agregar',
            component: Guiainsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
          {
            path: 'editar/:id',
            component: Guiainsertar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'CIENTIFICO'] },
          },
        ],
      },

      {
        path: 'guia',
        component: Guiazona,
      },
      {
        path: 'guiafav',
        component: Guiafav,
        canActivate: [guardGuard],
        data: { rol: ['ADMIN', 'PLANTLOVER'] },
        children: [
          {
            path: 'listar',
            component: Guifavlistar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'agregar',
            component: Guifavregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
          {
            path: 'editar/:id',
            component: Guifavregistrar,
            canActivate: [guardGuard],
            data: { rol: ['ADMIN', 'PLANTLOVER'] },
          },
        ],
      },

      { path: 'apidiagnostico', component: PlantIdentifierComponent },

      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'app/message',
    loadComponent: () => import('./components/message/message').then((m) => m.MensajeriaComponent),
  },

  {
    path: 'app/public',
    loadComponent: () => import('./components/public/public').then((m) => m.PublicarComponent),
  },

  { path: '**', redirectTo: '' },
];
