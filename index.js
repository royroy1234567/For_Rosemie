const entries = [
	{
		title: "Hi  Joy",
		prose:
			"Hi Baby, I'm Sorry for Making you feel that way Last Night, I know you were upset and I should have been more understanding. I want you to know that I care about your feelings and I will do my best to control my temper, I love you. Please forgive me.",
		note: "I'm not perfect, but I will always try to be better for you.",
		margin: "Moss remembers the feet that walk gently.",
		caption: "Sunlight entering the Mosswood",
		image:
			"https://images.unsplash.com/photo-1756185554759-412aa3825734?auto=format&fit=crop&w=1200&q=85",
		alt: "Warm sunlight filtering through a dense green forest",
		accent: "#688c43",
		accentRgb: "104, 140, 67",
		night: "#d4e2b7",
		nightSoft: "#f0e8c9"
	},
	{
		title: "The Lanterncap Circle",
		prose:
			"Seven lanterncaps appeared beneath the hazel after rain. Their colours changed whenever a bird crossed overhead.",
		note: "Do not pick the smallest one. It is said to be listening for the roots.",
		margin: "A mushroom ring is a doorway only while no one is watching.",
		caption: "Lanterncaps beneath a starry canopy",
		image:
			"https://images.unsplash.com/photo-1600995616866-d2dc0215774a?auto=format&fit=crop&w=1200&q=85",
		alt: "A bunch of mushrooms that are growing on a moss",
		accent: "#8b6c55",
		accentRgb: "139, 108, 85",
		night: "#e2d9bd",
		nightSoft: "#f3eaca"
	},
	{
		title: "Where the River Leaves the Map",
		prose:
			"Beyond the final rowan, the river climbed into the mist and vanished between two cliffs. Its spray smelled of mint.",
		note: "A silver moth returned my compass. The needle now points toward running water.",
		margin: "Maps end where the forest begins to tell its own story.",
		caption: "The hidden falls beyond the rowans",
		image:
			"https://images.unsplash.com/photo-1776698704755-e84d48ce05a5?auto=format&fit=crop&w=1200&q=85",
		alt: "A waterfall cascading through a lush forest veiled in mist",
		accent: "#4f805c",
		accentRgb: "79, 128, 92",
		night: "#cfe0bf",
		nightSoft: "#edf0d0"
	},
	{
		title: "The Meadow Remembers Names",
		prose:
			"At sundown, the wildflowers turned their faces toward each traveller. Mine whispered the name my grandmother used.",
		note: "Golden pollen settled into the shape of a crown, then scattered before I could lift it.",
		margin: "Speak kindly here. The meadow keeps every word.",
		caption: "The namekeeping meadow at golden hour",
		image:
			"https://images.unsplash.com/photo-1761054254614-48f0c7c727ba?auto=format&fit=crop&w=1200&q=85",
		alt: "A field of wildflowers glowing in warm golden-hour sunlight",
		accent: "#ae793d",
		accentRgb: "174, 121, 61",
		night: "#eadcad",
		nightSoft: "#f7edcf"
	}
];

const elements = {
	root: document.documentElement,
	entryIndex: document.querySelector("#entryIndex"),
	entryTime: document.querySelector("#entryTime"),
	entryTitle: document.querySelector("#entryTitle"),
	entryProse: document.querySelector("#entryProse"),
	entryNote: document.querySelector("#entryNote"),
	marginNote: document.querySelector("#marginNote"),
	dreamPhoto: document.querySelector("#dreamPhoto"),
	photoCaption: document.querySelector("#photoCaption"),
	photoCredit: document.querySelector("#photoCredit"),
	leftPageNumber: document.querySelector("#leftPageNumber"),
	rightPageNumber: document.querySelector("#rightPageNumber"),
	previousButton: document.querySelector("#previousButton"),
	nextButton: document.querySelector("#nextButton"),
	previousEdge: document.querySelector("#previousEdge"),
	nextEdge: document.querySelector("#nextEdge"),
	progressDots: document.querySelector("#progressDots"),
	announcement: document.querySelector("#entryAnnouncement")
};

