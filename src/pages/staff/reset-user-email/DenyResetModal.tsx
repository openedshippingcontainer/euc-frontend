import React, { useState } from "react";

import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton
} from "baseui/modal";
import { toaster } from "baseui/toast";
import { Textarea } from "baseui/textarea";
import { FormControl } from "baseui/form-control";

import * as Api from "../../../api";
import { LabelSmall } from "baseui/typography";

interface DenyResetModalProps {
  deniedRequest: ResetEmailRequestDTO | null;
  refetch: () => void;
  onModalClose: () => void;
}

export const DenyResetModal = ({
  deniedRequest,
  refetch,
  onModalClose
}: DenyResetModalProps) => {
  const [message, setMessage] = useState("");

  const OnDeny = () => {
    if (!deniedRequest)
      return;

    Api.DenyResetEmailRequest(deniedRequest.id, message)
      .then(() => {
        refetch();
        onModalClose();
      })
      .catch(() => {
        toaster.negative("Greška se dogodila prilikom odobravanja zahteva", {});
      });
  }

  if (!deniedRequest)
    return null;

  return (
    <Modal
      animate
      autoFocus
      closeable
      unstable_ModalBackdropScroll
      role="dialog"
      onClose={onModalClose}
      isOpen={deniedRequest !== null}
    >
      <ModalHeader>
        Obrazložite poništenje zahteva
        <LabelSmall color="contentSecondary">
          Ukoliko ne unesete poruku, nikakav mejl neće biti poslat.
        </LabelSmall>
      </ModalHeader>
      <ModalBody $style={{ marginBottom: 0 }}>
        <br />
        <FormControl
          label={() => "Zdravo,"}
          caption={() => (
            <LabelSmall>
              --
              <br />
              EliteUnitedCrew
            </LabelSmall>
          )}
        >
          <Textarea
            clearable
            placeholder="nismo uspeli da potvrdimo tvoj identitet, pa te molimo da nam proslediš sledeće informacije (na isti način kao što si poslao i prvobitan zahtev): ..."
            value={message}
            onChange={(event) => setMessage(event.currentTarget.value)}
            overrides={{
              Input: { style: { minHeight: "200px", resize: "vertical" } }
            }}
          />
        </FormControl>
      </ModalBody>
      <ModalFooter $style={{ marginTop: 0 }}>
        <ModalButton
          kind="primary"
          onClick={OnDeny}
        >
          Poništi zahtev
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