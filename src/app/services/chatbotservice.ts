import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private readonly apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly apiKey =
    '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';

  constructor(private http: HttpClient) {}

  getChatResponse(pregunta: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'GreenImpact App',
    });

    const body = {
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'user',
          content: `Eres un especialista en medio ambiente, botánica y jardinería responsable de brindar orientación únicamente sobre estos temas. 

Debes responder preguntas relacionadas con:
- Cuidado y mantenimiento de plantas
- Diagnóstico de plagas y enfermedades vegetales
- Ecología, sostenibilidad y medio ambiente
- Botánica, horticultura y jardinería

Si el usuario realiza una consulta que no esté relacionada con plantas (temas botánicos), debes responder de manera educada y profesional. Indica que solo puedes asistir en temas de plantas, utilizando una frase similar a: 'Lo lamento, pero te ayudaría o asistiría mejor si hablamos de plantas.' Redirige la conversación invitando al usuario a hacer una pregunta botánica.
. Responde esta pregunta: ${pregunta}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    };

    console.log('🔗 Enviando solicitud a OpenRouter...');
    console.log('📝 Pregunta:', pregunta);
    console.log('🔐 Headers:', headers);
    console.log('📦 Body:', JSON.stringify(body, null, 2));

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      tap((response) => {
        console.log('✅ Respuesta recibida:', response);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error completo:', error);
        console.error('🔍 Status:', error.status);
        console.error('🔍 Error message:', error.message);
        console.error('🔍 Error response:', error.error);

        return throwError(
          'Ocurrió un error al consultar la IA. Revisa la consola para más detalles.'
        );
      })
    );
  }
}
