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

  let nftValue = 5000;
  let ulxMarketPrice = 0.1;
  let baseStake = nftValue / ulxMarketPrice;

  /// Function to calculate individual year growth
  let calculateYearlyGrowth = (
    initialStake,
    stakedDays,
    multiplier,
    withdrawOffset = 0,
    leap = false
  ) => {
    /// Flag to switch autostake state
    let autostake = stakedDays > 0 ? true : false;
    /// Make calculations for the first day
    let totalStake = initialStake;
    let stakeRewards = autostake
      ? Number((totalStake * multiplier).toFixed(2))
      : 0;
    let rewardsAmount = Number((totalStake * multiplier).toFixed(2));
    let withdraw = autostake ? 0 : Number((rewardsAmount / 2).toFixed(2));
    let withdrawSum = withdraw + withdrawOffset;
    let ulxEnd = withdrawSum + totalStake;

    /* console.log("Day 1")
    console.log("StakeON", autostake)
    console.log("Total Stake", totalStake)
    console.log("Rewards ON", stakeRewards)
    console.log("Rewards Amount", rewardsAmount)
    console.log("Withdraw", withdraw)
    console.log("Withdraw Sum", withdrawSum)
    console.log("ULX End", ulxEnd)
    console.log("============================") */

    for (let day = 1; day < (leap ? 366 : 365); day++) {
      /// When autostake is just turned off we still need compute once the new total stake for today
      totalStake = autostake ? totalStake + rewardsAmount : totalStake;
      /// Then we can mark autostake off if there's no more staked days
      autostake = day < stakedDays;
      stakeRewards = autostake
        ? Number((totalStake * multiplier).toFixed(2))
        : 0;
      rewardsAmount = Number((totalStake * multiplier).toFixed(2));
      withdraw = autostake ? 0 : Number((rewardsAmount / 2).toFixed(2));
      withdrawSum = Number(withdrawSum + withdraw);
      ulxEnd = Number(withdrawSum + totalStake);

      /* console.log("Day", day + 1)
      console.log("StakeON", autostake)
      console.log("Total Stake", totalStake)
      console.log("Rewards ON", stakeRewards)
      console.log("Rewards Amount", rewardsAmount)
      console.log("Withdraw", withdraw)
      console.log("Withdraw Sum", withdrawSum)
      console.log("ULX End", ulxEnd)
      console.log("============================") */
    }
    return { ulxEnd, totalStake, withdrawSum };
  };

  const multipliers = [0.002, 0.001, 0.0005, 0.00025, 0.000125];

  // Function to calculate growth.
  let calculateGrowth = (nftValue, ulxMarketPrice, years) => {
    const initialStake = nftValue / ulxMarketPrice;
    /// Compute every year one by one to get data for the chart
    const y1 = calculateYearlyGrowth(
      initialStake,
      years[0],
      multipliers[0],
      0,
      true
    );
    const y2 = calculateYearlyGrowth(
      y1.totalStake,
      years[1],
      multipliers[1],
      y1.withdrawSum
    );
    const y3 = calculateYearlyGrowth(
      y2.totalStake,
      years[2],
      multipliers[2],
      y2.withdrawSum
    );
    const y4 = calculateYearlyGrowth(
      y3.totalStake,
      years[3],
      multipliers[3],
      y3.withdrawSum
    );
    const y5 = calculateYearlyGrowth(
      y4.totalStake,
      years[4],
      multipliers[4],
      y4.withdrawSum,
      true
    );
    /// ==================================
    /// Return the last year ulx calculations
    return {
      ulx: Number(y5.ulxEnd.toFixed(2)),
      usdt: Number((y5.ulxEnd * ulxMarketPrice).toFixed(2)),
      percentage: Number((y5.ulxEnd / initialStake - 1) * 100).toFixed(2),
    };
    /// ==================================
    /// ==================================
  };

  let years = [
    Number(year1.value),
    Number(year2.value),
    Number(year3.value),
    Number(year4.value),
    Number(year5.value),
  ];

  // Function to update shown values when inputs changes.
  const updateValues = () => {
    const result = calculateGrowth(nftValue, ulxMarketPrice, years);
    if (typeof ulxMarketPrice === "number" && ulxMarketPrice > 0) {
      displayGrowthUsdt.textContent = result.usdt;
      displayGrowthUlx.textContent = result.ulx;
      displayGrowthUlxPercent.textContent = result.percentage;
      displayGrowthUsdtPercent.textContent = result.percentage;
    } else {
      displayGrowthUsdt.textContent = 0;
      displayGrowthUlx.textContent = 0;
      displayGrowthUlxPercent.textContent = 0;
      displayGrowthUsdtPercent.textContent = 0;
    }
  };

  // Slider's event Listeners
  year1.addEventListener("change", () => {
    years[0] = Number(year1.value);
    updateValues();
    updateChart();
  });

  year2.addEventListener("change", () => {
    years[1] = Number(year2.value);
    updateValues();
    updateChart();
  });

  year3.addEventListener("change", () => {
    years[2] = Number(year3.value);
    updateValues();
    updateChart();
  });

  year4.addEventListener("change", () => {
    years[3] = Number(year4.value);
    updateValues();
    updateChart();
  });

  year5.addEventListener("change", () => {
    years[4] = Number(year5.value);
    updateValues();
    updateChart();
  });

  // DropDown event listeners for each option
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener("click", (e) => {
      let selectedValue = e.target.id;
      if (selectedValue) {
        nftValue = Number(selectedValue);
        updateValues();
        updateChart();
      }
    });
  }

  // ULX input event listener
  ulxInput.addEventListener("input", (e) => {
    ulxMarketPrice = Number(e.target.value);
    updateValues();
    updateChart();
  });

  ////////////////////////////////////////////////////////////////////

  const offGraph = () => {
    const initialStake = nftValue / ulxMarketPrice;
    /// Compute every year one by one to get data for the chart
    const y1 = calculateYearlyGrowth(initialStake, 0, multipliers[0], 0, true);
    const y2 = calculateYearlyGrowth(
      y1.totalStake,
      0,
      multipliers[1],
      y1.withdrawSum
    );
    const y3 = calculateYearlyGrowth(
      y2.totalStake,
      0,
      multipliers[2],
      y2.withdrawSum
    );
    const y4 = calculateYearlyGrowth(
      y3.totalStake,
      0,
      multipliers[3],
      y3.withdrawSum
    );
    const y5 = calculateYearlyGrowth(
      y4.totalStake,
      0,
      multipliers[4],
      y4.withdrawSum,
      true
    );
    return [0, y1.ulxEnd, y2.ulxEnd, y3.ulxEnd, y4.ulxEnd, y5.ulxEnd];
  };

  const onGraph = () => {
    const initialStake = nftValue / ulxMarketPrice;
    /// Compute every year one by one to get data for the chart
    const y1 = calculateYearlyGrowth(
      initialStake,
      365,
      multipliers[0],
      0,
      true
    );
    const y2 = calculateYearlyGrowth(
      y1.totalStake,
      365,
      multipliers[1],
      y1.withdrawSum
    );
    const y3 = calculateYearlyGrowth(
      y2.totalStake,
      365,
      multipliers[2],
      y2.withdrawSum
    );
    const y4 = calculateYearlyGrowth(
      y3.totalStake,
      365,
      multipliers[3],
      y3.withdrawSum
    );
    const y5 = calculateYearlyGrowth(
      y4.totalStake,
      365,
      multipliers[4],
      y4.withdrawSum,
      true
    );
    return [0, y1.ulxEnd, y2.ulxEnd, y3.ulxEnd, y4.ulxEnd, y5.ulxEnd];
  };

  let newGraph = (
    newYears = [year1.value, year2.value, year3.value, year4.value, year5.value]
  ) => {
    const initialStake = nftValue / ulxMarketPrice;
    /// Compute every year one by one to get data for the chart
    const y1 = calculateYearlyGrowth(
      initialStake,
      newYears[0],
      multipliers[0],
      0,
      true
    );
    const y2 = calculateYearlyGrowth(
      y1.totalStake,
      newYears[1],
      multipliers[1],
      y1.withdrawSum
    );
    const y3 = calculateYearlyGrowth(
      y2.totalStake,
      newYears[2],
      multipliers[2],
      y2.withdrawSum
    );
    const y4 = calculateYearlyGrowth(
      y3.totalStake,
      newYears[3],
      multipliers[3],
      y3.withdrawSum
    );
    const y5 = calculateYearlyGrowth(
      y4.totalStake,
      newYears[4],
      multipliers[4],
      y4.withdrawSum,
      true
    );
    return [0, y1.ulxEnd, y2.ulxEnd, y3.ulxEnd, y4.ulxEnd, y5.ulxEnd];
  };

  const curveData = [onGraph(), offGraph(), offGraph()];
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
      responsive: true,
      maintainAspectRatio: false,
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
    const labels = ["Auto stake On", "Auto stake OFF", "Selection"];
    myChart.data.datasets = [onGraph(), offGraph(), newGraph()].map(
      (data, index) => ({
        data: data,
        label: labels[index],
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
      })
    );
    myChart.update();
  };

});
// Style
const canvasWrapper = document.querySelector(".calculator__canvas-embed");
canvasWrapper.style.height = "42%";
