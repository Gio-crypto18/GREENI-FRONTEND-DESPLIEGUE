import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensajesapiService {

frases: string[] = [
  "¡Cada pequeño paso cuenta hacia un gran cambio!",
  "Cree en ti y en el poder de tus acciones.",
  "Haz algo hoy que tu yo del futuro agradecerá.",
  "Tu esfuerzo deja huella en el planeta.",
  "No tienes que ser perfecto, solo constante.",
  "El cambio empieza contigo, aquí y ahora.",
  "La constancia transforma hábitos en resultados.",
  "Cuidar el planeta también es cuidarte a ti.",
  "Tus decisiones diarias construyen el futuro.",
  "Eres capaz de más de lo que imaginas.",
  "Ser ecológico no es una moda, es una misión.",
  "Lo importante no es cuánto haces, sino que nunca dejes de intentarlo.",
  "Suma acciones verdes, resta indiferencia.",
  "La sostenibilidad no es un objetivo, es un camino.",
  "Cada acto consciente es un paso hacia un mundo mejor.",
  "Tu ejemplo puede inspirar a cientos más.",
  "La diferencia no la hacen los demás, la haces tú.",
  "Haz del respeto por la naturaleza un estilo de vida.",
  "Recuerda: hoy también es un buen día para comenzar.",
  "El impacto más grande empieza con la decisión más pequeña."
];

 obtenerFraseAleatoria(): string {
    const index = Math.floor(Math.random() * this.frases.length);
    return this.frases[index];
  }
}