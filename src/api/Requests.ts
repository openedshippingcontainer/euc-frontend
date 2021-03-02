import { HttpClient } from "./HttpClient";

export const FetchRequests = () => HttpClient<Array<RequestDTO>>("requests");
export const FetchRequest = (request_id: number) => (
  HttpClient<RequestDTO>(`request/${request_id}`)
);

export const AddRequest = (
  category_id: number,
  title: string,
  description: string
) => (
  HttpClient<ResponseObject>(
    "request/add",
    {
      body: {
        "categoryId": category_id,
        "request": title,
        "description": description
      }
    }
  )
);

export const DeleteRequest = (id: number) => (
  HttpClient<ResponseObject>(`request/delete/${id}`)
);

export const ResetRequest = (id: number) => (
  HttpClient<ResponseObject>(`request/reset/${id}`)
);

export const SendRequestComment = (
  request_id: number,
  text: string
) => (
  HttpClient<ResponseObject>(
    "request/comment/add",
    {
      body: {
        "requestId": request_id,
        "text": text
      }
    }
  )
);

export const EditRequestComment = (id: number, text: string) => (
  HttpClient<ResponseObject>(
    "request/comment/edit",
    {
      body: { "requestId": id, "text": text }
    }
  )
);

export const RemoveRequestComment = (id: number) => (
  HttpClient<ResponseObject>(`request/comment/staffdelete/${id}`)
);