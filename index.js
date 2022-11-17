import axios from "axios";
import express from "express";
import moment from "moment/moment.js";

moment.locale("en-GB");

const app = express();

function getCurrentDate() {
	return moment().format("l").replaceAll("/", "-");
}

async function fetchCurrentKwh() {
	const url = `https://odegdcpnma.execute-api.eu-west-2.amazonaws.com/development/prices?dno=19&voltage=LV&start=${getCurrentDate()}&end=${getCurrentDate()}`;
	const response = await axios.get(url);
	const json = response.data;
	const baseCost = json.data.data[0].Overall;
	let cost = baseCost * 2.2;
	const currentHour = new Date().getHours();
	if (currentHour > 16 && currentHour < 19) {
		cost += 12;
	}
	cost *= 1.2;
	return cost;
}

app.get("/", async (req, res) => {
	const currentCost = await fetchCurrentKwh();
	res.status(200).json({ cost: currentCost });
});

app.listen(3000, () => {
	console.log("Started on http://localhost:3000");
});
