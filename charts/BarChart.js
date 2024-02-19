function _verifyConfig(cfg) {
	const REQUIRED = [
		"chartWidth",
		"chartHeight",
		"xPos",
		"yPos",
		"barRatio",
		"dataKey",
	];

	let missing = REQUIRED.filter((k) => cfg[k] === null);

	if (missing.length != 0) {
		throw new Error(`Missing parameters ${missing}`);
	}

	cfg.lineColour = cfg.lineColour ?? "#000000";
	cfg.lineWeight = cfg.lineWeight ?? 1;
	cfg.barColour = cfg.barColour ?? "#ffffff";
	cfg.label = cfg.label ?? { textSize: 15, rotation: 90, dataKey: "Week" };
}

class BarChart {
	constructor(cfg, data) {
		_verifyConfig(cfg);

		for (let [k, v] of Object.entries(cfg)) {
			this[k] = v;
		}

		this.data = data ?? cfg.data;

		let n = this.data.length;
		this.barWidth = (this.chartWidth * this.barRatio) / n;
		this.gapWidth = (this.chartWidth * (1.0 - this.barRatio)) / n;
	}

	render() {
		push();
		translate(this.xPos, this.yPos);
		stroke(this.lineColour);
		strokeWeight(this.lineWeight);
		line(0, 0, 0, -this.chartHeight);
		line(0, 0, this.chartWidth, 0);

		push();
		translate(this.gapWidth, 0);

		let dataMax = max(this.data.map((d) => d[this.dataKey]));

		for (let i = 0; i < this.data.length; i++) {
			let row = this.data[i];
			let d = row[this.dataKey];

			fill(this.barColour);
			stroke(this.lineColour);
			strokeWeight(this.lineWeight);

			let h = this.chartHeight * (d / dataMax);
			rect(0, 0, this.barWidth, -h);
			translate(this.gapWidth + this.barWidth, 0);

			push();

			fill(this.lineColour);
			noStroke();

			textSize(this.label.textSize);
			textAlign(LEFT, CENTER);
			angleMode(DEGREES);

			translate(-15, 20);
			rotate(this.label.rotation);

			let labelText = row[this.label.dataKey];
			text(labelText, 0, 0);

			pop();
		}
		pop();

		let nTicks = 5;
		let tickGap = this.chartHeight / nTicks;
		for (let i = 0; i <= nTicks; i++) {
			stroke(this.lineColour);
			line(0, 0, -20, 0);

			fill(this.lineColour);
			noStroke();

			let row = this.data[i];

			textSize(this.label.textSize);
			textAlign(RIGHT, CENTER);

			let labelText = row["VALUE"];
			text(labelText, -40, 0);

			translate(0, -tickGap);
		}

		pop();
	}
}
