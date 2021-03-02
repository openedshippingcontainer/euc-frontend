interface ResetEmailRequestDTO {
  created: string;
  done: boolean;
  email: string;
  id: number;
  lastModified: string;
  moderator?: UserDTO;
  text: string;
  username: string;
  valid: YesNo;
}