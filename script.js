const BASE_URL = "https://v6.exchangerate-api.com/v6/5b3e753a3e29eeac3df096a9/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const fromURL = `${BASE_URL}/${fromCurr.value}`;
  let response = await fetch(fromURL);
  if (!response.ok) {
    msg.innerText = `Error: ${response.statusText}`;
    return;
  }
  let data = await response.json();
  let fromRate = data.conversion_rates[fromCurr.value];
  let toRate = data.conversion_rates[toCurr.value];

  if (!fromRate || !toRate) {
    msg.innerText = `Error: Rate not available for ${fromCurr.value} or ${toCurr.value}`;
    return;
  }

  let finalAmount = amtVal * (toRate / fromRate);
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});