import React, { useState } from "react";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from "baseui/modal";
import { Textarea } from "baseui/textarea";
import { FormControl } from "baseui/form-control";

interface ConfirmActionModalProps {
  torrent: TorrentDTO;
  isOpen: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export const TorrentDeleteModal = (
  { torrent, isOpen, onConfirm, onClose }: ConfirmActionModalProps
) => {
  const [reason, setReason] = useState("");

  return (
    <Modal
      animate
      autoFocus
      closeable
      unstable_ModalBackdropScroll
      role="dialog"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHeader>Obriši {torrent.name}</ModalHeader>
      <ModalBody $style={{ marginBottom: 0 }}>
        <FormControl
          label={() => "Unesite razlog za brisanje ovog torenta"}
        >
          <Textarea
            clearable
            value={reason}
            onChange={(event) => setReason(event.currentTarget.value)}
            overrides={{
              Input: { style: { minHeight: "250px", resize: "vertical" } }
            }}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter $style={{ marginTop: 0 }}>
        <ModalButton
          kind="primary"
          onClick={() => {
            onConfirm(reason);
            onClose();
          }}
        >
          Obriši
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
}