import { HttpClient } from "./HttpClient";

export const FetchShouts = () => (
  HttpClient<Array<ShoutboxDTO>>("shoutbox")
);

export const FetchShoutsDelta = (timestamp: number) => (
  HttpClient<Array<ShoutboxDTO>>(`shoutbox/id/delta/${timestamp}`)
);

export const SendShout = (message: string) => (
  HttpClient<ResponseObject>(
    "shoutbox/add",
    {
      body: { "message": message }
    }
  )
);

export const RemoveShout = (id: number) => (
  HttpClient<ResponseObject>(`shoutbox/remove/${id}`)
);