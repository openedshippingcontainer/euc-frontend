import React from "react";

import ReadPng from "./read.png";
import UnreadPng from "./unread.png";
import LockedPng from "./locked.png";

const ReadIcon = () => (<img src={ReadPng} />);
const UnreadIcon = () => (<img src={UnreadPng} />);
const LockedIcon = () => (<img src={LockedPng} />);

export const GetIcon = (locked: boolean, unread: boolean) => {
  if (locked)
    return LockedIcon;
  return unread ? UnreadIcon : ReadIcon;
}