import React from "react";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from "baseui/modal";

import { CommentInputComponent } from "./CommentInputComponent";

interface CommentEditModalProps {
  id: number;
  content: string;
  type: CommentInputType;
  onClose: () => void;
  onRefresh: () => void;
}

export const CommentEditModal = (
  { id, content, type, onClose, onRefresh }: CommentEditModalProps
) => (
  <Modal
    animate
    autoFocus
    closeable
    unstable_ModalBackdropScroll
    size="auto"
    role="dialog"
    isOpen={content !== null}
    onClose={onClose}
  >
    <ModalHeader>Izmenite poruku</ModalHeader>
    <ModalBody $style={{ marginBottom: 0 }}>
      <CommentInputComponent
        id={id}
        type={(type + "-edit") as CommentInputType}
        defaultText={content}
        onSubmit={() => {
          onClose();
          onRefresh();
        }}
      />
    </ModalBody>
    <ModalFooter $style={{ marginTop: 0 }}>
      <ModalButton
        kind="tertiary"
        onClick={onClose}
      >
        Nazad
      </ModalButton>
    </ModalFooter>
  </Modal>
);