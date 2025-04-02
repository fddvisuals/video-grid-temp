// version: 1.0.0
// author: quanzhang.xyz
const config = {
  // =====================
  // | Global Variables |
  // =====================
  finalVideoIndex: 22, // the index of the last video in your folder, enter 15 if video15.mp4 is the last video in your folder

  // =================
  // | Page Settings |
  // =================
  pageTitle: "", // for the browser tabs and search results
  pageDescription: "",

  // ======================
  // | Project Information|
  // ======================
  projectTitle: "",
  projectSubtitle: "",
  projectInfo: "",

  // ==================
  // |Custom Variables|
  // ==================
  fullVideoExists: false, // enter true if you've included a fullvideo.mp4 in the videos folder
  initialVideoIndex: 1, // enter 4 will start the project at video4.mp4
  gridColumnCount: 4, // number of columns
  gridGapScale: 1, // grid gap size (1 is default)
  videoVolume: 1, // 1 is full volume, and 0 is completely mute

  // ==============
  // |Color Theme|
  // ==============

  /* 
    You can use any color you want, but you need to use hex color codes.
    Here are some guidelines:
    - Hex color codes start with a '#' 
    - They are followed by 6 alphanumeric characters.
    - You can use this color picker to get the hex color code of a color:
      https://g.co/kgs/sDiHLk
  */
  hoverVideoBorder: "#e32d45",
  clickVideoBorder: "#0c8a3a",
  playSeriesVideoBorder: "#88609c",
  startButton: "#e32d45",

  // ===========================================
  // |Automated Permission Granting for Display|
  // ===========================================
  /* 
    If it's set to true, the system will automatically grant permission 
    for including your project for display on the project page and its Github page.
  */
  autoGrantPermission: false,
  authorNameforDisplay: "",
  authorContact: "",
};

// Config
const appState = {
  isTactile: false,
  videosLoaded: 0,
  videoSeriesIndex: 0,
  intervalId: null,
};

// Add base URL for videos from GitHub
const videoBaseURL = "https://github.com/fddvisuals/video-grid-temp/raw/refs/heads/main/videos/";

// Utility Functions

const updateTextByClassName = (className, newText) => {
  if (newText !== "" && newText !== ".") {
    const elements = document.getElementsByClassName(className);
    for (let element of elements) {
      element.innerText = newText;
    }
  }
};

const appendVideo = (videoName, parentElement, autoplayStatus) => {
  let video = document.createElement("video");
  // Changed to load video from GitHub instead of locally
  video.src = videoBaseURL + videoName + ".mp4";
  video.controls = false;
  video.loop = true;
  video.autoplay = autoplayStatus;
  parentElement.appendChild(video);
  return video;
};

const resetVideoClasses = (video) => {
  video.classList.remove("hover-playing");
  video.classList.remove("click-playing");
  video.classList.remove("auto-playing");
};

const removeVideoInteractionClasses = (video) => {
  video.classList.remove("hover-playing");
  video.classList.remove("click-playing");
};

const stopAllVideos = (videos) => {
  videos.forEach((video) => {
    video.pause();
    resetVideoClasses(video);
  });
};

const resetPlaySeries = () => {
  if (appState.intervalId !== null) {
    clearInterval(appState.intervalId);
    appState.videoSeriesIndex = 0;
  }
};

// Video Helpers
const startHoverPlay = (video) => {
  if (!video.classList.contains("click-playing")) {
    video.play();
    video.classList.add("hover-playing");
  }
};

const pauseHoverPlay = (video) => {
  video.pause();
  removeVideoInteractionClasses(video);
};

const toggleHoverPlay = (video) => {
  if (video.classList.contains("hover-playing")) {
    video.pause();
    removeVideoInteractionClasses(video);
  } else {
    video.play();
    video.classList.add("hover-playing");
  }
};

const toggleClickPlay = (video) => {
  if (video.classList.contains("click-playing")) {
    video.pause();
    removeVideoInteractionClasses(video);
  } else {
    video.play();
    video.classList.add("click-playing");
  }
};

// Interactions
const hoverToPopup = (hoverControl, popup) => {
  hoverControl.style.display = "block";
  hoverControl.addEventListener("mouseenter", () => {
    popup.style.display = "block";
  });
  hoverControl.addEventListener("mouseleave", () => {
    popup.style.display = "none";
  });
};

const popup = (popup) => {
  if (popup.style.display == "block") {
    popup.style.display = "none";
  } else if (popup.style.display == "none") {
    popup.style.display = "block";
  }
};

// Other
const isValidColor = (color) => {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
};

