const HARDWARE_ACCELERACTION_DELAY = 300;
const TITLES_ANIMATION_DELAY = 650;
const RESTART_CONNECTION_AHEAD_OF = 30 * 1000;

function convertToHumanTime(wholeSeconds) {
  const position_minutes = Math.floor(wholeSeconds / 60);
  const position_seconds = wholeSeconds - position_minutes * 60;
  return position_minutes + ":" + String(position_seconds).padStart(2, "0");
}

const firstEvtSource = new EventSource(`/api/display`);
setupSSEHandler(firstEvtSource);

let progressInterval;
const background = document.querySelector(".background");
const nowPlayingContainer = document.querySelector(".main-left");
let queueList = document.querySelector(".queue-list");
const queueListContainer = document.querySelector(".queue-list-container");

function toggleHardwareAcceleration(elements, ...properties) {
  elements.forEach((el) => {
    el.style.willChange =
      el.style.willChange === "" ? properties.join(",") : "";
  });
}

function initializeSong(current_track, position, queue, paused) {
  // toggleHardwareAcceleration([...playedEarlier, ...queryItems], "opacity", "transform");
  updateBackground(current_track.image);
  createNowPlaying(
    current_track.id,
    position,
    current_track.duration,
    current_track.image,
    current_track.name,
    current_track.artists
  );
  if (!paused) {
    runCounter(position.seconds);
  }
  newQueue(queue);
  animateQueueTitles();
  setTimeout(animatePlayingTitle, TITLES_ANIMATION_DELAY);
}

function removeFirstQueueItem(queue) {
  queueList.classList.add("queue-list--song-change");
  setTimeout(() => {
    toggleHardwareAcceleration(queueList.childNodes);
    newQueue(queue);
    queueList.classList.remove("queue-list--song-change");
    animateQueueTitles();
  }, TITLES_ANIMATION_DELAY);
}

function replaceQueue(queue) {
  queueList.classList.add("queue-list--queue-change");
  const newQueueList = document.createElement("div");
  newQueueList.classList.add("queue-list");
  newQueue(queue, newQueueList);
  queueListContainer.appendChild(newQueueList);
  setTimeout(() => {
    // toggleHardwareAcceleration(queueList.childNodes);
    queueList.remove();
    queueList = newQueueList;
    animateQueueTitles();
  }, TITLES_ANIMATION_DELAY);
}

function showNewSong(current_track, position, queue, paused) {
  queueList = document.querySelector(".queue-list");
  const playedEarlier = document.querySelectorAll(".now-playing");
  const queryItems = [...queueList.childNodes];
  toggleHardwareAcceleration(
    [...playedEarlier, ...queryItems],
    "opacity",
    "transform"
  );
  updateBackground(current_track.image);
  setTimeout(() => {
    fadeOutPlaying(playedEarlier);
    createNowPlaying(
      current_track.id,
      { seconds: 0, human: "00:00" },
      current_track.duration,
      current_track.image,
      current_track.name,
      current_track.artists
    );
    if (!paused) {
      runCounter(position.seconds);
    }
    const previousQueue = [current_track, ...queue];
    const areQueuesTheSame = queryItems.every(
      (nextSong, i) => nextSong.dataset.id === previousQueue[i].id
    );
    if (areQueuesTheSame) {
      removeFirstQueueItem(queue);
    } else {
      replaceQueue(queue);
    }
    setTimeout(animatePlayingTitle, TITLES_ANIMATION_DELAY);
  }, HARDWARE_ACCELERACTION_DELAY);
}

function restartSSEConnection(evtSource) {
  evtSource.close();
  console.log(evtSource);
  setTimeout(() => {
    const newEvtSource = new EventSource(`/api/display`);
    setupSSEHandler(newEvtSource);
  }, 5000);
}

function setupConnectionRestart(year, month, day, hour, minutes, seconds) {
  console.log("kolejna przerwa", hour, ":", minutes, ":", seconds);
  const now = new Date();
  let eta_ms =
    new Date(year, month, day, hour, minutes, seconds, 0).getTime() - now;
  eta_ms -= RESTART_CONNECTION_AHEAD_OF;
  console.log("do kolejnej przerwy", eta_ms);
  setTimeout(() => restartSSEConnection(evtSource), eta_ms);
}

function setupSSEHandler(evtSource) {
  console.log("connecting: ", evtSource);
  evtSource.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    console.log(parsedData, new Date());
    clearInterval(progressInterval);
    if (parsedData?.fromServer) {
      console.log("standalone");
      if (parsedData.action === "resume") {
        runCounterStandalone();
        return;
      }
      const [year, month, day, hour, minutes, seconds] =
        parsedData.tillNextBreak;
      setupConnectionRestart(year, month, day, hour, minutes, seconds);
      return;
    }
    let { current_track, queue, position, paused, action, type } = parsedData;
    const nowPlaying = document.querySelector(".now-playing");
    if (queueList.firstChild === null) {
      action = "init_song";
    }
    const isDifferentSongID =
      nowPlaying?.dataset?.id && nowPlaying.dataset.id !== current_track.id;
    if (action !== "init_song" && isDifferentSongID) {
      action = "new_song";
    }
    switch (action) {
      case "init_song": {
        initializeSong(current_track, position, queue, paused);
        break;
      }
      case "new_song": {
        showNewSong(current_track, position, queue, paused);
        break;
      }
      case "pause": {
        updateTime(position.seconds, position.human);

        break;
      }
      case "resume":
      case "position_change":
        if (type !== "break_change") {
          updateTime(position.seconds, position.human);
        }
        if (!paused) {
          runCounter(position.seconds);
        }
        break;
    }
  };
}

