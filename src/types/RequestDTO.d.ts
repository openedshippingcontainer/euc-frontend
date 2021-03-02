interface RequestDTO {
  added: string;
  category: CategoryDTO;
  commentList: Array<RequestCommentDTO>;
  comments: number;
  description: string;
  filled: string;
  filledDate: string;
  filler: UserDTO;
  hits: number;
  id: number;
  request: string;
  requester: UserDTO;
}