document.addEventListener("DOMContentLoaded", (event) => {
  //store DOM elements
  // General
  // const loadingPage = document.getElementById("loading-page");
  const mainPage = document.getElementById("main-page");
  // const startButton = document.getElementById("start-button");

  // Footer-Right
  // Remove variables for controls no longer needed
  // const tactileToggle = document.getElementById("tactile-toggle");
  // const infoHover = document.getElementById("info-hover");
  // const fullVideoToggle = document.getElementById("full-video-toggle");
  // const fullVideoPopup = document.getElementsByClassName("full-video-popup")[0];
  // const closeFullVideo = document.getElementById("close-full-video");

  // More Controls
  // const moreControls = document.getElementById("more-controls");
  // const hiddenControls = document.getElementsByClassName("hidden-controls");
  // const closeControls = document.getElementById("close-controls");
  // const playSeriesButton = document.getElementById("play-series");
  // const playAllButton = document.getElementById("play-all");
  // const stopAllButton = document.getElementById("stop-all");

  // DOM Manipulation
  (function () {
    // Set Document Title
    if (config.pageTitle !== "") {
      document.title = config.pageTitle;
    }

    // Set Meta description if config.description is not ''
    if (config.pageDescription !== "") {
      let meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.content = config.pageDescription;
      } else {
        meta = document.createElement("meta");
        meta.name = "description";
        meta.content = config.pageDescription;
        document.head.appendChild(meta);
      }
    }

    // Set Project Info
    updateTextByClassName("project-title", config.projectTitle + ".");
    updateTextByClassName("project-subtitle", config.projectSubtitle);
    updateTextByClassName("info-popup", config.projectInfo);

    //Set Color Customization
    if (
      isValidColor(config.hoverVideoBorder) &&
      isValidColor(config.clickVideoBorder) &&
      isValidColor(config.playSeriesVideoBorder) &&
      isValidColor(config.startButton)
    ) {
      const styleColors = document.createElement("style");
      styleColors.innerHTML = `
      body .hover-playing {
        border-color: ${config.hoverVideoBorder} !important;
      }
      body .click-playing {
        border-color: ${config.clickVideoBorder} !important;
      }
      body .auto-playing {
        border-color: ${config.playSeriesVideoBorder} !important;
      }
      body .start-button {
        color: ${config.startButton} !important;
      }
      `;
      document.head.appendChild(styleColors);
    }
  })();

  // Check for config.initialVideoIndex to be valid or output alert
  if (
    config.initialVideoIndex < 1 ||
    config.initialVideoIndex > config.finalVideoIndex
  ) {
    alert(
      `Check your config.js file. config.initialVideoIndex has to be an integer between 1 and ${config.finalVideoIndex}.`
    );
  }

  const videoGrid = document.getElementsByClassName("video-grid")[0];

  // Create video grid items using GitHub video source
  for (let i = config.initialVideoIndex; i <= config.finalVideoIndex; i++) {
    const video = document.createElement("video");
    video.src = `${videoBaseURL}video${i}.mp4`; // using GitHub video URL
    video.controls = false;
    video.loop = true;
    video.preload = "auto";
    video.volume = config.videoVolume;
    video.classList.add("video-grid-item");
    videoGrid.appendChild(video);
  }

  // Remove grid style adjustments for controls if any, retain basic styling
  videoGrid.style.gridAutoFlow = "column";
  videoGrid.style.gridTemplateRows = "1fr 1fr";
  videoGrid.style.columnGap = `${config.gridGapScale * 1}vw`;
  videoGrid.style.rowGap = `${config.gridGapScale * 0.5}vh`;

  const videos = Array.from(document.querySelectorAll(".video-grid video"));

  videos.forEach((video) => {
    video.addEventListener("canplaythrough", () => {
      appState.videosLoaded++;
    });
  });

  // Remove control event listeners; keep video event listeners for playback on mouse events
  videos.forEach((video) => {
    video.addEventListener("mouseenter", () => {
      // Play on hover
      if (!video.classList.contains("auto-playing")) {
        video.play();
        video.classList.add("hover-playing");
      }
    });
    video.addEventListener("mouseleave", () => {
      // Pause hover playback
      if (video.classList.contains("hover-playing") && !video.classList.contains("auto-playing")) {
        video.pause();
        video.classList.remove("hover-playing");
      }
    });
    video.addEventListener("click", () => {
      // Toggle play/pause on click
      if (video.paused) {
        video.play();
        video.classList.add("click-playing");
      } else {
        video.pause();
        video.classList.remove("click-playing");
      }
    });
  });
});
