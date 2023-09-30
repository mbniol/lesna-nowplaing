window.onSpotifyWebPlaybackSDKReady = async () => {
  const response = await fetch("/api/token/sdk");
  const jsonResponse = await response.json();
  const token = jsonResponse.token;
  console.log(jsonResponse);
  const player = new Spotify.Player({
    name: "Lesna",
    getOAuthToken: (cb) => {
      console.log(token);
      cb(token);
    },
    volume: 0.5,
  });

  player.addListener("ready", (x) => {
    console.log(x);
  });

  // player.addListener("player_state_changed", () => {
  //   player.getCurrentState().then((state) => {
  //     console.log(state);
  //   });
  // });

  player.connect();
};
