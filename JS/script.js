/////Global variables
const APIKey = "AIzaSyBzuxsMhK3p2f_rsBo2Bck3C9mVmQmUtHM";
const currentVideoId = window.location.search.slice(4, 15);
const currentVideoNum = window.location.search.slice(15);
const currLangIsAR = navigator.language.slice(0, 2) == "ar";

/////Fetching JSON data
fetchJSONData = async () => {
  document.querySelector(".loader-wrapper").style.display = "block";
  vidWrapper.classList.add("loading");
  const res = await fetch("data/videos.json");
  const data = await res.json();
  document.querySelector(".loader-wrapper").style.display = "none";
  vidWrapper.classList.remove("loading");

  return data;
};

/////Fetching Youtube data
fetchYoutubeAPI = async (endpoint, parameter, id) => {
  const res = await fetch(
    `https://youtube.googleapis.com/youtube/v3/${endpoint}?part=snippet${parameter}=${id}&key=${APIKey}`
  );
  const data = await res.json();

  return data;
};

/////Playlist handling
playlist = async () => {
  const playlistVideoWrapper = document.querySelector(".playlist-video");

  const dataFromAPI = await fetchYoutubeAPI(
    "playlistItems",
    "&playlistId",
    "PL9YZBmmxypG48lO9E6-JGtNbzcIdnbR1d"
  );
  const dataFromJSON = await fetchJSONData();

  const playlistDataFromAPI = dataFromAPI.items.map((item, index) => {
    const videoId = item.snippet.resourceId.videoId;
    const videoTitleAR = item.snippet.title;
    const videoThumbnail = item.snippet.thumbnails.medium.url;
    const channelTitle = item.snippet.videoOwnerChannelTitle;
    const videoNumber = index + 1;
    return {
      videoId,
      videoTitleAR,
      videoThumbnail,
      channelTitle,
      videoNumber,
    };
  });

  const playlistDataFromJSON = dataFromJSON.videos.map((video) => {
    const videoTitleEN = video.videoTitle.en;
    return videoTitleEN;
  });

  /////Playlist videos
  playlistDataFromAPI.forEach((video) => {
    const videoAnchor = document.createElement("a");
    videoAnchor.classList.add("video-anchor");
    videoAnchor.setAttribute(
      "href",
      `index.html?id=${video.videoId}${video.videoNumber}`
    );

    videoAnchor.innerHTML = `<div class="video-lists ${
      video.videoNumber == currentVideoNum ? `current-vid` : ``
    }">
      <div class="video-number">${video.videoNumber}</div>

      <img id="thumbnail" alt="Video thumbnail" src="${video.videoThumbnail}" />

      <div class="video-info">
        <div class="video-title" style="${
          currLangIsAR ? `direction:rtl` : `direction:ltr`
        }">${
      currLangIsAR
        ? video.videoTitleAR
        : playlistDataFromJSON[video.videoNumber - 1]
    }</div>
        <div class="video-channel">${video.channelTitle}</div>
      </div>
    </div>`;
    playlistVideoWrapper.appendChild(videoAnchor);
  });

  /////Total video & current video number
  const playlistInfo = document.querySelector(".playlist-info");
  const totalVideoNum = dataFromAPI.pageInfo.totalResults;

  playlistInfo.textContent = `${currentVideoNum} / ${totalVideoNum} - محمد عبدالتواب`;

  videoNavigation();
  updateVideoInfo();
};
playlist();

/////Prev/next video navigation handling
videoNavigation = () => {
  const prevMobile = document.querySelector(".prev-mobile");
  const nextMobile = document.querySelector(".next-mobile");
  const nextPC = document.querySelector(".next");
  const currentVid = document.querySelector(".current-vid");
  const prevSibling = currentVid.parentNode.previousSibling;
  const nextSibling = currentVid.parentNode.nextSibling;
  const prevVideo = prevSibling && prevSibling.getAttribute("href");
  const nextVideo = nextSibling && nextSibling.getAttribute("href");
  prevMobile.setAttribute("href", prevVideo || "");
  nextMobile.setAttribute("href", nextVideo || "");
  nextPC.setAttribute("href", nextVideo || "");
  if (nextVideo == null) {
    nextMobile.style.opacity = "0.3";
    nextMobile.removeAttribute("href");
    nextPC.style.opacity = "0.3";
    nextPC.removeAttribute("href");
  }
  if (prevVideo == null) {
    prevMobile.style.opacity = "0.3";
    prevMobile.removeAttribute("href");
  }
};

