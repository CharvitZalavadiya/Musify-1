"use strict";

const { getData } = require("../config/axios.config");
const apiConfig = require("../config/api.config");
const { getUrlQuery } = require("../utils/helpers.util");

const getSeveralDetail = async (req, artistIds) => {
  const { data: trackArtists } = await getData(
    `/artists?ids=${artistIds}`,
    req.cookies.access_token
  );
  return trackArtists;
};

const getAlbum = async (req, itemLimit, id) => {
  const { offset, limit, page } = getUrlQuery(req.params, itemLimit);
  const { artistId = id } = req.params;
  const { data: artistAlbum } = await getData(
    `/artists/${artistId}/albums?limit=${limit}&offset=${offset}`,
    req.cookies.access_token
  );
  const baseUrl = `${req.baseUrl}/${artistId}/album`;
  return { baseUrl, page, ...artistAlbum };
};

const getDetail = async (req) => {
  const { artistId } = req.params;

  const { data: artistDetail } = await getData(
    `artists/${artistId}`,
    req.cookies.access_token
  );

  return artistDetail;
};

const getTopTracks = async (req, id) => {
  const { artistId = id } = req.params;

  const { data: artistTopTracks } = await getData(
    `/artists/${artistId}/top-tracks?market=${apiConfig.MARKET}`,
    req.cookies.access_token
  );

  return artistTopTracks;
};

const getRelated = async (req, id) => {
  const { artistId = id } = req.params;

  const { data: relatedArtist } = await getData(
    `/artists/${artistId}/related-artists`,
    req.cookies.access_token
  );

  return relatedArtist;
}

module.exports = {
  getSeveralDetail,
  getAlbum,
  getDetail,
  getTopTracks,
  getRelated
};
