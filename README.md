# EUC Frontend
_A torrent tracker frontend written in React_

---

## Screenshots (Light theme)
![Homepage](https://i.postimg.cc/RZthJ1p7/homepage.png)
![Torrents](https://i.postimg.cc/YSfSbrHj/torrents.png)
![Torrent details](https://i.postimg.cc/TPXwVyBZ/torrent-details.jpg)
![Forum preview](https://i.postimg.cc/7YdbLt9P/forum.png)


## Clips (Dark theme)
[Login](https://streamable.com/87ta3q)
[Homepage](https://streamable.com/l81qga)
[Torrent details](https://streamable.com/jvwjtm)
[Forum preview](https://streamable.com/449fwu)
[Forum drafts](https://streamable.com/7c7c4p)


## How to use
- Local development: `npm i && npm run dev`
- Deploying to a web-server: `npm i && npm run build`, after the build finishes, then you can server the dist/ folder via your favorite web-server, e.g. nginx

Hot-reloading is configured out-of-the-box, so there is no need to start and stop every time you make a change in the code base.


## Author's note
In order to use this project, you will have to have a backend solution that will serve your data. See `src/api/HttpClient.ts` for more info.
You will also have to adjust the endpoint paths in `src/api/`, their corresponding DTOs in `src/types/` and the corresponding code appropriately.


## Contributing
See https://unlicense.org/ under "Unlicensing Contributions".