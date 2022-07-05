let tvData = [
  { label: "Han", value: 33 },
  { label: "Christian", value: 12 },
  { label: "Lisa", value: 41 },
  { label: "Jacob", value: 16 },
  { label: "Nick", value: 59 },
  { label: "Ahmed", value: 38 },
  { label: "Peleke", value: 21 },
  { label: "Matt", value: 25 },
];
let tvAnnotations = {
  title: "Title Test",
  xAxis: "X Axis",
  yAxis: "Y Axis",
  caption:
    "Caption. This is where a caption would go, and would normally be a sentence or two in length. How do I make the text wrap instead of running off the paaaage",
  // colorScale: "",
  // altText: "A graph of TV watchers or whatever",
};
let sleepData = [
  { label: "12am", value: 0 },
  { label: "1am", value: 2 },
  { label: "2am", value: 0 },
  { label: "3am", value: 0 },
  { label: "4am", value: 3 },
  { label: "5am", value: 5 },
  { label: "6am", value: 3 },
  { label: "7am", value: 8 },
  { label: "8am", value: 14 },
  { label: "9am", value: 9 },
  { label: "10am", value: 6 },
  { label: "11am", value: 5 },
  { label: "12pm", value: 9 },
  { label: "1pm", value: 4 },
  { label: "2pm", value: 3 },
  { label: "3pm", value: 4 },
  { label: "4pm", value: 1 },
  { label: "5pm", value: 3 },
  { label: "6pm", value: 1 },
  { label: "7pm", value: 4 },
  { label: "8pm", value: 2 },
  { label: "9pm", value: 2 },
  { label: "10pm", value: 3 },
  { label: "11pm", value: 0 },
];

let sleepAnnotations = {
  title: "How often I woke up at each hour of the day April-June 2022",
  xAxis: "Time",
  yAxis: "Number of Occurrences",
  caption: "Nope",
  // maybe rename to just "color"
  colorScale: "vibrant", // must be option name OR color list
};

// COLOR LIST
const colors = {
  bright: ["#47A", "#6ce", "#283", "#cb4", "#e67", "#a37", "#bbb"],
  vibrant: ["#E73", "#07b", "#3be", "#e37", "#c31", "#098", "#bbb"],
  muted: ["#328", "#173", "#4a9", "#8ce", "#dc7", "#c67", "#a49", "#825"],
  highContrast: ["#fff", "#da3", "#b56", "#048", "#000"], // ff is white, 00 is black
  mediumContrast: ["#69C", "#048", "#EC6", "#945", "#970", "#E9A"],
  dark: ["#225", "#255", "#252", "#663", "#633", "#555"],
  pale: ["#BCE", "#CEF", "#CDA", "#EEB", "#FCC", "#DDD"],
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
  ],
};

// Define SVG area dimensions
const svgWidth = 1000;
const svgHeight = 800;

// Define the chart's margins as an object
const chartMargin = {
  top: 50,
  right: 30,
  bottom: 150,
  left: 100,
};

// Define dimensions of the chart area
let chartWidth = svgWidth - chartMargin.left - chartMargin.right;
let chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// data should be [{"label": "x", "value": y}]
function makeGraph(data, divId, annotations) {
  console.log(data);

  // Select body, append SVG area to it, and set the dimensions
  let svg = d3
    .select("#" + divId)
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

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
    .domain([0, d3.max(data, (d) => d.value)])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  let bottomAxis = d3.axisBottom(xBandScale);
  let leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g").call(leftAxis);

  chartGroup
    .append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // COLOR
  let colorChoice = colors["highContrast"]; // tbh default should probs be just like blue
  if (annotations.colorScale in colors) {
    colorChoice = colors[annotations.colorScale];
  } else if (annotations.colorScale.length > 0) {
    colorChoice = annotations.colorScale;
  }
  console.log(annotations.colorScale + "  " + annotations.colorScale.length);
  console.log(colorChoice);

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

  //

  // y axis
  chartGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left + 40)
    .attr("x", 0 - chartHeight / 2)
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text(annotations.yAxis);

  // x axis
  chartGroup
    .append("text")
    .attr(
      "transform",
      `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top})`
    )
    .attr("class", "axisText")
    .text(annotations.xAxis);

  // title
  chartGroup
    .append("text")
    .attr("transform", `translate(${20}, ${-chartMargin.top / 2})`)
    .attr("class", "axisText")
    .text(annotations.title);

  // caption
  chartGroup
    .append("text")
    .attr(
      "transform",
      `translate(${chartMargin.left}, ${chartHeight + chartMargin.top + 50})`
    )
    .attr("class", "axisText")
    .text(annotations.caption);
}

makeGraph(sleepData, "graph", sleepAnnotations);
