const screenCfg = { width: window.innerWidth, height: window.innerHeight };
let bars = [];
let rawData;
let data;
const backgroundColour = "#000000";

function preload() {
	// rawData = loadTable("data/traffic.csv.bck", "csv", "header");
	rawData = loadTable("data/children2.csv", "csv", "header");
}

function setup() {
	createCanvas(screenCfg.width, screenCfg.height);
	data = rawData.rows.map((d) => d.obj);

	bars.push(
		new BarChart(
			{
				chartWidth: 400,
				chartHeight: 200,
				xPos: 100,
				yPos: 400,
				barRatio: 0.5,
				dataKey: ["Male", "Female"],
				lineColour: "#ffffff",
				lineWeight: 2,
				barColour: ["#ff00ff", "#aa00aa"],
				labelKey: "Age Group",
			},
			data
				// Filter out Total rows
				.filter((r) => r["Age Group"] !== "0 - 17 years")
		)
	);
}

function draw() {
	background(backgroundColour);
	bars.forEach((x) => x.render());
}
