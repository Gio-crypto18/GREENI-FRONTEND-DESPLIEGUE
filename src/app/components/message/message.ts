import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar'; 

interface Contact {
  name: string;
  avatar: string;
  status: string;
  memberSince: string;
}

interface ChatMessage {
  sender: 'me' | 'them';
  text: string;
}

@Component({
  selector: 'app-mensajeria',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar],
  templateUrl: './message.html',
  styleUrl:'./message.css',
})
export class MensajeriaComponent {
  contacts: Contact[] = [
    {
      name: 'Juan Pérez',
      avatar: 'https://i.pravatar.cc/120?img=11',
      status: 'Activo',
      memberSince: '2024',
    },
    {
      name: 'Ana López',
      avatar: 'https://i.pravatar.cc/120?img=12',
      status: 'Activo',
      memberSince: '2023',
    },
    {
      name: 'Pedro Sánchez',
      avatar: 'https://i.pravatar.cc/120?img=13',
      status: 'Inactivo',
      memberSince: '2022',
    },
    {
      name: 'Daniela Flores',
      avatar: 'https://i.pravatar.cc/120?img=14',
      status: 'Activo',
      memberSince: '2024',
    },
    {
      name: 'Soporte Greeni',
      avatar: 'assets/logo-greeni.png',
      status: 'Activo',
      memberSince: '2024',
    },
  ];

  conversations: Record<string, ChatMessage[]> = {
    'Juan Pérez': [],
    'Ana López': [],
    'Pedro Sánchez': [],
    'Daniela Flores': [],
    'Soporte Greeni': [],
  };

  currentContact: Contact | null = null;
  messages: ChatMessage[] = [];
  messageText = '';


  isModalOpen = false;

  selectContact(contact: Contact): void {
    this.currentContact = contact;
    if (!this.conversations[contact.name]) {
      this.conversations[contact.name] = [];
    }
    this.messages = this.conversations[contact.name];
  }

  sendMessage(): void {
    const text = this.messageText.trim();
    if (!this.currentContact) {
      alert('Selecciona un contacto antes de enviar un mensaje.');
      return;
    }
    if (!text) return;

    const msg: ChatMessage = { sender: 'me', text };
    this.conversations[this.currentContact.name].push(msg);
    this.messages = this.conversations[this.currentContact.name];
    this.messageText = '';
  }


  openProfile(): void {
    if (!this.currentContact) {
      alert('Primero selecciona un contacto');
      return;
    }
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeProfile(): void {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }
}
