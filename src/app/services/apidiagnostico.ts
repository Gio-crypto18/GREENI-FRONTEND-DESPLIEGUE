import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlantApiService {
  private plantIdUrl = '/api-plantid/identify'; 

  private plantIdKey = 'lpxCj7hazodFazDonTsRp0x2keVxxeuIgxtcVtAfZeGKWixlhH';

  constructor(private http: HttpClient) { }

  identifyPlant(imageFile: File): Observable<any> {
    const reader = new FileReader();

    return new Observable((observer) => {
      reader.onload = () => {
        const base64Image = (reader.result as string).split(',')[1];

        const body = {
          images: [base64Image],
          modifiers: ["similar_images"],
          plant_details: [
            "common_names",
            "url",
            "description",
            "taxonomy",
            "rank",
            "gbif_id",
            "inaturalist_id",
            "image",
            "synonyms",
            "edible_parts",
            "watering"
          ],
          language: "es"
        };

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Api-Key': this.plantIdKey
        });

   
        this.http.post(this.plantIdUrl, body, { headers }).pipe(
          map((result: any) => this.processPlantData(result)),
          catchError((error: any) => {
            console.error('Error en Plant.id API:', error);

            throw new Error('No se pudo identificar la planta: ' + error.message);
          })
        ).subscribe(observer);
      };

      reader.onerror = (err) => observer.error(err);
      reader.readAsDataURL(imageFile);
    });
  }


  private processPlantData(plantData: any): any {
    if (!plantData.suggestions || plantData.suggestions.length === 0) {
      throw new Error('No se encontraron coincidencias');
    }

    const bestMatch = plantData.suggestions[0];
    const plantDetails = bestMatch.plant_details || {};

    if (bestMatch.probability < 0.30) {
      throw new Error('La imagen no parece contener una planta');
    }
    
    return {
      identification: {
        name: bestMatch.plant_name,
        confidence: (bestMatch.probability * 100).toFixed(1) + '%',
        scientificName: plantDetails.scientific_name || bestMatch.plant_name
      },
      
      taxonomy: {
        family: plantDetails.taxonomy?.family || 'No disponible',
        genus: plantDetails.taxonomy?.genus || 'No disponible',
        order: plantDetails.taxonomy?.order || 'No disponible',
        class: plantDetails.taxonomy?.class || 'No disponible'
      },
      
      commonNames: plantDetails.common_names || ['No disponible'],
      
      description: plantDetails.description?.value || 'Descripción no disponible',
      
      care: {
        watering: plantDetails.watering?.value || 'No disponible',
        edibleParts: plantDetails.edible_parts || []
      },
      
      additionalInfo: {
        url: plantDetails.url || '',
        gbifId: plantDetails.gbif_id || '',
        inaturalistId: plantDetails.inaturalist_id || '',
        rank: plantDetails.rank || ''
      },
      
      media: {
        images: bestMatch.similar_images || []
      },
      
      otherSuggestions: plantData.suggestions.slice(1, 4).map((suggestion: any) => ({
        name: suggestion.plant_name,
        confidence: (suggestion.probability * 100).toFixed(1) + '%',
        scientificName: suggestion.plant_details?.scientific_name || suggestion.plant_name
      }))
    };
  }
}