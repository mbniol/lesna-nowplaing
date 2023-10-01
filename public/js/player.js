window.onSpotifyWebPlaybackSDKReady = async () => {
  const response = await fetch("/api/token/sdk");
  const jsonResponse = await response.json();
  const token = jsonResponse.token;

  const player = new Spotify.Player({
    name: "Lesna",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });

  player.addListener("ready", (x) => {});

  let currentSongID = undefined;
  fetch("/api/queue");

  player.addListener(
    "player_state_changed",
    ({
      position,
      duration,
      track_window: { current_track, previous_tracks },
    }) => {
      fetch("/api/queue");
      if (current_track !== currentSongID) {
        const previous_track = previous_tracks[previous_tracks.length - 1];
        //
        fetch("/api/queue", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current: current_track.uid,
            previous: previous_track.uid,
          }),
        });
      }
    }
  );

  player.connect();
};
