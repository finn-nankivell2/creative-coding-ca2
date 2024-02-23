function _verifyConfig(cfg) {
	const REQUIRED = [
		"chartWidth",
		"chartHeight",
		"xPos",
		"yPos",
		"barRatio",
		"dataKey",
		"labelKey",
	];

	let missing = REQUIRED.filter((k) => cfg[k] === null);

	if (missing.length != 0) {
		throw new Error(`Missing parameters ${missing}`);
	}

	cfg.lineColour = cfg.lineColour ?? "#000000";
	cfg.lineWeight = cfg.lineWeight ?? 1;
	cfg.barColour = cfg.barColour ?? "#ffffff";
	cfg.label = cfg.label ?? { textSize: 15, rotation: 90 };
	cfg.label.dataKey = cfg.labelKey;
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

		let dataMax;
		if (Array.isArray(this.dataKey)) {
			dataMax = max(
				this.data.map((d) =>
					this.dataKey
						.map(function (k) {
							return d[k];
						})
						.reduce(function (p, a) {
							return Number(p) + Number(a);
						}, 0)
				)
			);
		} else {
			dataMax = max(this.data.map((d) => Number(d[this.dataKey])));
		}

		for (let i = 0; i < this.data.length; i++) {
			let row = this.data[i];

			stroke(this.lineColour);
			strokeWeight(this.lineWeight);

			// Logic for multiple array keys
			if (Array.isArray(this.dataKey)) {
				push();
				for (let [i, k] of Object.entries(this.dataKey)) {
					fill(this.barColour[i]);
					let d = row[k];

					let h = this.chartHeight * (d / dataMax);
					rect(0, 0, this.barWidth, -h);
					translate(0, -h);
				}
				pop();
			} else {
				fill(this.barColour);
				let d = row[this.dataKey];

				let h = Math.round(this.chartHeight * (d / dataMax));
				rect(0, 0, this.barWidth, -h);
			}

			translate(this.gapWidth + this.barWidth, 0);

			push();

			fill(this.lineColour);
			noStroke();

			textSize(this.label.textSize);
			textAlign(LEFT, CENTER);
			angleMode(DEGREES);

			translate(-65, 20);
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

			// let row = this.data[i];

			textSize(this.label.textSize);
			textAlign(RIGHT, CENTER);

			// let labelText = row["VALUE"];

			if (i == nTicks) {
				text(dataMax, -40, 0);
			}

			translate(0, -tickGap);
		}

		pop();
	}
}
