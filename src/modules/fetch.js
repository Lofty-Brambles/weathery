import { make } from "./util";

async function createLI(e) {
	const lat = (e.boundingbox[0] + e.boundingbox[1]) / 2;
	const lon = (e.boundingbox[2] + e.boundingbox[3]) / 2;
	const data = (async function search() {
		const promise = await fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${process.env.WEATHER_KEY}`
		);
		const dataPool = await promise.json();
		return dataPool;
	})();
	data.place = e.display_name;

	const li = make("li");
	li.textContent = ` ${e.display_name}`;
	li.addEventListener("click", () => {
		addTab(data);
	});
}

function displayGeodata() {
	const location = document.querySelector(".input-div > input").value;
	const list = document.querySelector(".add-city-popup > ul");

	list.style.justifyContent = "center";

	const data = (async function search() {
		const promise = await fetch(
			`https://geocode.maps.co/search?q=${location}`
		);
		const dataPool = await promise.json();
		return dataPool;
	})();
	list.style.justifyContent = "flex-start";
	data.forEach(async e => {
		list.appendChild(await createLI(e));
	});
}

function fetchData() {}

export { displayGeodata, fetchData };
