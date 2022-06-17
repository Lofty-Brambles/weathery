import swal from "sweetalert";
import { geocodingData, loadStorage } from "./local-store";
import { add, checkAvail, make } from "./util";

export default function domHandlers() {
	async function displaySearchResults() {
		const location = document.querySelector(".input-div > input").value;
		const list = document.querySelector(".add-city-popup > ul");

		list.style.justifyContent = "center";
		const li = make("li");
		const image = make("img");
		image.src = "./../assets/loading.jpg";
		li.appendChild(image);
		list.appendChild(li);

		const data = await geocodingData(location);
		list.style.justifyContent = "flex-start";
		list.innerHTML = null;
		data.forEach(e => {
			const lii = make("li");
			lii.textContent = `🚩 ${e.display_name}`;
			lii.addEventListener("click", () => {
				const cities = JSON.parse(localStorage.getItem("cities")) ?? [];
				if (checkAvail(cities, "place", e.display_name)) {
					cities.push({
						place: e.display_name,
						lat: e.lat,
						lon: e.lon
					});
					localStorage.setItem("cities", JSON.stringify(cities));
				} else {
					swal({
						title: "Hey, you already have that city!",
						icon: "error"
					});
				}
			});
			list.appendChild(lii);
		});
	}

	function addCityPopup() {
		const inputDiv = make("div");
		add(inputDiv, "input-div");
		const input = make("input");
		input.setAttribute("placeholder", "Search a city..");
		const searchBtn = make("button");
		searchBtn.innerHTML = `<span class="material-symbols-outlined">
			search<span>`;
		inputDiv.appendChild(input);
		inputDiv.appendChild(searchBtn);

		searchBtn.addEventListener("click", () => {
			const val = document.querySelector(".input-div > input");
			if (/[a-zA-Z]+/i.test(val)) {
				displaySearchResults();
			}
		});
		searchBtn.addEventListener("keydown", e => {
			const val = document.querySelector(".input-div > input");
			if (e.code === "Enter" && /[a-zA-Z]+/i.test(val)) {
				displaySearchResults();
			}
		});

		const list = make("ul");

		const main = make("div");
		add(main, "add-city-popup");
		[inputDiv, list].forEach(e => {
			main.appendChild(e);
		});
		return main;
	}

	function manageCityPopups() {
		const topic = make("div");
		add(topic, "topic");
		topic.textContent = "Manage Places";

		const list = make("ul");
		loadStorage(list);

		const main = make("div");
		add(main, "manage-popup");
		[topic, list].forEach(e => {
			main.appendChild(e);
		});
		return main;
	}

	const menu = document.querySelector(".menu");
	menu.addEventListener("click", () => {
		swal({
			content: manageCityPopups(),
			buttons: {
				add: {
					text: "Add",
					value: true,
				},
				back: {
					text: "Cancel",
					value: false,
				},
			},
		}).then(value => {
			if (value) {
				if (
					document.querySelector(".manage-popup > ul")
						.childElementCount < 3
				) {
					swal({
						content: addCityPopup(),
						buttons: {
							cancel: {
								text: "Cancel",
								value: false,
							},
						},
					});
				} else {
					swal({
						title: "Sorry, you can only have 3 places at once.",
						text: "Please remove a few cities before adding more.",
						icon: "error",
						buttons: {
							cancel: {
								text: "Cancel",
								value: false,
							},
						},
					});
				}
			}
		});
	});
}
