import { loadContent, loadinit } from "./local-store";
import { make, add } from "./util";

export default function components() {
	const createIconsLink = () => {
		const link = make("link");
		link.rel = "stylesheet";
		link.href =
			"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
		return link;
	};

	const createNav = () => {
		const logo = make("div");
		add(logo, "logo");
		logo.innerHTML = `<div class="material-symbols-outlined">
			thermostat</div><div>Weathery</div>`;

		const settings = make("div");
		add(settings, "material-symbols-outlined", "settings");
		settings.textContent = "settings";

		const cities = make("div");
		add(cities, "material-symbols-outlined", "menu");
		cities.textContent = "menu";

		const navBar = make("nav");
		[settings, logo, cities].forEach(e => {
			navBar.appendChild(e);
		});
		return navBar;
	};

	const createBody = () => {
		const arrowleft = make("div");
		add(arrowleft, "material-symbols-outlined", "arrowleft");
		arrowleft.textContent = "navigate_before";
		const arrowright = make("div");
		add(arrowright, "material-symbols-outlined", "arrowright");
		arrowright.textContent = "navigate_next";
		
		const pillbar = make("div");
		add(pillbar, "pill-bar");

		const pillNav = make("div");
		add(pillNav, "pill-nav");
		[arrowleft, pillbar, arrowright].forEach(e => {
			pillNav.appendChild(e);
		});

		const body = make("div");
		add(body, "body");

		const main = make("main");
		main.appendChild(pillNav);
		main.appendChild(body);
		return main;
	};

	(function loadBody() {
		document.head.appendChild(createIconsLink());
		document.body.appendChild(createNav());
		document.body.appendChild(createBody());
		loadinit();
		loadContent("initial");
	})();
}
