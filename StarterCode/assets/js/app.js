// @TODO: YOUR CODE HERE!
// First, we want to get the width of the id location
let width = 1000
let height = 600


var TopMargin = 30;
var right = 100;
var bottom = 50;
var left = 40;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");
var circRadius;




svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");
xText.attr(
    "transform",
    "translate(" +
    ((width - right) / 2 + right) +
    ", " +
    (height - TopMargin - bottom) +
    ")"
);

// X AXIS Details
xText
    .append("text")
    .attr("y", -26)
    .attr("data-name", "poverty")
    .attr("data-axis", "x")
    .attr("class", "aText active x")
    .text("(%) Poverty Percentage");
var leftTextX = TopMargin + left;
var leftTextY = (height + right) / 2 - right;
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");
yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
);

// Y AXIS Details
yText
    .append("text")
    .attr("y", 26)
    .attr("data-name", "heathcare")
    .attr("data-axis", "y")
    .attr("class", "aText active y")
    .text("(%) Without Healthcare");
d3.csv("assets/data/data.csv").then(function(data) {
    visualize(data);
});

function visualize(theData) {
    var curX = "poverty";
    var curY = "healthcare";
    var minX;
    var max_x;
    var minY;
    var max_y;


    

    function minX_Max() {
        minX = d3.min(theData, function(d) {
            return parseFloat(d[curX]) * 0.90;
        });
        max_x = d3.max(theData, function(d) {
            return parseFloat(d[curX]) * 1.10;
        });
    }

    function yMin_Max() {
        minY = d3.min(theData, function(d) {
            return parseFloat(d[curY]) * 0.90;
        });
        max_y = d3.max(theData, function(d) {
            return parseFloat(d[curY]) * 1.10;
        });
    }
    minX_Max();
    yMin_Max();



    var xScale = d3
        .scaleLinear()
        .domain([minX, max_x])
        .range([TopMargin + right, width - TopMargin]);
    var yScale = d3
        .scaleLinear()
        .domain([minY, max_y])
        .range([height - TopMargin - right, TopMargin]);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    svg
        .append("g")
        .call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (height - TopMargin - right) + ")");
    svg
        .append("g")
        .call(yAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(" + (TopMargin + right) + ", 0)");
    var theCircles = svg.selectAll("g theCircles").data(theData).enter();
    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([40, -60])
        .html(function(d) {
            // x key
            var theX;
            // Grab the state name.
            var theState = "<div>" + d.state + "</div>";
            // Snatch the y value's key and value.
            var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
            // If the x key is poverty
            theX = "<div>" + curX + ": " + d[curX] + "%</div>";
            // Display what we capture.
            return theState + theX + theY;
        });
    // Call the toolTip function.
    svg.call(toolTip);
    theCircles
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d["poverty"]);
        })
        .attr("cy", function(d) {
            return yScale(d["healthcare"]);
        })
        .attr("r", 10).attr("fill", "#add8e6")
        .attr("class", function(d) {
            return "stateCircle" + d.abbr;
        })
        .on("mouseover", function(d) {
            toolTip.show(d, this);
            d3.select(this).style("stroke", "#323232");
        })
        .on("mouseout", function(d) {
            toolTip.hide(d);
            d3.select(this).style("stroke", "#e3e3e3");
        });
    theCircles
        .append("text")
        .text(function(d) {
            return d.abbr;
        })
        .attr("dx", function(d) {
            return xScale(d[curX]);
        })
        .attr("dy", function(d) {
            return yScale(d[curY]) + 10 / 2.5;
        })
        .attr("font-size", 10)
        .attr("class", "stateText")
        .on("mouseover", function(d) {
            toolTip.show(d);
            d3.select("." + d.abbr).style("stroke", "#e3e3e3");
        });
}