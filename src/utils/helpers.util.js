"use strict";

const apiConfig = require("../config/api.config");

/**
 * Generates a random string containing numbers and letters
 * @param {number} length The length of the string
 * @returns {string} Generated string
 */
const generateRandomString = function (length) {
  let /** {string | undefined} */ randomString = "";
  const /** {string} */ possibleLetters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length - 1; i++) {
    const /** {number} */ randomIndex = Math.floor(
        Math.random() * possibleLetters.length
      );
    randomString += possibleLetters[randomIndex];
  }
  return randomString;
};

/**
* Constructs a URL query object based on provided parameters
* Oparam {Object} params - The parameters for constructing the URL query.I
* @param {number} [params.page=1] - The page number for paginated results.
* @param {number} [limit=apiConfig. DEFAULT_LIMIT] - The limit of items per page, with a
default value from the API configuration.
* @returns {Object} - The URL query object with properties for limit, offset, and page.
*/
const getUrlQuery = (params, limit = apiConfig.DEFAULT_LIMIT) => {
  const { page = 1 } = params;
  const /** {number} */ offset = ( limit * page ) - limit;
  return { limit, offset, page };
};

// convert milliseconod to time code
const msToTimeCode = (ms) => {
  const sec = Math.floor((ms % 60000) / 1000);
  const min = Math.floor((ms % 3600000) / 60000);
  const formattedSec = sec.toString().padStart(2, "0");
  const formattedMin = min.toString().padStart(2, "0");
  
  return `${formattedMin}:${formattedSec}`;
};

module.exports = {
  generateRandomString,
  getUrlQuery,
  msToTimeCode
};
