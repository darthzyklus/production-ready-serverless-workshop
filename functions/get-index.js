const fs = require("fs");
const Mustache = require("mustache");
const http = require("axios");

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
    const resp = await http.get(restaurantsApiRoot);

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
