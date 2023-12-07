const closeBtn = document.querySelectorAll(".closeBtn");
const backBtn = document.getElementById("backBtn");
const openBtn = document.getElementsByClassName("add-song-floating-btn")[0];
const addSongPanel = document.getElementsByClassName("add-song")[0];
const addSongBtn = document.getElementById("addSongBtn");

openBtn.addEventListener("click", async (e) => {
  addSongPanel.classList.add("visible");
  // setTimeout(() => addSongPanel.classList.remove("hide"), 0);
  // setTimeout(() => addSongPanel.classList.remove("forceHide"), 500);
  //XDDDDDDDDD
});

closeBtn.forEach((el) => {
  el.addEventListener("click", async (e) => {
    addSongPanel.classList.remove("visible");
    // setTimeout(() => addSongPanel.classList.add("hide"), 0);
    // setTimeout(() => addSongPanel.classList.add("forceHide"), 500);
  });
});

backBtn.addEventListener("click", async (e) => {
  console.log("kurwa");
  document
    .getElementsByClassName("add-song-step1")[0]
    .classList.remove("fadeOut");
  document
    .getElementsByClassName("add-song-step2")[0]
    .classList.remove("fadeIn");
  document.getElementsByClassName("add-song-step1")[0].classList.add("fadeIn");
  document.getElementsByClassName("add-song-step2")[0].classList.add("fadeOut");
});

//dodawanie piosenki
const new_pattern_form = document.querySelector("#spotifyForm");
const add_song = new_pattern_form.querySelector("#addSongBtn");
add_song.addEventListener("click", async (e) => {
  add_song.classList.add("hidden");
  e.preventDefault();
  const formData = new FormData(new_pattern_form);
  const params = new URLSearchParams(formData);
  const response = await fetch("/api/check_track", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  //przypisanie danych z odpowiedzi do json
  const json = await response.json();
  //podmiana danych na otrzymane z bazy w step2
  document.getElementById("error").innerHTML = "";
  document.getElementById("step2-song-title").innerHTML = json["name"];
  document.getElementById("step2-song-artist").innerHTML = json["artist"];
  document.getElementById("step2-song-img").setAttribute("src", json["img"]);
  document
    .getElementById("voting-vote-btn")
    .setAttribute("data-track-id", json["id"]);

  if (json["error"] == undefined) {
    document
      .getElementsByClassName("add-song-step1")[0]
      .classList.remove("fadeIn");
    document
      .getElementsByClassName("add-song-step2")[0]
      .classList.remove("fadeOut");
    document
      .getElementsByClassName("add-song-step1")[0]
      .classList.add("fadeOut");
    document
      .getElementsByClassName("add-song-step2")[0]
      .classList.add("fadeIn");
    setTimeout(() => {
      add_song.classList.remove("hidden");
    }, 500);
  } else {
    document.getElementById("error").innerHTML = json["error"];
    add_song.classList.remove("hidden");
  }
});

async function getVisitorId() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}

async function show_votes() {
  const result = await fetch("/api/track_list");
  const json = await result.json();
  json.forEach(({ id, name, artist, count, cover }) => {
    document.getElementById("voting-list").innerHTML += add_track(
      id,
      name,
      artist,
      count,
      cover
    );
  });
  const visitorId = await getVisitorId();
  console.log(JSON.stringify({ visitorId }));
  const votingButtons = document.querySelectorAll(".voting-vote-btn");
  votingButtons.forEach((el) => {
    el.addEventListener("click", async (e) => {
      const trackID = el.dataset.trackId;
      await fetch(`/api/votes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotifyLink: trackID, visitorId }),
      });
      disableVoting();
    });
  });
  const events = new EventSource(
    // `https://${process.env.WEB_HOST}:${process.env.WEB_PORT}/api/player`
    `/api/live_votes`
  );
  events.onmessage = async (event) => {
    const { track_id, cover, name, artist, votes } = JSON.parse(event.data);
    console.log(JSON.parse(event.data));
    const targetElement = document.querySelector("#letterstart" + track_id);
    if (!targetElement) {
      document.getElementById("voting-list").innerHTML += add_track(
        track_id,
        name,
        artist,
        votes,
        cover
      );
    } else {
      const voteCountContainer = targetElement.querySelector(
        ".voting-votecount-container"
      );
      const oldSpan = voteCountContainer.querySelector(
        ".voting-votecount-count"
      );
      const newSpan = document.createElementFromString(
        `<span class="voting-votecount-count voting-votecount-count--take-position">${votes}</span>`
      );
      voteCountContainer.appendChild(newSpan);
      // debugger;
      oldSpan.classList.add("voting-votecount-count--leave-position");
      // setTimeout(() => {
      //   newSpan.classList.add("voting-votecount-count");
      // }, 0);
      // setTimeout(() => {
      //   newSpan.classList.add("voting-votecount-count--take-position");
      // }, 0);
      // setTimeout(() => {
      //   newSpan.classList.remove("voting-votecount-count--next");
      //   oldSpan.classList.add("voting-votecount-count--leave-position");
      // }, 100);
      // debugger;
      setTimeout(() => {
        newSpan.classList.remove("voting-votecount-count--take-position");
        oldSpan.remove();
      }, 500);
    }
    const response = await fetch("/api/check_vote_status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visitorId }),
    });
    //przypisanie danych z odpowiedzi do json
    const votestatus = await response.json();
    if (votestatus["vote"]) {
      disableVoting();
    }
  };
  window.addEventListener("beforeunload", function (e) {
    events.close();
  });
  const response = await fetch("/api/check_vote_status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ visitorId }),
  });
  //przypisanie danych z odpowiedzi do json
  const votestatus = await response.json();
  if (votestatus["vote"]) {
    disableVoting();
  }
}
function add_track(id, name, artist, count, cover) {
  return `
  <div class="voting-item" id="letterstart${id}">
  <div class="voting-song-cover">
    <img src="${cover}" alt="" srcset="" />
  </div>
  <div class="voting-song-info-wrapper">
    <div class="voting-title">${name}</div>
    <div class="voting-artist">${artist}</div>
    <div class="voting-votecount-wrapper">
      Głosów: 
      <span style="position: relative;" class="voting-votecount-container">
        <span class="voting-votecount-count">${count}</span>
      </span>
    </div>
  </div>
  <button
    class="voting-vote-btn"
    data-track-id="${id}"
  >
  <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2652 7 12.5196 7.10536 12.7071 7.29289L19.7071 14.2929C20.0976 14.6834 20.0976 15.3166 19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071L12 9.41421L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L11.2929 7.29289C11.4804 7.10536 11.7348 7 12 7Z"/>
</svg>
  </button>
</div>`;
}

function disableVoting() {
  const buttons = document.querySelectorAll("button");
  //console.log(buttons);
  buttons.forEach((e) => {
    e.disabled = true;
  });
}
show_votes();
