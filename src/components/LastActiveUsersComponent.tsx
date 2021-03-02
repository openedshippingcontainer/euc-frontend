import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";

import { styled } from "baseui";

import { UserTag } from "./UserTag";
import { LinkAnchor } from "./LinkAnchor";
import { ElevatedPanel } from "./ElevatedPanel";

import * as Api from "../api";

const Bold = styled("span", {
  fontWeight: "bold"
});

export const LastActiveUsersComponent = () => {
  const { data: users, isError } = useQuery(
    "last_active_users",
    () => (
      Api.GetLastActiveUsers()
        .then((response) => {
          response.content = response.content.filter((user) => user);
          return response;
        })
    ),
    { suspense: true }
  );

  if (isError)
    return (<Bold>Greška se dogodila prilikom učitavanja liste poslednje aktivnih korisnika.</Bold>);

  if (!users)
    return null;

  return (
    <ElevatedPanel $subtle>
      <span>
        <Bold>Korisnici prisutni u poslednjih 15min./
          <Link
            to="/previous-day-visitors"
            component={LinkAnchor}
            // @ts-ignore
            $style={{ fontWeight: "bold" }}
          >
            24h
          </Link>:
        </Bold>
        {users.content.map((user: UserDTO) => (
          <UserTag key={user.id} user={user} />
        ))}
      </span>
    </ElevatedPanel>
  );
};