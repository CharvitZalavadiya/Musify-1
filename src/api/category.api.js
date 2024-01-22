"use strict";

const { getData } = require("../config/axios.config");
const { getUrlQuery } = require("../utils/helpers.util");

const getSeveralDetail = async (req) => {
  const { offset, limit, page } = getUrlQuery(req.params);
  const {
    data: { categories },
  } = await getData(
    `/browse/categories?limit=${limit}&offset=${offset}`,
    req.cookies.access_token
  );
  return { baseUrl: req.baseUrl, page, name: "Explore", ...categories };
};

const getDetail = async (req) => {
  const { categoryId } = req.params;
  const { data: catInfo } = await getData(
    `/browse/categories/${categoryId}`,
    req.cookies.access_token
  );
  return catInfo;
};

module.exports = {
  getSeveralDetail,
  getDetail
};
