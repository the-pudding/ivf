// Given a t value along the path, return the angle (in radians) of the path at that point
// (Used to decide whether sprite is flipped)
const getAngleAtT = (t, pathEl) => {
	const delta = 0.1;
	const pathLength = pathEl.getTotalLength();

	const p1 = pathEl.getPointAtLength(t);
	const p2 = pathEl.getPointAtLength(Math.min(t + delta, pathLength));

	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;

	return Math.atan2(dy, dx);
};

// Given a coordinate (of a marker), find the closest t value along the path
const findClosestT = (cx, cy, pathEl, samples = 2000) => {
	let best = { dist: Infinity, t: 0 };
	const pathLength = pathEl.getTotalLength();

	for (let i = 0; i <= samples; i++) {
		const t = (i / samples) * pathLength;
		const p = pathEl.getPointAtLength(t);

		const dx = p.x - cx;
		const dy = p.y - cy;
		const d = dx * dx + dy * dy;

		if (d < best.dist) {
			best = { dist: d, t };
		}
	}
	return best.t;
};

// Given a t value along the path, return the screen coordinates
const coordinatesForT = (t, pathEl, sideId) => {
	const point = pathEl.getPointAtLength(t);

	const svg = pathEl.ownerSVGElement;
	const ctm = svg.getScreenCTM();
	const svgPoint = svg.createSVGPoint();
	svgPoint.x = point.x;
	svgPoint.y = point.y;

	const screenPoint = svgPoint.matrixTransform(ctm);
	const parentEl = document.querySelector(`#side-${sideId}`);
	const parentRect = parentEl.getBoundingClientRect();

	return {
		x: screenPoint.x - parentRect.left,
		y: screenPoint.y - parentRect.top
	};
};

export { getAngleAtT, findClosestT, coordinatesForT };
