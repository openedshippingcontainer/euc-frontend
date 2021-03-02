type EditTorrentRequestFields = "name" | "description" | "quality";
type EditTorrentRequest = Record<
  Partial<EditTorrentRequestFields> & { "categoryId": string },
  string | number
>;