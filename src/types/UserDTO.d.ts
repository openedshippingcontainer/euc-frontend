interface Country {
  flagpic: string;
  hide: number;
  id: number;
  name: string;
}

enum UserAcceptPmsChoice {
  YES = "YES",
  FRIENDS = "FRIENDS",
  NO = "NO"
}

interface UserDTO {
  acceptPms: UserAcceptPmsChoice;
  added: string;
  avatar: string;
  className: string;
  clazz: number;
  country: Country;
  countryId: number;
  deletePms: YesNo;
  downloaded: number;
  email: string;
  emailNotifs: YesNo;
  enabled: YesNo;
  extra: string;
  fcmEnbabled: boolean;
  id: number;
  info: string;
  lastAccess: string;
  lastBrowse: string;
  parked: YesNo;
  passhash: string;
  passkey: string;
  pmNotifs: YesNo;
  postsPerPage: number;
  ratio: number;
  savePms: YesNo;
  signature: string;
  status: YesNo;
  title: string;
  topicsPerPage: number;
  torrentsPerPage: number;
  uploaded: number;
  username: string;
  viewAvatars: YesNo;
  viewSignatures: YesNo;
  viewTurbo: YesNo;
  viewXxx: YesNo;
  wishlist: Array<number>;
}