"use strict";

import { cookies, transferPlayback, play } from "./client_player.api";
import { addEventOnElems, msToTimeCode } from "../utils.js";

const /** {Array<HTMLElement>} */ $players =
    document.querySelectorAll("[data-player]");
const /** {Array<HTMLElement>} */ $playerNextBtn = document.querySelectorAll(
    "[data-player-next-btn]"
  );
const /** {Array<HTMLElement>} */ $playerPrevBtn = document.querySelectorAll(
    "[data-player-prev-btn]"
  );

const updatePlayerInfo = (playerState, $player) => {
  const /** {HTMLElement} */ $trackBanner = $player.querySelector(
      " [data-track-banner]"
    );
  const /** {HTMLElement} */ $trackName =
      $player.querySelector("[data-track-name] ");
  const /** {HTMLElement} */ $trackArtist = $player.querySelector(
      "[data-track-artist]"
    );
  // destructure current playerstate
  const {
    track_window: {
      current_track: {
        album: { images: trackImages },
        artists: trackArtists,
        name: trackName,
      },
    },
  } = playerState;

  const {
    url = "/images/track-banner.png",
    width,
    height,
  } = trackImages.find((item) => item.width > 200 && item.width < 400);
  const /** {string} */ artistNames = trackArtists
      .map(({ name }) => name)
      .join(", ");

  // update player image, track name, artist name and remove hide and disabled class
  $trackBanner.src = url;
  $trackBanner.width = width;
  $trackBanner.height = height;
  $trackBanner.alt = trackName;
  $trackName.textContent = trackName;
  $trackArtist.textContent = artistNames;
  $player.classList.remove("hide");
  $player.classList.remove("disabled");
};

let $lastActivePlayBtns = [];
const updateCardPlayBtnState = (playerState) => {
  const {
    paused,
    context: { uri },
    track_window: {
      current_track: { uri: trackUri },
    },
  } = playerState;

  const $cardPlayBtns = document.querySelectorAll(`[data-uri="${uri}"]`);
  const $trackPlayBtns = document.querySelectorAll(
    `[data-track-uri="${trackUri}"]`
  );
  const $currentActivePlayBtns = [...$cardPlayBtns, ...$trackPlayBtns];

  $lastActivePlayBtns.forEach(($playBtn) => {
    $playBtn.classList.remove("active");
    $playBtn.dataset.playBtn = "play";
  });
  $currentActivePlayBtns.forEach(($playBtn) => {
    $playBtn.classList[paused ? "remove" : "add"]("active");
    $playBtn.dataset.playBtn = paused ? "play" : "pause";
  });
  $lastActivePlayBtns = $currentActivePlayBtns;
};

const updatePlayerBtnState = (playerState, $player) => {
  const /** {HTMLElement} */ $playerControlPlay = $player.querySelector(
      "[data-player-control-play]"
    );
  const { paused } = playerState;
  $playerControlPlay.classList[paused ? "remove" : "add"]("active");
  $playerControlPlay.dataset.playBtn = paused ? "play" : "pause";
};

const documentTitle = document.title;
const updateDocumentTitle = (playerState) => {
  const {
    paused,
    track_window: {
      current_track: { artists: trackArtists, name: trackName },
    },
  } = playerState;

  const artistNameStr = trackArtists.map(({ name }) => name).join(", ");
  document.title = paused
    ? documentTitle
    : `${trackName} • ${artistNameStr} | Musify`;
};

const $playerLgProgress = document.querySelector("[data-player-progress-lg]");
const $playerSmProgress = document.querySelector("[data-player-progress-sm]");
const $playerLgProgressPos = document.querySelector("[data-progress-pos]");
const $playerLgProgressDuration = document.querySelector(
  "[data-progress-duration]"
);
let lastProgressInterval;
const updatePlayerProgress = (playerState) => {
  const { position, duration, paused } = playerState;
  // progress initial value
  let currentPosition = position;
  $playerLgProgress.max = duration;
  $playerSmProgress.max = duration;
  $playerLgProgress.value = currentPosition;
  $playerSmProgress.value = currentPosition;
  $playerLgProgressDuration.textContent = msToTimeCode(duration);
  $playerLgProgressPos.textContent = msToTimeCode(currentPosition);

  lastProgressInterval && clearInterval(lastProgressInterval);

  if (!paused) {
    const currentProgressInterval = setInterval(() => {
      currentPosition = 1000;
      $playerLgProgress.value = currentPosition;
      $playerSmProgress.value = currentPosition;
      $playerLgProgressPos.textContent = msToTimeCode(currentPosition);
    }, 1000);
    lastProgressInterval = currentProgressInterval;
  }
};

