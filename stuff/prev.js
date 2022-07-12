// COLOR LIST
const colors = {
  bright: ["#47A", "#6ce", "#283", "#cb4", "#e67", "#a37", "#bbb"], //7
  vibrant: ["#E73", "#07b", "#3be", "#e37", "#c31", "#098", "#bbb"],//7
  muted: ["#328", "#173", "#4a9", "#8ce", "#dc7", "#c67", "#a49", "#825"],//8
  highContrast: ["#fff", "#da3", "#b56", "#048", "#000"], // ff is white, 00 is black
  mediumContrast: ["#69C", "#048", "#EC6", "#945", "#970", "#E9A"],//6
  dark: ["#225", "#255", "#252", "#663", "#633", "#555"], //6
  pale: ["#BCE", "#CEF", "#CDA", "#EEB", "#FCC", "#DDD"], //6
  light: [
    "#7AD",
    "#E86",
    "#ED8",
    "#FAB",
    "#9DF",
    "#4B9",
    "#BC3",
    "#AA0",
    "#DDD",
  ],//9
};

// // Define SVG area dimensions
// const svgWidth = 1000;
// const svgHeight = 1000;

// // Define the chart's margins as an object
// const chartMargin = {
//   top: 50,
//   right: 30,
//   bottom: 150,
//   left: 100,
// };

