import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FullCalendarModule,
    RouterLink
  ],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CalendarComponent implements OnInit {
  showModal = false;
  editingReminder: any = null;
  reminderForm: FormGroup;
  role: string = '';
  reminders: any[] = [];
  filteredReminders: any[] = [];


  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locale: 'es'
  };

  constructor(private fb: FormBuilder,private loginService: Loginservice) {
    this.reminderForm = this.fb.group({
      id: [0],
      title: ['', Validators.required],
      datetime: ['', Validators.required],
      type: ['Riego'],
      status: ['pending']
    });
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


  ngOnInit() {
    this.loadReminders();
    this.updateCalendarEvents();
    if (this.loginService.verificar()) {
    this.role = this.loginService.showRole();
    }
  }

  loadReminders() {
    const saved = localStorage.getItem('plant-reminders');
    if (saved) {
      this.reminders = JSON.parse(saved);
      this.filteredReminders = [...this.reminders];
    }
  }

  updateCalendarEvents() {
    const events = this.reminders.map(reminder => ({
      id: reminder.id.toString(),
      title: reminder.title,
      start: reminder.datetime,
      color: this.getEventColor(reminder.type),
      extendedProps: {
        type: reminder.type,
        status: reminder.status
      }
    }));
    
    this.calendarOptions.events = events;
  }

  getEventColor(type: string): string {
    const colors: any = {
      'Riego': '#3498db',
      'Fertilizar': '#2ecc71',
      'Poda': '#e74c3c',
      'Revisión': '#f39c12',
      'Otro': '#9b59b6'
    };
    return colors[type] || '#95a5a6';
  }

  handleDateClick(arg: any) {
    this.reminderForm.patchValue({
      datetime: arg.dateStr + 'T10:00:00'
    });
    this.openReminderModal();
  }

  handleEventClick(arg: any) {
    const reminderId = parseInt(arg.event.id);
    const reminder = this.reminders.find(r => r.id === reminderId);
    if (reminder) {
      this.editReminder(reminder);
    }
  }

  openReminderModal(reminder?: any) {
    this.editingReminder = reminder || null;
    
    if (reminder) {
      this.reminderForm.patchValue(reminder);
    } else {
      const now = new Date();
      now.setMinutes(0);
      now.setSeconds(0);
      
      this.reminderForm.reset({
        id: 0,
        title: '',
        datetime: now.toISOString().slice(0, 16),
        type: 'Riego',
        status: 'pending'
      });
    }
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingReminder = null;
  }

  saveReminder() {
    if (this.reminderForm.valid) {
      const formData = this.reminderForm.value;
      
      if (this.editingReminder) {
        const index = this.reminders.findIndex(r => r.id === this.editingReminder.id);
        if (index !== -1) {
          this.reminders[index] = { ...this.reminders[index], ...formData };
        }
      } else {
        const newId = this.reminders.length > 0 ? Math.max(...this.reminders.map(r => r.id)) + 1 : 1;
        this.reminders.push({
          ...formData,
          id: newId
        });
      }
      
      this.saveReminders();
      this.closeModal();
    }
  }

  saveReminders() {
    localStorage.setItem('plant-reminders', JSON.stringify(this.reminders));
    this.updateCalendarEvents();
    this.filteredReminders = [...this.reminders];
  }

  editReminder(reminder: any) {
    this.openReminderModal(reminder);
  }

  deleteReminder(id: number) {
    if (confirm('¿Estás seguro de eliminar este recordatorio?')) {
      this.reminders = this.reminders.filter(r => r.id !== id);
      this.saveReminders();
    }
  }

  clearAllReminders() {
    if (confirm('¿Estás seguro de eliminar TODOS los recordatorios?')) {
      this.reminders = [];
      this.saveReminders();
    }
  }

  filterReminders(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredReminders = this.reminders.filter(reminder =>
      reminder.title.toLowerCase().includes(searchTerm)
    );
  }

  filterByStatus(event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    
    if (status === 'all') {
      this.filteredReminders = [...this.reminders];
    } else {
      this.filteredReminders = this.reminders.filter(reminder => reminder.status === status);
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}