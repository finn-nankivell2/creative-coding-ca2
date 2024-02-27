function _verifyConfig(cfg) {
	const REQUIRED = [
		"chartWidth",
		"chartHeight",
		"chartType",
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

	let chartTypes = [
		"bar",
		"stacked",
		"fullstacked",
		"horizontal",
		"clustered",
		"pie",
	];
	if (!chartTypes.includes(cfg.chartType)) {
		throw new Error(
			`chartType must be one of ${chartTypes}, not ${this.chartType}`
		);
	}

	cfg.nTicks = cfg.nTicks ?? 6;
	cfg.lineColour = cfg.lineColour ?? "#000000";
	cfg.lineWeight = cfg.lineWeight ?? 1;
	cfg.barColour = cfg.barColour ?? "#ffffff";
	cfg.labelRotation = cfg.labelRotation ?? 90;
	cfg.labelTextSize = cfg.labelTextSize ?? 15;
}

class BarChart {
	constructor(cfg, data) {
		_verifyConfig(cfg);

		for (let [k, v] of Object.entries(cfg)) {
			this[k] = v;
		}

		this.data = data ?? cfg.data;

		let n = this.data.length;

		if (this.chartType === "horizontal") {
			this.barWidth = (this.chartHeight * this.barRatio) / n;
			this.gapWidth = (this.chartHeight * (1.0 - this.barRatio)) / n;
		} else {
			this.barWidth = (this.chartWidth * this.barRatio) / n;
			this.gapWidth = (this.chartWidth * (1.0 - this.barRatio)) / n;
		}
	}

	_getDataMax() {
		if (this.dataMaxDefault) {
			return this.dataMaxDefault;
		}

		let dataMax;

		if (this.chartType == "clustered") {
			dataMax = max(
				this.data.map((d) =>
					max(
						this.dataKey.map(function (k) {
							return d[k];
						})
					)
				)
			);
		} else if (Array.isArray(this.dataKey)) {
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
		return dataMax;
	}

	_getDataTicks(n, dataMax, floored = true) {
		dataMax = dataMax ?? this._getDataMax();

		let ticks = [];
		let step = dataMax / n;
		let value = 0;

		for (let i = 0; i < n; i++) {
			if (i == n - 1) {
				value = dataMax;
			}

			ticks.push(floored ? Math.floor(value) : Math.round(value, 2));
			value += step;
		}

		return ticks;
	}

	_renderPie() {
		push();
		translate(this.xPos, this.yPos);
		stroke(this.lineColour);
		strokeWeight(this.lineWeight);

		fill(this.barColour[0]);
		ellipseMode(CORNER);
		ellipse(0, 0, this.chartWidth, this.chartHeight);

		let angle = 0;
		let dataTotal = this.data
			.map((row) => row[this.dataKey])
			.reduce((a, b) => Number(a) + Number(b), 0);

		for (let [i, row] of Object.entries(this.data)) {
			fill(this.barColour[i]);

			let d = row[this.dataKey];
			let aratio = d / dataTotal;
			let a = 360 * aratio;

			arc(0, 0, this.chartWidth, this.chartHeight, angle, angle+a);
			angle += a;
		}
		pop();
	}

	_renderTitle() {
		if (!this.chartTitle) {
			return;
		}

		push();
		translate(
			this.xPos + this.chartWidth / 2,
			this.yPos - this.barWidth * 2
		);
		textAlign(CENTER, CENTER);
		textSize(this.labelTextSize * 1.2);
		fill(this.lineColour);
		text(this.chartTitle, 0, 0);
		pop();
	}

	// Render legend for any bar chart
	_renderLegend() {
		if (!this.legend) {
			return;
		}

		push();
		translate(this.xPos + this.chartWidth * 1.2, this.yPos);

		stroke(this.lineColour);
		textSize(this.labelTextSize);
		textAlign(RIGHT, CENTER);

		for (let [name, colour] of this.legend) {
			strokeWeight(this.lineWeight);
			fill(colour);
			rect(0, 0, this.labelTextSize, this.labelTextSize);

			strokeWeight(0);
			fill(this.lineColour);
			textAlign(LEFT, TOP);
			text(name, this.labelTextSize * 2, 0);

			translate(0, this.labelTextSize * 2);
		}
		pop();
	}

	// Render horizontal bar chart
	_renderHorizontal() {
		push();
		translate(this.xPos, this.yPos + this.chartHeight);
		stroke(this.lineColour);
		strokeWeight(this.lineWeight);
		line(0, 0, 0, -this.chartHeight);
		line(0, 0, this.chartWidth, 0);

		push();
		translate(0, -this.chartHeight);

		let dataMax = this._getDataMax();

		for (let i = 0; i < this.data.length; i++) {
			let row = this.data[i];

			stroke(this.lineColour);
			strokeWeight(this.lineWeight);

			fill(this.barColour[0]);
			let d = row[this.dataKey];

			let h = Math.round(this.chartWidth * (d / dataMax));
			rect(0, 0, h, this.barWidth);

			translate(0, this.gapWidth + this.barWidth);

			push();

			fill(this.lineColour);
			noStroke();

			textSize(this.labelTextSize);
			textAlign(RIGHT, CENTER);
			angleMode(DEGREES);

			translate(-this.barWidth, -this.barWidth);
			rotate(this.labelRotation);

			let labelText = row[this.labelKey];
			text(labelText, 0, 0);

			pop();
		}
		pop();

		let tickGap = this.chartWidth / (this.nTicks - 1);
		let tickValues = this._getDataTicks(this.nTicks);
		let tickWidth = 20;

		push();
		translate(0, tickWidth);
		for (let i = 0; i < this.nTicks; i++) {
			stroke(this.lineColour);
			line(0, 0, 0, -tickWidth);

			fill(this.lineColour);
			noStroke();

			push();
			textSize(this.labelTextSize);
			textAlign(CENTER, CENTER);
			angleMode(DEGREES);

			text(tickValues.shift(), 0, tickWidth * 1.5);

			pop();
			translate(tickGap, 0);
		}
		pop();

		if (this.leftTicks) {
			push();
			translate(this.chartWidth, 0);
			tickValues = this._getDataTicks(this.nTicks, this.leftTicks, false);

			stroke(this.lineColour);
			line(0, 0, 0, -this.chartHeight);

			for (let i = 0; i < this.nTicks; i++) {
				stroke(this.lineColour);
				line(0, 0, tickWidth, 0);

				fill(this.lineColour);
				noStroke();

				textSize(this.labelTextSize);
				textAlign(LEFT, CENTER);
				text(tickValues.shift(), tickWidth * 1.5, 0);

				translate(0, -tickGap);
			}
			pop();
		}

		pop();
	}

	_renderNormal() {
		push();
		translate(this.xPos, this.yPos + this.chartHeight);
		stroke(this.lineColour);
		strokeWeight(this.lineWeight);
		line(0, 0, 0, -this.chartHeight);
		line(0, 0, this.chartWidth, 0);

		push();
		translate(this.gapWidth, 0);

		let dataMax = this._getDataMax();

		for (let i = 0; i < this.data.length; i++) {
			let row = this.data[i];

			stroke(this.lineColour);
			strokeWeight(this.lineWeight);

			// Logic for multiple array keys
			if (Array.isArray(this.dataKey)) {
				if (this.chartType == "fullstacked") {
					dataMax = this.dataKey
						.map((k) => row[k])
						.reduce((a, b) => Number(a) + Number(b), 0);
				}

				push();
				const numKeys = this.dataKey.length;
				for (let [i, k] of Object.entries(this.dataKey)) {
					fill(this.barColour[i]);
					let d = row[k];
					let h = this.chartHeight * (d / dataMax);

					if (this.chartType == "clustered") {
						let bw = this.barWidth / numKeys;
						rect(0, 0, bw, -h);
						translate(bw, 0);
					} else {
						rect(0, 0, this.barWidth, -h);
						translate(0, -h);
					}
				}
				pop();
			} else {
				fill(this.barColour[0]);
				let d = row[this.dataKey];

				let h = Math.round(this.chartHeight * (d / dataMax));
				rect(0, 0, this.barWidth, -h);
			}

			translate(this.gapWidth + this.barWidth, 0);

			push();

			fill(this.lineColour);
			noStroke();

			textSize(this.labelTextSize);
			textAlign(LEFT, CENTER);
			angleMode(DEGREES);

			translate(-this.barWidth, this.barWidth / 2);
			rotate(this.labelRotation);

			let labelText = row[this.labelKey];
			text(labelText, 0, 0);

			pop();
		}
		pop();

		let tickGap = this.chartHeight / (this.nTicks - 1);
		let tickValues = this._getDataTicks(this.nTicks);
		let tickWidth = 20;

		push();
		for (let i = 0; i < this.nTicks; i++) {
			stroke(this.lineColour);
			line(0, 0, -tickWidth, 0);

			fill(this.lineColour);
			noStroke();

			textSize(this.labelTextSize);
			textAlign(RIGHT, CENTER);
			text(tickValues.shift(), -tickWidth * 1.5, 0);

			translate(0, -tickGap);
		}
		pop();

		if (this.leftTicks) {
			push();
			translate(this.chartWidth, 0);
			tickValues = this._getDataTicks(this.nTicks, this.leftTicks, false);

			stroke(this.lineColour);
			line(0, 0, 0, -this.chartHeight);

			for (let i = 0; i < this.nTicks; i++) {
				stroke(this.lineColour);
				line(0, 0, tickWidth, 0);

				fill(this.lineColour);
				noStroke();

				textSize(this.labelTextSize);
				textAlign(LEFT, CENTER);
				text(tickValues.shift(), tickWidth * 1.5, 0);

				translate(0, -tickGap);
			}
			pop();
		}

		pop();
	}

	render() {
		if (this.chartType == "pie") {
			this._renderPie();
		} else if (this.chartType == "horizontal") {
			this._renderHorizontal();
		} else {
			this._renderNormal();
		}

		this._renderLegend();
		this._renderTitle();
	}
}
