const screenCfg = { width: window.innerWidth, height: window.innerHeight };
let bars = [];
let rawData;
let data;
const backgroundColour = "#000000";

function preload() {
	rawData = loadTable("data/traffic.csv.bck", "csv", "header");
}

function setup() {
	createCanvas(screenCfg.width, screenCfg.height);

	data = rawData.rows.map((d) => d.obj);

	bars.push(
		new BarChart(
			{
				chartWidth: 1000,
				chartHeight: 200,
				xPos: 100,
				yPos: 400,
				barRatio: 0.5,
				dataKey: "VALUE",
				lineColour: "#ff00ff",
				lineWeight: 2,
				barColour: "#ff00ff",
			},
			data
		)
	);

	console.log(bars);
}

function draw() {
	background(backgroundColour);
	bars.forEach((x) => x.render());
}
