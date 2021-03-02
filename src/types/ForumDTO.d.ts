interface ForumCategory {
  id: number;
  name: string;
}

interface ForumDTO {
  category: ForumCategory;
  categoryId: number;
  description: string;
  id: number;
  lastForumPost: PostDTO;
  minClassCreate: number;
  minClassRead: number;
  minClassWrite: number;
  name: string;
  postCount: number;
  sort: number;
  topicCount: number;
  unread: YesNo;
}