import { HttpClient } from "./HttpClient";

export const FetchTorrentSubs = (id: number) => (
  HttpClient<Array<SubtitleDTO>>(`subs/${id}`)
);

export const AddSubtitle = (
  language: string,
  link: string,
  torrent_id: number
) => (
  HttpClient<ResponseObject>(
    `subs/add`,
    {
      body: {
        "lang": language,
        "link": link,
        "torrentId": torrent_id
      }
    }
  )
);

export const EditSubtitle = (
  language: string,
  link: string,
  subtitle_id: number
) => (
  HttpClient<ResponseObject>(
    `subs/edit`,
    {
      body: {
        "lang": language,
        "link": link,
        "subId": subtitle_id
      }
    }
  )
);

export const DeleteSubtitle = (id: number) => (
  HttpClient<ResponseObject>(`subs/staffdelete/${id}`)
);