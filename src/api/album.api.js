"use strict";

const { getData } = require("../config/axios.config");
const { getUrlQuery } = require("../utils/helpers.util");

const getNewRelease = async (req, itemLimit) => {
  const { limit, offset, page } = getUrlQuery(req.params, itemLimit);
  const {
    data: { albums: newRelease },
  } = await getData(
    `/browse/new-releases?limit=${limit}&offset=${offset}`,
    req.cookies.access_token
  );
  return { baseUrl: req.baseUrl, page, ...newRelease };
};

const getDetail = async (req) => {
  const { albumId } = req.params;
  const { data: albumDetail } = await getData(
    `/albums/${albumId}`,
    req.cookies.access_token
  );

  return albumDetail;
};

module.exports = {
  getNewRelease,
  getDetail,
};
