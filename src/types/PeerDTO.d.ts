interface PeerDTO {
  agent: string;
  connectable: YesNo;
  downloaded: number;
  downloadoffset: number;
  finishedat: number;
  id: number;
  ip: string;
  lastAction: string;
  passkey: string;
  peerId: string;
  port: number;
  seeder: YesNo;
  started: string;
  toGo: number;
  torrentId: number;
  uploaded: number;
  uploadoffset: number;
  user: UserDTO;
}