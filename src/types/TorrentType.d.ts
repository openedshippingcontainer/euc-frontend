interface TorrentTagType {
  id: number;
  name: string;
}

interface WishlistIdType {
  torrentId: number;
  userId: number;
}

interface WishlistType {
  id: WishlistIdType;
}

interface TorrentType {
  added: string;
  banned: YesNo;
  bonusops: string;
  category: CategoryDTO;
  comments: number;
  descr: string;
  doubleul: YesNo;
  filename: string;
  free: YesNo;
  id: number;
  infolink: string;
  lastAction: string;
  leechers: number;
  locked: YesNo;
  name: string;
  nuke: string;
  owner: UserType;
  quality: string;
  searchText: string;
  seeders: number;
  size: number;
  tags: Array<TorrentTagType>;
  timesCompleted: number;
  trash: YesNo;
  uploader: string;
  uploaderInfo: UserDTO;
  visible: YesNo;
  wishilstUserIds: Array<WishlistType>;
}