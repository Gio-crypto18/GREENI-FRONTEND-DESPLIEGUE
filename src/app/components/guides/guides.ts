import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar'; // 🔁 ajusta la ruta según tu proyecto
import { CommonModule } from '@angular/common';

interface Guide {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'interior' | 'acuaticas' | 'enfermedades';
  favorite: boolean;
  fullContent: string;
}

interface CategoryInfo {
  title: string;
  subtitle: string;
}

interface CategoryRow {
  key: string;
  title: string;
  subtitle: string;
  guides: Guide[];
}

@Component({
  selector: 'app-guides-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './guides.html',
  styleUrl: './guides.css',
})
export class GuidesPageComponent {

  searchTerm = '';
  currentFilter: 'all' | 'favoritos' | 'interior' | 'acuaticas' | 'enfermedades' =
    'all';


  isModalOpen = false;
  selectedGuide: Guide | null = null;


  categoryInfo: Record<string, CategoryInfo> = {
    interior: {
      title: 'Plantas de Interior',
      subtitle: 'Guías para que tus plantas prosperen lejos del sol directo.',
    },
    acuaticas: {
      title: 'Plantas Acuáticas',
      subtitle: 'Descubre cómo mantener un ecosistema acuático saludable.',
    },
    enfermedades: {
      title: 'Enfermedades y Plagas',
      subtitle: 'Aprende a identificar y tratar los problemas más comunes.',
    },
    favoritos: {
      title: 'Mis Favoritos',
      subtitle: 'Tus guías guardadas para un acceso rápido.',
    },
  };