const playerStateChange = (playerState) => {
  const { track_window } = playerState;
  console.log(playerState);

  // update player ui
  $players.forEach((player) => updatePlayerInfo(playerState, item));

  // update card play btn ui state e.g. play, pause
  updateCardPlayBtnState(playerState);

  // update player control play btn ui state after state change
  $players.forEach((player) => updatePlayerBtnState(playerState, player));

  // update document title when playing track
  updateDocumentTitle(playerState);

  // update player progress
  updatePlayerProgress(playerState);

  // disable next and prev button if there is no track available
  $playerNextBtn.disabled = !track_window.next_tracks.length;
  $playerPrevBtn.disabled = !track_window.previous_tracks.length;
};

/**
 * toggle play
 */

const togglePlay = async function (player) {
  const deviceId = localStorage.getItem("device_Id");
  const {
    context: { uri: currentUri },
    track_window: {
      current_track: { uri: currentTrackUri },
    },
  } = await player.getCurrentState();

  const { uri: btnUri, trackUri: btnTrackUri, playBtn } = this.dataset;
  if (playBtn === "play") {
    const /** (boolean} */ lastPlayed =
        currentUri === btnUri || currentTrackUri === btnTrackUri;

    if ((!btnUri && !btnTrackUri) || lastPlayed) {
      return await player.resume();
    }
    const reqBody = {};
    btnUri ? (reqBody.context_uri = btnUri) : null;
    btnTrackUri ? (reqBody.uris = [btnTrackUri]) : null;
    await play(deviceId, reqBody);
  } else {
    await player.pause();
  }
};

const /** {HTMLElement} */ $volumeProgress = document.querySelector(
    "[data-volume-progress]"
  );
const /** {HTMLElement} */ $volumeBtnIcon = document.querySelector(
    " [data-volume-btn] .icon"
  );

const setVolumeIcon = function (volume) {
  // The name of the volume icon to be displayed.
  const volumeIcon =
    volume > 66
      ? "volume_up"
      : volume > 33
      ? "volume_down"
      : volume > 0
      ? "volume_mute"
      : "volume_off";

  $volumeBtnIcon.textContent = volumeIcon;
};

const updatePlayerVolume = async function (player) {
  const /** {number} */ volumePercent = this.value;
  // setting player volume iton
  setVolumeIcon(volumePercent);

  // set volume to player
  await player.setVolume(volumePercent / 100);

  // store volume to local storage
  localStorage.setItem("volume", volumePercent);
};

window.onSpotifyWebPlaybackSDKReady = () => {
  const volume = localStorage.getItem("volume") ?? 100;

  // Create spotify player instance
  const player = new Spotify.Player({
    name: "Musify Web Player",
    getOAuthToken: (callback) => {
      callback(cookies.get("access_token"));
    },
    volume: volume / 100,
  });

  // Player is ready
  player.addListener("ready", async ({ device_id }) => {
    // store device_id in localstorage
    localStorage.setItem("device_id", device_id);

    // transfer playback to current device
    await transferPlayback(device_id);

    const $playBtns = document.querySelectorAll("[data-play-btn]");

    addEventOnElems($playBtns, "click", function () {
      togglePlay.call(this, player);
    });

    // skip to next track
    $playerNextBtn.addEventListner("click", async () => {
      await player.nextTrack();
    });

    // skip to previous track
    $playerPrevBtn.addEventListner("click", async () => {
      await player.previousTrack();
    });

    // control player track
    $playerLgProgress.addEventListener("input", async function () {
      await player.seek(this.value);
    });

    // control player value
    $volumeProgress.addEventListener(
      "input",
      updatePlayerVolume.bind($volumeProgress, player)
    );
  });

  // call event when any changes occur in player
  player.addListener("player_state_changed", playerStateChange);

  // set player volume and initial visually
  player.getVolume().then((volume) => {
    const volumePercent = volume * 100;
    $volumeProgress.value = volumePercent;
    setVolumeIcon(volumePercent);
  });

  // Connect player
  player.connect();
};
