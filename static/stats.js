var charts = {
	"#stats-timeline": function (svg, width, height) {
		var scaleX = d3.scale.linear()
			.domain([0, data.timeline.length])
			.range([0, width]);
		
		var scaleY = d3.scale.linear()
			.domain([0, d3.max(data.timeline, function (d) {
				return d ? d.tweets + d.retweets + d.replies : 0;
			})])
			.range([0, height]);
		
		var padding = 1;
		
		svg.selectAll("rect")
			.data(data.timeline)
			.enter()
			.append("rect")
			.attr("x", function (d, i) {
				return scaleX(i);
			})
			.attr("y", function (d) {
				return height - scaleY(d && d.tweets + d.retweets + d.replies);
			})
			.attr("width", width / data.timeline.length - padding)
			.attr("height", function (d) {
				return scaleY(d && d.tweets + d.retweets + d.replies);
			});
	},
	"#stats-types": function (svg, width, height) {
		
	}
};

Object.keys(charts).forEach(function (k) {
	var svg = d3.select(k);
	
	charts[k](svg, svg.attr("width"), svg.attr("height"));
});