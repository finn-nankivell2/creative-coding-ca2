const screenCfg = { width: window.innerWidth, height: window.innerHeight };
let bars = [];
let rawData;
let data;
const backgroundColour = "#070909";

function preload() {
	rawData = loadTable("data/outputs/ratingpop.csv", "csv", "header");
}

function setup() {
	createCanvas(screenCfg.width, screenCfg.height);
	data = rawData.rows.map((d) => d.obj);

	bars.push(
		new BarChart(
			{
				chartWidth: 600,
				chartHeight: 200,
				xPos: 150,
				yPos: 150,
				barRatio: 0.6,
				dataKey: ["POPULARITY", "RATING"],
				lineColour: "#c7c8c3",
				lineWeight: 2,
				barColour: ["#a7b34d", "#42b0c6", "#5577ff"],
				labelKey: "MOVIE",
				labelRotation: 45,
				chartType: "clustered",
				nTicks: 10,
				leftTicks: 10.0,
				rotation: -45
			},
			data
		)
	);
}

function draw() {
	background(backgroundColour);
	bars.forEach((x) => x.render());
}
