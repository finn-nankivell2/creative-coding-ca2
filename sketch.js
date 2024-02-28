// const screenCfg = { width: window.innerWidth, height: window.innerHeight };
const screenCfg = { width: 2000, height: 2000 };
let bars = [];
let rawData = {};
let data = {};
const backgroundColour = "#070909";
const palette = [
	"#6420AA",
	"#FF3EA5",
	"#FF7ED4",
	"#FFB5DA",

	"#6130Ad",
	"#cF2E95",
	"#cF4Ec4",
	"#dF95dA",

	"#A420cA",
	"#af95da",
];
const lineColour = "#cccccc";

function preload() {
	let files = [
		"ratingpop",
		"ratingpopvs",
		"ratingdist",
		"genrecounts",
		"movietypecounts",
		"runtimecountsgrouped"
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
				chartWidth: 500,
				chartHeight: 330,
				xPos: 150,
				yPos: 100,
				barRatio: 0.6,
				dataKey: ["POPULARITY", "RATING"],
				lineColour: lineColour,
				lineWeight: 2,
				barColour: palette,
				labelKey: "MOVIE",
				labelRotation: 45,
				chartType: "clustered",
				nTicks: 10,
				leftTicks: 10,
				chartTitle: "IMDB Top movies num. ratings vs. average rating",
				legend: [
					["Number of ratings", palette[0]],
					["Rating out of 10", palette[1]],
				]
			},
			data.ratingpop
		)
	);


	bars.push(
		new BarChart(
			{
				chartWidth: 500,
				chartHeight: 330,
				xPos: 1000,
				yPos: 100,
				barRatio: 0.6,
				dataKey: ["CRITIC", "AUDIENCE"],
				dataMaxDefault: 100,
				lineColour: lineColour,
				lineWeight: 2,
				barColour: palette,
				labelKey: "MOVIE",
				labelRotation: 45,
				chartType: "clustered",
				nTicks: 10,
				chartTitle: "Metacritic - Critic vs. Audience ratings",
				legend: [
					["Critic Score", palette[0]],
					["Audience Score", palette[1]],
				]
			},
			data.ratingpopvs
		)
	);

	bars.push(
		new BarChart(
			{
				chartWidth: 500,
				chartHeight: 330,
				xPos: 1200,
				yPos: 700,
				barRatio: 0.6,
				dataKey: ["CRITIC", "AUDIENCE"],
				lineColour: lineColour,
				lineWeight: 2,
				barColour: palette,
				labelKey: "MOVIE",
				labelRotation: 45,
				chartType: "fullstacked",
				nTicks: 10,
				chartTitle: "Metacritic - Critic vs. Audience ratings",
				legend: [
					["Critic Score", palette[0]],
					["Audience Score", palette[1]],
				]
			},
			data.ratingpopvs
		)
	);

	bars.push(
		new BarChart(
			{
				chartWidth: 600,
				chartHeight: 300,
				xPos: 100,
				yPos: 1600,
				barRatio: 0.8,
				dataKey: "COUNT",
				lineColour: lineColour,
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

	bars.push(
		new BarChart(
			{
				chartWidth: 400,
				chartHeight: 400,
				xPos: 1200,
				yPos: 1550,
				barRatio: 0.6,
				dataKey: "COUNT",
				lineColour: lineColour,
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
	);

	bars.push(
		new BarChart(
			{
				chartWidth: 900,
				chartHeight: 600,
				xPos: 100,
				yPos: 750,
				barRatio: 0.8,
				dataKey: "COUNT",
				lineColour: lineColour,
				lineWeight: 2,
				barColour: palette,
				labelKey: "RANGE",
				labelRotation: 0,
				chartType: "horizontal",
				nTicks: 10,
				chartTitle: "Distribution of movie runtimes (minutes)",
			},
			data.runtimecountsgrouped
		)
	)


	background(backgroundColour);
	bars.forEach((x) => x.render());
}
