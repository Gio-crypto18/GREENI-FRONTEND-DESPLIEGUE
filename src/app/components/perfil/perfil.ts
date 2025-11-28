import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Loginservice } from '../../services/loginservice';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class PerfilComponent implements OnInit {
  
  activeTab = 'perfil';
  loading = false;
  user: any = null;
  errorMessage = '';

  profileForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginService: Loginservice
  ) {}

  ngOnInit(): void {
    // DEBUG: Verificar token
    const token = sessionStorage.getItem('token');
    console.log('🔐 Token en sessionStorage:', token);
    
    this.initForms();
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading = true;
    this.errorMessage = '';

    this.loginService.getUsuarioCompleto().subscribe({
      next: (userData) => {
        console.log(' Datos completos desde backend:', userData);
        this.user = userData;
        this.updateFormWithUserData();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar datos:', error);
        this.errorMessage = 'Error al cargar los datos del perfil';
        this.loading = false;

        const basicData = this.loginService.getUsuarioData();
        if (basicData) {
          this.user = basicData;
          this.updateFormWithUserData();
          this.errorMessage += ' - Mostrando datos limitados';
        }
      }
    });
  }

  updateFormWithUserData(): void {
    if (this.profileForm && this.user) {
      this.profileForm.patchValue({
        id: this.user.id || 'N/A',
        fechaIni: this.formatFecha(this.user.fechaIni),
        nombre: this.user.nombre || '',
        email: this.user.email || '',
        activo: this.user.activo !== undefined ? this.user.activo : true,
        rol: this.getRolDisplayName(this.user.rol),
        biografia: this.user.biografia || ''
      });
    }
  }

 private formatFecha(fecha: any): string {
  if (!fecha) return 'N/A';
  
  try {
    if (typeof fecha === 'string') {
      return new Date(fecha).toLocaleDateString('es-ES');
    }
    
    if (fecha.year && fecha.month && fecha.day) {
      const jsMonth = fecha.month - 1;
      const dateObj = new Date(fecha.year, jsMonth, fecha.day);
      return dateObj.toLocaleDateString('es-ES');
    }

    if (fecha instanceof Date) {
      return fecha.toLocaleDateString('es-ES');
    }
  } catch (error) {
    return 'N/A';
  }
  
  return 'N/A';
}

  private getRolDisplayName(rol: any): string {
  if (!rol) return 'Plant Lover';
  
  if (typeof rol === 'object' && rol.tipo) {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Admin',
      'ADMINISTRADOR': 'Admin',
      'CIENTIFICO': 'Científico', 
      'PLANTLOVER': 'Plant Lover',
      'PLANT_LOVER': 'Plant Lover'
    };
    return roleMap[rol.tipo] || 'Plant Lover';
  }
  
  if (typeof rol === 'string') {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Admin',
      'ADMINISTRADOR': 'Admin',
      'CIENTIFICO': 'Científico',
      'PLANTLOVER': 'Plant Lover',
      'PLANT_LOVER': 'Plant Lover'
    };
    return roleMap[rol] || 'Plant Lover';
  }
  
  return 'Plant Lover';
}

  initForms(): void {
    this.profileForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      fechaIni: [{ value: '', disabled: true }],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      activo: [true],
      rol: [{ value: '', disabled: true }], 
      biografia: ['']
    });
  }

  getUserInitials(): string {
    if (!this.user?.nombre) return '—';
    return this.user.nombre
      .split(' ')
      .filter(Boolean)
      .map((name: string) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getUserRoleDisplay(): string {
    return this.getRolDisplayName(this.user?.rol);
  }

  getRoleBadgeClass(): string {
  const rol = this.user?.rol;
  let roleType = '';
  
  if (typeof rol === 'object' && rol.tipo) {
    roleType = rol.tipo;
  } else if (typeof rol === 'string') {
    roleType = rol;
  }
  
  if (roleType === 'ADMIN') return 'role-badge role-admin';
  if (roleType === 'CIENTIFICO') return 'role-badge role-cientifico';
  return 'role-badge role-plantlover';
}

  get avatarClass(): string {
    return `avatar-preview ${this.user?.avatarUrl ? 'has-image' : 'no-image'}`;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  saveProfile(): void {
    console.log('Guardando perfil...', this.profileForm.value);
 
  }

  triggerImageUpload(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onImageUpload(event: Event): void {
  }
}