"use strict";

const { getData } = require("../config/axios.config");
const { getUrlQuery } = require("../utils/helpers.util");

const getFeatured = async (req, itemLimit) => {
  const { offset, limit, page } = getUrlQuery(req.params, itemLimit);
  const { data: featuredPlaylist } = await getData(
    `/browse/featured-playlists?limit=${limit}&offset=${offset}`,
    req.cookies.access_token
  );

  return { baseUrl: req.baseUrl, page, ...featuredPlaylist };
};

const getCategoryPlaylist = async (req, itemLimit) => {
  const { offset, limit, page } = getUrlQuery(req.params, itemLimit);
  const { categoryId = "toplists" } = req.params;

  const { data: catPlaylist } = await getData(
    `/browse/categories/${categoryId}/playlists?limit=${limit}&offset=${offset}`,
    req.cookies.access_token
  );
  const /** {string} */ baseUrl = `${req.baseUrl}/${categoryId}`;

  return { baseUrl, page, ...catPlaylist };
};

const getDetail = async (req) => {
  const { playlistId } = req.params;

  const { data: playlistDetail } = await getData(
    `/playlists/${playlistId}`,
    req.cookies.access_token
  );
  return playlistDetail;
};


module.exports = {
  getFeatured,
  getCategoryPlaylist,
  getDetail
};
