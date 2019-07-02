/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const axios = require("axios");
const crypto = require("crypto");
const assert = require("assert");

const productsUrl =
  "https://spreadsheets.google.com/feeds/list/17Ao7AGuYxql6KBq_Di-dFJkhtFLk80Z0EtKFF-HnB9s/1/public/values?alt=json";
const locationsUrl =
  "https://spreadsheets.google.com/feeds/list/17Ao7AGuYxql6KBq_Di-dFJkhtFLk80Z0EtKFF-HnB9s/2/public/values?alt=json";

const getSpreadsheetJson = async url => {
  try {
    const { status, data } = await axios(url);
    console.log("response");
    console.log(data);
    if (status === 200) {
      return { ok: true, data };
    } else {
      throw new Error("Could not fetch spreadsheet json");
    }
  } catch (error) {
    console.error(error);
    return { ok: false, error };
  }
};

const getEntriesFromSpreadsheet = feed => {
  return feed.entry.map(entry => {
    return Object.entries(entry).reduce((acc, [_key, { $t: value }]) => {
      const [_, key] = _key.split("$");
      if (key) {
        return { ...acc, [key]: value };
      }
      return acc;
    }, {});
  });
};

const getParsedValue = string => {
  if (string.search(/^\d{1,}\,\d{1,2}$/) !== -1) {
    return parseFloat(string.replace(",", "."));
  } else if (string.search(/^\d+$/) !== -1) {
    return parseInt(string);
  }
  return string;
};

const cleanSpreadsheetData = data =>
  data.map(item =>
    Object.entries(item).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: getParsedValue(value) }),
      {},
    ),
  );

exports.sourceNodes = async ({ actions }) => {
  const makeNode = node => {
    node.internal.contentDigest = crypto
      .createHash("md5")
      .update(JSON.stringify(node))
      .digest("hex");

    createNode(node);
  };
  const { createNode } = actions;
  const { data: productsJson } = await getSpreadsheetJson(productsUrl);
  const { data: locationsJson } = await getSpreadsheetJson(locationsUrl);
  const products = cleanSpreadsheetData(
    getEntriesFromSpreadsheet(productsJson.feed),
  );
  const locations = cleanSpreadsheetData(
    getEntriesFromSpreadsheet(locationsJson.feed),
  );

  products.map(({ id, price, quantitysqm, pricesqm, name }) => {
    const gqlId = `product-${id}`;
    makeNode({
      id: gqlId,
      price,
      quantitysqm,
      pricesqm,
      name,
      internal: { type: "product" },
    });
    return gqlId;
  });
  locations.map(({ id, price, name }) => {
    const gqlId = `location-${id}`;
    makeNode({
      id: gqlId,
      price,
      name,
      internal: { type: "location" },
    });
    return gqlId;
  });
};
