import { Component, OnInit } from '@angular/core';
import { authService } from '../components/login/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { format, isValid } from 'date-fns';

interface ClienteData {
  id: number;
  cedula: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
}

interface HabitacionData {
  id: number;
  habitacion: string;
  descripcion: string;
  precio: number;
}

interface ReservacionData {
  id: number;
  id_habitacion: number;
  id_cliente: number;
  fechaInicio: Date;
  fechaFin: Date;
  cedula: string;
  habitacion: string;
  fechaInicioString?: string;
  fechaFinString?: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  private apiUrl = 'http://localhost:3000/api/user/hotel';
  sidebarCollapsed = false;

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  clienteData: ClienteData = {
    id: 0, cedula: '', nombre: '', apellidos: '', telefono: '', email: ''
  };

  habitacionData: HabitacionData = {
    id: 0, habitacion: '', descripcion: '', precio: 0
  };

  reservacionData: ReservacionData = {
    id: 0,
    id_habitacion: 1,
    id_cliente: 1,
    fechaInicio: new Date(),
    fechaFin: new Date(),
    cedula: '',
    habitacion: ''
  };

  clientesData: ClienteData[] = [];
  habitacionesData: HabitacionData[] = [];
  reservacionesData: ReservacionData[] = [];

  mostrarClientes: boolean = false;
  mostrarHabitaciones: boolean = false;
  mostrarReservaciones: boolean = false;
  mostrarFormularioCliente: boolean = false;
  mostrarFormularioHabitacion: boolean = false;
  mostrarFormularioReservacion: boolean = false;
  actualizarFormularioCliente: boolean = false;
  actualizarFormularioHabitacion: boolean = false;
  actualizarFormularioReservacion: boolean = false;

  constructor(
    private authService: authService,
    private http: HttpClient,
    private router: Router
  ) {
    this.obtenerClientes();
    this.obtenerHabitaciones();
    this.obtenerReservaciones();
  }

  ngOnInit(): void {}

  // Funciones de visualización
  clientes() {
    this.resetearVistas();
    this.mostrarClientes = true;
  }

  habitaciones() {
    this.resetearVistas();
    this.mostrarHabitaciones = true;
  }

  reservaciones() {
    this.resetearVistas();
    this.mostrarReservaciones = true;
  }

  private resetearVistas() {
    this.mostrarClientes = false;
    this.mostrarHabitaciones = false;
    this.mostrarReservaciones = false;
    this.mostrarFormularioCliente = false;
    this.mostrarFormularioHabitacion = false;
    this.mostrarFormularioReservacion = false;
    this.actualizarFormularioCliente = false;
    this.actualizarFormularioHabitacion = false;
    this.actualizarFormularioReservacion = false;
  }

  // Funciones de formulario
  formularioCliente() {
    this.resetearVistas();
    this.mostrarFormularioCliente = true;
  }

  formularioHabitacion() {
    this.resetearVistas();
    this.mostrarFormularioHabitacion = true;
  }

  formularioReservacion() {
    this.resetearVistas();
    this.mostrarFormularioReservacion = true;
  }

