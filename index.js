const entries = [
	{
		title: "Hi wifey",
		prose:
			"Hi Baby, I'm Sorry for Making you feel that way Last Night, I know you were upset and I should have been more understanding. I want you to know that I care about your feelings and I will do my best to control my temper, I love you. Please forgive me.",
		note: "I'm not perfect, but I will always try to be better for you.",
		margin: "Please Remember na andito lang ako .",
		caption: "Cute mo dito",
		image:
			"Rosemie1.jpg",
		alt: "Warm sunlight filtering through a dense green forest",
		accent: "#688c43",
		accentRgb: "104, 140, 67",
		night: "#d4e2b7",
		nightSoft: "#f0e8c9"
	},
	{
		title: "My Rose",
		prose:
			"A rose may have thorns, yet its beauty remains. embracing every part of you, even the ones that may hurt",
		note: "Mamahalin kita, kasama ang iyong mga tinik at bawat piraso ng iyong pagkatao ",
		margin: "I will cherish you, thorns and all, for you are my rose.",
		caption: "Mahal kita, kahit malayo ka ",
		image:
			"Rosemie3.jpg",
		alt: "A waterfall cascading through a lush forest veiled in mist",
		accent: "#4f805c",
		accentRgb: "79, 128, 92",
		night: "#cfe0bf",
		nightSoft: "#edf0d0"
	},
		{
		title: "My  Joy",
		prose:
			"Ikaw ang pinaka malalim kong lungkot, pinaka mababaw na ligaya",
		note: "para sa iyo na ang aking walang hanggang debosyon.",
		margin: "pero sana sa akin ang mga ngiti mo.",
		caption: "ang ganda ng ngiti mo dito",
		image:
			"Rosemie2.jpg",
		alt: "A bunch of mushrooms that are growing on a moss",
		accent: "#8b6c55",
		accentRgb: "139, 108, 85",
		night: "#e2d9bd",
		nightSoft: "#f3eaca"
	},
	{
		title: "Aking ulan",
		prose:
			"I used to hate Rain, but now it reminds me of you, the gentleness, the breeze, the calmness",
		note: "Gusto ko ng ulan, sa lamig, at katahimikan nito",
		margin: "pero mas gusto ko ang init ng yakap mo",
		caption: "I Cherish, this First pic of Us",
		image:
			"Rosemie4.jpg",
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