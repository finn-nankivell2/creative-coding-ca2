const screenCfg = { width: window.innerWidth, height: window.innerHeight };
let bars = [];
let rawData;
let data;
const backgroundColour = "#000000";

function preload() {
	// rawData = loadTable("data/traffic.csv.bck", "csv", "header");
	rawData = loadTable("data/children.csv", "csv", "header");
}

function setup() {
	createCanvas(screenCfg.width, screenCfg.height);
	data = rawData.rows.map((d) => d.obj);
	console.log(data);

	bars.push(
		new BarChart(
			{
				chartWidth: 400,
				chartHeight: 200,
				xPos: 100,
				yPos: 400,
				barRatio: 0.5,
				dataKey: "VALUE",
				lineColour: "#ffffff",
				lineWeight: 2,
				barColour: "#ff00ff",
				labelKey: "Age Group",
			},
			data
				// Filter out individual counties
				.filter(
					(r) =>
						r["Administrative Counties"] === "Ireland" &&
						r["Sex"] === "Both sexes"
				)
				// Filter out Total rows
				.filter((r) => r["Age Group"] !== "0 - 17 years")
		)
	);
}

function draw() {
	background(backgroundColour);
	bars.forEach((x) => x.render());
}
