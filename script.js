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
  var nav = document.querySelector(".calculator__dropdown__list");

  // Get the div children of the nav element
  var divs = nav.getElementsByTagName("div");

  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener("click", function () {
      // Get the value of the selected div
      var selectedValue = this.getAttribute("data-value");

      // Change the variable value based on the selected option
      var myVariable;

      if (selectedValue === "option1") {
        myVariable = "Value for Option 1";
      } else if (selectedValue === "option2") {
        myVariable = "Value for Option 2";
      } else if (selectedValue === "option3") {
        myVariable = "Value for Option 3";
      }

      // Do something with the updated variable value
      console.log(myVariable);
    });
  }
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

//Sliders
const year1 = document.querySelector(
  ".rangeslider__value.is--year-1.is--visible.w-input"
);
const year2 = document.querySelector(".rangeslider__value.is--year-2");
const year3 = document.querySelector(".rangeslider__value.is--year-3");
const year4 = document.querySelector(".rangeslider__value.is--year-4");
const year5 = document.querySelector(".rangeslider__value.is--year-5");

// Fields
const displayGrowthUlxPercent = document.querySelector(
  ".calculator__col.is--right .growth-ulx-percent"
);
const displayGrowthUlx = document.querySelector(
  ".calculator__col.is--right .growth-ulx"
);
const displayGrowthUsdtPercent = document.querySelector(
  ".calculator__col.is--right .growth-usdt-percent"
);
const displayGrowthUdtPercent = document.querySelector(
  ".calculator__col.is--right .growth-usdt"
);

let years = [year1.value, year2.value, year3.value, year4.value, year5.value];

const updateValues = () => {
  const nftValue = 5000;
  const usdt = 0.1;
  const ulx = 0.1;
  const baseStake = nftValue / ulx;
  let totalDays = years[0] + years[1] + years[2] + years[3] + years[4];

  let interestInFiveYears =
    years[0] * 0.002 +
    years[1] * 0.001 +
    years[2] * 0.0005 +
    years[3] * 0.00025 +
    years[4] * 0.000125;

  let growthUlx = (baseStake + (nftValue * 0.02 * totalDays)).toFixed(2);
  let growthUlxPercentage = ((growthUlx / baseStake - 1) * 100).toFixed(2);

  displayGrowthUlx.textContent = growthUlx;
  displayGrowthUlxPercent.textContent = growthUlxPercentage;
};

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
