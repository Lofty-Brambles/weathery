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

		info.daily.forEach(el => {
			card4.innerHTML += `<div><div>${resolveTime(
				el.dt,
				true,
				true
			)}</div><div>${(el.temp.max - 273.15).toFixed(0)} ℃</div><div>${
				(el.temp.min - 273.15).toFixed(0)
			} ℃</div><div>${getIcon(el.weather[0].icon)}</div></div>`;
		});

		[card1, card2, card3, card4].forEach(el => {
			tabDiv.appendChild(el);
		});
		return tabDiv;
	}

	const data = JSON.parse(localStorage.getItem("cities"));
	const mainTab = document.querySelector(".body");
	mainTab.innerHTML = null;
	const pillbar = document.querySelector(".pill-bar");
	pillbar.innerHTML = null;

	function addPills(pos) {
		const pill = function pill(act = false) {
			const div = make("div");
			add(div, "material-symbols-outlined");
			if (act) {
				div.classList.add("radio_button_checked");
			} else {
				div.classList.add("radio_button_unchecked");
			}
			div.textContent = act ? "radio_button_checked" : "radio_button_unchecked";
			return div;
		};
		const nos = mainTab.childElementCount;
		for (let i = 0; i < nos; i++) {
			if ( (pos === "first") && (i === 0) ) {
				pillbar.appendChild(pill(true));
				break;
			}
			if ( (pos === "last") && (i === (nos - 1))) {
				pillbar.appendChild(pill(true));
				break;
			}
			pillbar.appendChild(pill());
		}
	}

	function addArrowListener() {
		document.querySelector(".arrowright").addEventListener("click", () => {
			const next = mainTab.querySelector(".active");
			if (next.nextElementSibling) {
				next.classList.remove("active");
				next.nextElementSibling.classList.add("active");

				const nextPill = mainTab.querySelector(".radio_button_checked");
				nextPill.classList.remove("radio_button_checked");
				nextPill.classList.add("radio_button_unchecked");
				nextPill.textContent = "radio_button_unchecked";
				nextPill.nextElementSibling.classList.add("radio_button_checked");
				nextPill.nextElementSibling.classList.remove("radio_button_unchecked");
				nextPill.nextElementSibling.textContent = "radio_button_checked";
			}
		});

		document.querySelector(".arrowleft").addEventListener("click", () => {
			const prev = mainTab.querySelector(".active");
			if (prev.prevElementSibling) {
				prev.classList.remove("active");
				prev.prevElementSibling.classList.add("active");

				const prevPill = mainTab.querySelector(".radio_button_checked");
				prevPill.classList.remove("radio_button_checked");
				prevPill.classList.add("radio_button_unchecked");
				prevPill.textContent = "radio_button_unchecked";
				prevPill.prevElementSibling.classList.add("radio_button_checked");
				prevPill.prevElementSibling.classList.remove("radio_button_unchecked");
				prevPill.prevElementSibling.textContent = "radio_button_checked";
			}
		});
	}

	(async function exec() {
		const promises = data.map(async el => {
			const info = await weatherFetch(el);
			info.place = el.place;
			const tab = await addinfo(info);
			add(tab, "tab");
			tab.setAttribute("id", el.place.split(",")[0].replace(/,/i, "-"));
			mainTab.appendChild(tab);
		});

		await Promise.all(promises);
	
		if (type === "initial") {
			mainTab.firstElementChild.classList.add("active");
		} else {
			mainTab.lastElementChild.classList.add("active");
		}
	
		if (type === "initial") {
			addPills("first");
		} else {
			addPills("last");
		}
		addArrowListener();
	})();
}

export { loadinit, loadStorage, geocodingData, loadContent };