// data should be [{"label": "x", "value": y}]
function makeGraph(data, divId, annotations) {
  //console.log(data);


  let div_w = d3
    .select("#" + divId)
    .style("width")
    .split("px")
    .shift();
  // ! use?
  let div_h = d3
    .select("#" + divId)
    .style("height")
    .split("px")
    .shift();

    let svgWidth = div_w;

  // caption setup
  let capWidth = Math.round((svgWidth - 60) / 10); // 16px font seems ~10px wide on average
  let capWrapped = `<tspan x="5"> ${annotations.caption[0]}`;
  let curr = ""
  let lines_ct = 0
  for (let i = 1; i < annotations.caption.length; i++) {
    currchar = annotations.caption.charAt(i);
    curr += currchar;
    if (currchar === " ") {
      capWrapped += curr;
      curr = "";
    }
    if (i % capWidth === 0) {
      capWrapped += `</tspan><tspan dy=18 x="5">`; // 18 is px height but hmmmm
      lines_ct++;
    }

  }
  capWrapped += curr;
  capWrapped += "</tspan>"


  // ? is using only width always okay?
  let svgHeight = div_w * 0.8 + 20 * lines_ct;


  let chartMargin = {
    top: 0.1 * svgHeight,
    bottom: Math.max(0.1 * svgHeight, 100) + 20 * lines_ct,
    right: 0.05 * svgWidth,
    left: Math.max(60, svgWidth * 0.1),
  };

  // Define dimensions of the chart area
  let chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  let chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;



  console.log(
    `SVG is ${svgHeight} by ${svgWidth}, chart is ${chartHeight} by ${chartWidth}`
  );

  // Select body, append SVG area to it, and set the dimensions
  let svg = d3
    .select("#" + divId)
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth)
    .attr("viewbox", `0 0 ${svgWidth} ${svgHeight}`)
    .attr("role", "img")
    .attr("aria-labelledby", `title-${divId} `)
    .attr("aria-describedby", `desc-${divId}`)
    .attr("class", "PlotSVG")

  // .attr("aria-label", "title+desc"); // ?

  svg
    .append("title")
    .attr("text", annotations.title)
    .attr("id", `title-${divId} `);
  svg
    .append("description")
    .attr("text", annotations.caption)
    .attr("id", `desc-${divId}`); // ? alt text?

  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  let chartGroup = svg
    .append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  let xBandScale = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  let yLinearScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)]) // ! make customizable?
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  let bottomAxis = d3.axisBottom(xBandScale);
  let leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g").call(leftAxis).style("font-size", "14px"); // ! align with other text - style not size?

  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis)
    .style("font-size", "14px");

  // COLOR
  let colorChoice = "blue"; //colors["highContrast"]; // tbh default should probs be just like blue
  if (annotations.colorScale in colors) {
    colorChoice = colors[annotations.colorScale];
  } else if (annotations.colorScale.length > 0) {
    colorChoice = annotations.colorScale;
  }

  // Create one SVG rectangle per piece of data
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xBandScale(d.label))
    .attr("y", (d) => yLinearScale(d.value))
    .attr("width", xBandScale.bandwidth())
    .attr("height", (d) => chartHeight - yLinearScale(d.value))
    .attr("fill", (d, i) => colorChoice[i % colorChoice.length]);


  // ADDING TEXT-------------------

  // y axis
  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", Math.min(-chartMargin.left / 2, -40)) // ACTUALLY X (bc rotate) // optionally add min distance
    .attr("x", -chartHeight / 2)
    //.attr("dy", "1em") // ??
    .attr("class", "axisText")
    .text(annotations.yAxis)
    .style("text-anchor", "middle");

  // x axis // todo maybe add px minimum height?
  chartGroup
    .append("text")
    .attr(
      "transform",
      `translate(${chartWidth / 2}, ${Math.max(chartHeight * 1.05, chartHeight + 40) })` // ??
    )
    .attr("class", "axisText")
    .text(annotations.xAxis)
    .style("text-anchor", "middle");

  // title
  chartGroup
    .append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${-chartMargin.top / 2})`)
    .attr("class", "axisText")
    .text(annotations.title)
    .style("text-anchor", "middle");

  // caption // ! wrap
  chartGroup
    .append("text")
    .attr(
      "transform",
      `translate(0, ${Math.max(chartHeight * 1.1, chartHeight + 70)})` // hmmm
    )
    .attr("class", "axisText") // ??? no?
    .html(capWrapped)
    //.style("text-anchor", "middle");
}

const wakeTimeData = [
  { label: 0, value: 6 },
  { label: 1, value: 4 },
  { label: 2, value: 2 },
  { label: 3, value: 2 },
  { label: 4, value: 12 },
  { label: 5, value: 5 },
  { label: 6, value: 15 },
  { label: 7, value: 38 },
  { label: 8, value: 62 },
  { label: 9, value: 56 },
  { label: 10, value: 24 },
  { label: 11, value: 27 },
  { label: 12, value: 29 },
  { label: 13, value: 20 },
  { label: 14, value: 10 },
  { label: 15, value: 6 },
  { label: 16, value: 10 },
  { label: 17, value: 8 },
  { label: 18, value: 9 },
  { label: 19, value: 12 },
  { label: 20, value: 6 },
  { label: 21, value: 6 },
  { label: 22, value: 4 },
  { label: 23, value: 2 },
];
const wakeAnnotations = {
  title: "Waking Time Frequency (2021-22)",
  xAxis: "Hour of the day",
  yAxis: "Number of Occurrences",
  caption:
    "Created from a near-complete record of my sleep from June 2021 to June 2022. When Mr. Bilbo Baggins of Bag End announced that he would be celebrating his eleventy-first birthday with a party of special magnificence, there was much talk and excitement in Hobbiton.",
  colorScale: ["blue"], // need to document that it must be a list
};

const sleepDurationData = [
  { label: 1, value: 13 },
  { label: 2, value: 9 },
  { label: 3, value: 19 },
  { label: 4, value: 31 },
  { label: 5, value: 17 },
  { label: 6, value: 30 },
  { label: 7, value: 53 },
  { label: 8, value: 47 },
  { label: 9, value: 53 },
  { label: 10, value: 31 },
  { label: 11, value: 16 },
  { label: 12, value: 15 },
  { label: 13, value: 8 },
  { label: 14, value: 9 },
  { label: 15, value: 6 },
  { label: 16, value: 4 },
  { label: 17, value: 4 },
  { label: 18, value: 2 },
  { label: 19, value: 4 },
  { label: 21, value: 2 },
  { label: 22, value: 2 },
];

const durationAnnotations = {
  title: "Sleep Duration (2021-22)",
  xAxis: "Time",
  yAxis: "Number of Occurrences",
  caption:
    "Created from a near-complete record of my sleep from June 2021 to June 2022.",
  colorScale:   [
    "#7AD", // 1
    "#E86", // 2
    "#ED8", // 3
    "#FAB", // 4
    "#9DF", // 5
    "#4B9", // 6
    "#BC3", // 7
    "#AA0", // 8
    "#DDD", // 9
    "#FAB",
    "#BC3",
    "#DDD",
    "#BC3",
    "#4B9",
    "#DDD",
    "#ED8",
    "#BC3",
    "#E86",
    "#AA0",
    "#7AD",
    "#9DF",
  ]
};
const sleepStartData = [
  { label: 12, value: 3 },
  { label: 13, value: 2 },
  { label: 14, value: 3 },
  { label: 15, value: 10 },
  { label: 16, value: 10 },
  { label: 17, value: 6 },
  { label: 18, value: 4 },
  { label: 19, value: 3 },
  { label: 20, value: 2 },
  { label: 21, value: 5 },
  { label: 22, value: 20 },
  { label: 23, value: 37 },
  { label: 0, value: 79 },
  { label: 1, value: 49 },
  { label: 2, value: 41 },
  { label: 3, value: 26 },
  { label: 4, value: 22 },
  { label: 5, value: 15 },
  { label: 6, value: 13 },
  { label: 7, value: 6 },
  { label: 8, value: 6 },
  { label: 9, value: 7 },
  { label: 10, value: 4 },
  { label: 11, value: 2 },
];
const sleepAnnotations = {
  title: "Sleeping Time Frequency (2021-22)",
  xAxis: "Hour of the day",
  yAxis: "Number of Occurrences",
  caption:
    "Created from a near-complete record of my sleep from June 2021 to June 2022. What I was on previously am I the reason interesting stuff we'll see what happens in agent select but now it's time to go ahead and meet our teams",
  colorScale: "muted",
};

makeGraph(wakeTimeData, "graph", wakeAnnotations);
makeGraph(wakeTimeData, "graph1", wakeAnnotations);
makeGraph(sleepStartData, "graph3", sleepAnnotations);
makeGraph(sleepDurationData, "graph2", durationAnnotations);
