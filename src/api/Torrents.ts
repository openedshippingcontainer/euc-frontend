import { saveAs } from "file-saver";

import { HttpClient } from "./HttpClient";

// NOTE: both `search` and `categories` arguments are supposed to be strings.
// Specifically, `categories` is supposed to be represented as an array,
// with a semi-colon as the separator.
export const FetchOrderedTorrents = (
  page: number,
  sort_column: string,
  sort_order: string,
  search: string | null,
  categories: Array<string>
) => {
  const parameters = new URLSearchParams();
  if (search !== null && search.length !== 0)
    parameters.append("search", search);

  if (categories.length !== 0) {
    let is_first = true;

    let categories_string = "";
    categories.forEach((category) => {
      if (is_first) {
        categories_string += category;
        is_first = false;
      } else {
        categories_string += `;${category}`;
      }
    });

    parameters.append("categories", categories_string);
  }

  // Decode already encoded URI, since encodeURI will be called later
  // If we don't do it, then some symbols will unfortunately get double encoded
  const query = decodeURIComponent(parameters.toString());
  return HttpClient<PagedResult<TorrentDTO>>(
    `browse/full/${page}/35/${sort_column}/${sort_order}${
      (query.length !== 0) ? `?${query}` : ""
    }`
  );
};

export const FetchMovies = (page: number) => (
  HttpClient<PagedResult<TorrentDTO>>(`browse/movies?page=${page}`)
);

export const FetchTvShows = (page: number) => (
  HttpClient<PagedResult<TorrentDTO>>(`browse/tvshows?page=${page}`)
);

export const FetchHotTorrents = () => (
  HttpClient<Array<TorrentDTO>>("browse/hot")
);

export const FetchNeededSeeders = () => (
  HttpClient<Array<TorrentDTO>>("needseeders")
);

export const FetchTorrentDetails = (id: number) => (
  HttpClient<TorrentDTO>(`details/${id}`)
);

export const FetchTorrentPeers = (id: number) => (
  HttpClient<Array<PeerDTO>>(`peers/${id}`)
);

export const FetchTorrentFiles = (id: number) => (
  HttpClient<Array<TorrentFile>>(`files/${id}`)
);

export const FetchTorrentComments = (id: number, page: number) => (
  HttpClient<PagedResult<CommentDTO>>(`comments/torrent/${id}?page=${page}`)
);

export const DownloadTorrent = (
  id: number,
  filename: string
) => (
  HttpClient<Response>(
    `download/${id}/${filename}`,
    {
      headers: { "Content-Type": "application/x-bittorrent" }
    }
  )
    .then((response) => response.blob())
    .then((blob) => saveAs(
      blob,
      filename.endsWith(".torrent") ? filename : filename + ".torrent"
    ))
    .catch((error) => console.log(error))
);

export const UploadTorrent = (
  category_id: number,
  description: string,
  file: File,
  name: string,
  quality: string,
  requested: (boolean | null) = null,
  request_id: (number | null) = null,
) => {
  const parameters = new URLSearchParams();
  parameters.append("categoryId", category_id.toString());
  parameters.append("description", description);
  parameters.append("name", name);
  parameters.append("quality", quality);

  if (requested && request_id) {
    parameters.append("requested", requested.toString());
    parameters.append("requestId", request_id.toString());
  }

  const form_data = new FormData();
  form_data.append("file", file);

  // Decode already encoded URI, since encodeURI will be called later
  // If we don't do it, then some symbols will unfortunately get double encoded
  const query = decodeURIComponent(parameters.toString());
  return HttpClient<Response>(
    `torrent/upload?${query}`,
    {
      method: "POST",
      body: form_data,
      as_raw_stream: true
    })
    .then((response) => response.text());
}

export const ReplyToTorrent = (id: number, text: string) => (
  HttpClient<ResponseObject>(
    "comment/add",
    {
      body: { "id": id, "text": text }
    }
  )
);

export const EditTorrentComment = (id: number, text: string) => (
  HttpClient<ResponseObject>(
    "comment/edit",
    {
      body: { "id": id, "text": text }
    }
  )
);

export const RemoveTorrentComment = (id: number) => (
  HttpClient<ResponseObject>(`comment/staffdelete/${id}`)
);

export const EditTorrent = (id: number, edit_request: EditTorrentRequest) => (
  HttpClient<ResponseObject>(
    `torrent/edit`,
    { body: { "id": id, ...edit_request } }
  )
);

export const DeleteTorrent = (id: number, reason: string) => (
  HttpClient<ResponseObject>(
    `torrent/delete`,
    {
      body: {
        "id": id,
        "reason": reason
      }
    }
  )
);

export const GetTorrentsDownloadedByUser = (user_id: number) => (
  HttpClient<Array<TorrentDownloadDTO>>(`torrentdownloaded/user/${user_id}`)
);

export const GetUsersWhoDownloadedTorrent = (torrent_id: number) => (
  HttpClient<Array<TorrentDownloadDTO>>(`torrentdownloaded/torrent/${torrent_id}`)
);