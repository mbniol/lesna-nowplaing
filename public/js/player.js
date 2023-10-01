let playerChanges = 0;
let connectEnforcer;
function addConnectEnforcer() {
  connectEnforcer = document.createElement("div");
  connectEnforcer.classList.add("enforcer");
  connectEnforcer.innerText = "Podłącz do Spotify";
  document.body.appendChild(connectEnforcer);
  // connectEnforcer.addEventListener("click", () => {
  //   connectEnforcer.remove();
  // });
}
window.onSpotifyWebPlaybackSDKReady = async () => {
  const response = await fetch("/api/token/sdk");
  const jsonResponse = await response.json();
  const token = jsonResponse.token;
  // console.log(token);

  const player = new Spotify.Player({
    name: "Lesna",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });

  player.addListener("ready", ({ device_id }) => {
    addConnectEnforcer();
    console.log("The Web Playback SDK is ready to play music!");
    console.log("Device ID", device_id);
  });

  let currentSongID = undefined;
  // fetch("/api/queue");

  player.addListener("player_state_changed", async (a) => {
    // console.log(playerChanges);
    if (playerChanges++ === 0) {
      addClickEnforcer();
    }
    const rzeczy = await fetch("/api/queue");
    const json = await rzeczy.json();
    console.log(json);
    // if (current_track !== currentSongID) {
    //   const previous_track = previous_tracks[previous_tracks.length - 1];
    //   //
    //   fetch("/api/queue", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       current: current_track.uid,
    //       previous: previous_track.uid,
    //     }),
    //   });
    // }
  });
  player.connect();
};

function addClickEnforcer() {
  console.log(connectEnforcer);
  connectEnforcer.remove();
  const clickEnforcer = document.createElement("div");
  clickEnforcer.classList.add("enforcer");
  clickEnforcer.innerText = "Kliknij";
  document.body.appendChild(clickEnforcer);
  // document.body.innerHTML += '<div class="enforcer">Podłącz spotify</div>';
  // const clickEnforcer = document.querySelector(".enforcer");
  clickEnforcer.addEventListener("click", () => {
    clickEnforcer.remove();
    fetch("/api/play", {
      method: "PUT",
    });
  });
}

// document.body.innerHTML += '<div class="enforcer">Podłącz spotify</div>';
// const clickEnforcer = document.querySelector(".enforcer");
// clickEnforcer.addEventListener("click", () => {
//   clickEnforcer.remove();
//   //   player.resume().then(() => {
//   //     console.log("Resumed!");
//   //   });
// });
