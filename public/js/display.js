// import "dotenv/config";

Document.prototype.createElementFromString = function (str) {
  const element = new DOMParser().parseFromString(str, "text/html");
  const child = element.documentElement.querySelector("body").firstChild;
  return child;
};

function convertToHumanTime(wholeSeconds) {
  const position_minutes = Math.floor(wholeSeconds / 60);
  const position_seconds = wholeSeconds - position_minutes * 60;
  return position_minutes + ":" + String(position_seconds).padStart(2, "0");
}

const events = new EventSource(
  // `https://${process.env.WEB_HOST}:${process.env.WEB_PORT}/api/player`
  `https://localhost:3000/api/player`
);
let progressInterval;
const background = document.querySelector(".background");
const nowPlayingContainer = document.querySelector(".main-left");
let queryList = document.querySelector(".queue-list");
const queryListContainer = document.querySelector(".queue-list-container");

events.onmessage = (event) => {
  let { current_track, queue, position, paused, action, type } = JSON.parse(
    event.data
  );
  let position_s;
  let duration_s;
  if (type === "break_change") {
    const { progressBar } = getCounterElements();
    position_s = Number(progressBar.value);
  } else {
    position_s = Math.ceil(position / 1000);
    duration_s = Math.floor(current_track.duration / 1000);
  }
  clearInterval(progressInterval);
  if (queryList.firstChild === null) {
    action = "init_song";
  }
  switch (action) {
    case "init_song": {
      updateBackground(current_track.image);
      position_human = convertToHumanTime(position_s);
      createNowPlaying(
        current_track.id,
        { seconds: position_s, human: position_human },
        { seconds: duration_s, human: current_track.duration_human },
        current_track.image,
        current_track.name,
        current_track.artists
      );
      if (!paused) {
        runCounter(position_s);
      }
      newQueue(queue);
      break;
    }
    case "new_song": {
      updateBackground(current_track.image);
      fadeOutPlaying();
      createNowPlaying(
        current_track.id,
        { seconds: 0, human: "00:00" },
        { seconds: duration_s, human: current_track.duration_human },
        current_track.image,
        current_track.name,
        current_track.artists
      );
      // runCounter(position)
      if (!paused) {
        runCounter(position_s);
      }
      if (queryList.firstElementChild.dataset.id === current_track.id) {
        queryList.classList.add("queue-list--song-change");
        setTimeout(() => {
          newQueue(queue);
          queryList.classList.remove("queue-list--song-change");
        }, 650);
      } else {
        queryList.classList.add("queue-list--queue-change");
        const newQueryList = document.createElement("div");
        newQueryList.classList.add("queue-list");
        newQueue(queue, newQueryList);
        queryListContainer.appendChild(newQueryList);
        setTimeout(() => {
          queryList.remove();
          queryList = newQueryList;
        }, 650);
      }
      break;
    }
    case "pause": {
      updateTime(position_s);
      break;
    }
    case "resume":
    case "position_change":
      updateTime(position_s);
      if (!paused) {
        runCounter(position_s);
      }
      break;
  }
};

const timeoutArray = [];

function newQueue(tracks, scopeQueryList = queryList) {
  timeoutArray.forEach((timeout) => clearTimeout(timeout));
  let queryListNewContent = "";
  tracks.forEach((track) => {
    queryListNewContent += `<div class="queue-item" data-id="${track.id}">
        <img class="queue-item-image" src="${track.image}" />
        <div class="queue-item-text">
          <div class="queue-item-title-container">
            <span class="queue-item-title">${track.name}</span>
          </div>
          <div class="queue-item-artist">
          ${track.artists}
          </div>
          <div class="song-timestamp">${track.duration_human}</div>
        </div>
      </div>`;
  });
  scopeQueryList.innerHTML = queryListNewContent;
  animate();
}

function animate() {
  const queueItems = [...document.querySelectorAll(".queue-item")].slice(0, 4);
  const itemsWithTitles = queueItems.map((item) => {
    title = item.querySelector(".queue-item-title");
    return { item, title };
  });

  const additionalMargin = 10;

  const filteredItemsWithTitles = itemsWithTitles.filter(({ item, title }) => {
    //dodac tu jakis padding jaki bedzie potem
    return (
      title.getBoundingClientRect().right > item.getBoundingClientRect().right
    );
  });

  filteredItemsWithTitles.forEach(({ item, title }) => {
    const diff = Math.ceil(
      title.getBoundingClientRect().right -
        item.getBoundingClientRect().right +
        additionalMargin
    );
    const transitionLength = diff / 20;
    title.style.transition = `transform ${transitionLength}s linear`;
    createTimeout(item, 4000, transitionLength * 1000, -diff, true);
  });

  function createTimeout(item, delay, transitionLength, vector, forward) {
    const title = item.querySelector(".queue-item-title");
    timeoutArray.push(
      setTimeout(() => {
        title.style.transform = `translateX(${forward ? vector : 0}px)`;
        timeoutArray.push(
          setTimeout(
            () =>
              createTimeout(item, delay, transitionLength, vector, !forward),
            transitionLength + 4000
          )
        );
      }, delay)
    );
  }
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
  <div class="song-title-container">
    <div class="playing__position">${position.human}</div>
    <div class="playing__length">${duration.human}</div>
    <div class="song-title">${name}</div>
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

function updateTime(position) {
  const { progressBar, positionDiv } = getCounterElements();
  progressBar.value = position;
  positionDiv.innerText = convertToHumanTime(position);
}

function runCounter(position) {
  const { progressBar, positionDiv } = getCounterElements();
  progressInterval = setInterval(() => {
    if (progressBar.value < progressBar.max) {
      progressBar.value++;
      position++;
      positionDiv.innerText = convertToHumanTime(position);
    }
  }, 1000);
}

function fadeOutPlaying() {
  const playedEarlier = document.querySelectorAll(".now-playing");
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
  newBackgroundImage.classList.add("background__image");
  backgroundImage.classList.add("background__image--fade-out");
  // debugger;
  setTimeout(() => {
    backgroundImage.remove();
  }, 500);
}

window.addEventListener("beforeunload", function (e) {
  events.close();
  e.preventDefault();
  e.returnValue = "";
});