  // Funciones de guardado
  guardarCliente() {
    if (!this.clienteData.cedula || !this.clienteData.nombre || !this.clienteData.apellidos) {
      console.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.http.post(`${this.apiUrl}/save-client`, this.clienteData)
      .subscribe(
        (response: any) => {
          console.log('Cliente guardado:', response);
          this.resetearVistas();
          this.mostrarClientes = true;
          this.obtenerClientes();
        },
        error => console.error('Error al guardar cliente:', error)
      );
  }

  guardarHabitacion() {
    if (!this.habitacionData.habitacion || !this.habitacionData.precio) {
      console.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.http.post(`${this.apiUrl}/save-room`, this.habitacionData)
      .subscribe(
        (response: any) => {
          console.log('Habitación guardada:', response);
          this.resetearVistas();
          this.mostrarHabitaciones = true;
          this.obtenerHabitaciones();
        },
        error => console.error('Error al guardar habitación:', error)
      );
  }

  guardarReservacion() {
    if (!this.reservacionData.id_habitacion || !this.reservacionData.id_cliente ||
        !this.reservacionData.fechaInicio || !this.reservacionData.fechaFin) {
      console.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    const reservacionToSend = {
      ...this.reservacionData,
      fechaInicio: new Date(this.reservacionData.fechaInicio).toISOString(),
      fechaFin: new Date(this.reservacionData.fechaFin).toISOString()
    };

    this.http.post(`${this.apiUrl}/save-reservation`, reservacionToSend)
      .subscribe(
        (response: any) => {
          console.log('Reservación guardada:', response);
          this.resetearVistas();
          this.mostrarReservaciones = true;
          this.obtenerReservaciones();
        },
        error => console.error('Error al guardar reservación:', error)
      );
  }

  // Funciones de obtención
  obtenerClientes() {
    this.http.get<any>(`${this.apiUrl}/get-clients`)
      .subscribe(
        (response: any) => {
          if (response.status && response.data) {
            this.clientesData = response.data.map((item: any) => ({
              id: item._id,
              cedula: item.cedula,
              nombre: item.nombre,
              apellidos: item.apellidos,
              telefono: item.telefono || '',
              email: item.email || ''
            }));
          }
        },
        error => console.error('Error al obtener clientes:', error)
      );
  }

  obtenerHabitaciones() {
    this.http.get<any>(`${this.apiUrl}/get-rooms`)
      .subscribe(
        (response: any) => {
          if (response.status && response.data) {
            this.habitacionesData = response.data.map((item: any) => ({
              id: item._id,
              habitacion: item.habitacion,
              descripcion: item.descripcion,
              precio: item.precio
            }));
          }
        },
        error => console.error('Error al obtener habitaciones:', error)
      );
  }

  obtenerReservaciones() {
    this.http.get<any>(`${this.apiUrl}/get-reservations`)
      .subscribe(
        (response: any) => {
          if (response.status && response.data) {
            this.reservacionesData = response.data.map((item: any) => ({
              id: item._id,
              id_habitacion: item.id_habitacion,
              id_cliente: item.id_cliente,
              fechaInicio: new Date(item.fechaInicio),
              fechaFin: new Date(item.fechaFin),
              cedula: item.cliente?.cedula || '',
              habitacion: item.habitacion?.habitacion || '',
              fechaInicioString: new Date(item.fechaInicio).toLocaleDateString(),
              fechaFinString: new Date(item.fechaFin).toLocaleDateString()
            }));
          }
        },
        error => console.error('Error al obtener reservaciones:', error)
      );
  }

  // Funciones de eliminación
  eliminarCliente(id: number) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
        this.http.delete(`${this.apiUrl}/delete-client/${id}`)
            .subscribe({
                next: (response: any) => {
                    if (response.status) {
                        console.log('Cliente eliminado:', response);
                        this.obtenerClientes();
                    } else {
                        console.error('Error:', response.message);
                    }
                },
                error: (error) => console.error('Error al eliminar cliente:', error)
            });
    }
}

  eliminarHabitacion(id: number) {
    this.http.delete(`${this.apiUrl}/delete-room/${id}`)
      .subscribe(
        response => {
          console.log('Habitación eliminada:', response);
          this.obtenerHabitaciones();
        },
        error => console.error('Error al eliminar habitación:', error)
      );
  }

  eliminarReservacion(id: number) {
    this.http.delete(`${this.apiUrl}/delete-reservation/${id}`)
      .subscribe(
        response => {
          console.log('Reservación eliminada:', response);
          this.obtenerReservaciones();
        },
        error => console.error('Error al eliminar reservación:', error)
      );
  }

  // Funciones de actualización
  actualizarCliente(id: number) {
    this.resetearVistas();
    this.actualizarFormularioCliente = true;
    const clienteEditar = this.clientesData.find(cliente => cliente.id === id);
    if (clienteEditar) {
      this.clienteData = { ...clienteEditar };
    }
  }

  guardarEdicionCliente() {
    if (!this.clienteData.cedula || !this.clienteData.nombre || !this.clienteData.apellidos) {
      console.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.http.put(`${this.apiUrl}/update-client/${this.clienteData.id}`, this.clienteData)
      .subscribe(
        response => {
          console.log('Cliente actualizado:', response);
          this.resetearVistas();
          this.mostrarClientes = true;
          this.obtenerClientes();
        },
        error => console.error('Error al actualizar cliente:', error)
      );
  }

  actualizarHabitacion(id: number) {
    this.resetearVistas();
    this.actualizarFormularioHabitacion = true;
    const habitacionEditar = this.habitacionesData.find(habitacion => habitacion.id === id);
    if (habitacionEditar) {
      this.habitacionData = { ...habitacionEditar };
    }
  }

  guardarEdicionHabitacion() {
    if (!this.habitacionData.habitacion || !this.habitacionData.precio) {
      console.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.http.put(`${this.apiUrl}/update-room/${this.habitacionData.id}`, this.habitacionData)
      .subscribe(
        response => {
          console.log('Habitación actualizada:', response);
          this.resetearVistas();
          this.mostrarHabitaciones = true;
          this.obtenerHabitaciones();
        },
        error => console.error('Error al actualizar habitación:', error)
      );
  }

  actualizarReservacion(id: number) {
    this.resetearVistas();
    this.actualizarFormularioReservacion = true;
    const reservacionEditar = this.reservacionesData.find(reservacion => reservacion.id === id);
    if (reservacionEditar) {
      this.reservacionData = { ...reservacionEditar };
    }
  }

  guardarEdicionReservacion() {
    if (!this.reservacionData.id_habitacion || !this.reservacionData.id_cliente ||
        !this.reservacionData.fechaInicio || !this.reservacionData.fechaFin) {
      console.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    const reservacionToUpdate = {
      ...this.reservacionData,
      fechaInicio: new Date(this.reservacionData.fechaInicio).toISOString(),
      fechaFin: new Date(this.reservacionData.fechaFin).toISOString()
    };

    this.http.put(`${this.apiUrl}/update-reservation/${this.reservacionData.id}`, reservacionToUpdate)
      .subscribe(
        response => {
          console.log('Reservación actualizada:', response);
          this.resetearVistas();
          this.mostrarReservaciones = true;
          this.obtenerReservaciones();
        },
        error => console.error('Error al actualizar reservación:', error)
      );
  }
}

