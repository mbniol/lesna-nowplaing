statusDiv = document.getElementsByClassName('player-status')[0]
infoDiv = document.getElementsByClassName('player-info')[0]

function postStatus(playerStatus){
  statusDiv.innerHTML = playerStatus
}

function updateInfo(infoObject, infoObjectNext){
  trackName = infoObject[7];
  artistsObject = Object.values(infoObject[9])
  let artists = ""

  trackNameNext = infoObjectNext[7];
  artistsObjectNext = Object.values(infoObjectNext[9])
  let artistsNext = ""

  artistsObject.forEach(element => {
    artists = artists + String(Object.values(element)[0]) + ", "
  });

  if (artists.endsWith(", ")){
    artists=artists.slice(0,-2)
  }

  artistsObjectNext.forEach(element => {
    artistsNext = artistsNext + String(Object.values(element)[0]) + ", "
  });

  if (artistsNext.endsWith(", ")){
    artistsNext=artistsNext.slice(0,-2)
  }

  infoDiv.innerHTML = "Teraz odtwarzane: "+trackName+" - "+artists+" <br> Następne: "+trackNameNext+" - "+artistsNext
}

window.onSpotifyWebPlaybackSDKReady = () => {
  //token here
  const token = '';
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    postStatus('Ready with Device ID: '+device_id);
  });

  // Not Ready
  player.addListener('not_ready', ({ device_id }) => {
    postStatus('Device ID has gone offline '+device_id);
  });
  
    player.addListener('initialization_error', ({ message }) => {
      postStatus(message);
  });

  player.addListener('authentication_error', ({ message }) => {
      postStatus(message);
  });

  player.addListener('account_error', ({ message }) => {
      postStatus(message);
  });

  player.connect();

  player.addListener('player_state_changed', () => {
    player.getCurrentState().then(state => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }
    
      var current_track = Object.values(state.track_window.current_track);
      var next_track = Object.values(state.track_window.next_tracks[0]);

      updateInfo(current_track, next_track)
    });
  });
}  