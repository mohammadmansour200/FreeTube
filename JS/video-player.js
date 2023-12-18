/////Global HTML elements
const video = document.querySelector("video");
const vidWrapper = document.querySelector(".video-container");

/////Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Space":
      e.preventDefault();
      playPause();
      break;
    case "KeyT":
      theaterMode();
      break;
    case "KeyF":
      fullScreenMode();
      break;
    case "KeyI":
      miniPlayerMode();
      break;
    case "KeyM":
      toggleMute();
      break;
    case "KeyL":
    case "ArrowRight":
      skip(+10);
      animateForward();
      break;
    case "KeyJ":
    case "ArrowLeft":
      skip(-10);
      animateRewind();
      break;
    case "KeyC":
      toggleCC();
      break;
    case "ArrowUp":
      e.preventDefault();
      volume(+0.05);
      showVolPer();
      break;
    case "ArrowDown":
      e.preventDefault();
      volume(-0.05);
      showVolPer();
      break;
    case "Escape":
      closeSetting();
      break;
  }
});

/////Video rewind/Seeking handling
function skip(duration) {
  video.currentTime += duration;
}

//Mobile double tap handling
video.addEventListener(
  "touchstart",
  function (e) {
    const videoRect = vidWrapper.getBoundingClientRect();
    const clickPosition = e.touches[0].clientX;
    const calculateVideoReso = videoRect.width / 2;

    if (clickPosition >= calculateVideoReso) {
      doubleTouch(e, +10, animateForward);
    } else {
      doubleTouch(e, -10, animateRewind);
    }
  },
  { passive: true }
);

let lastClick = 0;
function doubleTouch(e, duration, functionName) {
  let date = new Date();
  let time = date.getTime();
  const timeBetweenTaps = 200;
  if (time - lastClick < timeBetweenTaps) {
    skip(duration);
    functionName();
  }
  lastClick = time;
}

//Rewind feedback
const rewindFeedback = document.querySelector(".rewind");
function animateRewind() {
  rewindFeedback.classList.add("add-animation");
  setTimeout(() => {
    rewindFeedback.classList.remove("add-animation");
  }, 1000);
}

//Fast forward feedback
const forwardFeedback = document.querySelector(".fast-forward");
function animateForward() {
  forwardFeedback.classList.add("add-animation");
  setTimeout(() => {
    forwardFeedback.classList.remove("add-animation");
  }, 1000);
}
/////Video rewind/Seeking handling end/////

/////Setting panel
const back = document.querySelectorAll(".back");
const settingPanel = document.querySelector("#setting-panel");
const playbackPanel = document.querySelector(".playback-option-panel");
const ccPanel = document.querySelector(".cc-option-panel");

const settingBtn = document.querySelector(".setting");
const settingBtnMobile = document.querySelector(".setting-mobile");

settingBtn.addEventListener("click", toggleSettingPanel);
settingBtnMobile.addEventListener("click", toggleSettingPanel);

function toggleSettingPanel(e) {
  e.stopPropagation();
  if (vidWrapper.classList.contains("settings")) {
    closeSetting();
  } else {
    openSetting();
  }
}

function openSetting() {
  vidWrapper.classList.add("settings");
  settingPanel.style.display = "block";
}

document.addEventListener("click", (e) => {
  if (e.target !== settingPanel) {
    closeSetting();
  }
});
document.addEventListener("touchend", (e) => {
  if (e.target == video) {
    closeSetting();
  }
});

function closeSetting() {
  vidWrapper.classList.remove("settings");
  settingPanel.style.display = "none";
  ccPanel.style.display = "none";
  playbackPanel.style.display = "none";
}

///// Playback speed & CC
function openPanel(panel) {
  panel.style.display = "block";
}

function closePanel(panel) {
  panel.style.display = "none";
}

///// Playback speed options panel
const panelItemSpeed = document.querySelector(".playback");
const speedOption = document.querySelectorAll(".speed");

panelItemSpeed.addEventListener("click", (e) => {
  e.stopPropagation();
  togglePlaybackPanel();
});
back[0].addEventListener("click", (e) => {
  e.stopPropagation();
  speedBack();
});
playbackPanel.addEventListener("click", (e) => {
  e.stopPropagation();
  changePlaybackSpeed(e);
});

function togglePlaybackPanel() {
  openPanel(playbackPanel);
  closePanel(settingPanel);
}

function speedBack() {
  playbackPanel.style.display = "none";
  settingPanel.style.display = "block";
}

function changePlaybackSpeed(e) {
  const option = document.querySelector(".options");
  const speedState = document.querySelector(".panelitem-content");
  if (e.target == speedOption || e.target != option) {
    video.playbackRate = e.target.getAttribute("data-speed");
    speedState.textContent = e.target.textContent;
    speedBack();
  }
}

///// CC options panel
const panelItemCC = document.querySelector(".cc");
const cchidden = document.querySelector(".hidden-option");
const ccShowing = document.querySelector(".showing-option");

