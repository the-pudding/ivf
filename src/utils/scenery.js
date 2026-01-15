export const scenery = {
	heart: {
		enter: (els) => {
			els[0].style.transition =
				"opacity 0.5s ease-in-out, transform 0.5s ease-in-out";
			els[0].style.opacity = "1";
		},
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

			left.style.transform = "translate(0, 0)";
			right.style.transform = "translate(0, 0)";
			els[0].style.opacity = "0";
		}
	},
	needle: {
		enter: (els) => {
			els.forEach((el) => {
				const delay = Math.random() * 0.3 + 0.5;
				el.style.transition = `opacity 0.5s ${delay}s ease-in-out, transform 0.5s ${delay + 0.1}s ease-in-out`;
				el.style.opacity = "1";
				el.style.transform = "translateY(1%)";
			});
		},
		"poke-loop": (els) => {
			els.forEach((el, i) => {
				el.classList.add("needle-jab");
				el.style.animationDelay = `${i * 0.15}s`;
			});
		},
		fade: (els) => {
			els.forEach((el) => {
				el.classList.remove("needle-jab");
				el.style.opacity = "0.2";
			});
		},
		reset: (els) => {
			els.forEach((el) => {
				el.style.opacity = "0";
				el.style.transform = "translateY(0)";
			});
		}
	},
	calendar: {
		drop: (els) => {
			els[0].style.transition =
				"transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
			els[0].style.transform = "translateY(0)";
			els[0].style.opacity = "1";
		},
		"flash-loop": (els) => {
			const squareEls = els[0].querySelectorAll(".days path");
			squareEls.forEach((squareEl) => {
				squareEl.classList.add("calendar-flash");
				squareEl.style.animationDelay = `${-Math.random() * 4}s`;
			});
		},
		fade: (els) => {
			els.forEach((el) => {
				el.style.opacity = "0.2";
				const squareEls = els[0].querySelectorAll(".days path");
				squareEls.forEach((squareEl) => {
					squareEl.classList.remove("calendar-flash");
				});
			});
		},
		reset: (els) => {
			els[0].style.transform = "translateY(-2%)";
			els[0].style.opacity = "0";
		}
	},
	"paper-stack": {
		enter: (els) => {
			els.forEach((stackEl, i) => {
				const stackDelay = i * 0.4;
				const paperEls = stackEl.querySelectorAll("path");

				paperEls.forEach((paperEl, j) => {
					const paperDelay = j * 0.1;
					paperEl.style.transition = `opacity 0.4s ${stackDelay + paperDelay}s ease-in-out, transform 0.4s ${stackDelay + paperDelay}s ease-in-out`;
					paperEl.style.opacity = "1";
					paperEl.style.transform = "translateY(0)";
				});
			});
		},
		reset: (els) => {
			els.forEach((stackEl) => {
				const paperEls = stackEl.querySelectorAll("path");
				paperEls.forEach((paperEl) => {
					paperEl.style.opacity = "0";
					paperEl.style.transform = "translateY(-2%)";
				});
			});
		}
	},
	"horizontal-needle": {
		enter: (els) => {
			els.forEach((el) => {
				const delay = Math.random() * 0.3 + 0.5;
				el.style.transition = `opacity 0.5s ${delay}s ease-in-out, transform 0.5s ${delay + 0.1}s ease-in-out`;
				el.style.opacity = "1";
				el.style.transform = "translateX(1%)";
			});
		},
		reset: (els) => {
			els.forEach((el) => {
				el.style.opacity = "0";
				el.style.transform = "translateX(0)";
			});
		}
	},
	block: {
		fall: (els) => {
			els[0].style.transition =
				"transform 0.9s cubic-bezier(.2, .0, 1, .8), opacity 0.5s 1s ease-in-out";
			els[0].style.transform = "translateY(100%)";
			els[0].style.opacity = "0";
		},
		reset: (els) => {
			els[0].style.transition = "none";
			els[0].style.transform = "translateY(0)";
			els[0].style.opacity = "1";
		}
	}
};