/////Video info handling
updateVideoInfo = async () => {
  const dataFromAPI = await fetchYoutubeAPI(
    "videos",
    "&part=statistics&id",
    `${currentVideoId}`
  );

  const dataFromJSON = await fetchJSONData();

  const APIData = dataFromAPI.items.map((item) => {
    const channelId = item.snippet.channelId;
    const videoTitleAR = item.snippet.localized.title;
    const publishDate = item.snippet.publishedAt;
    const views = item.statistics.viewCount;
    return {
      channelId,
      videoTitleAR,
      publishDate,
      views,
    };
  });

  const JSONData = dataFromJSON.videos.map((video) => {
    const Src = video.videoSrc;
    const CC = video.videoCC;
    const Title = video.videoTitle.en;
    return {
      Src,
      CC,
      Title,
    };
  });

  const currentVid = document.querySelector(".current-vid");
  currentVid.setAttribute("channel-id", APIData[0].channelId);

  /////Video src/cc updating
  const videoEl = document.querySelector("video");
  const ccTrack = document.querySelector("track");
  videoEl.setAttribute("src", `${JSONData[currentVideoNum - 1].Src}`);
  ccTrack.setAttribute("src", `${JSONData[currentVideoNum - 1].CC}`);

  /////Video title
  const videoTitleEl = document.querySelectorAll(".info-title");
  videoTitleEl.forEach((El) => {
    El.textContent = `${
      currLangIsAR
        ? APIData[0].videoTitleAR
        : JSONData[currentVideoNum - 1].Title
    }`;
    El.style.direction = `${currLangIsAR ? `rtl` : `ltr`}`;
  });

  /////Video release date
  const videoYear = APIData[0].publishDate.slice(0, 4);
  const videoDay = APIData[0].publishDate.slice(8, 10);
  date = new Date(APIData[0].publishDate);
  const monthNameEN = date.toLocaleString("en", { month: "short" });
  const monthNameAR = date.toLocaleString("ar", { month: "short" });

  const releaseDateEl = document.querySelectorAll(".release-date");
  releaseDateEl.forEach((date) => {
    date.textContent = `${
      currLangIsAR ? monthNameAR : monthNameEN
    } ${videoDay}, ${videoYear}`;
  });

  /////Video views count
  const viewCountEl = document.querySelectorAll(".views");
  viewCountEl.forEach((view) => {
    view.textContent = `${APIData[0].views
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
      currLangIsAR ? `مشاهدة` : `views`
    }`;
  });
  updateChannelInfo();
};

updateChannelInfo = async () => {
  const currentVid = document.querySelector(".current-vid");
  const currentVidChannelId = currentVid.getAttribute("channel-id");
  const dataFromAPI = await fetchYoutubeAPI(
    "channels",
    "&part=statistics&id",
    `${currentVidChannelId}`
  );

  const APIData = dataFromAPI.items.map((item) => {
    const channelUrl = item.snippet.customUrl;
    const channelName = item.snippet.localized.title;
    const channelPP = item.snippet.thumbnails.default.url;
    const channelSubs = item.statistics.subscriberCount;
    return {
      channelUrl,
      channelName,
      channelPP,
      channelSubs,
    };
  });

  /////Channel name
  const channelNameEl = document.querySelectorAll(".channel-name");
  channelNameEl.forEach((name) => {
    name.textContent = APIData[0].channelName;
  });

  /////Channel profile picture
  const channelPPEl = document.querySelectorAll(".pp");
  channelPPEl.forEach((pic) => {
    pic.setAttribute("src", APIData[0].channelPP);
  });

  /////Channel subscribers
  const subsFormatter = new Intl.NumberFormat("en-GB", {
    notation: "compact",
  });

  const formattedSubs = subsFormatter.format(APIData[0].channelSubs);

  const subsCount = document.querySelectorAll(".subs-count");
  subsCount.forEach((subs) => {
    subs.textContent = `${formattedSubs} ${
      currLangIsAR ? `مشترك` : `subscribers`
    }`;
  });

  const subBtn = document.querySelectorAll(".channel-link");
  subBtn.forEach((sub) => {
    sub.setAttribute(
      "href",
      `https://www.youtube.com/${APIData[0].channelUrl}?sub_confirmation=1`
    );
  });
};
