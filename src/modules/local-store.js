import tippy from "tippy.js";
import initData from "../init";
import { add, extractFirst, getIcon, make, resolveTime, titlize } from "./util";

function loadinit() {
	if (!localStorage.getItem("cities")) {
		localStorage.setItem("cities", JSON.stringify(initData()));
	}
}

function loadStorage(list) {
	const createListItem = function createListItem(array, item) {
		const li = make("li");
		li.innerHTML = `<div>🔍 ${extractFirst(item.place)}</div>`;
		const div = make("div");
		add(div, "material-symbols-outlined", "del-btn");
		div.textContent = "delete";
		li.appendChild(div);

		div.addEventListener("click", () => {
			if (array.length > 1) {
				const filteredArr = array.filter(
					val => val.place !== item.place
				);
				localStorage.setItem("cities", JSON.stringify(filteredArr));
				loadStorage(document.querySelector(".manage-popup > ul"));
			} else {
				tippy(".del-btn", {
					content: "Sorry, you need to keep atleast one city.",
					trigger: "click",
					zIndex: 10002,
					theme: "popup",
				});
			}
		});

		return li;
	};

	// eslint-disable-next-line no-param-reassign
	list.innerHTML = null;
	const data = JSON.parse(localStorage.getItem("cities"));
	if (!data) {
		const li = make("li");
		li.textContent = "Oh no. Something went wrong. Please reload the page.";
		list.appendChild(li);
	} else {
		const liArray = [];
		data.forEach(el => {
			liArray.push(createListItem(data, el));
		});
		liArray.forEach(el => {
			list.appendChild(el);
		});
	}
}

async function geocodingData(location) {
	const promise = await fetch(`https://geocode.maps.co/search?q=${location}`);
	const dataArray = await promise.json();
	return dataArray;
}

function loadContent(type) {
	async function weatherFetch(data) {
		const promise = await fetch(
			`https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely&appid=${process.env.WEATHER_KEY}`
		);
		const dataPool = await promise.json();
		return dataPool;
	}

	function addinfo(info) {
		const tabDiv = make("div");

		const card1 = make("div");
		add(card1, "card1");

		const temp = (+info.current.temp - 273.15).toFixed(0);
		const { icon } = info.current.weather[0];
		const weather = titlize(info.current.weather[0].description);

		card1.innerHTML = `<div><span class="temp">${temp}</span> <span class="unit">℃</span></div>
			<div>${resolveTime(info.current.dt)}</div>
			<div>${getIcon(icon)} ${weather}</div>
			<div>${extractFirst(info.place)}</div>`;

		const card2 = make("div");
		add(card2, "card2");

		const feelTemp = (+info.current.feels_like - 273.15).toFixed(0);
		const visUnit = (+info.current.visibility / 1000).toFixed(0);

		card2.innerHTML = `<div><div class="material-symbols-outlined">brightness_6</div><div>Sunrise / Sunset</div><div>${resolveTime(
			info.current.sunrise,
			false
		)} / ${resolveTime(info.current.sunset, false)}</div></div>
			<div><div class="material-symbols-outlined">thermostat</div><div>Feels like</div><div>${feelTemp} ℃</div></div>
			<div><div class="material-symbols-outlined">tire_repair</div><div>Pressure</div><div>${
				info.current.pressure
			} hPa</div></div>
			<div><div class="material-symbols-outlined">humidity_mid</div><div>Humidity</div><div>${
				info.current.humidity
			}%</div></div>
			<div><div class="material-symbols-outlined">contrast</div><div>UV Index</div><div>${
				info.current.uvi
			}</div></div>
			<div><div class="material-symbols-outlined">cloudy</div><div>Cloudiness</div><div>${
				info.current.clouds
			} %</div></div>
			<div><div class="material-symbols-outlined">visibility</div><div>Visibility</div><div>${visUnit} km</div></div>
			<div><div class="material-symbols-outlined">air</div><div>Wind Speed</div><div>${
				info.current.wind_speed
			}</div></div>`;

		const card3 = make("div");
		add(card3, "card3");

		info.hourly.forEach(el => {
			card3.innerHTML += `<div><div>${resolveTime(
				el.dt,
				false
			)}</div><div>${(el.temp - 273.15).toFixed(0)} ℃</div><div>${getIcon(
				el.weather[0].icon
			)}</div></div>`;
		});

		const card4 = make("div");
		add(card4, "card4");

		card4.innerHTML = ``;

		if (info.alerts) {
			const card5 = make("div");
			add(card5, "card5");

			card5.innerHTML = ``;

			[card1, card2, card3, card4, card5].forEach(el => {
				tabDiv.appendChild(el);
			});
		} else {
			[card1, card2, card3, card4].forEach(el => {
				tabDiv.appendChild(el);
			});
		}
		return tabDiv;
	}

	const data = JSON.parse(localStorage.getItem("cities"));
	const mainTab = document.querySelector("main");
	data.forEach(async el => {
		const info = await weatherFetch(el);
		info.place = el.place;
		const tab = addinfo(info);
		add(tab, "tab");
		tab.setAttribute("id", el.place);
		mainTab.appendChild(tab);
	});

	const con = type + 1;
	return con;
}

export { loadinit, loadStorage, geocodingData, loadContent };
