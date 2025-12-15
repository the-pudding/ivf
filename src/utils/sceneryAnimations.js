export const sceneryAnimations = {
	heart: {
		split: (els) => {
			const left = els[0].querySelector("path.left");
			const right = els[0].querySelector("path.right");

			left.style.transition = "transform 0.3s ease-in-out";
			right.style.transition = "transform 0.3s ease-in-out";

			left.style.transform = "translate(-4%, 0)";
			right.style.transform = "translate(4%, 0)";
		},
		reset: (els) => {
			const left = els[0].querySelector("path.left");
			const right = els[0].querySelector("path.right");

			left.style.transition = "transform 0.3s ease-in-out";
			right.style.transition = "transform 0.3s ease-in-out";

			left.style.transform = "translate(0, 0)";
			right.style.transform = "translate(0, 0)";
		}
	},
	needle: {
		enter: (els) => {
			els.forEach((el) => {
				const delay = Math.random() * 300;
				el.style.transition = `opacity 0.5s ease-in-out, transform 0.5s ${delay}s ease-in-out`;
				el.style.opacity = "1";
				el.style.transform = "translateY(1%)";
			});
		},
		reset: (els) => {
			els.forEach((el) => {
				el.style.transition =
					"opacity 0.5s ease-in-out, transform 0.5s ease-in-out";
				el.style.opacity = "0";
				el.style.transform = "translateY(0)";
			});
		}
	}
};
