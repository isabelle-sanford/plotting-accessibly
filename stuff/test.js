chart1 = {
    const svg = d3.create("svg")
        .attr("viewBox", [0, 0, width, 33])
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .style("display", "block");
  
    svg.selectAll("text")
      .data(alphabet)
      .join("text")
        .attr("x", (d, i) => i * 17)
        .attr("y", 17)
        .attr("dy", "0.35em")
        .text(d => d);
  
    return svg.node();
  }