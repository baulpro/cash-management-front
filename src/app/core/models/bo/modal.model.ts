import { ModalType } from "../types/modal.type";

export interface ModalState {
  open: boolean;
  type: ModalType;
  title: string;
  message: string;
  onConfirm?: () => void;
}
