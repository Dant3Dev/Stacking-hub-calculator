addEventListener("DOMContentLoaded", () => {
  $("#calculator-form").submit(() => false);

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

  ////////////////////////////////////////////////////////////////////

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

  // Dropdown Selectors
  let nav = document.querySelector(".calculator__dropdown__list");
  let divs = nav.getElementsByTagName("div");

  // ULX input Selector
  const ulxInput = document.getElementById("field-7");

  // Constants
  let years = [
    Number(year1.value),
    Number(year2.value),
    Number(year3.value),
    Number(year4.value),
    Number(year5.value),
  ];

  let nftValue = 5000;
  let ulx = 0.1;
  let baseStake = nftValue / ulx;

  // Function to calculate total growth.
  let calculateGrowth = (baseStake, years) => {
    let sum = baseStake;
    const multipliers = [0.002, 0.001, 0.0005, 0.00025, 0.000125];

    for (let i = 0; i < years.length; i++) {
      let year = 365;
      let stakeYear = years[i];
      // Leap year adjustment
      if (i === 2) {
        if (years[i] > 59) {
          stakeYear = years[i] + 2;
        }
        year = year + 2;
      }
      // Leap year adjustment
      if (i === 4) {
        if (years[i] > 59) {
          stakeYear = years[i] + 1;
        }
      }
      for (let day = 1; day <= stakeYear; day++) {
        sum += sum * multipliers[i];
      }
      for (let day = 1; day <= year - stakeYear; day++) {
        sum += (multipliers[i] * baseStake) / 2;
      }
    }
    return sum.toFixed(2);
  };

  // Function to calculate percentage of growth.
  let calculatePercentageGrowth = () =>
    ((calculateGrowth(baseStake, years) / baseStake - 1) * 100).toFixed(2);

  // Function to update shown values when inputs changes.
  const updateValues = () => {
    calculatePercentageGrowth();
    if (typeof ulx === "number" && ulx > 0) {
      displayGrowthUsdt.textContent = calculateGrowth(nftValue, years);
      baseStake = nftValue / ulx;
      displayGrowthUlx.textContent = calculateGrowth(baseStake, years);
      displayGrowthUlxPercent.textContent = calculatePercentageGrowth();
      displayGrowthUsdtPercent.textContent = calculatePercentageGrowth();
    } else {
      displayGrowthUsdt.textContent = 0;
      baseStake = 0;
      displayGrowthUlx.textContent = 0;
      displayGrowthUlxPercent.textContent = 0;
      displayGrowthUsdtPercent.textContent = 0;
    }
  };

  // Slider's event Listeners
  year1.addEventListener("change", () => {
    years[0] = Number(year1.value);
    updateValues();
  });

  year2.addEventListener("change", () => {
    years[1] = Number(year2.value);
    updateValues();
  });

  year3.addEventListener("change", () => {
    years[2] = Number(year3.value);
    updateValues();
  });

  year4.addEventListener("change", () => {
    years[3] = Number(year4.value);
    updateValues();
  });

  year5.addEventListener("change", () => {
    years[4] = Number(year5.value);
    updateValues();
  });

  // DropDown event listeners for each option
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener("click", (e) => {
      let selectedValue = e.target.id;
      if (selectedValue) {
        nftValue = Number(selectedValue);
        updateValues();
      }
    });
  }

  // ULX input event listener
  ulxInput.addEventListener("input", (e) => {
    ulx = e.target.value;
    updateValues();
    updateChart();
  });

  ////////////////////////////////////////////////////////////////////
  const calculateOffGraph = [
    (displayGrowthUlx.textContent = calculateGrowth(baseStake, [])),
    (displayGrowthUlx.textContent = calculateGrowth(baseStake, [0])),
    (displayGrowthUlx.textContent = calculateGrowth(baseStake, [0, 0])),
    (displayGrowthUlx.textContent = calculateGrowth(baseStake, [0, 0, 0])),
    (displayGrowthUlx.textContent = calculateGrowth(baseStake, [0, 0, 0, 0])),
    (displayGrowthUlx.textContent = calculateGrowth(
      baseStake,
      [0, 0, 0, 0, 0]
    )),
  ];
  const calculateOnGraph = [
    (displayGrowthUlx.textContent = calculateGrowth(
      baseStake,
      [0, 0, 0, 0, 0]
    )),
    (displayGrowthUlx.textContent = calculateGrowth(
      baseStake,
      [365, 0, 0, 0, 0]
    )),
    (displayGrowthUlx.textContent = calculateGrowth(
      baseStake,
      [365, 365, 0, 0, 0]
    )),
    (displayGrowthUlx.textContent = calculateGrowth(
      baseStake,
      [365, 365, 365, 0, 0]
    )),
    (displayGrowthUlx.textContent = calculateGrowth(
      baseStake,
      [365, 365, 365, 365, 0]
    )),
    (displayGrowthUlx.textContent = calculateGrowth(
      baseStake,
      [365, 365, 365, 365, 365]
    )),
  ];
  const curveData = [calculateOnGraph, calculateOffGraph, [0, 0, 0, 0, 0, 0]];
  const newData = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  const greenGradient = ["#1FFFA3", "#408782"];
  const redGradient = ["#F29191", "#F5477B"];
  const activeGradient = ["#3BB5FF", "#264794"];

  const ctx = document.getElementById("chartCanvas").getContext("2d");

  Chart.defaults.font.family = "Aeonik, sans-serif";
  Chart.defaults.font.size = 14;
  Chart.defaults.font.weight = 400;
  Chart.defaults.color = "#090B10";

  let myChart = new Chart(ctx, {
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
  // Function to update the dataset and redraw the chart
  const updateChart = () => {
    myChart.data.datasets = newData.map((data, index) => ({
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
    }));
    myChart.update();
  };
});