function runCounterStandalone() {
  runCounter(progressBar.value);
}

const titleAnimationTimeoutArray = [];

function newQueue(tracks, scopeQueueList = queueList) {
  titleAnimationTimeoutArray.forEach((timeout) => clearTimeout(timeout));
  let queueListNewContent = "";
  tracks.forEach((track) => {
    queueListNewContent += `<div class="queue-item" data-id="${track.id}">
        <img class="queue-item-image" src="${track.image}" />
        <div class="queue-item-text">
          <div class="queue-item-title-container">
            <span class="queue-item-title">${track.name}</span>
          </div>
          <div class="queue-item-artist">
          ${track.artists}
          </div>
          <div class="song-timestamp">${track.duration.human}</div>
        </div>
      </div>`;
  });
  scopeQueueList.innerHTML = queueListNewContent;
}

function animatePlayingTitle() {
  const parentsWithChildren = [
    [
      document.querySelector(".song-data"),
      document.querySelector(".song-title"),
    ],
  ];
  animateTitles(parentsWithChildren, 30);
}

function animateQueueTitles() {
  const queueItems = [...document.querySelectorAll(".queue-item")].slice(0, 4);
  const itemsWithTitles = queueItems.map((item) => {
    title = item.querySelector(".queue-item-title");
    return [item, title];
  });
  animateTitles(itemsWithTitles, 10);
}

function animateTitles(parentsWithChildren, additionalMargin) {
  const filteredPairs = parentsWithChildren.filter(([parent, child]) => {
    return (
      child.getBoundingClientRect().right > parent.getBoundingClientRect().right
    );
  });

  filteredPairs.forEach(([parent, child]) => {
    const diff = Math.ceil(
      child.getBoundingClientRect().right -
        parent.getBoundingClientRect().right +
        additionalMargin
    );
    const transitionLength = diff / 20;
    child.style.transition = `transform ${transitionLength}s linear`;
    createTitleAnimationTimeout(
      child,
      4000,
      transitionLength * 1000,
      -diff,
      true
    );
  });
}

function createTitleAnimationTimeout(
  element,
  delay,
  transitionLength,
  vector,
  forward
) {
  titleAnimationTimeoutArray.push(
    setTimeout(() => {
      element.style.transform = `translateX(${forward ? vector : 0}px)`;
      titleAnimationTimeoutArray.push(
        setTimeout(
          () =>
            createTitleAnimationTimeout(
              element,
              delay,
              transitionLength,
              vector,
              !forward
            ),
          transitionLength + 4000
        )
      );
    }, delay)
  );
}

function createNowPlaying(id, position, duration, image, name, artists) {
  const nowPlaying =
    document.createElementFromString(`<div class="now-playing" data-id="${id}"><div class="cover-art">
    <progress
      class="song-progress-bar"
      value="${position.seconds}"
      max="${duration.seconds}"
    ></progress>
    <img src="${image}" width="100%" />
  </div>
  <div class="playing__time">
    <div class="playing__position">${position.human}</div>
    <div class="playing__length">${duration.human}</div>
  </div>
  <div class="song-data">
  <!-- ja jebie -->
  <div class="song-second-title-container">
    <div class="song-title-container">
      <div class="song-title">${name}</div>
    </div>
  </div>
    <div class="song-artist">${artists}</div>
  </div></div>`);
  nowPlayingContainer.appendChild(nowPlaying);
}

function getCounterElements() {
  const progressBar = document.querySelector(
    ".now-playing:not(.now-playing--go) .song-progress-bar"
  );
  const positionDiv = document.querySelector(
    ".now-playing:not(.now-playing--go) .playing__position"
  );
  return { progressBar, positionDiv };
}

function updateTime(seconds, human) {
  console.log("updateuje");
  const { progressBar, positionDiv } = getCounterElements();
  progressBar.value = seconds;
  positionDiv.innerText = human;
}

function runCounter(seconds) {
  const { progressBar, positionDiv } = getCounterElements();
  progressInterval = setInterval(() => {
    if (progressBar.value < progressBar.max) {
      progressBar.value++;
      seconds++;
      positionDiv.innerText = convertToHumanTime(seconds);
    }
  }, 1000);
}

function fadeOutPlaying(playedEarlier) {
  playedEarlier.forEach((element) => {
    element.classList.add("now-playing--go");
  });
  setTimeout(() => {
    playedEarlier.forEach((element) => {
      element.remove();
    });
  }, 500);
}

function updateBackground(imageSrc) {
  const backgroundImage = document.querySelector(".background img");
  const newBackgroundImage = document.createElement("img");
  newBackgroundImage.src = imageSrc;
  background.appendChild(newBackgroundImage);
  toggleHardwareAcceleration([newBackgroundImage, backgroundImage], "opacity");
  setTimeout(() => {
    newBackgroundImage.classList.add("background__image");
    backgroundImage.classList.add("background__image--fade-out");
    // debugger;
    setTimeout(() => {
      backgroundImage.remove();
      toggleHardwareAcceleration([newBackgroundImage], "opacity");
    }, 500);
  }, HARDWARE_ACCELERACTION_DELAY);
}

// window.addEventListener("beforeunload", function (e) {
//   events.close();
//   e.preventDefault();
//   e.returnValue = "";
// });
