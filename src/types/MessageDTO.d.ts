enum MessageDirectionType {
  IN = "IN",
  OUT = "OUT",
  BOTH = "BOTH"
}

interface MessageQuotesDTO {
  name: string;
  quote: string;
}

interface MessageDTO {
  added: string;
  hint: string;
  id: number;
  location: MessageDirectionType;
  msg: string;
  poster: number;
  quotes: Array<MessageQuotesDTO>;
  receiver: UserDTO;
  receiverUsername: string;
  sender: UserDTO;
  senderUsername: string;
  unread: YesNo;
}