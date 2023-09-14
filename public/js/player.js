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
  const token = 'BQDcEtY419E2Nig00AXlmSWGp01LhJL7iewZ96vQsAhZJrXS_eRwLKJw9iUe-Wo-hp7pjA-HG1-Am0uFQuzUdsap3IsqAzwuC5HxTxl-HjKWBBGo7353-YMj0pU_Z7SaVmVy46nLm5uVFuryjuWC7fROI8v0Zd8i9wWHgA0nzm0n0Th1zHWpxeDXDO5d2nKZzdTdREMA1Z9_dA';
  const player = new Spotify.Player({
    name: 'Lesna',
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