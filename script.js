addEventListener("DOMContentLoaded", () => {
  $("#calculator-form").submit(() => false);

  // const startPrice = document.querySelector('.calculator__input.is--start-price');

  // Functions
  const createGradient = (ctx, startColor, endColor) => {
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    return gradient;
  };

  const validateInput = (inputField) => {
    inputField.value = inputField.value.replace(/[^\d.]/g, "");

    let decimalIndex = inputField.value.indexOf(".");
    if (decimalIndex !== -1) {
      let integerPart = inputField.value.substring(0, decimalIndex);
      let decimalPart = inputField.value.substring(decimalIndex + 1);

      if (integerPart.length > 1) integerPart = integerPart.slice(0, 1);
      if (decimalPart.length > 2) decimalPart = decimalPart.slice(0, 2);
      inputField.value = integerPart + "." + decimalPart;
    } else {
      if (inputField.value.length > 1)
        inputField.value = inputField.value.slice(0, 1);
    }
  };

  // Listeners
  // startPrice.addEventListener('input', () => {
  //     validateInput(startPrice);
  // });

  ///////////////////////////////////

  const curveData = [
    [0, 0.1, 0.2, 0.6, 0.4, 1.0],
    [0, 0.2, 0.5, 0.7, 0.6, 1.5],
    [0, 0.1, 0.6, 0.8, 1.1, 1.4],
  ];
  const greenGradient = ["#1FFFA3", "#408782"];
  const redGradient = ["#F29191", "#F5477B"];
  const activeGradient = ["#3BB5FF", "#264794"];

  const ctx = document.getElementById("chartCanvas").getContext("2d");

  Chart.defaults.font.family = "Aeonik, sans-serif";
  Chart.defaults.font.size = 14;
  Chart.defaults.font.weight = 400;
  Chart.defaults.color = "#090B10";

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["", "YEAR 1", "YEAR 2", "YEAR 3", "YEAR 4", "YEAR 5"],
      datasets: curveData.map((data, index) => ({
        data: data,
        backgroundColor:
          index === 2
            ? createGradient(ctx, "#c3ffea", "rgba(255, 255, 255, 0.5)")
            : "transparent",
        fill: index === 2 ? "origin" : "-1",
        borderColor: createGradient(
          ctx,
          [redGradient[0], activeGradient[0], greenGradient[0]][index],
          [redGradient[1], activeGradient[1], greenGradient[1]][index]
        ),
        borderWidth: 2,
        lineTension: 0.6,
      })),
    },
    options: {
      plugins: {
        legend: {
          //display: false,
        },
        tooltip: {
          //enabled: false,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Chart represents the growth of the ULX based on your AutoStake function",
          },
        },
        y: {
          display: false,
          title: {
            display: true,
            text: "Rewards growth in ULX %",
          },
        },
      },
    },
  });
});

//Slider's Selectors
const year1 = document.querySelector(
  ".rangeslider__value.is--year-1.is--visible.w-input"
);
const year2 = document.querySelector(".rangeslider__value.is--year-2");
const year3 = document.querySelector(".rangeslider__value.is--year-3");
const year4 = document.querySelector(".rangeslider__value.is--year-4");
const year5 = document.querySelector(".rangeslider__value.is--year-5");

// Field's Selectors
const displayGrowthUlxPercent = document.querySelector(
  ".calculator__col.is--right .growth-ulx-percent"
);
const displayGrowthUlx = document.querySelector(
  ".calculator__col.is--right .growth-ulx"
);
const displayGrowthUsdtPercent = document.querySelector(
  ".calculator__col.is--right .growth-usdt-percent"
);
const displayGrowthUsdt = document.querySelector(
  ".calculator__col.is--right .growth-usdt"
);

// Constants
let years = [
  Number(year1.value),
  Number(year2.value),
  Number(year3.value),
  Number(year4.value),
  Number(year5.value),
];

let nftValue = 5000;
const usdt = 0.1;
const ulx = 0.1;
let baseStake = nftValue / ulx;

// Function to calculate total growth.
let calculateGrowth = (baseStake, years) => {
  let sum = baseStake;
  const multipliers = [0.002, 0.001, 0.0005, 0.00025, 0.000125];

  for (let i = 0; i < years.length; i++) {
    if (
      typeof years[i] === "number" &&
      Number.isInteger(years[i]) &&
      years[i] > 0
    ) {
      let year = years[i];
      if (i === 2) {
        year = years[i] + 2;
      } else if (i == 4) {
        year = years[i] + 1;
      }
      for (let day = 1; day <= year; day++) {
        sum += sum * multipliers[i];
      }
    }
  }
  return sum.toFixed(2);
};

// Function to calculate percentage of growth.
let calculatePercentageGrowth = () =>
  ((calculateGrowth(baseStake, years) / baseStake - 1) * 100).toFixed(2);

// Function to update shown values when inputs changes.
const updateValues = () => {
  displayGrowthUlx.textContent = calculateGrowth(baseStake, years);
  displayGrowthUsdt.textContent = calculateGrowth(nftValue, years);
  displayGrowthUlxPercent.textContent = calculatePercentageGrowth();
  displayGrowthUsdtPercent.textContent = calculatePercentageGrowth();
};

// Slider's Event Listeners
year1.addEventListener("change", function () {
  years[0] = Number(year1.value);
  updateValues();
});

year2.addEventListener("change", function () {
  years[1] = Number(year2.value);
  updateValues();
});

year3.addEventListener("change", function () {
  years[2] = Number(year3.value);
  updateValues();
});

year4.addEventListener("change", function () {
  years[3] = Number(year4.value);
  updateValues();
});

year5.addEventListener("change", function () {
  years[4] = Number(year5.value);
  updateValues();
});

// Dropdown Selectors
let nav = document.querySelector(".calculator__dropdown__list");
let divs = nav.getElementsByTagName("div");

for (var i = 0; i < divs.length; i++) {
  divs[i].addEventListener("click", function () {
    let selectedValue = this.getAttribute("id");
    if (selectedValue) {
      nftValue = Number(selectedValue);
      baseStake = nftValue / ulx;
      calculatePercentageGrowth();
      updateValues();
    }
  });
}
