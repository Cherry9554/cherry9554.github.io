//(function)(){
	var width = 600;
	var height = 600;

	/*var bubble = d3.layout.pack()
			.size([diameter, diameter])
			.value(function(d) {return d.size;})
          	.sort(function(a, b) {
				return -(a.value - b.value)
			}) 
			.padding(3);*/

	var svg = d3.select("#chart")
		.append("svg")
		.attr("height", height)
		.attr("width", width)
		.append("g")
		//.attr("transform","transform(" + width/2 + "," + height/2 + ",0)")
		.attr("transform","transform(0,0)")
	 
	var maxCounts
	var minCounts
	//var minPrice
	//var maxPrice
	var radiusScale
	var colorScale

  	d3.csv('data/vehicle-type.csv', function (error, datapoints) {
    	if(error){ console.log(error)};
    	datapoints.forEach(function(d){
	      	d.AvgPrice= +d.AvgPrice;
	      	d.Counts = +d.Counts;
    	});

    	console.log(datapoints);

    	d3.csv('data/vehicle-type-overview.csv', function (error, data) {
	    	if(error){ console.log(error)};
	    	data.forEach(function(d){
		      	d.AvgPrice= +d.AvgPrice;
		      	d.Counts = +d.Counts;
	    	});

	    	var subset = data;

	    	console.log(subset);

	 		var types = d3.map(datapoints, function(d){return d.VehicleType;}).keys()
	 		types.push("All")

	 		console.log(types)
	 		var options = []
	 		for (i = 0; i < types.length; i++) {
	 			options.push(i);
	 		}
	 		console.log(options)

	 		d3.select("#drop")
			    .append("select")
			    .selectAll("option")
			    .data(options)
			    .enter()
			    .append("option")
			    .property("selected", function(d) { return d === 11; })
			    .text(function(d) {return types[d];})


			console.log(subset)

			maxCounts = d3.max(subset, function(d){
	    		return d.Counts;
	    	});
	    	minCounts = d3.min(subset, function(d){
	    		return d.Counts;
	    	});
			radiusScale = d3.scaleSqrt().domain([minCounts,maxCounts]).range([10,80])

	 		var prices = d3.map(subset, function(d){return d.AvgPrice;}).keys()

	 		maxPrice = d3.max(subset, function(d){
	    		return d.AvgPrice;
	    	});
	    	minPrice = d3.min(subset, function(d){
	    		return d.AvgPrice;
	    	});

	 		//colorScale = d3.scaleCluster().domain(prices).range(['#E5D6EA', '#C798D3', '#9E58AF', '#7F3391', '#581F66', '#30003A']);
	 		//colorScale = d3.scaleCluster().domain(prices).range(d3.schemeYlOrRd[9]);
	 		//colorScale = d3.scaleOrdinal(d3.schemeBlues[9]);
	 		colorScale = d3.scaleSequential(d3.interpolateOrRd).domain([minPrice, maxPrice]);


	 		var textScale = d3.scaleLinear().domain([minCounts,maxCounts]).range([5,20]);


			d3.select('select')
			    .on("change", function() {

			    key = this.selectedIndex;
				console.log(types[key])


		        simulation = d3.forceSimulation()
				.force("x", d3.forceX(width/2).strength(0.05))
				.force("y", d3.forceY(height/2).strength(0.05))
				.force("collide", d3.forceCollide(function(d){
					return radiusScale(d.Counts) + 1;
				}))

				simulation.restart()
				
				d3.selectAll("circle").remove()
				d3.selectAll("text").remove()

				if (key === 11) {
					subset = data;
				} else {
					subset = d3.nest()
				    .key(function (d) {return d.VehicleType;})
				   	.entries(datapoints)
				   	.filter(function(d) {return d.key == types[key];})[0].values

				}

				
				console.log(subset)

				maxCounts = d3.max(subset, function(d){
		    		return d.Counts;
		    	});
		    	minCounts = d3.min(subset, function(d){
		    		return d.Counts;
		    	});
				radiusScale = d3.scaleSqrt().domain([minCounts,maxCounts]).range([10,80])

		 		//prices = d3.map(subset[0].values, function(d){return d.AvgPrice;}).keys()
		 		//colorScale = d3.scaleCluster().domain(prices).range(['#E5D6EA', '#C798D3', '#9E58AF', '#7F3391', '#581F66', '#30003A']);
		 		//colorScale = d3.scaleCluster().domain(prices).range(d3.schemeYlOrRd[9]);

				maxPrice = d3.max(subset, function(d){
		    		return d.AvgPrice;
		    	});
		    	minPrice = d3.min(subset, function(d){
		    		return d.AvgPrice;
		    	});

		 		//colorScale = d3.scaleCluster().domain(prices).range(['#E5D6EA', '#C798D3', '#9E58AF', '#7F3391', '#581F66', '#30003A']);
		 		//colorScale = d3.scaleCluster().domain([minPrice, maxPrice]).range(d3.schemeYlOrRd[9]);
		 		//colorScale = d3.scaleOrdinal(d3.schemeBlues[9]);
		 		colorScale = d3.scaleSequential(d3.interpolateOrRd).domain([minPrice, maxPrice]);
				
		 		textScale = d3.scaleLinear().domain([minCounts,maxCounts]).range([5,20])

				
		 		if (key === 11) {
					circles = svg.selectAll(".type")
						.data(subset)
						.enter().append("circle")
						.attr("class", "type")
						.attr("r", function(d){
							return radiusScale(d.Counts);
						})
						.attr("fill", function(d){
			      			return colorScale(d.AvgPrice);
						})
						.on("mouseover", function (d) { showPopovers.call(this, d); })
			            .on("mouseout", function (d) { removePopovers(); })

			    } else {
			    	circles = svg.selectAll(".type")
						.data(subset)
						.enter().append("circle")
						.attr("class", "type")
						.attr("r", function(d){
							return radiusScale(d.Counts);
						})
						.attr("fill", function(d){
			      			return colorScale(d.AvgPrice);
						})
						.on("mouseover", function (d) { showPopover2.call(this, d); })
			            .on("mouseout", function (d) { removePopovers(); })
			    }

		        if (key === 11) {

			        texts = svg.selectAll(null)
					    .data(subset)
					    .enter()
					    .append("text")
					    .text(function (d) {
					    	return d.VehicleType;
					    })
					    .style("text-anchor", "middle")
					    .attr("color", "black")
					    .attr("font-size", function(d) {
					    	return textScale(d.Counts);
					    })


				} else {
					texts = svg.selectAll(null)
					    .data(subset)
					    .enter()
					    .append("text")
					    .text(function (d) {
					    	return d.Brand;
					    })
					    .style("text-anchor", "middle")
					    .attr("color", "black")
					    .attr("font-size", function(d) {
					    	return textScale(d.Counts);
					    })

				}

		        simulation.nodes(subset).on('tick', ticked)



			})

	 		
	 		var simulation = d3.forceSimulation()
				.force("x", d3.forceX(width/2).strength(0.05))
				.force("y", d3.forceY(height/2).strength(0.05))
				.force("collide", d3.forceCollide(function(d){
					return radiusScale(d.Counts) + 1;
				}))

	    	var circles = svg.selectAll(".type")
				.data(subset)
				.enter().append("circle")
				.attr("class", "type")
				.attr("r", function(d){
					return radiusScale(d.Counts);
				})
				.attr("fill", function(d){
	      			return colorScale(d.AvgPrice);
				})
				.on("mouseover", function (d) { showPopover.call(this, d); })
	            .on("mouseout", function (d) { removePopovers(); })

	        var texts = svg.selectAll(null)
			    .data(subset)
			    .enter()
			    .append("text")
			    .text(function (d) {
			    	return d.VehicleType;
			    })
			    .style("text-anchor", "middle")
			    .attr("color", "black")
			    .attr("font-size", function(d) {
			    	return textScale(d.Counts);
			    })

	        function removePopovers () {
	            $('.popover').each(function() {
	                $(this).remove();
	            }); 
	        }

	        function showPopover (d) {
	            $(this).popover({
	                placement: 'auto top',
	                container: 'body',
	                trigger: 'manual',
	                html : true,
	                content: function() { 
	                    return "Brand: " + d.VehicleType + "<br/>Average Price: " + Math.round(d.AvgPrice) + "<br/>Number of Cars: " + d.Counts;
	                    }
	                });
	            $(this).popover('show')
	        }


	        function showPopover2 (d) {
	            $(this).popover({
	                placement: 'auto top',
	                container: 'body',
	                trigger: 'manual',
	                html : true,
	                content: function() { 
	                    return "Brand: " + d.Brand + "<br/>Average Price: " + Math.round(d.AvgPrice) + "<br/>Number of Cars: " + d.Counts;
	                    }
	                });
	            $(this).popover('show')
	        }

			simulation.nodes(subset).on('tick', ticked)

			function ticked(){
				circles
				.attr("cx", function(d){
					return d.x;
				})
				.attr("cy", function(d){
					return d.y;
				})

				texts.attr('x', (d) => {
		            return d.x;
		        })
		        .attr('y', (d) => {
		            return d.y;
		        });
			}

		})

  	})

//})();