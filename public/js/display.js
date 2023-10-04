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

const events = new EventSource("http://localhost:3000/api/player");
let progressInterval;
const nowPlayingContainer = document.querySelector(".main-left");
let queryList = document.querySelector(".queue-list");
const queryListContainer = document.querySelector(".queue-list-container");

// events.onmessage =

const xd = (event) => {
  const { current_track, queue, position, paused, action } = JSON.parse(
    event.data
  );
  console.log(event.data);
  let position_s = Math.ceil(position / 1000);
  const duration_s = Math.ceil(current_track.duration / 1000);
  clearInterval(progressInterval);
  switch (action) {
    case "init_song": {
      const position_human = convertToHumanTime(position_s);
      const nowPlaying =
        document.createElementFromString(`<div class="now-playing" data-id="${current_track.id}"><div class="cover-art">
        <progress
          class="song-progress-bar"
          value="${position_s}"
          max="${duration_s}"
        ></progress>
        <img src="${current_track.image}" width="100%" />
      </div>
      <div class="song-title-container">
        <div class="song-title">${current_track.name}</div>
        <div class="song-artist">${current_track.artists}</div>
        <div class="song-position">${position_human}</div>
        <div class="song-timestamp">${current_track.duration_human}</div>
      </div></div>`);
      nowPlayingContainer.appendChild(nowPlaying);
      if (!paused) {
        const progressBar = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-progress-bar"
        );
        const positionDiv = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-position"
        );
        progressInterval = setInterval(() => {
          if (progressBar.value <= progressBar.max) {
            progressBar.value++;
            position_s++;
            positionDiv.innerText = convertToHumanTime(position_s);
          }
        }, 1000);
      }
      let queryListNewContent = "";
      queue.forEach((track) => {
        queryListNewContent += `<div class="queue-item" data-id="${track.id}">
            <img class="queue-item-image" src="${track.image}" hei />
            <div class="queue-item-title">${track.name}</div>
            <div class="queue-item-artist">
            ${track.artists}
            </div>
            <div class="song-timestamp">${track.duration_human}</div>
          </div>`;
      });
      queryList.innerHTML = queryListNewContent;
      break;
    }
    case "new_song": {
      const playedEarlier = document.querySelector(".now-playing");
      playedEarlier.classList.add("now-playing--go");
      setTimeout(() => playedEarlier.remove(), 500);
      const nowPlaying =
        document.createElementFromString(`<div class="now-playing" data-id="${current_track.id}"><div class="cover-art">
          <progress
            class="song-progress-bar"
            value="${position_s}"
            max="${duration_s}"
          ></progress>
          <img src="${current_track.image}" width="100%" />
        </div>
        <div class="song-title-container">
          <div class="song-title">${current_track.name}</div>
          <div class="song-artist">${current_track.artists}</div>
          <div class="song-position">00:00</div>
          <div class="song-timestamp">${current_track.duration_human}</div>
        </div></div>`);
      nowPlayingContainer.appendChild(nowPlaying);
      const progressBar = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-progress-bar"
      );
      const positionDiv = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-position"
      );
      if (!paused) {
        const progressBar = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-progress-bar"
        );
        const positionDiv = document.querySelector(
          ".now-playing:not(.now-playing--go) .song-position"
        );
        progressInterval = setInterval(() => {
          if (progressBar.value <= progressBar.max) {
            progressBar.value++;
            position_s++;
            positionDiv.innerText = convertToHumanTime(position_s);
          }
        }, 1000);
      }
      if (queryList.firstElementChild.dataset.id === current_track.id) {
        queryList.classList.add("queue-list--song-change");
        setTimeout(() => {
          let queryListNewContent = "";
          queue.forEach((track) => {
            queryListNewContent += `<div class="queue-item" data-id="${track.id}">
              <img class="queue-item-image" src="${track.image}" hei />
              <div class="queue-item-title">${track.name}</div>
              <div class="queue-item-artist">
              ${track.artists}
              </div>
              <div class="song-timestamp">${track.duration_human}</div>
            </div>`;
          });
          queryList.classList.remove("queue-list--song-change");
          queryList.innerHTML = queryListNewContent;
        }, 650);
      } else {
        queryList.classList.add("queue-list--queue-change");
        const newQueryList = document.createElement("div");
        newQueryList.classList.add("queue-list");
        let queryListNewContent = "";
        queue.forEach((track) => {
          queryListNewContent += `<div class="queue-item" data-id="${track.id}">
  <img class="queue-item-image" src="${track.image}" hei />
  <div class="queue-item-title">${track.name}</div>
  <div class="queue-item-artist">
  ${track.artists}
  </div>
  <div class="song-timestamp">${track.duration_human}</div>
</div>`;
        });
        newQueryList.innerHTML = queryListNewContent;
        queryListContainer.appendChild(newQueryList);
        setTimeout(() => {
          queryList.remove();
          queryList = newQueryList;
        }, 650);
      }
      break;
    }
    case "pause": {
      const progressBar = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-progress-bar"
      );
      const positionDiv = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-position"
      );
      progressBar.value = position_s;
      positionDiv.innerText = convertToHumanTime(position_s);
      break;
    }
    case "resume":
    case "position_change":
      const progressBar = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-progress-bar"
      );
      const positionDiv = document.querySelector(
        ".now-playing:not(.now-playing--go) .song-position"
      );
      progressBar.value = position_s;
      positionDiv.innerText = convertToHumanTime(position_s);
      if (!paused) {
        progressInterval = setInterval(() => {
          if (progressBar.value <= progressBar.max) {
            progressBar.value++;
            position_s++;
            positionDiv.innerText = convertToHumanTime(position_s);
          }
        }, 1000);
      }
      break;
  }
};

