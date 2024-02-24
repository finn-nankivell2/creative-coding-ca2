const screenCfg = { width: window.innerWidth, height: window.innerHeight };
let bars = [];
let rawData;
let data;
const backgroundColour = "#070909";

function preload() {
	rawData = loadTable("data/outputs/ratingdist.csv", "csv", "header");
}

function setup() {
	createCanvas(screenCfg.width, screenCfg.height);
	data = rawData.rows.map((d) => d.obj);

	bars.push(
		new BarChart(
			{
				chartWidth: 800,
				chartHeight: 400,
				xPos: 150,
				yPos: 50,
				barRatio: 1.0,
				dataKey: "COUNT",
				lineColour: "#c7c8c3",
				lineWeight: 2,
				barColour: ["#a7b34d", "#aa00aa", "#5577ff"],
				// barColour: ["#ffffff", "#aa00aa", "#5577ff"],
				labelKey: "RANGE",
				chartType: "bar"
			},
			data
		)
	);
}

function draw() {
	background(backgroundColour);
	bars.forEach((x) => x.render());
}
