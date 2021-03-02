import React from "react";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from "baseui/modal";

interface ConfirmActionModalProps {
  title: string;
  body?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmActionModal = (
  { title, body, isOpen, onConfirm, onClose }: ConfirmActionModalProps
) => (
  <Modal
    animate
    autoFocus
    closeable
    unstable_ModalBackdropScroll
    role="dialog"
    isOpen={isOpen}
    onClose={onClose}
  >
    <ModalHeader>{title}</ModalHeader>
    <ModalBody $style={{ marginBottom: 0 }}>
      {body !== undefined ? body : "Da li ste sigurni da želite da izvršite ovu naredbu?"}
    </ModalBody>
    <ModalFooter $style={{ marginTop: 0 }}>
      <ModalButton
        kind="primary"
        onClick={onConfirm}
      >
        Da
      </ModalButton>
      <ModalButton
        kind="tertiary"
        onClick={onClose}
      >
        Nazad
      </ModalButton>
    </ModalFooter>
  </Modal>
);