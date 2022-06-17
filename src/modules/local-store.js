import tippy from "tippy.js";
import initData from "../init";
import { add, extractFirst, make } from "./util";

function loadinit() {
	if ( !localStorage.getItem("cities") ) {
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
					theme: "popup"
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
		const promise = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.lat}&lon=${data.lon}&exclude=minutely&appid=${process.env.WEATHER_KEY}`);
		const dataPool = await promise.json();
		return dataPool;
	}

	function addinfo(info) {
		const tabDiv = make("div");
		tabDiv.textContent = info;
		return tabDiv;
	}

	const data = JSON.parse(localStorage.getItem("cities"));
	const mainTab = document.querySelector("main");
	data.forEach(async el => {
		const info = await weatherFetch(el);
		const tab = addinfo(info);
		add(tab, "tab");
		mainTab.appendChild(tab);
	});

	const con = type + 1;
	return con;
}

export { loadinit, loadStorage, geocodingData, loadContent };
