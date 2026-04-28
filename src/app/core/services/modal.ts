import { Injectable, signal } from '@angular/core';
import { ModalState } from '../models/bo/modal.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  private readonly _state = signal<ModalState>({
    open: false,
    type: 'info',
    title: '',
    message: '',
  });

  readonly state = this._state.asReadonly();

  success(message: string, title = 'Success'): void {
    this._state.set({ open: true, type: 'success', title, message });
  }

  error(message: string, title = 'Error'): void {
    this._state.set({ open: true, type: 'error', title, message });
  }

  info(message: string, title = 'Information'): void {
    this._state.set({ open: true, type: 'info', title, message });
  }

  confirm(message: string, onConfirm: () => void, title = 'Confirm'): void {
    this._state.set({ open: true, type: 'confirm', title, message, onConfirm });
  }

  close(): void {
    this._state.set({ open: false, type: 'info', title: '', message: '' });
  }

}
