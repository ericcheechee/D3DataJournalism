
var svgWidth = 1250;
var svgHeight = 750;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth-margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgheight)
  .attr("width", svgwidth);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.right})`);

var chosenXAxis = "poverty";

function xScale(data, chosenXAxis){
  var xLinearScale = d3.xLinearScale()
  .domaina([d3.min(data, d => d[chosenXAxis])]) * 0.7,
  d3.max(data, d => d[chosenXAxis]) * 1.0, ])

  .range([0,width]);
  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderCircles(circlesGroup, newXScale,chosenXAxis) {
  //test //var bottomAxis = d3.axisBottom(newXScale);
  circlesGroup.transition()
    .duration(750)
    .attr("cs", d=> newXScale(d[chosenXAxis]))
  return circlesGroup;
}

// new labels
function renderLabels(stateText, newXScale, chosenXaxis) {

  stateText.transition()
    .duration(750)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return stateText;
}

// function to update tooltip
  function updateToolTip(chosenXAxis, circlesGroup){
      if(chosenXAxis === "poverty") {
          var label = "In Poverty %";
      }

      else if(chosenXAxis === "income"){
          var label = "Household Income (median)"
      }

      else {
          var label = "Age(median)"
      }
// variable that declares what the tooltip displays
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([70, 70])
    .html(function(d) {
        return (`${d.state}<br> ${label} : ${d[chosenXAxis]}`);
    });

    circlesGroup.call(toolTip);
// mourseover action that calls tooltip
    circlesGroup.on("mouseover", function(data){
       toolTip.show(data);
    })

    .on("mouseout", function(data){
        toolTip.hide(data);
    });

    return circlesGroup;
}


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data) {

// parse data
  data,forEach(function(data){
    data.poverty =+data.poverty;
    data.age =+data.age;
    data.income =+data.income;
    data.healthcare =+data.healthcare;
    data.obesity =+data.obesity;
    data.smokes =+data.smokes;
  });

// xLinearScale function above csv import
var xLinearScale = xScale(data, chosenXAxis);

// Create y scale function
var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

// append y axis
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - (margin.left/2))
.attr("x", 0- (height/2) )
.attr("dy", "1em")
.classed("axis-text", true)
.text("Lacks Healthcare (%)");


// append initial circles
var circles = chartGroup.selectAll("g circle")
  .data(data)
  .enter();

var circlesGroup = circles
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 18)
  .classed("stateCircle", true)
  .attr("opacity", ".5");

var stateText = circles
  .append("text")
  .text( d=> d.abbr)
  .classed("stateText", true)
  .attr("dx", d => xLinearScale(d[chosenXAxis]))
  .attr("dy", d => yLinearScale(d.healthcare));

// Create group for  2 x- axis labels
var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

var ageLabel = labelGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age")
  .classed("inactive", true)
  .text("Age(median)");

var incomeLabel = labelGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "income")
  .classed("inactive", true)
  .text("Household Income (median)");

// append y axis
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Number of Billboard 500 Hits");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale= xScale(data, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis)

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // updates tooltips with new info
      stateText = renderLabels(stateText,xLinearScale, chosenXAxis);

      // changes classes to change bold text
      if(chosenXAxis === "poverty") {
            povertyLabel
            .classed("active", true)
            .classed("inactive", false);

            ageLabel
            .classed("active", false)
            .classed("inactive", true);

            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }

        else if(chosenXAxis === "income"){
            povertyLabel
            .classed("active", false)
            .classed("inactive", true)

            ageLabel
            .classed("active", false)
            .classed("inactive", true)

            incomeLabel
            .classed("active", true)
            .classed("inactive", false)
        }

        else {
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);

            incomeLabel
            .classed("active", false)
            .classed("inactive", true);

            ageLabel
            .classed("active", true)
            .classed("inactive", false);
      }
    }
  });
});






























r
