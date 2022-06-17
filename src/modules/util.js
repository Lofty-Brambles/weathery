import { addSeconds, format, fromUnixTime, subSeconds } from "date-fns";

function make(element) {
	return document.createElement(element);
}

function add(element, ...classes) {
	classes.forEach(cl => {
		element.classList.add(cl);
	});
}

function checkAvail(array, property, value) {
	for (let i = 0; i < array.length; i++) {
		const element = array[i];
		if (element[property] === value) {
			return false;
		}
	}
	return true;
}

function extractFirst(str) {
	return str.split(",")[0];
}

function titlize(str) {
	return str
		.split(" ")
		.map(e => e.charAt(0).toUpperCase() + e.slice(1))
		.join(" ");
}

function 

function applyBg(code) {
	if (code === "01d" || code === "02d") {
		return `./../assets/clearday.jpg`;
	}
	if (code === "01n" || code === "02n") {
		return `./../assets/clearnight.jpg`;
	}
	if (code === "03d" || code === "03n" || code === "04d" || code === "04n") {
		return `./../assets/cloudy.jpg`;
	}
	if (code === "09d" || code === "09n" || code === "10d" || code === "10n") {
		return `./../assets/rainy.jpg`;
	}
	if (code === "11d" || code === "11n") {
		return `./../assets/thunderstorm.jpg`;
	}
	if (code === "13d" || code === "13n") {
		return `./../assets/snowy.jpg`;
	}
	if (code === "50d" || code === "50n") {
		return `./../assets/misty.jpg`;
	}
	return "";
}

function resolveTime(unix, off) {
	const UTCdateObj = fromUnixTime(unix);
	let localdateObj = "";

	if (off >= 0) {
		localdateObj = addSeconds(UTCdateObj, off);
	} else {
		localdateObj = subSeconds(UTCdateObj, off);
	}

	const time = format(localdateObj, "p").toLowerCase();
	const date = format(localdateObj, "PPPP");
	return `${date}<br>${time}`;
}

export { make, add, checkAvail, extractFirst, applyBg, titlize, resolveTime };
