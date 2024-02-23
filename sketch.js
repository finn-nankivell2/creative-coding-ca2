const screenCfg = { width: window.innerWidth, height: window.innerHeight };
let bars = [];
let rawData;
let data;
const backgroundColour = "#000000";

function preload() {
	rawData = loadTable("data/children2.csv", "csv", "header");
}

function setup() {
	createCanvas(screenCfg.width, screenCfg.height);
	data = rawData.rows.map((d) => d.obj);

	bars.push(
		new BarChart(
			{
				chartWidth: 340,
				chartHeight: 150,
				xPos: 150,
				yPos: 350,
				barRatio: 0.6,
				// dataKey: ["Male", "Female"],
				dataKey: "Total",
				lineColour: "#ffffff",
				lineWeight: 2,
				barColour: ["#ff00ff", "#aa00aa", "#5577ff"],
				labelKey: "Age Group",
				chartType: "bar"
			},
			data
				// Filter out Total rows
				.filter((r) => r["Age Group"] !== "0 - 17 years")
		)
	);

	bars.push(
		new BarChart(
			{
				chartWidth: 340,
				chartHeight: 150,
				xPos: 100,
				yPos: 50,
				barRatio: 0.6,
				dataKey: ["Male", "Female", "Total"],
				lineColour: "#ffffff",
				lineWeight: 2,
				barColour: ["#ff00ff", "#aa00aa", "#5577ff"],
				labelKey: "Age Group",
				chartType: "clustered"
			},
			data
				// Filter out Total rows
				.filter((r) => r["Age Group"] !== "0 - 17 years")
		)
	);

	bars.push(
		new BarChart(
			{
				chartWidth: 340,
				chartHeight: 150,
				xPos: 600,
				yPos: 50,
				barRatio: 0.6,
				dataKey: ["Male", "Female"],
				lineColour: "#ffffff",
				lineWeight: 2,
				barColour: ["#ff00ff", "#aa00aa", "#5577ff"],
				labelKey: "Age Group",
				chartType: "stacked"
			},
			data
				// Filter out Total rows
				.filter((r) => r["Age Group"] !== "0 - 17 years")
		)
	);

	bars.push(
		new BarChart(
			{
				chartWidth: 340,
				chartHeight: 150,
				xPos: 650,
				yPos: 360,
				barRatio: 0.6,
				dataKey: ["Male", "Female"],
				lineColour: "#ffffff",
				lineWeight: 2,
				barColour: ["#ff00ff", "#aa00aa", "#5577ff"],
				labelKey: "Age Group",
				chartType: "fullstacked"
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
