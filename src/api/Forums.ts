import { HttpClient } from "./HttpClient";

export const FetchForum = () => (
  HttpClient<Array<ForumDTO>>("forums")
);

export const FetchForumCategory = (id: number, page: number) => (
  HttpClient<PagedResult<TopicDTO>>(`forum/topicsperpage/${id}?page=${page}`)
);

export const FetchForumTopic = (id: number, page: number) => (
  HttpClient<PagedResult<PostDTO>>(`forum/posts/${id}?page=${page}`)
);

export const FetchUnreadForumTopics = () => (
  HttpClient<Array<UnreadTopicDTO>>(`forum/unread`)
);

export const FetchLatestForumPosts = () => (
  HttpClient<Array<TopicDTO>>("forum/latestPosts")
);

export const ReplyToForumTopic = (id: number, text: string) => (
  HttpClient<ResponseObject>(
    "forum/reply",
    {
      body: { "topicId": id, "text": text }
    }
  )
);

export const NewForumTopic = (
  category_id: number,
  subject: string,
  text: string
) => (
  HttpClient<ResponseObject>(
    "forum/add/topic",
    {
      body: {
        "forumId": category_id,
        "subject": subject,
        "text": text
      }
    }
  )
);

export const EditForumPost = (id: number, text: string) => (
  HttpClient<ResponseObject>(
    "forum/editpost",
    {
      body: { "id": id, "text": text }
    }
  )
);

export const RemoveForumPost = (id: number) => (
  HttpClient<ResponseObject>(`forum/staffdelete/${id}`)
);

export const MarkAllAsRead = () => (
  HttpClient<ResponseObject>(`forum/catchup`)
);