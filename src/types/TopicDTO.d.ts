interface TopicDTO {
  author: UserDTO;
  forumId: number;
  forumName: string;
  id: number;
  lastPost: PostDTO;
  locked: YesNo;
  sticky: YesNo;
  subject: string;
  unread: YesNo;
  userid: number;
  views: number;
  postCount: number;
}