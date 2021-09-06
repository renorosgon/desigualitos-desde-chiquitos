// set the dimensions and margins of the graph
var margin = {top: 10, right: 50, bottom: 10, left: 250},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var segmentplot = d3.select(".segmentplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/renorosgon/desigualitos-desde-chiquitos/main/estructura_web/data/tamanhogrupos.csv", function(data) {
data.sort(function(a,b) { return -a.IngresoPerCapita - -b.IngresoPerCapita })
// Add X axis
  var x = d3.scaleLinear()
            .domain([10, 34])
            .range([ 0, width]);
  segmentplot.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))

      // Titulo del eje
segmentplot.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "start")
  .attr("x", 0)
  .attr("y", height + margin.top + 30)
  .text("Mayor Atención");

segmentplot.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 30)
    .text("Menor Atención");

segmentplot.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 60)
        .text("Estudiantes por Grupo");

// Y axis
  var y = d3.scaleBand()
            .range([ 0, height ])
            .domain(data.map(function(d) { return d.NOMGEO; }))
            .padding(1);
  segmentplot.append("g")
  .call(d3.axisLeft(y))

  // Titulo del eje
  segmentplot.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", -margin.left - 90)
      .attr("y",  -margin.top + -150 )
      .text("Menor Ingreso");
  segmentplot.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "sart")
          .attr("transform", "rotate(-90)")
          .attr("x", -margin.left + 125)
          .attr("y",  -margin.top + -150 )
          .text("Mayor Ingreso");

  // Add a scale for bubble size
  var z = d3.scaleLinear()
  .domain([10, 35])
  .range([ 5, 10]);

  // Lines
  segmentplot.selectAll("myline")
     .data(data)
     .enter()
     .append("line")
     .attr("x1", function(d) { return x(d.GruposPublicos);})
     .attr("y1", function(d) { return y(d.NOMGEO); })
     .attr("x2", function(d) { return x(d.GruposPrivados);})
     .attr("y2", function(d) { return y(d.NOMGEO); })
     .attr("stroke", "grey")
     .attr("stroke-width", "1px")

  // Circles of variable 1
  segmentplot.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.GruposPublicos); })
    .attr("cy", function(d) { return y(d.NOMGEO); })
    .attr("r", function(d) { return z(d.GruposPublicos); })
    .style("fill", '#127a76')

  // Circles of variable 2
  segmentplot.selectAll("data")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.GruposPrivados);})
    .attr("cy", function(d) { return y(d.NOMGEO); })
    .attr("r", function(d) { return z(d.GruposPrivados);})
    .style("fill",  '#df753a')
})
