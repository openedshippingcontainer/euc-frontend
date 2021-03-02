interface CommentDTO {
  added: string;
  id: number;
  images: Array<string>;
  locked: YesNo;
  oriBody: string;
  body: string;
  torrent: TorrentType;
  user: UserDTO;
  userId: number;
  username: string;
  youtubes: Array<string>;
}

interface PostDTO {
  added: string;
  body: string;
  editedAt: string;
  editedBy: number;
  formattedBody: string;
  id: number;
  images: Array<string>;
  originalBody: string;
  topic: TopicDTO;
  topicId: number;
  topicName: string;
  user: UserDTO;
  userId: number;
  youtubes: Array<string>;
}