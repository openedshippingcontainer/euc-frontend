import React, { useState } from "react";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from "baseui/modal";
import { Input } from "baseui/input";
import { toaster } from "baseui/toast";
import { FormControl } from "baseui/form-control";

import * as Api from "../../../api";

interface ApproveResetModalProps {
  approvedRequest: ResetEmailRequestDTO | null;
  refetch: () => void;
  onModalClose: () => void;
}

export const ApproveResetModal = ({
  approvedRequest,
  refetch,
  onModalClose
}: ApproveResetModalProps) => {
  const [user_id, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [new_email, setNewEmail] = useState("");

  const OnApprove = () => {
    if (!approvedRequest)
      return;

    Api.ApproveResetEmailRequest(new_email, approvedRequest.id, +user_id, username)
      .then(() => {
        refetch();
        onModalClose();
      })
      .catch(() => {
        toaster.negative("Greška se dogodila prilikom odobravanja zahteva", {});
      });
  }

  if (!approvedRequest)
    return null;

  return (
    <Modal
      animate
      autoFocus
      closeable
      unstable_ModalBackdropScroll
      role="dialog"
      onClose={onModalClose}
      isOpen={approvedRequest !== null}
    >
      <ModalHeader>
        Da li ste sigurni da želite da odobrite zahtev ovog korisnika?
      </ModalHeader>
      <ModalBody $style={{ marginBottom: 0 }}>
        <FormControl
          label={() => "ID korisnika"}
        >
          <Input
            required
            name="userid"
            onChange={(event) => setUserId(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl
          label={() => `Korisničko ime (${approvedRequest.username})`}
        >
          <Input
            required
            name="username"
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
        </FormControl>
        <FormControl
          label={() => `Nova E-mail adresa (${approvedRequest.email})`}
        >
          <Input
            required
            name="new_email"
            onChange={(event) => setNewEmail(event.currentTarget.value)}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter $style={{ marginTop: 0 }}>
        <ModalButton
          kind="primary"
          onClick={OnApprove}
          disabled={
            user_id === "" ||
            username === "" ||
            new_email === ""
          }
        >
          Odobri
        </ModalButton>
        <ModalButton
          kind="tertiary"
          onClick={onModalClose}
        >
          Nazad
        </ModalButton>
      </ModalFooter>
    </Modal>
  );
}