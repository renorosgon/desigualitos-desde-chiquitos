// set the dimensions and margins of the graph
var  margin = {top: 10, right: 250, bottom: 10, left: 250},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(".scatterplot")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/renorosgon/desigualitos-desde-chiquitos/main/estructura_web/data/siged.csv", function(data) {

// Add X axis
var x = d3.scaleLinear()
.domain([0, 16])
.range([ 0, width ]);

// Construye el eje
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x))

// Titulo del eje
svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "middle")
  .attr("x", width - margin.left)
  .attr("y", height + margin.top + 30)
  .text("Escuelas por Cada 1000 estudiantes");

// Add Y axis
var y = d3.scaleLinear()
.domain([2000, 18000])
.range([ height, 0]);

svg.append("g")
.call(d3.axisLeft(y))

// Titulo del eje
svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("x", -margin.left + 20)
    .attr("y",  -margin.top + -50 )
    .text("Ingreso Per Capita (Pesos)");


// Add a scale for bubble size
var z = d3.scaleLinear()
.domain([10, 410])
.range([ 4, 40]);

// Add a scale for bubble color
var myColor = d3.scaleOrdinal()
.domain(['PÚBLICO',"PRIVADO"])
.range(['#127a76','#df753a']);

// -1- Create a tooltip div that is hidden by default:
var tooltip = d3.select(".scatterplot")
.append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "black")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("color", "white")

// -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
var showTooltip = function(d) {
tooltip
  .transition()
  .duration(200)
tooltip
  .style("opacity", 1)
  .html(d.NOMGEO + ': ' + d.Escuelas + ' escuelas.')
  .style("position","absolute")
  .style("left", (d3.mouse(this)[0]+50) + "px")
  .style("top", (d3.mouse(this)[1]+30) + "px")
}

var hideTooltip = function(d) {
  tooltip.transition()
          .duration(300)
          .style("opacity", 0)
}

// Add dots
svg.append('g')
.selectAll("dot")
.data(data)
.enter()
.append("circle")
  .attr("class", "bubbles")
  .attr("cx", function (d) { return x(d.EscuelasPerCap); } )
  .attr("cy", function (d) { return y(d.IngresoPerCapita); } )
  .attr("r", function (d) { return z(d.Escuelas); } )
  .style("fill", function (d) { return myColor(d.Control); } )
// -3- Trigger the functions
.on("mouseover", showTooltip )
.on("mouseleave", hideTooltip )
})