panelItemCC.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleCCPanel();
});
back[1].addEventListener("click", (e) => {
  e.stopPropagation();
  ccBack();
});
cchidden.addEventListener("click", (e) => {
  e.stopPropagation();
  hideCC();
});
ccShowing.addEventListener("click", (e) => {
  e.stopPropagation();
  showCC();
});

function toggleCCPanel() {
  openPanel(ccPanel);
  closePanel(settingPanel);
}

function ccBack() {
  ccPanel.style.display = "none";
  settingPanel.style.display = "block";
}

const cc = video.textTracks[0];
function showCC() {
  cc.mode = "showing";
  vidWrapper.classList.add("captions");
  ccShowing.classList.add("on");
  cchidden.classList.remove("off");
  captionState();
  closePanel(ccPanel);
  openPanel(settingPanel);
}

function hideCC() {
  cc.mode = "hidden";
  vidWrapper.classList.remove("captions");
  ccShowing.classList.remove("on");
  cchidden.classList.add("off");
  captionState();
  closePanel(ccPanel);
  openPanel(settingPanel);
}

function captionState() {
  const ccContent = document.querySelector(".subtitle-content");
  ccContent.textContent = vidWrapper.classList.contains("captions")
    ? "English"
    : "Off";
}

/////CC button
const ccBtn = document.querySelector(".cc-btn");
const ccBtnMobile = document.querySelector(".cc-btn-mobile");

ccBtn.addEventListener("click", () => toggleCC());
ccBtnMobile.addEventListener("touchend", () => toggleCC());

function toggleCC() {
  const cc = video.textTracks[0];
  if (vidWrapper.classList.contains("captions")) {
    cc.mode = "hidden";
    vidWrapper.classList.remove("captions");
  } else {
    cc.mode = "showing";
    vidWrapper.classList.add("captions");
  }
  captionState();
}

/////Video duration/progress bar
const totalTime = document.querySelector(".total-time");
const currentTime = document.querySelector(".current-time");
const progressBar = document.querySelector(".progress-bar");

video.addEventListener("timeupdate", () => {
  currentTime.textContent = formatDuration(video.currentTime);
  const currentPer = (video.currentTime / video.duration) * 100;
  progressBar.style.backgroundSize = `${currentPer}% 100%`;
  progressBar.value = currentPer;
});

function formatDuration(time) {
  const zeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);

  if (hours === 0) {
    return `${minutes}:${zeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${zeroFormatter.format(minutes)}:${zeroFormatter.format(
      seconds
    )}`;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  video.addEventListener("loadedmetadata", () => {
    totalTime.textContent = formatDuration(video.duration);
  });
});

let isScrubbing = false;
progressBar.addEventListener("input", (e) => {
  updateValueandUI(e);
  updateVideoProgress(e);
  isScrubbing = true;
  setTimeout(removeOverlayAsync, 100);
});
progressBar.addEventListener("touchend", () => {
  isScrubbing = false;
  setTimeout(removeOverlayAsync, 100);
});

function updateValueandUI(e) {
  progressBar.value = e.target.value;
  progressBar.style.backgroundSize = `${e.target.value}% 100%`;
}

function updateVideoProgress(e) {
  video.currentTime = (e.target.value / 100) * video.duration;
}

/////Timeline hover feedback
const timelineContainer = document.querySelector(".timeline-container");

timelineContainer.addEventListener("mousemove", timelineHover);

function timelineHover(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const per = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  timelineContainer.style.setProperty("--preview-position", per);
}

/////Volume slider
const volumeSlider = document.querySelector(".volume-slider");

//Volume increase/decrease feedback elements
const volumeHigh = document.querySelector(".volume-high");
const volumeLow = document.querySelector(".volume-low");
const volumeMuted = document.querySelector(".volume-muted");

function volume(change) {
  video.volume = Math.min(1, Math.max(0, video.volume + change));
  volumeSlider.value = video.volume;

  //Volume increase/decrease feedback
  if (video.muted || video.volume === 0) {
    volumeMuted.style.display = "block";
    setTimeout(() => {
      volumeMuted.style.display = "none";
    }, 600);
  } else if (video.volume >= 0.5) {
    volumeHigh.style.display = "block";
    setTimeout(() => {
      volumeHigh.style.display = "none";
    }, 600);
  } else {
    volumeLow.style.display = "block";
    setTimeout(() => {
      volumeLow.style.display = "none";
    }, 600);
  }
}

/////Volume current percentage bar
const volPer = document.querySelector(".volume-percentage");
function showVolPer() {
  volPer.textContent = `${Math.floor(volumeSlider.value * 100)}%`;
  volPer.style.display = "block";
  setTimeout(() => (volPer.style.display = "none"), 600);
}

