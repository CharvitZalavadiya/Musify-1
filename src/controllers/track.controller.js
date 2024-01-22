"use strict";

const userApi = require("../api/user.api");
const playerApi = require("../api/player.api");
const artistApi = require("../api/artist.api");
const trackApi = require("../api/track.api");
const { msToTimeCode } = require("../utils/helpers.util");

const trackDetail = async (req, res) => {
  // current user profile
  const currentProfile = await userApi.getProfile(req);

  // recently played tracks
  const recentlyPlayed = await playerApi.getRecentlyPlayed(req);
  const recentlyPlayedTracks = recentlyPlayed.items.map(({ track }) => track);
  
  // track detail
  const trackDetail = await trackApi.getDetail(req);

  // track artist detail
  const artistIds = trackDetail.artists.map(({ id }) => id);
  const trackArtists = await artistApi.getSeveralDetail(
    req,
    artistIds.join(",")
  );

  // first artist top track
  const [firstArtistId] = artistIds;
  const artistTopTracks = await artistApi.getTopTracks(req, firstArtistId);

  // related artist
  const relatedArtist = await artistApi.getRelated(req, firstArtistId);


  res.render("./pages/track_detail", {
    currentProfile,
    recentlyPlayedTracks,
    trackDetail,
    trackArtists,
    artistTopTracks,
    relatedArtist,
    msToTimeCode,
  });
};

module.exports = {
  trackDetail,
};
