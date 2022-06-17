import tippy from "tippy.js";
import initData from "../init";
import { extractFirst, make } from "./util";

function loadinit() {
	localStorage.setItem("cities", JSON.stringify(initData()));
}

function loadStorage(list) {
	const createListItem = function createListItem(array, item) {
		const li = make("li");
		li.innerHTML = `<div>🔍 ${extractFirst(item.place)}</div>
			<div class="material-symbols-outlined del-btn">delete</div>`;

		li.querySelector(".del-btn").addEventListener(() => {
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
				});
			}
		});

		return li;
	};

	const itemArray = [];
	const data = JSON.parse(localStorage.getItem("cities"));
	if (!data) {
		const li = make("li");
		li.textContent = "Oh no. Something went wrong. Please reload the page.";
		list.appendChild(li);
	} else {
		const liArray = [];
		itemArray.forEach(el => {
			liArray.push(createListItem(itemArray, el));
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

export { loadinit, loadStorage, geocodingData };
