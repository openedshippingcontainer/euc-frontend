import { HttpClient } from "./HttpClient";

export const FetchStaffQuestions = (page: number) => (
  HttpClient<PagedResult<StaffQuestionDTO>>(
    `staffQuestion/getQuestions?page=${page}`
  )
);

export const SubmitStaffQuestion = (text: string) => (
  HttpClient<ResponseObject>(
    "staffQuestion/submitQuestion",
    {
      body: { "text": text }
    }
  )
);

export const SubmitStaffAnswer = (id: number, text: string) => (
  HttpClient<ResponseObject>(
    "staffQuestion/submitAnswer",
    {
      body: { "id": id, "text": text }
    }
  )
);

export const FetchResetEmailRequests = () => (
  HttpClient<Array<ResetEmailRequestDTO>>(
    "getEmailResetRequests"
  )
);

export const DenyResetEmailRequest = (request_id: number, reason: string) => (
  HttpClient<ResponseObject>(
    "cancelEmailResetRequests",
    {
      body: {
        "requestId": request_id,
        "emailBody": reason
      }
    }
  )
);

export const ApproveResetEmailRequest = (
  email: string,
  request_id: number,
  user_id: number,
  username: string
) => (
  HttpClient<ResponseObject>(
    "submitEmailResetRequests",
    {
      body: {
        "email": email,
        "requestId": request_id,
        "userId": user_id,
        "username": username
      }
    }
  )
);

export const SendResetEmailRequest = (
  email: string,
  text: string,
  username: string
) => (
  HttpClient<ResponseObject>(
    "public/reset",
    {
      body: {
        "email": email,
        "text": text,
        "username": username
      }
    }
  )
);