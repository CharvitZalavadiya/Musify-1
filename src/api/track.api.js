"use strict";

const { getData } = require("../config/axios.config");

const getRecommendedTrack = async (req, trackSeed, itemLimit) => {
  const {
    data: { tracks: recommendedTracks },
  } = await getData(
    `/recommendations?seed_tracks=${trackSeed}&limit=${itemLimit}`,
    req.cookies.access_token
  );

  return recommendedTracks;
};

const getDetail = async (req) => {
  const { trackId } = req.params;

  const { data: trackDetail } = await getData(
    `/tracks/${trackId}`,
    req.cookies.access_token
  );

  return trackDetail
};


module.exports = {
  getRecommendedTrack,
  getDetail,
};
