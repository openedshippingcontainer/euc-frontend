import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "react-query";

import { styled } from "baseui";
import { Button } from "baseui/button";
import { colors } from "baseui/tokens";
import { toaster } from "baseui/toast";
import { LabelSmall } from "baseui/typography";
import { StyledSpinnerNext } from "baseui/spinner";

import { LinkAnchor } from "./LinkAnchor";
import { RadioGroup } from "./RadioGroup";
import { ElevatedPanel } from "./ElevatedPanel";
import { CenteredLayout } from "./ContentWrapper";

import * as Api from "../api";
import * as Helpers from "../helpers";
import { SendIcon } from "./icons";

const Bold = styled("span", {
  fontWeight: "bold"
});

const Title = styled("h4", {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0
});

const StaffText = styled("span", {
  color: colors.red400
});

interface Props {
  staff: boolean;
  onHomepage: boolean;
  defaultPoll?: PollDTO;
}

interface VoteMutationType {
  poll: PollDTO;
  selection: number;
}

export const PollComponent = ({ staff, onHomepage, defaultPoll }: Props) => {
  const [selection, setSelection] = useState(-1);

  const {
    data: poll,
    isError
  } = useQuery(
    ["poll", staff, defaultPoll],
    () => {
      const callback = (staff ? Api.FetchLastStaffPoll : Api.FetchLastUserPoll);
      return callback().then((response) => response);
    },
    {
      enabled: defaultPoll === undefined,
      initialData: defaultPoll
    }
  );

  const query_client = useQueryClient();
  const vote_mutation = useMutation(
    (mutation: VoteMutationType) => Api.SendPollVote(mutation.poll.id, mutation.selection),
    {
      onSuccess: (data, variables) => {
        query_client.invalidateQueries(["poll", staff]);
        toaster.positive(`Uspešno glasano za opciju ${variables.poll.choices[variables.selection].name}`, {});
      },
      onError: () => {
        toaster.negative(`Greška se dogodila prilikom glasanja za ovu anketu!`, {});
      }
    }
  );

  if (isError)
    return (<Bold>Greška se dogodila prilikom učitavanja ankete.</Bold>);

  return (
    <ElevatedPanel $subtle>
      {!poll ? (
        <CenteredLayout>
          <StyledSpinnerNext />
        </CenteredLayout>
      ) : (
        <>
          {staff ? (
            <Title><StaffText>STAFF:</StaffText>{' '}{poll.question}</Title>
          ) : (
            <Title>{poll.question}</Title>
          )}
          <RadioGroup
            selection={poll.userAnswer !== -1 ? poll.userAnswer : selection}
            setSelection={setSelection}
            choices={poll.choices}
            voted={poll.userAnswer !== -1 || poll.answered === "YES"}
          />
          <LabelSmall>Postavljeno {Helpers.GetFormattedTime(poll.added)}</LabelSmall>
          {poll.answered !== "YES" && selection !== undefined ? (
            <Button
              size="compact"
              startEnhancer={() => <SendIcon inverse />}
              onClick={() => {
                vote_mutation.mutate({
                  poll: poll,
                  selection: selection
                });
              }}
              overrides={{
                Root: {
                  style: ({ $theme }) => ({
                    marginTop: $theme.sizing.scale300
                  })
                }
              }}
            >
              Glasaj!
            </Button>
          ) : null}
          {onHomepage ? (
            <Link
              to={`/polls/${staff ? "staff" : "user"}`}
              component={LinkAnchor}
              // @ts-ignore
              $style={{ marginTop: "8px" }}
            >
              Pogledajte sve{staff ? " staff " : " "}ankete
            </Link>
          ) : null}
        </>
      )}
    </ElevatedPanel>
  );
};