enum UserStatusType {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED"
}

interface UserType {
  avatar: string;
  className: string;
  clazz: number;
  downloaded: number;
  email: string;
  enabled: YesNo;
  fcmEnbabled: boolean;
  id: number;
  parked: YesNo;
  passhash: string;
  passkey: string;
  privacy: string;
  status: UserStatusType;
  uploaded: number;
  username: string;
  viewXxx: YesNo;
  torrentsPerPage: number;
  topicsPerPage: number;
  postsPerPage: number;
  wishlist: Array<number>;
}