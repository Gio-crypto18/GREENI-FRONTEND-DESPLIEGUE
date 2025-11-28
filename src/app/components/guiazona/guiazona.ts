import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd, RouterOutlet } from '@angular/router';

import { GuiaService } from '../../services/guiaservice';
import { Guiafavoritaservice } from '../../services/Guiafavoritaservice';
import { Guia } from '../../models/Guia';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './guiazona.html',
  styleUrls: ['./guiazona.css'],
})
export class Guiazona implements OnInit {
     role: string = '';
  guides: Guia[] = [];
  favoriteGuides: number[] = [];
  filteredGuides: Guia[] = [];
  activeFilter: string = 'all';
  searchTerm: string = '';
  showModal: boolean = false;
  selectedGuide: Guia | null = null;
  esPaginaPersonalizadas: boolean = false;

  constructor(
    private guiaService: GuiaService,
    private guiaFavoritaService: Guiafavoritaservice,
    private router: Router,
    private loginService: Loginservice
  ) {}

  ngOnInit() {
    
    this.loadGuides();
    this.loadFavorites();

    this.esPaginaPersonalizadas = this.router.url === '/personalizadas';

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.esPaginaPersonalizadas = event.url === '/personalizadas';
      }
    });
    
    if (this.loginService.verificar()) {
    this.role = this.loginService.showRole();
    }
  }

   verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar();
  }
  isAdmin() {
    return this.role === 'ADMIN';
  }

  isCientifico() {
    return this.role === 'CIENTIFICO';
  }

  isPlantLover() {
    return this.role === 'PLANTLOVER';
  }
  loadGuides() {
    this.guiaService.list().subscribe({
      next: (data: Guia[]) => {
        this.guides = data;
        this.filteredGuides = [...this.guides];
        console.log('Guías cargadas:', this.guides);
      },
      error: (error) => {
        console.error('Error cargando guías:', error);
        this.guides = this.getSampleGuides();
        this.filteredGuides = [...this.guides];
      },
    });
  }

  loadFavorites() {
    const saved = localStorage.getItem('guide-favorites');
    if (saved) {
      this.favoriteGuides = JSON.parse(saved);
    }
  }

  filterGuides(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.guides];

    if (this.activeFilter !== 'all') {
      if (this.activeFilter === 'favoritos') {
        filtered = filtered.filter((guide) => this.isFavorite(guide.guiaId));
      } else {
        filtered = filtered.filter((guide) =>
          guide.tipoGuia.toLowerCase().includes(this.activeFilter)
        );
      }
    }

    if (this.activeFilter === 'personalizadas') {
      filtered = filtered.filter(
        (guide) =>
          guide.tipoGuia?.toLowerCase().includes('personal') ||
          guide.tituloGuia?.toLowerCase().includes('personal')
      );
    }

    if (this.searchTerm) {
      filtered = filtered.filter(
        (guide) =>
          guide.tituloGuia.toLowerCase().includes(this.searchTerm) ||
          guide.contenidoGuia.toLowerCase().includes(this.searchTerm) ||
          guide.tipoGuia.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredGuides = filtered;
  }

  toggleFavorite(guideId: number) {
    if (this.isFavorite(guideId)) {
      this.favoriteGuides = this.favoriteGuides.filter((id) => id !== guideId);
    } else {
      this.favoriteGuides.push(guideId);
    }

    this.saveFavorites();
    this.applyFilters();
  }

  isFavorite(guideId: number | undefined): boolean {
    return guideId ? this.favoriteGuides.includes(guideId) : false;
  }

  saveFavorites() {
    localStorage.setItem('guide-favorites', JSON.stringify(this.favoriteGuides));
  }

  openGuideModal(guide: Guia) {
    this.selectedGuide = guide;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedGuide = null;
  }
  getGuideImage(tipoGuia: string | undefined): string {
    const images: { [key: string]: string } = {
      interior: 'assets/guia-bonsai.jpeg',
      exterior: 'assets/guia-monstera.webp',
      cuidados: 'assets/guia-orquidea.jpg',
      riego: 'assets/guia-suculenta.jpeg',
      poda: '/assets/plantas.jpeg',
    };
    return images[tipoGuia?.toLowerCase() || 'interior'] || 'assets/default-plant.jpg';
  }

  getCategoryClass(tipoGuia: string | undefined): string {
    const classes: { [key: string]: string } = {
      interior: 'interior',
      exterior: 'exterior',
      cuidados: 'cuidados',
      riego: 'riego',
      poda: 'poda',
    };
    return classes[tipoGuia?.toLowerCase() || 'interior'] || 'default';
  }

  getShortDescription(contenido: string | undefined): string {
    if (!contenido) return 'Descripción no disponible';
    return contenido.length > 120 ? contenido.substring(0, 120) + '...' : contenido;
  }

  getContentLength(contenido: string | undefined): string {
    if (!contenido) return '0 palabras';
    const wordCount = contenido.split(' ').filter((w) => w.trim().length > 0).length;
    return wordCount > 1 ? `${wordCount} palabras` : '1 palabra';
  }

  crearGuiaPersonalizada() {
    console.log('Creando guía personalizada...');
    alert('Vas a crear una guía personalizada');
  }

  private getSampleGuides(): Guia[] {
    return [
      {
        guiaId: 1,
        tituloGuia: 'Cuidados Básicos de Plantas de Interior',
        tipoGuia: 'interior',
        contenidoGuia:
          'Aprende los fundamentos para mantener tus plantas de interior saludables. Incluye información sobre riego, luz, humedad y fertilización adecuada para diferentes tipos de plantas de interior.',
      },
      {
        guiaId: 2,
        tituloGuia: 'Guía Completa de Riego',
        tipoGuia: 'riego',
        contenidoGuia:
          'Descubre cómo regar correctamente tus plantas según su tipo, estación del año y condiciones ambientales. Aprende a identificar signos de exceso o falta de agua.',
      },
      {
        guiaId: 3,
        tituloGuia: 'Plantas de Exterior Resistentes',
        tipoGuia: 'exterior',
        contenidoGuia:
          'Conoce las mejores plantas para jardines exteriores que requieren poco mantenimiento y son resistentes a diferentes condiciones climáticas.',
      },
      {
        guiaId: 4,
        tituloGuia: 'Técnicas de Poda para Plantas Ornamentales',
        tipoGuia: 'poda',
        contenidoGuia:
          'Aprende cuándo y cómo podar tus plantas ornamentales para promover un crecimiento saludable y mantener su forma estética. Incluye técnicas para diferentes especies.',
      },
      {
        guiaId: 5,
        tituloGuia: 'Cuidados Esenciales para Suculentas',
        tipoGuia: 'cuidados',
        contenidoGuia:
          'Guía específica para el cuidado de suculentas, incluyendo requisitos de luz, riego adecuado, suelo ideal y cómo propagar estas plantas resistentes.',
      },
    ];
  }
}