const arr = [
  {
    current_track: {
      image: "https://i.scdn.co/image/ab67616d0000b273282c5746a6b43888a2dc8ef2",
      artists: "Waco, Zipera",
      duration: 219333,
      duration_human: "3:39",
      name: "W imię czego?",
      id: "5v92rgDJjwu5ktzWRXfIWe",
    },
    queue: [
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 255480,
        duration_human: "4:15",
        name: "OBOJÊTNOŒÆ",
        id: "1mF3QCim68ij1FYSCiBxt6",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 206306,
        duration_human: "3:26",
        name: "WIR WYDARZEÑ",
        id: "1prQAufeQWQhZYiq23kgKM",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0212099c18cc1ffe14cfc12e6b",
        artists: "Zipera",
        duration: 233853,
        duration_human: "3:53",
        name: "Droga otwarta",
        id: "1zX3KHXhpp4iNvvYpHvUUo",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 80973,
        duration_human: "1:20",
        name: "INTRO",
        id: "05M7YAjTgalWRRhxYypcIF",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 210013,
        duration_human: "3:30",
        name: "O.N.F.R. II (OPARTA NA FAKTACH RYMONACJA)",
        id: "2kAZx7pdyOlB4q2CmAdUfS",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 191106,
        duration_human: "3:11",
        name: "ELEMENT ZASKOCZENIA",
        id: "4w8imt6KJDuStelwmjE6u6",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 261959,
        duration_human: "4:21",
        name: "HIPHOPOWY RING (REMIX)",
        id: "4nWrXp2kCnCavlaY5AD3LA",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 16773,
        duration_human: "0:16",
        name: "SKIT (JAZDA)",
        id: "20D302KXTUL1yxNOlsUAoF",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 205093,
        duration_human: "3:25",
        name: "PIERWSZY STOPIEÑ ZAGRO¯ENIA (SCENARIUSZ)",
        id: "3kKs9DmkgxFeei1jz5LbGd",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 288306,
        duration_human: "4:48",
        name: "MG£A",
        id: "6H3dBDyOhWaiFFc1dpOTDu",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 186466,
        duration_human: "3:06",
        name: "CZARNA OWCA",
        id: "5K9BpllAO0BasrPjBavjYe",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 133986,
        duration_human: "2:13",
        name: "SKIT (MELAN¯ STUDIO 21:30)",
        id: "5UTkALtB0z4cyrOw0Nv8S0",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 329693,
        duration_human: "5:29",
        name: "WADEMEKUM",
        id: "261GnWODKY5gRPVCOpxULp",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 217640,
        duration_human: "3:37",
        name: "ANTYMORALNY PROCES",
        id: "2RyckZF8kJDv7oclTt2ndu",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 206306,
        duration_human: "3:26",
        name: "WIR WYDARZEÑ",
        id: "1prQAufeQWQhZYiq23kgKM",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 29093,
        duration_human: "0:29",
        name: "SKIT (SZARA PRAWDA)",
        id: "2Aff8N9Cvyi4yMWmQPl1WR",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 271213,
        duration_human: "4:31",
        name: "TAK MUSI BYÆ",
        id: "4vuQLNjMWzFzLW37C0Psan",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 268026,
        duration_human: "4:28",
        name: "SZTUCZNA TWARZ",
        id: "0Z0jf39pcGJUQ2NbGBYcUK",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 255480,
        duration_human: "4:15",
        name: "OBOJÊTNOŒÆ",
        id: "1mF3QCim68ij1FYSCiBxt6",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 183013,
        duration_human: "3:03",
        name: "OUTRO",
        id: "71ZSf3OTm1qNDovvtUgpt4",
      },
    ],
    position: 2625,
    paused: false,
    action: "init_song",
  },
  {
    current_track: {
      image: "https://i.scdn.co/image/ab67616d0000b2738aace3b9a4d896cae773dbd7",
      artists: "Zipera",
      duration: 255480,
      duration_human: "4:15",
      name: "OBOJÊTNOŒÆ",
      id: "1mF3QCim68ij1FYSCiBxt6",
    },
    queue: [
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 206306,
        duration_human: "3:26",
        name: "WIR WYDARZEÑ",
        id: "1prQAufeQWQhZYiq23kgKM",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0212099c18cc1ffe14cfc12e6b",
        artists: "Zipera",
        duration: 233853,
        duration_human: "3:53",
        name: "Droga otwarta",
        id: "1zX3KHXhpp4iNvvYpHvUUo",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 80973,
        duration_human: "1:20",
        name: "INTRO",
        id: "05M7YAjTgalWRRhxYypcIF",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 210013,
        duration_human: "3:30",
        name: "O.N.F.R. II (OPARTA NA FAKTACH RYMONACJA)",
        id: "2kAZx7pdyOlB4q2CmAdUfS",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 191106,
        duration_human: "3:11",
        name: "ELEMENT ZASKOCZENIA",
        id: "4w8imt6KJDuStelwmjE6u6",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 261959,
        duration_human: "4:21",
        name: "HIPHOPOWY RING (REMIX)",
        id: "4nWrXp2kCnCavlaY5AD3LA",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 16773,
        duration_human: "0:16",
        name: "SKIT (JAZDA)",
        id: "20D302KXTUL1yxNOlsUAoF",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 205093,
        duration_human: "3:25",
        name: "PIERWSZY STOPIEÑ ZAGRO¯ENIA (SCENARIUSZ)",
        id: "3kKs9DmkgxFeei1jz5LbGd",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 288306,
        duration_human: "4:48",
        name: "MG£A",
        id: "6H3dBDyOhWaiFFc1dpOTDu",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 186466,
        duration_human: "3:06",
        name: "CZARNA OWCA",
        id: "5K9BpllAO0BasrPjBavjYe",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 133986,
        duration_human: "2:13",
        name: "SKIT (MELAN¯ STUDIO 21:30)",
        id: "5UTkALtB0z4cyrOw0Nv8S0",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 329693,
        duration_human: "5:29",
        name: "WADEMEKUM",
        id: "261GnWODKY5gRPVCOpxULp",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 217640,
        duration_human: "3:37",
        name: "ANTYMORALNY PROCES",
        id: "2RyckZF8kJDv7oclTt2ndu",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 206306,
        duration_human: "3:26",
        name: "WIR WYDARZEÑ",
        id: "1prQAufeQWQhZYiq23kgKM",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 29093,
        duration_human: "0:29",
        name: "SKIT (SZARA PRAWDA)",
        id: "2Aff8N9Cvyi4yMWmQPl1WR",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 271213,
        duration_human: "4:31",
        name: "TAK MUSI BYÆ",
        id: "4vuQLNjMWzFzLW37C0Psan",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 268026,
        duration_human: "4:28",
        name: "SZTUCZNA TWARZ",
        id: "0Z0jf39pcGJUQ2NbGBYcUK",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 255480,
        duration_human: "4:15",
        name: "OBOJÊTNOŒÆ",
        id: "1mF3QCim68ij1FYSCiBxt6",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 183013,
        duration_human: "3:03",
        name: "OUTRO",
        id: "71ZSf3OTm1qNDovvtUgpt4",
      },
    ],
    position: 0,
    paused: false,
    action: "new_song",
  },

  {
    current_track: {
      image: "https://i.scdn.co/image/ab67616d0000b2738aace3b9a4d896cae773dbd7",
      artists: "Zipera",
      duration: 206306,
      duration_human: "3:26",
      name: "WIR WYDARZEÑ",
      id: "1prQAufeQWQhZYiq23kgKM",
    },
    queue: [
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0212099c18cc1ffe14cfc12e6b",
        artists: "Zipera",
        duration: 233853,
        duration_human: "3:53",
        name: "Droga otwarta",
        id: "1zX3KHXhpp4iNvvYpHvUUo",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 80973,
        duration_human: "1:20",
        name: "INTRO",
        id: "05M7YAjTgalWRRhxYypcIF",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 210013,
        duration_human: "3:30",
        name: "O.N.F.R. II (OPARTA NA FAKTACH RYMONACJA)",
        id: "2kAZx7pdyOlB4q2CmAdUfS",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 191106,
        duration_human: "3:11",
        name: "ELEMENT ZASKOCZENIA",
        id: "4w8imt6KJDuStelwmjE6u6",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 261959,
        duration_human: "4:21",
        name: "HIPHOPOWY RING (REMIX)",
        id: "4nWrXp2kCnCavlaY5AD3LA",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 16773,
        duration_human: "0:16",
        name: "SKIT (JAZDA)",
        id: "20D302KXTUL1yxNOlsUAoF",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 205093,
        duration_human: "3:25",
        name: "PIERWSZY STOPIEÑ ZAGRO¯ENIA (SCENARIUSZ)",
        id: "3kKs9DmkgxFeei1jz5LbGd",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 288306,
        duration_human: "4:48",
        name: "MG£A",
        id: "6H3dBDyOhWaiFFc1dpOTDu",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 186466,
        duration_human: "3:06",
        name: "CZARNA OWCA",
        id: "5K9BpllAO0BasrPjBavjYe",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 133986,
        duration_human: "2:13",
        name: "SKIT (MELAN¯ STUDIO 21:30)",
        id: "5UTkALtB0z4cyrOw0Nv8S0",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 329693,
        duration_human: "5:29",
        name: "WADEMEKUM",
        id: "261GnWODKY5gRPVCOpxULp",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 217640,
        duration_human: "3:37",
        name: "ANTYMORALNY PROCES",
        id: "2RyckZF8kJDv7oclTt2ndu",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 206306,
        duration_human: "3:26",
        name: "WIR WYDARZEÑ",
        id: "1prQAufeQWQhZYiq23kgKM",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 29093,
        duration_human: "0:29",
        name: "SKIT (SZARA PRAWDA)",
        id: "2Aff8N9Cvyi4yMWmQPl1WR",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 271213,
        duration_human: "4:31",
        name: "TAK MUSI BYÆ",
        id: "4vuQLNjMWzFzLW37C0Psan",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 268026,
        duration_human: "4:28",
        name: "SZTUCZNA TWARZ",
        id: "0Z0jf39pcGJUQ2NbGBYcUK",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 255480,
        duration_human: "4:15",
        name: "OBOJÊTNOŒÆ",
        id: "1mF3QCim68ij1FYSCiBxt6",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028aace3b9a4d896cae773dbd7",
        artists: "Zipera",
        duration: 183013,
        duration_human: "3:03",
        name: "OUTRO",
        id: "71ZSf3OTm1qNDovvtUgpt4",
      },
    ],
    position: 0,
    paused: false,
    action: "new_song",
  },

  {
    current_track: {
      image: "https://i.scdn.co/image/ab67616d0000b27389fc8b71ce74de508e3109af",
      artists: "Ecco2k, Thaiboy Digital, Bladee",
      duration: 120000,
      duration_human: "2:00",
      name: "Western Union",
      id: "1zX178V8sWozr96MrfmRun",
    },
    queue: [
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e02ff07469efd357665e364e2d9",
        artists: "Skrillex, Yung Lean, Bladee",
        duration: 192000,
        duration_human: "3:12",
        name: "Ceremony",
        id: "4DmqWDZUtoxBX7wg9eCgzF",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e02d754d2ef29e3f7dcd73caa3b",
        artists: "Bladee",
        duration: 123586,
        duration_human: "2:03",
        name: "Reality Surf",
        id: "6HJszgJO19tAKff7X40ggp",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028504a0836dfaa61b28930505",
        artists: "Bladee, Ecco2k",
        duration: 134693,
        duration_human: "2:14",
        name: "Girls Just Want to Have Fun",
        id: "7hvwgwbZCCGZaNRQSf8bin",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028504a0836dfaa61b28930505",
        artists: "Bladee, Ecco2k",
        duration: 179430,
        duration_human: "2:59",
        name: "The Flag is Raised",
        id: "7mebNFbb0ehL1IX1DMktdC",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e02ff07469efd357665e364e2d9",
        artists: "Skrillex, Bladee",
        duration: 129229,
        duration_human: "2:09",
        name: "Real Spring",
        id: "69SvqsvWaLgztW7fGVKRZs",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0235f58f19ab125876752bcf6a",
        artists: "Bladee",
        duration: 134653,
        duration_human: "2:14",
        name: "Hotel Breakfast",
        id: "55CayibAnUWXdUwy2J68yB",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 188177,
        duration_human: "3:08",
        name: "UNDERSTATEMENT",
        id: "2ORtT6vXq21ZMLjW3H7TTQ",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 77015,
        duration_human: "1:17",
        name: "ITS OK TO NOT BE OK",
        id: "7d2sD0YaynMaal6sfvfCPT",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 153020,
        duration_human: "2:33",
        name: "I AM SLOWLY BUT SURELY LOSING HOPE",
        id: "3WieU75Yx5KEP1TnC8dTF8",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 126408,
        duration_human: "2:06",
        name: "ICARUS 3REESTYLE",
        id: "3PcEemHRD24onozCZpLFkt",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee, Wondha Mountain",
        duration: 186677,
        duration_human: "3:06",
        name: "NOTHINGG",
        id: "2d1kRMAr6mmVxvT26Bb65w",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 194707,
        duration_human: "3:14",
        name: "BLUE CRUSH ANGEL",
        id: "3IfubiA2HlLdwwNShXwW7q",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee, Ecco2k",
        duration: 117541,
        duration_human: "1:57",
        name: "DiSASTER PRELUDE",
        id: "1yA52ETTFmGPb0uJYShoAu",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 136557,
        duration_human: "2:16",
        name: "HAHAH",
        id: "4esa3tKLyvysJpj70fUCyK",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 110875,
        duration_human: "1:50",
        name: "DRAIN STORY",
        id: "6xj5Id3IaT83F2BX3GKJgp",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 138526,
        duration_human: "2:18",
        name: "Velociraptor",
        id: "7Bm6NB4Nade9tjlOUEAJ98",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 175709,
        duration_human: "2:55",
        name: "DRESDEN ER",
        id: "1yMPTkN25hmgxiAQYkX63O",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 108476,
        duration_human: "1:48",
        name: "She's Always Dancing",
        id: "2vN60qpabe5P08K3WxoEDA",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 171060,
        duration_human: "2:51",
        name: "URIEL OUTRO",
        id: "6SJUijraKdzwx3NPIaIvnw",
      },
    ],
    position: 0,
    paused: false,
    action: "new_song",
  },

  {
    current_track: {
      image: "https://i.scdn.co/image/ab67616d0000b273ff07469efd357665e364e2d9",
      artists: "Skrillex, Yung Lean, Bladee",
      duration: 192000,
      duration_human: "3:12",
      name: "Ceremony",
      id: "4DmqWDZUtoxBX7wg9eCgzF",
    },
    queue: [
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e02d754d2ef29e3f7dcd73caa3b",
        artists: "Bladee",
        duration: 123586,
        duration_human: "2:03",
        name: "Reality Surf",
        id: "6HJszgJO19tAKff7X40ggp",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028504a0836dfaa61b28930505",
        artists: "Bladee, Ecco2k",
        duration: 134693,
        duration_human: "2:14",
        name: "Girls Just Want to Have Fun",
        id: "7hvwgwbZCCGZaNRQSf8bin",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e028504a0836dfaa61b28930505",
        artists: "Bladee, Ecco2k",
        duration: 179430,
        duration_human: "2:59",
        name: "The Flag is Raised",
        id: "7mebNFbb0ehL1IX1DMktdC",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e02ff07469efd357665e364e2d9",
        artists: "Skrillex, Bladee",
        duration: 129229,
        duration_human: "2:09",
        name: "Real Spring",
        id: "69SvqsvWaLgztW7fGVKRZs",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0235f58f19ab125876752bcf6a",
        artists: "Bladee",
        duration: 134653,
        duration_human: "2:14",
        name: "Hotel Breakfast",
        id: "55CayibAnUWXdUwy2J68yB",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 188177,
        duration_human: "3:08",
        name: "UNDERSTATEMENT",
        id: "2ORtT6vXq21ZMLjW3H7TTQ",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 77015,
        duration_human: "1:17",
        name: "ITS OK TO NOT BE OK",
        id: "7d2sD0YaynMaal6sfvfCPT",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 153020,
        duration_human: "2:33",
        name: "I AM SLOWLY BUT SURELY LOSING HOPE",
        id: "3WieU75Yx5KEP1TnC8dTF8",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 126408,
        duration_human: "2:06",
        name: "ICARUS 3REESTYLE",
        id: "3PcEemHRD24onozCZpLFkt",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee, Wondha Mountain",
        duration: 186677,
        duration_human: "3:06",
        name: "NOTHINGG",
        id: "2d1kRMAr6mmVxvT26Bb65w",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 194707,
        duration_human: "3:14",
        name: "BLUE CRUSH ANGEL",
        id: "3IfubiA2HlLdwwNShXwW7q",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee, Ecco2k",
        duration: 117541,
        duration_human: "1:57",
        name: "DiSASTER PRELUDE",
        id: "1yA52ETTFmGPb0uJYShoAu",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 136557,
        duration_human: "2:16",
        name: "HAHAH",
        id: "4esa3tKLyvysJpj70fUCyK",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 110875,
        duration_human: "1:50",
        name: "DRAIN STORY",
        id: "6xj5Id3IaT83F2BX3GKJgp",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 138526,
        duration_human: "2:18",
        name: "Velociraptor",
        id: "7Bm6NB4Nade9tjlOUEAJ98",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 175709,
        duration_human: "2:55",
        name: "DRESDEN ER",
        id: "1yMPTkN25hmgxiAQYkX63O",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 108476,
        duration_human: "1:48",
        name: "She's Always Dancing",
        id: "2vN60qpabe5P08K3WxoEDA",
      },
      {
        image:
          "https://i.scdn.co/image/ab67616d00001e0279cf43651dd1c7b896e642e6",
        artists: "Bladee",
        duration: 171060,
        duration_human: "2:51",
        name: "URIEL OUTRO",
        id: "6SJUijraKdzwx3NPIaIvnw",
      },
    ],
    position: 0,
    paused: false,
    action: "new_song",
  },
];
// console.log(arr);
let i = 0;

setInterval(() => {
  if (arr[i]) {
    xd({ data: JSON.stringify(arr[i++]) });
  }
}, 2000);
