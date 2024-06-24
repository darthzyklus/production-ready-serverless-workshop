const fs = require("fs");
const aws4 = require("aws4");
const Mustache = require("mustache");
const http = require("axios");
const URL = require("url");

const restaurantsApiRoot = process.env.restaurants_api;

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

let html;

function loadHtml() {
    if (!html) {
        console.log("loading index.html...");
        html = fs.readFileSync("static/index.html", "utf-8");
        console.log("loaded");
    }

    return html;
}

const getRestaurants = async () => {
    console.log(`loading restaurants from ${restaurantsApiRoot}...`);

    const url = URL.parse(restaurantsApiRoot);

    const opts = {
        host: url.hostname,
        path: url.pathname,
    };

    aws4.sign(opts);

    const resp = await http.get(restaurantsApiRoot, {
        headers: opts.headers,
    });

    return resp.data;
};

module.exports.handler = async (event, context) => {
    const template = loadHtml();
    const restaurants = await getRestaurants();
    const dayOfWeek = days[new Date().getDay()];
    const html = Mustache.render(template, { dayOfWeek, restaurants });

    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "text/html; charset=UTF-8",
        },
        body: html,
    };

    return response;
};
