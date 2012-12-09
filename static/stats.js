var charts = {
	"#stats-timeline": function (svg, width, height) {
		var scaleX = d3.scale.linear()
			.domain([0, data.timeline.length])
			.range([0, width]);
		
		var scaleY = d3.scale.linear()
			.domain([0, d3.max(data.timeline, function (d) {
				return d && d.tweets + d.retweets + d.replies;
			})])
			.range([0, height]);
		
		var g = svg.selectAll("g")
			.data(data.timeline)
			.enter().append("g")
			.attr("transform", function (d, i) {
				return "translate(" + scaleX(i) + ", 0)";
			});
		
		g.selectAll("rect")
			.data(function (d) {
				var curY = 0;
				
				return (d ? [d.tweets, d.retweets, d.replies] : [0, 0, 0]).map(function (d) {
					return { y0: curY, y1: curY += d };
				});
			})
			.enter().append("rect")
			.attr("width", scaleX(1))
			.attr("height", function (d) {
				return scaleY(d.y1 - d.y0);
			})
			.attr("y", function (d) {
				return height - scaleY(d.y1);
			})
			.attr("class", function (d, i) {
				return "twColor" + i;
			});
	},
	"#stats-types": function (svg, width, height) {
		var values = [data.count.tweets, data.count.retweets, data.count.replies];
		
		var arc = d3.svg.arc()
			.outerRadius(Math.min(width, height) / 2)
			.innerRadius(0);
		
		var pie = d3.layout.pie()
			.sort(null);
		
		var g = svg.selectAll("g")
			.data(pie(values))
			.enter().append("g")
			.attr("transform", "translate(" + (width / 2) + ", " + (height / 2) + ")");
		
		g.append("path")
			.attr("d", arc)
			.attr("class", function (d, i) {
				return "twColor" + i;
			});
		
		/*g.append("text")
			.attr("transform", function (d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("dy", "0.5em")
			.style("text-anchor", "middle")
			.text(function (d) {
				return d.value;
			});*/
	}
};

Object.keys(charts).forEach(function (k) {
	var svg = d3.select(k);
	
	charts[k](svg, svg.attr("width"), svg.attr("height"));
});