/////Sliding volume bar handling
volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value === 0;
});

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume;
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0;
    volumeLevel = "muted";
  } else if (video.volume >= 0.5) {
    volumeLevel = "high";
  } else {
    volumeLevel = "low";
  }
  vidWrapper.dataset.volumeLevel = volumeLevel;
});

/////Mute volume on click
const muteBtn = document.querySelector(".mute-btn");

muteBtn.addEventListener("click", () => toggleMute());

function toggleMute() {
  video.muted = !video.muted;
}
/////Volume slider end/////

/////Theater mode
const theaterBtn = document.querySelector(".theater-btn");

theaterBtn.addEventListener("click", () => theaterMode());

function theaterMode() {
  const main = document.querySelector("main");
  const secondaryDiv = document.querySelector(".secondary");
  vidWrapper.classList.toggle("theater");
  main.classList.toggle("main-theater");
  secondaryDiv.classList.toggle("theater-column");
}

/////Fullscreen mode
const fullScreenBtn = document.querySelector(".full-screen-btn");

fullScreenBtn.addEventListener("click", () => fullScreenMode());
document.addEventListener("fullscreenchange", () =>
  vidWrapper.classList.toggle("full-screen", document.fullscreenElement)
);
screen.orientation.addEventListener("change", () => {
  if (screen.orientation.type == "landscape-primary") {
    vidWrapper.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});

const fullscreenErrorEl = document.querySelector(".fullscreen-error");
function fullScreenMode() {
  try {
    if (document.fullscreenElement == null) {
      if (vidWrapper.requestFullscreen) {
        vidWrapper.requestFullscreen();
      } else if (vidWrapper.mozRequestFullScreen) {
        vidWrapper.mozRequestFullScreen();
      } else if (vidWrapper.webkitRequestFullscreen) {
        vidWrapper.webkitRequestFullscreen();
      }
      screen.orientation.lock("landscape");
    } else {
      document.exitFullscreen();
      screen.orientation.lock("portrait");
    }
  } catch (error) {
    fullscreenErrorEl.style.display = "block";
    setTimeout(() => {
      fullscreenErrorEl.style.display = "none";
    }, 5000);
    fullscreenErrorEl.textContent = `${
      currLangIsAR
        ? `الآيفون لا يدعم خاصية تكبير الشاشة`
        : `iPhone doesn't support fullscreen mode`
    }`;
  }
}

/////Miniplayer mode
const miniPlayerBtn = document.querySelector(".mini-player-btn");

miniPlayerBtn.addEventListener("click", () => miniPlayerMode());
video.addEventListener("enterpictureinpicture", () =>
  vidWrapper.classList.add("mini-player")
);
video.addEventListener("leavepictureinpicture", () =>
  vidWrapper.classList.remove("mini-player")
);

function miniPlayerMode() {
  if (vidWrapper.classList.contains("mini-player")) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
}

/////Handling play/pause clicks
const playPauseBtn = document.querySelector(".play-pause-btn");
const playPauseMobile = document.querySelector(".play-pause");

playPauseBtn.addEventListener("click", () => playPause());
playPauseMobile.addEventListener("click", playPauseFuncMobile);

function playPause() {
  const pauseFeedback = document.querySelector(".pause-feedback");
  const playFeedback = document.querySelector(".play-feedback");
  if (vidWrapper.classList.contains("paused")) {
    video.play();
    vidWrapper.classList.remove("paused");
    playFeedback.classList.add("animate-feedback");
    pauseFeedback.classList.remove("animate-feedback");
  } else {
    video.pause();
    vidWrapper.classList.add("paused");
    playFeedback.classList.remove("animate-feedback");
    pauseFeedback.classList.add("animate-feedback");
  }
}

function playPauseFuncMobile() {
  if (vidWrapper.classList.contains("paused")) {
    video.play();
    vidWrapper.classList.remove("paused");
  } else {
    video.pause();
    vidWrapper.classList.add("paused");
  }
  removeOverlayAsync();
}

/////Show/hide video controls on mobile
video.addEventListener("touchend", function () {
  if (vidWrapper.classList.contains("show-overlay")) {
    vidWrapper.classList.remove("show-overlay");
  } else {
    vidWrapper.classList.add("show-overlay");
  }
  removeOverlayAsync();
});

function hideOverlay() {
  vidWrapper.classList.remove("show-overlay");
}

let hideOverlayTimeout;
function removeOverlayAsync() {
  clearTimeout(hideOverlayTimeout);
  if (
    vidWrapper.classList.contains("paused") ||
    isScrubbing === true ||
    !vidWrapper.classList.contains("show-overlay")
  ) {
    hideOverlayTimeout = null;
  } else {
    hideOverlayTimeout = setTimeout(hideOverlay, 5000);
  }
}

/////Loader
const loader = document.querySelector(".loader-wrapper");

video.addEventListener("waiting", () => {
  loader.style.display = "block";
  vidWrapper.classList.add("loading");
});
video.addEventListener("playing", () => {
  loader.style.display = "none";
  vidWrapper.classList.remove("loading");
});
