// const screenCfg = { width: window.innerWidth, height: window.innerHeight };
const screenCfg = { width: 1920, height: 1080 };
let bars = [];
let rawData = {};
let data = {};
const backgroundColour = "#070909";
const palette = [
	"#cb514b",
	"#69dea0",
	"#45a8f0",
	"#a85b8e",
	"#daa6ab",
	"#8f5296",
	"#c93c8a",
	"#579eec",
	"#09f5c7",
	"#0fe812",
];

function preload() {
	let files = [
		"ratingpop",
		"ratingpopvs",
		"ratingdist",
		"genrecounts",
		"movietypecounts",
	];

	for (let f of files) {
		rawData[f] = loadTable("data/outputs/" + f + ".csv", "csv", "header");
	}
}

function setup() {
	createCanvas(screenCfg.width, screenCfg.height);

	for (let [key, rd] of Object.entries(rawData)) {
		data[key] = rd.rows.map((d) => d.obj);
	}

	bars.push(
		new BarChart(
			{
				chartWidth: 300,
				chartHeight: 200,
				xPos: 100,
				yPos: 100,
				barRatio: 0.6,
				dataKey: ["RATING", "POPULARITY"],
				lineColour: "#c7c8c3",
				lineWeight: 2,
				barColour: palette,
				labelKey: "MOVIE",
				labelRotation: 90,
				chartType: "clustered",
				nTicks: 10,
				leftTicks: 10,
				chartTitle: "IMDB Top movies num. ratings vs. average rating",
			},
			data.ratingpop
		)
	);

	bars.push(
		new BarChart(
			{
				chartWidth: 300,
				chartHeight: 200,
				xPos: 900,
				yPos: 100,
				barRatio: 0.6,
				dataKey: ["CRITIC", "AUDIENCE"],
				dataMaxDefault: 100,
				lineColour: "#c7c8c3",
				lineWeight: 2,
				barColour: palette,
				labelKey: "MOVIE",
				labelRotation: 90,
				chartType: "fullstacked",
				nTicks: 10,
				chartTitle: "Metacritic - Critic vs. Audience ratings",
			},
			data.ratingpopvs
		)
	);

	bars.push(
		new BarChart(
			{
				chartWidth: 300,
				chartHeight: 200,
				xPos: 100,
				yPos: 510,
				barRatio: 0.6,
				dataKey: "COUNT",
				lineColour: "#c7c8c3",
				lineWeight: 2,
				barColour: palette,
				labelKey: "RANGE",
				labelRotation: 0,
				chartType: "bar",
				nTicks: 10,
				chartTitle: "Distribution of average movie ratings on IMDB",
			},
			data.ratingdist
		)
	);

		new BarChart(
			{
				chartWidth: 400,
				chartHeight: 400,
				xPos: 900,
				yPos: 100,
				barRatio: 0.6,
				dataKey: "COUNT",
				lineColour: "#c7c8c3",
				lineWeight: 2,
				barColour: palette,
				labelKey: "RANGE",
				labelRotation: 90,
				chartType: "pie",
				nTicks: 10,
				chartTitle: "Number of movies with rating range",
				legend: Object.entries(data.ratingdist).map((x) => [
					x[1].RANGE,
					palette[x[0]],
				]),
			},
			data.ratingdist
		)

	bars.push(
		new BarChart(
			{
				chartWidth: 300,
				chartHeight: 200,
				xPos: 520,
				yPos: 100,
				barRatio: 0.6,
				dataKey: ["CRITIC", "AUDIENCE"],
				dataMaxDefault: 100,
				lineColour: "#c7c8c3",
				lineWeight: 2,
				barColour: palette,
				labelKey: "MOVIE",
				labelRotation: 90,
				chartType: "clustered",
				nTicks: 10,
				chartTitle: "Metacritic - Critic vs. Audience ratings",
			},
			data.ratingpopvs
		)
	);

	background(backgroundColour);
	bars.forEach((x) => x.render());
}
