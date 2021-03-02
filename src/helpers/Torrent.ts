import { OptgroupsT } from "baseui/select";

// Copy-pasted from https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
export function GetSizeFromBytes(
  bytes: number,
  decimals = 2
): string {
  if (bytes === 0)
    return "0 B";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export const HasPoster = (torrent: TorrentDTO) : boolean => (
  torrent.mediaInfo && torrent.mediaTorrent &&
  torrent.mediaInfo.info.asset.poster_medium !== "false"
);

export const GetMediaTorrentName = (torrent: TorrentDTO): string => {
  const title = torrent.mediaInfo.info.asset.title;

  const original_title = torrent.mediaInfo.info.asset.original_title;
  if (original_title && original_title !== title)
    return `${original_title} (${title})`;

  const name = torrent.mediaInfo.info.asset.name;
  return title || name;
}

export const GetTrailer = (trailers: Array<TrailerType>): TrailerType => {
  const result = trailers.filter((trailer) => trailer.type === "Trailer");
  return (result.length !== 0) ? result[0] : trailers[0];
};

export const GetYoutubeTrailer = (trailers: Array<TrailerType>): string => (
  `https://www.youtube.com/watch?v=${GetTrailer(trailers).key}`
);

const GetTMDbMediaType = (type: string) => {
  switch (type) {
    case "CMS_TMDB_Movie": return "movie";
    case "CMS_TMDB_Tv": return "tv";
    default: return null;
  }
}

export const GetTMDbHref = (torrent: TorrentDTO): string => {
  const type = GetTMDbMediaType(torrent.mediaInfo.info.movieType);
  if (!type)
    return "#";

  return `https://www.themoviedb.org/${type}/${torrent.mediaInfo.info.tmdbid}`;
}

export const GroupedTorrentCategories: OptgroupsT = {
  __ungrouped: [],
  TV: [
    {
      "id": 2,
      "name": "Sport",
      "image": "new.sport.png"
    },
    {
      "id": 37,
      "name": "HD serije",
      "image": "new.hdep.png"
    },
    {
      "id": 7,
      "name": "Serije",
      "image": "new.episode.alt.png"
    },
    {
      "id": 36,
      "name": "HD filmovi",
      "image": "new.hd.png"
    },
    {
      "id": 43,
      "name": "UHD filmovi",
      "image": "uhd.png"
    },
    {
      "id": 35,
      "name": "Dokumentarni filmovi",
      "image": "new.docu.png"
    },
    {
      "id": 39,
      "name": "BDRip filmovi",
      "image": "new.bdbr.png"
    },
    {
      "id": 19,
      "name": "XviD filmovi",
      "image": "new.xvid.png"
    },
    {
      "id": 20,
      "name": "DVD-R filmovi",
      "image": "new.dvd.png"
    },
    {
      "id": 31,
      "name": "Crtaći",
      "image": "new.ctoon.png"
    },
    {
      "id": 26,
      "name": "Filmovi - Ostalo",
      "image": "new.ostalo.png"
    }
  ],
  Softver: [
    {
      "id": 29,
      "name": "Linux",
      "image": "new.linux.png"
    },
    {
      "id": 30,
      "name": "Windows",
      "image": "new.win.png"
    },
    {
      "id": 41,
      "name": "Android/iOS",
      "image": "mobileico.png"
    },
    {
      "id": 38,
      "name": "Mac OS",
      "image": "new.macos.png"
    },
    {
      "id": 1,
      "name": "PC ISO",
      "image": "new.iso.png"
    },
    {
      "id": 22,
      "name": "Svašta",
      "image": "new.appz.png"
    }
  ],
  Muzika: [
    {
      "id": 6,
      "name": "Audio",
      "image": "new.music.png"
    },
    {
      "id": 40,
      "name": "FLAC audio",
      "image": "new.flac.png"
    },
    {
        "id": 42,
        "name": "Turbo",
        "image": "turbo.png"
    },
    {
      "id": 27,
      "name": "Video snimci",
      "image": "new.mvideo.png"
    }
  ],
  Igrice: [
    {
      "id": 4,
      "name": "PC ISO",
      "image": "new.pciso.png"
    },
    {
      "id": 21,
      "name": "PC Rips",
      "image": "new.pcrip.png"
    },
    {
      "id": 17,
      "name": "PSx",
      "image": "new.ps2.png"
    },
    {
      "id": 18,
      "name": "Xbox",
      "image": "new.xbox.png"
    }
  ],
  Ostalo: [
    {
      "id": 24,
      "name": "E-knjige",
      "image": "new.ebook.png"
    },
    {
      "id": 32,
      "name": "Stripovi",
      "image": "new.comics.png"
    },
    {
      "id": 23,
      "name": "Anime",
      "image": "new.anime.png"
    },
    {
      "id": 33,
      "name": "XXX",
      "image": "new.pink.xxx.png"
    },
    {
      "id": 28,
      "name": "Svašta",
      "image": "new.misc.png"
    },
  ]
};

export const GetTorrentCategoryKey = (id: number) => (
  Object.keys(GroupedTorrentCategories)
    .find((value) => {
      const entry = GroupedTorrentCategories[value]
        .find((prop) => prop.id === id);
      if (entry !== undefined)
        return true;
      return false;
    })
);

export const GetTorrentCategorySlug = (
  parent?: string
) => {
  if (
    parent === undefined ||
    GroupedTorrentCategories[parent] === undefined
  ) {
    return "#";
  }

  const parameters = new URLSearchParams();

  // Craft categories parameter
  GroupedTorrentCategories[parent]
    .forEach((category) => parameters.append("c", category.id!.toString()));

  // Decode already encoded URI, since encodeURI will be called later
  // If we don't do it, then some symbols will unfortunately get double encoded
  const query = decodeURIComponent(parameters.toString());
  const slug = (query.length !== 0) ? `?${query}` : "";
  return slug;
}

export const GetTorrentCategory = (
  id: number,
  parent?: string
) => (
  parent === undefined ?
  undefined :
  GroupedTorrentCategories[parent].find((value) => value.id === id)
);