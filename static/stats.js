var svg = d3.select("#stats-timeline");

var width = svg.attr('width');
var height = svg.attr('height');
var padding = 1;

svg.selectAll("rect")
	.data(data.timeline)
	.enter()
	.append("rect")
	.attr("x", function (d, i) {
		return i * (width / data.timeline.length);
	})
	.attr("y", function (d) {
		return height - (d * 4);
	})
	.attr("width", width / data.timeline.length - padding)
	.attr("height", function (d) {
		return d * 4;
	});