const screenCfg = { width: window.innerWidth, height: window.innerHeight };
let bars = [];
let rawData;
let data;
const backgroundColour = "#070909";
const palette = [
	"#286a62",
	"#4e94cb",
	"#86089e",
	"#4327ce",
	"#0d0e5a",
	"#6d66df",
	"#e4f7c4",
	"#840d9e",
	"#78a0e4",
	"#b53668",
];

function preload() {
	rawData = loadTable("data/outputs/ratingdist.csv", "csv", "header");
}

function setup() {
	createCanvas(screenCfg.width, screenCfg.height);
	data = rawData.rows.map((d) => d.obj);


	// bars.push(
	// 	new BarChart(
	// 		{
	// 			chartWidth: 600,
	// 			chartHeight: 400,
	// 			xPos: 150,
	// 			yPos: 150,
	// 			barRatio: 0.6,
	// 			dataKey: ["POPULARITY", "RATING"],
	// 			lineColour: "#c7c8c3",
	// 			lineWeight: 2,
	// 			// barColour: ["#e02728", "#b3721f", "#c99ebf", "#7b6164", "#e8856b", "#ada089"],
	// 			barColour: palette,
	// 			labelKey: "MOVIE",
	// 			labelRotation: 45,
	// 			chartType: "clustered",
	// 			nTicks: 10,
	// 			leftTicks: 10.0,
	// 			rotation: -45,
	// 			legend: {
	// 				"Popularity" : palette[0],
	// 				"Rating out of 10" : palette[1]
	// 			}
	// 		},
	// 		data
	// 	)
	// );

	bars.push(
		new BarChart(
			{
				chartWidth: 600,
				chartHeight: 400,
				xPos: 400,
				yPos: 150,
				barRatio: 0.6,
				dataKey: "COUNT",
				lineColour: "#c7c8c3",
				lineWeight: 2,
				// barColour: ["#e02728", "#b3721f", "#c99ebf", "#7b6164", "#e8856b", "#ada089"],
				barColour: palette,
				labelKey: "RANGE",
				labelRotation: 0,
				chartType: "horizontal",
				nTicks: 10,
			},
			data
		)
	);
}

function draw() {
	background(backgroundColour);
	bars.forEach((x) => x.render());
}
