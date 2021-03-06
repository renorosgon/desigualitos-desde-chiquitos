var colisionwidth = 800;
var height = 400;

// append the svg object to the body of the page
var colision = d3
  .select('.colision')
  .append('svg')
  .attr('width', colisionwidth)
  .attr('height', height);

// Read data
d3.csv(
  'https://raw.githubusercontent.com/renorosgon/desigualitos-desde-chiquitos/main/estructura_web/data/siged.csv',
  function(data) {
    // Color palette for continents?
    var color = d3
      .scaleOrdinal()
      .domain(['PRIVADO', 'PÚBLICO'])
      .range(['#127a76', '#df753a']);

    // Size scale for countries
    var size = d3
      .scaleLinear()
      .domain([0, 10000])
      .range([7, 55]); // circle will be between 7 and 55 px wide

    // create a tooltip
    var Tooltip = d3
      .select('.colision')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px');

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip.style('opacity', 1);
    };
    var mousemove = function(d) {
      Tooltip.html(
        '<u>' + d.NOMGEO + '</u>' + '<br>' + d.Docentes + ' Docentes'
      )
        .style('left', d3.mouse(this)[0] + 20 + 'px')
        .style('top', d3.mouse(this)[1] + 'px');
    };
    var mouseleave = function(d) {
      Tooltip.style('opacity', 0);
    };

    // Initialize the circle: all located at the center of the svg area
    var node = colision
      .append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', function(d) {
        return size(d.Docentes);
      })
      .attr('cx', colisionwidth / 2)
      .attr('cy', height / 2)
      .style('fill', function(d) {
        return color(d.Control);
      })
      .style('fill-opacity', 0.8)
      .attr('stroke', 'black')
      .style('stroke-width', 1)
      .on('mouseover', mouseover) // What to do when hovered
      .on('mousemove', mousemove)
      .on('mouseleave', mouseleave)
      .call(
        d3
          .drag() // call specific function when circle is dragged
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // Features of the forces applied to the nodes:
    var simulation = d3
      .forceSimulation()
      .force(
        'center',
        d3
          .forceCenter()
          .x(colisionwidth / 2)
          .y(height / 2)
      ) // Attraction to the center of the svg area
      .force('charge', d3.forceManyBody().strength(0.1)) // Nodes are attracted one each other of value is > 0
      .force(
        'collide',
        d3
          .forceCollide()
          .strength(0.2)
          .radius(function(d) {
            return size(d.Docentes) + 3;
          })
          .iterations(1)
      ); // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation.nodes(data).on('tick', function(d) {
      node
        .attr('cx', function(d) {
          return d.x;
        })
        .attr('cy', function(d) {
          return d.y;
        });
    });

    // What happens when a circle is dragged?
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0.03);
      d.fx = null;
      d.fy = null;
    }
  }
);
