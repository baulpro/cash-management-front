import { Component, computed, inject } from '@angular/core';
import { ModalService } from '../../../core/services/modal';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {

  private readonly modalService = inject(ModalService);

  readonly state = this.modalService.state;
  readonly headerClass = computed(() => `header-${this.state().type}`)

  onClose(): void {
    this.modalService.close();
  }

  onConfirm(): void {
    const callback = this.state().onConfirm;
    this.modalService.close();
    if (callback) {
      callback();
    }
  }

}