  guides: Guide[] = [
    {
      id: 1,
      title: 'Cuidado de la Monstera Deliciosa',
      description:
        'Aprende a cuidar tu Monstera para que sus hojas crezcan grandes y sanas.',
      image:
        'https://www.farbio.com/cdn/shop/articles/monstera-pflanze-retten-tipps-zur-pflege-456715.png?v=1751286866',
      category: 'interior',
      favorite: true,
      fullContent:
        'La Monstera Deliciosa, también conocida como Costilla de Adán, prefiere la luz indirecta brillante. Un riego excesivo puede causar pudrición de raíces, por lo que es mejor dejar que la capa superior del sustrato se seque entre riegos. Utiliza un fertilizante equilibrado cada mes durante la primavera y el verano.',
    },
    {
      id: 3,
      title: 'Control del Hongo Oídio',
      description:
        'Identifica y elimina el oídio, un hongo común que afecta a muchas plantas.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY7wuLA9rYyybuDx8vfU1cKtpdDyvrpyxJdA&s',
      category: 'enfermedades',
      favorite: false,
      fullContent:
        'El oídio aparece como un polvo blanco en las hojas. Para tratarlo, mejora la circulación de aire alrededor de la planta y evita mojar el follaje. Puedes aplicar un fungicida a base de azufre o neem, o una solución casera de bicarbonato de sodio (una cucharadita por litro de agua con unas gotas de jabón).',
    },
    {
      id: 4,
      title: 'Elodea: La Planta Acuática Perfecta',
      description:
        'Descubre cómo mantener la Elodea, una planta oxigenadora ideal para acuarios.',
      image:
        'https://i0.wp.com/www.fanmascotas.com/wp-content/uploads/2019/09/WhatsApp-Image-2019-09-26-at-19.07.42.jpeg',
      category: 'acuaticas',
      favorite: false,
      fullContent:
        'La Elodea es una planta acuática de crecimiento rápido que ayuda a mantener el agua del acuario limpia y oxigenada. No requiere sustrato, ya que puede flotar libremente o ser anclada. Prefiere aguas con temperaturas entre 10-25°C y una iluminación moderada a alta.',
    },
    {
      id: 5,
      title: 'Ficus Lyrata: Guía Completa',
      description:
        'Todo lo que necesitas saber sobre el popular "árbol lira" para que prospere en tu hogar.',
      image:
        'https://jardinpostal.com/wp-content/uploads/2024/07/Jardin-Postal-comprar-Ficus-Lyrata-cuadrada-1024x1024.png',
      category: 'interior',
      favorite: false,
      fullContent:
        'El Ficus Lyrata necesita luz indirecta muy brillante y no le gustan los cambios bruscos de ubicación o temperatura. Riégalo cuando la parte superior del sustrato esté seca y asegúrate de que la maceta tenga un buen drenaje. Limpia sus grandes hojas con un paño húmedo para ayudar a la fotosíntesis.',
    },
    {
      id: 6,
      title: 'Tratamiento contra la Cochinilla',
      description:
        'Aprende a identificar y eliminar esta plaga tan común en plantas de interior.',
      image:
        'https://resizer.glanacion.com/resizer/v2/la-cochinilla-algodonosa-es-una-plaga-que-afecta-7G3B56I57NHMPICFAWIEH4BENA.jpg?auth=2ad3158f83169814d66ad32997a87a12131a11306fb373d1a4b5e38551520191&width=1200&quality=70&smart=false&height=800',
      category: 'enfermedades',
      favorite: true,
      fullContent:
        'La cochinilla algodonosa se ve como pequeñas motas de algodón en los tallos y hojas. Para eliminarlas, puedes usar un hisopo con alcohol isopropílico para aplicarlo directamente sobre ellas. Para infestaciones más grandes, el aceite de neem es un tratamiento efectivo y natural.',
    },
    {
      id: 7,
      title: 'Mantenimiento de Anubias',
      description:
        'Cuidados esenciales para las Anubias, plantas acuáticas resistentes y de bajo mantenimiento.',
      image:
        'https://cdn.shopify.com/s/files/1/0230/7266/9773/files/Anubias_leaf_algae_1800-min.jpg?v=1623907348',
      category: 'acuaticas',
      favorite: false,
      fullContent:
        'Las Anubias son plantas acuáticas muy resistentes, ideales para principiantes. Lo más importante es no enterrar su rizoma (el tallo horizontal grueso) en el sustrato, ya que se pudrirá. En su lugar, átala a una roca o tronco. Tolera condiciones de baja luz y no requiere fertilización intensiva.',
    },
    {
      id: 8,
      title: 'Guía Completa de Pothos (Epipremnum)',
      description:
        'Cómo cuidar tu Pothos para que trepe y crezca con vigor.',
      image:
        'https://allaboutplanties.com/cdn/shop/articles/8fea0a31af9f6992501385a62e8e1675.jpg?v=1729558541&width=1100',
      category: 'interior',
      favorite: false,
      fullContent:
        'El Pothos tolera desde luz baja hasta media. Riégalo moderadamente, dejando que el sustrato seque parcialmente. Es ideal para colgar en cestas o dejar trepando. Si ves hojas amarillas, ajusta el riego y aporta un fertilizante balanceado cada 2 meses.',
    },
    {
      id: 9,
      title: 'Sansevieria: Lengua de Suegra',
      description: 'Resistente, decorativa y muy fácil de cuidar.',
      image:
        'https://media.revistaad.es/photos/66de987f8441e1877f96f1dc/16:9/w_1411,h_794,c_limit/GettyImages-1336498787.jpg',
      category: 'interior',
      favorite: true,
      fullContent:
        'La Sansevieria prefiere luz indirecta brillante pero soporta poca luz. Riega solo cuando el sustrato esté completamente seco (aprox. cada 3–4 semanas). Evita el exceso de agua para no pudrir las raíces. Colócala en macetas con buen drenaje.',
    },
    {
      id: 10,
      title: 'Dracaena Marginata: Elegancia Vertical',
      description:
        'Guía para mantener tus Dracaenas erguidas y sanas.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlkhqFq9r6f1GQEo4gFRy3qq5N0regGHrj7Q&s',
      category: 'interior',
      favorite: false,
      fullContent:
        'La Dracaena marginata necesita luz indirecta y temperaturas estables entre 18–24 °C. Riega cuando los primeros 2 cm de tierra estén secos. Evita corrientes de aire y fertiliza ligeramente en primavera y verano.',
    },
    {
      id: 11,
      title: 'Prevención del Mildiu Polvoriento',
      description:
        'Cómo evitar y tratar el mildiu en tus plantas de interior.',
      image:
        'https://eos.com/wp-content/uploads/2024/02/powdery-mildew-cultural-treatment.png.webp',
      category: 'enfermedades',
      favorite: false,
      fullContent:
        'El mildiu polvoriento se manifiesta con manchas blancas en hojas y tallos. Mantén buena ventilación y evita el exceso de humedad. Para tratarlo, aplica un fungicida específico o una mezcla de leche diluida al 10 % en agua cada 7 días.',
    },
    {
      id: 12,
      title: 'Cómo Combatir la Mosca Blanca',
      description:
        'Métodos orgánicos y químicos para erradicar mosca blanca.',
      image:
        'https://cdn0.ecologiaverde.com/es/posts/1/8/3/mosca_blanca_como_eliminarla_2381_orig.jpg',
      category: 'enfermedades',
      favorite: true,
      fullContent:
        'La mosca blanca chupa savia y deja melaza en las hojas. Usa trampas adhesivas amarillas para monitoreo. Para un control natural, pulveriza jabón potásico o extracto de neem, y repite cada 10 días hasta su eliminación.',
    },
    {
      id: 13,
      title: 'Guía de Tratamiento contra Roya',
      description:
        'Identifica y detén la roya antes de que se propague.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStKBa5Ydi7V1eznbKvTsGUdml_GQzjor9o2A&s',
      category: 'enfermedades',
      favorite: false,
      fullContent:
        'La roya provoca manchas amarillas u óxido en el envés de las hojas. Retira partes infectadas y mejora la circulación de aire. Aplica un fungicida a base de cobre siguiendo las instrucciones del fabricante.',
    },
    {
      id: 14,
      title: 'Mantenimiento de Vallisneria Americana',
      description:
        'La planta ideal para fondos de acuarios de agua dulce.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_CsNoBRUoM5VPZMGbyS1f9vFuYUGDLUqHOg&s',
      category: 'acuaticas',
      favorite: false,
      fullContent:
        'La Vallisneria prospera en aguas frías y templadas. Siembra rizomas en sustrato fino y provee iluminación moderada. Retira hojas viejas para estimular el crecimiento. Es muy eficiente para oxigenar el agua.',
    },
    {
      id: 15,
      title: 'Cultivo de Cabomba',
      description:
        'Cómo establecer y mantener tu Cabomba caroliniana.',
      image:
        'https://www.2hraquarist.com/cdn/shop/articles/Cabomba_furcata_1800-min_7f973ad6-1c8c-4132-83d3-f8d723db7d4c_1799x.jpg?v=1742537064',
      category: 'acuaticas',
      favorite: false,
      fullContent:
        'La Cabomba requiere luz intensa y CO₂ añadido para un crecimiento óptimo. Coloca los tallos en sustrato arenoso y controla la velocidad del agua. El poda regular previene el exceso de biomasa.',
    },
    {
      id: 16,
      title: 'Guía de Cuidado de Rotala Rotundifolia',
      description:
        'Planta de tallos finos y hojas coloridas para acuarios.',
      image: 'https://i.redd.it/clpjordz4jq01.jpg',
      category: 'acuaticas',
      favorite: false,
      fullContent:
        'La Rotala prefiere iluminación alta y aporte de CO₂. Planta varios esquejes en sustrato nutritivo y mantén nitratos y fosfatos estables. Poda regularmente para formar matorrales densos.',
    },
  ];


