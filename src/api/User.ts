import { HttpClient } from "./HttpClient";

// User API
export const GetProfileByID = (id: string | null) => {
  if (!id)
    return HttpClient<UserDTO>("me");
  return HttpClient<UserDTO>(`user/${id}`);
}

export const GetProfileByUsername = (username: string | null) => {
  if (!username)
    return HttpClient<UserDTO>("me");
  return HttpClient<UserDTO>(`user/username/${username}`);
}

export const SearchUser = (username: string) => (
  HttpClient<Array<string>>(`username/search?username=${username}`)
);

export const GetPreferences = () => (
  HttpClient<UserDTO>("preferences")
);

export const SavePreferences = (
  view_xxx: boolean,
  accept_pms: boolean,
  delete_pms: boolean,
  save_pms: boolean,
  pm_notifs: boolean
) => (
  HttpClient<ResponseObject>(
    "preferences/save",
    {
      body: {
        "viewXxx": view_xxx ? "YES" : "NO",
        "acceptPms": accept_pms ? "YES" : "NO",
        "deletePms": delete_pms ? "YES" : "NO",
        "savePms": save_pms ? "YES" : "NO",
        "pmNotifs": pm_notifs ? "YES" : "NO",
      }
    }
  )
);

export const GetLastActiveUsers = () => (
  HttpClient<PagedResult<UserDTO>>("lastActiveUsers")
);

export const GetUsersActiveInLastDay = () => (
  HttpClient<Array<UserDTO>>("dayActiveUsers")
);

// Private message API
export const GetInbox = (page: number) => (
  HttpClient<PagedResult<MessageDTO>>(`inbox?page=${page}`)
);

export const GetOutbox = (page: number) => (
  HttpClient<PagedResult<MessageDTO>>(`sentbox?page=${page}`)
);

export const SearchPrivateMessages = (page: number, text: string) => (
  HttpClient<PagedResult<MessageDTO>>(`message/search?page=${page}&text=${text}`)
);

export const GetPrivateMessage = (id: number) => (
  HttpClient<MessageDTO>(`message/${id}`)
);

export const SendPrivateMessage = (user_id: number, text: string) => (
  HttpClient<ResponseObject>(
    "message/sendpm",
    {
      body: { "id": user_id, "text": text }
    }
  )
);

export const SendPrivateMessageByUsername = (username: string, text: string) => (
  HttpClient<ResponseObject>(
    "message/sendpm",
    {
      body: { "username": username, "text": text }
    }
  )
);

export const DeletePrivateMessage = (id: number) => (
  HttpClient<ResponseObject>(`message/delete/${id}`)
);

// Notifications
export const GetNotifications = () => (
  HttpClient<NotificationDTO>("notifications")
);