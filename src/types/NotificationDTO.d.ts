interface NotificationDTO {
  creationDate: string;
  newPM: boolean;
  newPost: boolean;
  // Indicates whether there is a new staff question
  // Always false for non-staff users
  newSQ: boolean;
  newTorrent: boolean;
  newCommentOnMyTorrent: Array<number>;
}