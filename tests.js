(function () {
	function assert(b) {
		if (!b) {
			throw new Error("Assertion failed");
		}
	}

	function assertEq(a, b) {
		if (a != b) {
			throw new Error(`Assertion failed, ${a} != ${b}`);
		}
	}

	let tests = [
		function () {
			// TEST 1

			let cfgObject = {
				chartWidth: 500,
				chartHeight: 500,
				xPos: 10,
				yPos: 10,
				barRatio: 0.6,
				dataKey: "key",
			};

			_verifyConfig(cfgObject);

			assertEq(cfgObject.lineWeight, 1);
		},
	];

	for (let i in tests) {
		let test = tests[i];

		try {
			test();
		} catch (error) {
			console.log(`Test ${i} failed! ERROR: ${error}`);
		}
	}
})();
