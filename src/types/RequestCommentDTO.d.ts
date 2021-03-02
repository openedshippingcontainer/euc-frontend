interface RequestCommentDTO {
  added: string;
  body: string;
  editedAt: string;
  editedBy: UserDTO;
  id: number;
  oriBody: string;
  user: UserDTO;
}