const prefersReducedMotion = window.matchMedia(
	"(prefers-reduced-motion: reduce)"
);
let currentIndex = 0;
let isTransitioning = false;

function preloadImage(src) {
	return new Promise((resolve) => {
		const image = new Image();
		image.onload = image.onerror = resolve;
		image.src = src;
	});
}

function setPalette(entry) {
	elements.root.style.setProperty("--accent", entry.accent);
	elements.root.style.setProperty("--accent-rgb", entry.accentRgb);
	elements.root.style.setProperty("--night", entry.night);
	elements.root.style.setProperty("--night-soft", entry.nightSoft);
}

function renderEntry({ announce = true } = {}) {
	const entry = entries[currentIndex];
	const entryNumber = String(currentIndex + 1).padStart(2, "0");
	const leftPage = currentIndex * 2 + 1;

	setPalette(entry);
	elements.entryIndex.textContent = `Field note no. ${entryNumber} · Green season`;
	elements.entryTime.dateTime = entry.time;
	elements.entryTime.textContent = entry.time;
	elements.entryTitle.textContent = entry.title;
	elements.entryProse.textContent = entry.prose;
	elements.entryNote.textContent = entry.note;
	elements.marginNote.textContent = entry.margin;
	elements.photoCaption.textContent = entry.caption;
	elements.photoCredit.textContent = entry.photographer;
	elements.photoCredit.href = entry.photographerUrl;
	elements.leftPageNumber.textContent = leftPage;
	elements.rightPageNumber.textContent = leftPage + 1;

	elements.dreamPhoto.classList.remove("is-missing");
	elements.dreamPhoto.alt = entry.alt;
	elements.dreamPhoto.src = entry.image;

	const atStart = currentIndex === 0;
	const atEnd = currentIndex === entries.length - 1;
	elements.previousButton.disabled = atStart;
	elements.previousEdge.disabled = atStart;
	elements.nextButton.disabled = atEnd;
	elements.nextEdge.disabled = atEnd;

	[...elements.progressDots.children].forEach((dot, index) => {
		dot.classList.toggle("is-active", index === currentIndex);
	});

	if (announce) {
		elements.announcement.textContent = `Field note ${currentIndex + 1} of ${entries.length}: ${entry.title}`;
	}
}

function transition(direction, update) {
	if (isTransitioning) return null;

	const canAnimate =
		"startViewTransition" in document && !prefersReducedMotion.matches;

	if (!canAnimate) {
		update();
		return null;
	}

	isTransitioning = true;
	elements.root.dataset.direction = direction;
	const viewTransition = document.startViewTransition(update);

	viewTransition.finished.finally(() => {
		delete elements.root.dataset.direction;
		isTransitioning = false;
	});

	return viewTransition;
}

async function turnPage(direction) {
	if (isTransitioning) return;

	const delta = direction === "forward" ? 1 : -1;
	const nextIndex = currentIndex + delta;
	if (nextIndex < 0 || nextIndex >= entries.length) return;

	isTransitioning = true;
	await preloadImage(entries[nextIndex].image);
	isTransitioning = false;

	transition(direction, () => {
		currentIndex = nextIndex;
		renderEntry();
	});
}

entries.forEach(() => {
	const dot = document.createElement("span");
	elements.progressDots.append(dot);
});

elements.dreamPhoto.addEventListener("error", () => {
	elements.dreamPhoto.classList.add("is-missing");
});

elements.previousButton.addEventListener("click", () => turnPage("backward"));
elements.previousEdge.addEventListener("click", () => turnPage("backward"));
elements.nextButton.addEventListener("click", () => turnPage("forward"));
elements.nextEdge.addEventListener("click", () => turnPage("forward"));

document.addEventListener("keydown", (event) => {
	if (isTransitioning || event.altKey || event.ctrlKey || event.metaKey) return;

	if (event.key === "ArrowLeft") {
		event.preventDefault();
		turnPage("backward");
	}

	if (event.key === "ArrowRight") {
		event.preventDefault();
		turnPage("forward");
	}
});

renderEntry({ announce: false });
entries.forEach((entry) => preloadImage(entry.image));