  get filteredCategoryRows(): CategoryRow[] {
    const term = this.searchTerm.toLowerCase().trim();

    const filtered = this.guides.filter((g) => {
      const matchesText =
        g.title.toLowerCase().includes(term) ||
        g.description.toLowerCase().includes(term);

      if (this.currentFilter === 'all') return matchesText;
      if (this.currentFilter === 'favoritos') return g.favorite && matchesText;
      return g.category === this.currentFilter && matchesText;
    });

    if (!filtered.length) return [];

    if (this.currentFilter === 'favoritos') {
      const info = this.categoryInfo['favoritos'];
      return [
        {
          key: 'favoritos',
          title: info.title,
          subtitle: info.subtitle,
          guides: filtered,
        },
      ];
    }

    const grouped: Record<string, Guide[]> = {};
    filtered.forEach((g) => {
      if (!grouped[g.category]) grouped[g.category] = [];
      grouped[g.category].push(g);
    });

    const rows: CategoryRow[] = [];
    Object.keys(grouped).forEach((key) => {
      const info = this.categoryInfo[key] || {
        title: key,
        subtitle: '',
      };
      rows.push({
        key,
        title: info.title,
        subtitle: info.subtitle,
        guides: grouped[key],
      });
    });

    return rows;
  }


  setFilter(filter: 'all' | 'favoritos' | 'interior' | 'acuaticas' | 'enfermedades') {
    this.currentFilter = filter;
  }

  toggleFavorite(guide: Guide, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    guide.favorite = !guide.favorite;
  }

  openModal(guide: Guide, event?: MouseEvent): void {
    if (event) event.preventDefault();
    this.selectedGuide = guide;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedGuide = null;
    document.body.style.overflow = '';
  }


  scrollCarousel(container: HTMLElement, direction: 'prev' | 'next'): void {
    const amount = container.clientWidth * 0.9;
    container.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  }
}
