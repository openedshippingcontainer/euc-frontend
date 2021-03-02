interface UnreadTopicDTO {
  id: number;
  lastPost: number;
  subject: string;
  topicLastPost: number;
  postCount: number;
  unread: boolean;
}