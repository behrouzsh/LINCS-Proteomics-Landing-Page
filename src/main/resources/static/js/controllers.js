/**
 * Created by Behrouzsh on 12/7/16.
 */
//var appModule = angular.module('plpModule', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
var appModule = angular.module('plpModule', ['mgcrea.ngStrap']);







appModule.controller('DataViewCtrl', ['$scope', '$location', '$http', '$timeout', function ($scope, $templateCache, $http, $timeout) {
    'use strict';
    var self = this;
    self.showSVG = false;
    self.initNetworkJSON = {};
    self.perturbJSON = {};
    self.P100ProcessedJSON = {};

    $scope.initNetworkApi = function() {

        $http.get('/lincsproteomics/data/P100_processed_perturb.json').success(function (data) {
            self.P100ProcessedJSON = data;
            console.log(self.P100ProcessedJSON);
            console.log(self.P100ProcessedJSON.Trametinib);
            self.selectedPerturbation = 'Trametinib';
            $scope.perturbation = self.P100ProcessedJSON.uniquePert;
        })

        //self.selectedPerturbation = 'Zebularine';


        //APi call if you want to grab the perturbagens from pilincs
        //**********************************
        // $http.get('api/pilincs/').success(function (data) {
        //     self.initNetworkJSON = data;
        //     console.log("initNetworkJSON");
        //     console.log(self.initNetworkJSON);
        //     $scope.perturbation = self.initNetworkJSON;
        // })
        //**********************************





    };
    self.selectedPerturbation = 'Trametinib';




    function callPilincsPerturbagen (inputPert) {

        console.log("in callPilincsPerturbagen");
        console.log("input");
        console.log(inputPert);
        self.showTable = false;
        self.showSVG = false;
        //*************** HeatMap Stuff ***************************
        //*************** HeatMap Stuff ***************************
        //*************** HeatMap Stuff ***************************
        var margin = { top: 50, right: 0, bottom: 100, left: 400 },
            width = 960 - margin.left - margin.right,
            height = 2400 - margin.top - margin.bottom,
            height_legend = margin.bottom,
            gridSize = Math.floor(width / 24),
            legendElementWidth = gridSize*1.15*2,
            buckets = 7,
            colors = ["#0c02fc","#6e68f9","#b2aff7","#f9f9f7","#fcfaa6","#f9f657","#fffa00"]; // alternatively colorbrewer.YlGnBu[9]
        //     days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        //     times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
        // //datasets = ["heatmap_data.tsv", "data2.tsv"];

        var svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        self.pertAnnotation = [];
        var heatmapChart = function(perturbagen) {

            //var address = "/lincsproteomics/data/P100_processed_perturb.json" ;
            console.log("in heatmap");
            console.log("perturbagen");
            console.log(perturbagen);

            // d3.json(address,
            //     // function(d) {
            //     //
            //     //     return {
            //     //         day: +d.data.day,
            //     //         hour: +d.data.hour,
            //     //         value: +d.data.value
            //     //     };
            //     // },
            //
            //     function(error, input) {
            //         console.log(input);
            //         console.log(error);
            console.log(perturbagen);
            //self.pertAnnotation = perturbagen[pertAnnotation];
            // pepId: +perturbagen.pertData.pepId;
            // pertId: +perturbagen.pertData.pertId;
            // value: +perturbagen.pertData.value;
            console.log("In loading dat for heatmap");


            var pepLabels = svg.selectAll(".pepLabel")
                .data(perturbagen.pertPeptide)
                .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", 0)
                .attr("y", function (d, i) { return i * gridSize; })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")");
                //.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "pepLabel mono axis axis-workweek" : "pepLabel mono axis"); });

            var pertLabels = svg.selectAll(".pertLabel")
                .data(perturbagen.pertId)
                .enter().append("text")
                .text(function(d) {
                    return d
                })
                .attr("x", function(d, i) { return i * gridSize; })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)");

                //.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "pertLabel mono axis axis-worktime" : "pertLabel mono axis"); });


            // console.log(input);
            // console.log(error);
            var data = perturbagen.pertData;
            //console.log(data);
            var min_data = d3.min(data, function (d) { return d.value; });
            var max_data = d3.max(data, function (d) { return d.value; });
            var domain_data = [min_data + (max_data - min_data)/7, min_data + 2*(max_data - min_data)/7, min_data + 3*(max_data - min_data)/7, min_data + 4*(max_data - min_data)/7, min_data + 5*(max_data - min_data)/7, min_data + 6*(max_data - min_data)/7, max_data];
            console.log("min");
            console.log(min_data);
            console.log("max");
            console.log(max_data);

            var colorScale = d3.scale.threshold()
                .domain(domain_data)
                .range(colors);


            // var colorScale = d3.scale.quantile()
            //     .domain([min_data, buckets - 1, max_data])
            //     .range(colors);

            //var colorScale = d3.scale.linear().domain([min_data,max_data]).range(["#0c02fc","#fffa00"]);

            // var colorScale = d3.scale.quantile()
            //     .domain(data.value.sort()).range(colors);

            console.log("colorScale");
            console.log(colorScale);
            var cards = svg.selectAll(".pertId")
                .data(data, function(d) {return d.pepId+':'+d.pertId;});

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function(d) { return (d.pertId - 1) * gridSize; })
                .attr("y", function(d) { return (d.pepId - 1) * gridSize; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

            cards.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.value); });

            cards.select("title").text(function(d) { return d.value; });

            cards.exit().remove();

            // var legend = svg.selectAll(".legend")
            //     .data([min_data].concat(colorScale.quantiles()), function(d) { return d; });

            var legend = svg.selectAll(".legend")
                .data([min_data, min_data + (max_data - min_data)/7, min_data + 2*(max_data - min_data)/7, min_data + 3*(max_data - min_data)/7, min_data + 4*(max_data - min_data)/7, min_data + 5*(max_data - min_data)/7, min_data + 6*(max_data - min_data)/7], function(d) { return d; });

            // console.log("colorScale.quantiles()");
            // console.log(colorScale.quantiles());
            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; });

            legend.append("text")
                //.attr("class", "mono")
                .text(function(d) { return "≥ " + parseFloat(Math.round(d * 100) / 100).toFixed(2); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize);

            legend.exit().remove();
            self.showSVG = true;
            self.showTable = true;
               // });
        };

        var heatmapParam = inputPert;
        heatmapChart(heatmapParam);



        //*************** HeatMap Stuff ***************************
        //*************** HeatMap Stuff ***************************
        //*************** HeatMap Stuff ***************************



    }
    var timeout;

    $scope.$watch(function () {

        return self.selectedPerturbation;
    }, function (newVal, oldVal) {
        self.showTable = false;
        var localPerturbagen = self.selectedPerturbation;
        console.log("Before callPilincsPerturbagen");
        console.log("input");
        console.log(self.selectedPerturbation);
        console.log(localPerturbagen);
        console.log(self.P100ProcessedJSON);
        console.log(self.P100ProcessedJSON[localPerturbagen]);
        if (timeout) {
            $timeout.cancel(timeout);
        };
        $timeout(function () {
            console.log("In timeout");
            console.log(self.selectedPerturbation);
            console.log(localPerturbagen);
            console.log(self.P100ProcessedJSON);
            console.log(self.P100ProcessedJSON[localPerturbagen]);
            self.pertTable = self.P100ProcessedJSON[localPerturbagen].pertAnnotation;
            self.showTable = true;
            d3.select("svg").remove();
            callPilincsPerturbagen(self.P100ProcessedJSON[localPerturbagen]);
        }, 1100);


        //function() { callPilincsPerturbagen(self.P100ProcessedJSON.localPerturbagen) }, 20000);
        console.log("Before callPilincsPerturbagen Again");
        console.log("input  Again");
        console.log(self.selectedPerturbation);
        console.log(localPerturbagen);
        console.log(self.P100ProcessedJSON);
        console.log(self.P100ProcessedJSON.localPerturbagen);
        //$timeout(callPilincsPerturbagen(self.P100ProcessedJSON.localPerturbagen), 20000);
    });

    self.showSVG = true;



}]);

appModule.controller('assayViewCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    var self = this;
    self.showSVG = false;
    $scope.showNetwork = function(item) {
        //var net = item.value;
        console.log(item);
        //console.log(item.value);
        var net = item.toString();
        console.log(net);

        var network = self.initNetworkJSON[net];
        console.log('network');
        console.log(network);

        if (net === "P100") {

            self.showP100div = true;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
        }
        if (net === "GCP") {
            self.showP100div = false;
            self.showGCPdiv = true;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
        }
        if (net === "RPPA") {
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = true;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
        }
        if (net === "SWATH") {
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = true;
            self.showDToxSdiv = false;
        }
        if (net === "DToxS") {
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = true;
        }







        var svg = d3.selectAll("#chart").append("svg");



        var force;

        var xScale = d3.scale.linear().range([5, 15]);
        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#767776", "#f91104", "#0af702"])
            .domain([0,1,2]);
        var colNodeScale = d3.scale.linear().range(["grey", "red"]);
        var colScale = d3.scale.linear().range(["grey", "red"]);
        var edgeWeightScale = d3.scale.linear().range([1, 3]);
        d3.selectAll("svg > *").remove();







        function update(nodes, links) {
            //
            //var svg;
            svg.remove();

            var margin = 100,
                w = 1500 -2*margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;

            svg = d3.select("#chart")
                .append("svg")
                .attr("style", "outline: thin solid blue;")
                .attr("width", w)
                .attr("height", h);

            // var pool = svg.append('circle')
            //     .style('stroke-width', strokeWidth * 2)
            //     .style('stroke-width', strokeWidth * 2)
            //     .attr({
            //         class: 'pool',
            //         r: radius,
            //         index: -1,
            //         cy: 0,
            //         cx: 0,
            //         transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
            //     });

            var force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h])
                .linkDistance(150)
                .charge(-500)
                //.linkStrength(0.9)
                //.friction(0.9)
                //.chargeDistance(300)
                .gravity(0.25)
                //.theta(0.8)
                //.alpha(0.1)
                .on("tick", tick)
                .start();

            // for (var i = n*n; i > 0; --i) force.tick();
            // force.stop();

            //.stop();


            xScale.domain(d3.extent(nodes, function (d) { return d.weight; }));
            colNodeScale.domain(d3.extent(nodes, function (d) { return d.group; }));
            colScale.domain(d3.extent(links, function (d) { return d.weight; }));


            var path = svg.append("svg:g").selectAll("path")
            //.data(links)
                .data(force.links())
                .enter().append("svg:path")
                .style("stroke", function (d) {return colScale(d.value); })
                .attr("class", function(d) { return "link "; });





            //************************************
            // var text = svg.append("svg:g").selectAll("g")
            //     .data(force.nodes())
            //     .enter().append("svg:g");
            // text.append("svg:text")
            //     .attr("x", 12)
            //     .attr("y", ".31em")
            //     .text(function(d) {
            //        return d.full_name; });
            //************************************

            //return d.full_name; });
            //.on("mouseover",function(d){
            //     return d.full_name;
            // });
            // .transition()
            // .duration(300)
            // .text(
            //      function(){ console.log("mouseOver"); d3.select(this).select("text").style("fill", "#000");} )
            // .on("mouseout", function(){ console.log("mouseOut"); d3.select(this).select("text").style("fill", "#ccc");} ); ;




            var node = svg.append("svg:g").selectAll("g.node")
                .data(force.nodes())
                .enter().append("svg:g")
                .attr("class", "node")
                .call(force.drag);

            node.append("circle")
                .attr("r", function (d) { return xScale(d.weight); })
                .style("fill", function(d) { return colNodeScale(d.group); });
            //.on("dblclick", dblclick);


            function openLink() {
                return function(d) {
                    var url = "";
                    if(d.slug != "") {
                        url = d.slug
                    } //else if(d.type == 2) {
                    //url = "clients/" + d.slug
                    //} else if(d.type == 3) {
                    //url = "agencies/" + d.slug
                    //}
                    window.open("//"+url)
                }
            };
            node.append("svg:image")
            //****************************************
            //.attr("class", function(d){ return d.name })
            //****************************************
            //.attr("xlink:href", function(d){ return d.img_hrefD})
                .attr("x", "-36px")
                .attr("y", "-36px")
                .attr("width", "70px")
                .attr("height", "70px")
            //.on("dblclick", openLink());

            // .on("mouseover", function (d) { if(d.entity == "company")
            // {
            //     d3.select(this).attr("width", "90px")
            //         .attr("x", "-46px")
            //         .attr("y", "-36.5px")
            //         .attr("xlink:href", function(d){ return d.img_hrefL});
            // }
            // })
            // .on("mouseout", function (d) { if(d.entity == "company")
            // {
            //     d3.select(this).attr("width", "70px")
            //         .attr("x", "-36px")
            //         .attr("y", "-36px")
            //         .attr("xlink:href", function(d){ return d.img_hrefD});
            // }
            // });


            //.text(function(d) { return d.name })
            node.append("svg:text")
            //****************************************
                .attr("class", function(d){ return d.name })
                //****************************************
                .attr("x", 16)
                .attr("y", ".31em")
                //.attr("class", "shadow")
                //.style("font-size","10px")
                // .attr("dx", 0)
                // .attr("dy", ".35em")
                //.style("font-size","12px")
                //****************************************
                .attr("class", "shadow")
                .style("font", "15px Times New Roman")
                //****************************************
                //.attr("text-anchor", "middle")
                //****************************************
                .text(function(d) { return d.full_name });
            //****************************************




            //This one is for the actual text
            node.append("svg:text")
            //****************************************
                .attr("class", function(d){ return d.name })
                //****************************************
                .attr("x", 16)
                .attr("y", ".31em")
                //.attr("class", "shadow")
                //.style("font-size","10px")
                // .attr("dx", 0)
                // .attr("dy", ".35em")
                //.style("font-size","12px")
                //****************************************
                .style("font", "15px Times New Roman")
                //****************************************
                //.attr("text-anchor", "middle")
                //****************************************
                .text(function(d) { return d.full_name });
            //****************************************


            node.on("mouseover", function(d) {
                d3.select(this).select("text")
                    .transition()
                    .duration(300)
                    .text(function (d) {
                        return d.full_name;
                    })
                    //.style("font-size", "15px")
                    .style("font", "15px Times New Roman");


                //d3.selectAll("text").remove();
                //d3.select(this).style("stroke-width", 6);

                //d3.select(this).select("text").style("stroke", "blue");

                var nodeNeighbors = links.filter(function(link) {
                    // Filter the list of links to only those links that have our target
                    // node as a source or target
                    return link.source.index === d.index || link.target.index === d.index;})
                    .map(function(link) {
                        // Map the list of links to a simple array of the neighboring indices - this is
                        // technically not required but makes the code below simpler because we can use
                        // indexOf instead of iterating and searching ourselves.
                        return link.source.index === d.index ? link.target.index : link.source.index; });

                d3.selectAll('circle').filter(function(node) {
                    // I filter the selection of all circles to only those that hold a node with an
                    // index in my listg of neighbors
                    return nodeNeighbors.indexOf(node.index) > -1;
                })
                    .style('stroke', 'blue');

                //d3.selectAll('text').filter(d).style('fill', 'blue');
                //****************************
                // d3.selectAll('text').filter(function(node) {
                //     // I filter the selection of all circles to only those that hold a node with an
                //     // index in my listg of neighbors
                //     return nodeNeighbors.indexOf(node.index) > -1;
                // }).style('fill', 'blue')
                //     //.style("font-size", "16px")
                //     //.style("font-weight", "bold");
                // //****************************
                path.style('stroke', function(l) {
                    if (d === l.source || d === l.target)
                        return "blue";
                    else
                        return "grey";
                })

                path.style('stroke-width', function(l) {
                    if (d === l.source || d === l.target)
                        return 3;
                    else
                        return 1;
                })

            })
                .on("mouseout",  function(d) {
                    d3.select(this).select("text")
                        .transition()
                        .duration(300)
                        .text(function (d) {
                            return d.full_name;
                        });
                    d3.select(this).select("text")
                    //*******************************
                        .style("font", "15px Times New Roman")
                        //*******************************
                        .style("font-size", "15px")
                        .style("fill",'black')
                        .style("font-weight", "normal");
                    //d3.select(this).style("stroke", "black");
                    //d3.select(this).style("stroke-width", 1);
                    //d3.select(this).style("stroke", "#333");
                    path.style('stroke', "grey");
                    path.style('stroke-width', 1);
                    //circle.style('stroke', "grey");
                    //node.style("stroke-width", 3);
                    //node.style("stroke", "#333");
                    //d3.selectAll('text').style('fill', 'black')
                    d3.selectAll('text').style('fill', 'black')
                        .style("font-weight", "normal");
                    //d3.selectAll("text").style("font-weight", "normal");
                    node.selectAll("circle").style("stroke-width", 3)
                        .style('stroke', "black");
                    //.style("font-size", "12px");
                    //}
                });


            function pythag(r, b, coord) {
                r += nodeBaseRad;

                // force use of b coord that exists in circle to avoid sqrt(x<0)
                b = Math.min(w - r - strokeWidth, Math.max(r + strokeWidth, b));

                var b2 = Math.pow((b - radius), 2),
                    a = Math.sqrt(hyp2 - b2);

                function openLink() {
                    return function(d) {
                        var url = "";
                        if(d.slug != "") {
                            url = d.slug
                        } //else if(d.type == 2) {
                        //url = "clients/" + d.slug
                        //} else if(d.type == 3) {
                        //url = "agencies/" + d.slug
                        //}
                        window.open("//"+url)
                    }
                }
                // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
                coord = Math.max(radius - a + r + strokeWidth,
                    Math.min(a + radius - r - strokeWidth, coord));

                return coord;
            }

            function tick(e) {
                path.attr("d", function(d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,

                        dr = Math.sqrt(dx * dx + dy * dy);
                    //console.log(d.source.x);
                    // console.log(d.target.x);
                    return "M" + d.source.x + "," + d.source.y + ","+ d.target.x + "," + d.target.y;
                    //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                });

                node.attr('x', function (d) { return d.x = pythag(Math.random() * 12, d.y, d.x); })
                    .attr('y', function (d) { return d.y = pythag(Math.random() * 12, d.x, d.y); })
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")"});

                //d3.select(this).classed("fixed", d.fixed = true);
                // circle.attr("transform", function(d) {
                //     return "translate(" + d.x + "," + d.y + ")";
                // });
                //************************************
                // text.attr("transform", function(d) {
                //     return "translate(" + d.x + "," + d.y + ")";
                // });
                //************************************
            }
            //For not moving after drag
            var drag = force.drag()
                .on("dragstart", dragstart);
            //.on("dragstart", dragstartAll);

            //For not moving after drag
            function dblclick(d) {
                d3.select(this).classed("fixed", d.fixed = false);

            }
            //For not moving after drag
            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);

                for (i=0;i<nodes.length;i++)
                { nodes[i].fixed = true;}
            }


            // For legend
            var colNodeScaleSeparateInfo = d3.scale.ordinal()
                .range(["#767776", "#f91104"])
                .domain(["Query Gene Set","Pathways / Kinases Perturbation"]);


            var legend = svg.selectAll(".legend")
                .data(colNodeScaleSeparateInfo.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + (i) * 25 + ")"; });

            legend.append("rect")
                .attr("x", w - 25)
                .attr("width",  25)
                .attr("height",  25)
                .style("fill", colNodeScaleSeparateInfo);

            legend.append("text")
                .attr("x", w - 35)
                .attr("y", 12.5)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });


            d3.select("#download").on("click", function(){
                d3.select(this)
                    .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart").html()))
                    .attr("download", "pathway_network.svg")
            })

            // d3.select("#download").on("click", function(){
            //     var html = d3.select("svg")
            //         .attr("version", 1.1)
            //         .attr("xmlns", "http://www.w3.org/2000/svg")
            //         .node().parentNode.innerHTML;
            //
            //     //console.log(html);
            //     var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
            //     var img = '<img src="'+imgsrc+'">';
            //     d3.select("#svgdataurl").html(img);
            //
            //
            //     var canvas = document.querySelector("canvas"),
            //         context = canvas.getContext("2d");
            //
            //     var image = new Image;
            //     image.src = imgsrc;
            //     image.onload = function() {
            //         context.drawImage(image, 0, 0);
            //
            //         var canvasdata = canvas.toDataURL("image/png");
            //
            //         var pngimg = '<img src="'+canvasdata+'">';
            //         d3.select("#pngdataurl").html(pngimg);
            //
            //         var a = document.createElement("a");
            //         a.download = "sample.png";
            //         a.href = canvasdata;
            //         a.click();
            //     };
            //
            // });




        }


























        }


}]);

appModule.controller('ToolsCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    var self = this;



}]);


appModule.controller('NavigationCtrl', ['$scope', '$location', '$http', '$window',function ($scope, $location, $http, $window) {
    var self = this;
    console.log("here");
    $scope.tabs = [
        { link : '#/', label : 'Home' },
        { link : '#/assay-view', label : 'Assay View' },
        { link : '#/data-view', label : 'Data View' },
        { link : '#/tools', label : 'Tools' },
        { link : '#/about', label : 'About' }
    ];

    $scope.selectedTab = $scope.tabs[0];
    $scope.setSelectedTab = function(tab) {
        $scope.selectedTab = tab;
        console.log($scope.selectedTab.link);
        console.log($scope.selectedTab.label);
        self.activeSite = $scope.selectedTab.link;
    }
    console.log($scope.selectedTab.link);
    console.log($scope.selectedTab.label);
    $scope.tabClass = function(tab) {
        if ($scope.selectedTab == tab) {
            self.activeSite = $scope.selectedTab.link;
            return "active";

        } else {
            return "";
        }
    }
    self.showSVG = false;
    // Load tags for autocomplete
    self.initNetworkJSON = {};



    $scope.initNetwork = function() {

        $http.get('/lincsproteomics/data/content.json').success(function (data) {
            self.initNetworkJSON = data;
            console.log("initNetworkJSON");
            console.log(self.initNetworkJSON);


    })
    };
    //$scope.initNetwork();


    $scope.customDownload = function(msg){
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/dcic-portal/", '_blank');

        // DToxS:
        //     http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:MS%20protein%20state%20assay
        //
        // RPPA:
        //     http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:RPPA%20protein%20state%20assay
        //
        // P100:
        //     http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:P100%20phosphoprotein%20quantification%20assay
        //
        // SWATH:
        //     http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:SWATH-MS%20protein%20quantification%20assay



        // self.inputGenesForPathway = $window.localStorage.getItem("genes");
        // var inputGenesForPathway = $window.localStorage.getItem("genes");
        console.log("message");
        console.log(message);
    };
    $scope.customDownloadSWATH = function(msg){
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:SWATH-MS%20protein%20quantification%20assay", '_blank');
        console.log("message");
        console.log(message);

    };
    $scope.customDownloadRPPA = function(msg){
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:RPPA%20protein%20state%20assay", '_blank');
        console.log("message");
        console.log(message);

    };
    $scope.customDownloadDToxS = function(msg){
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:MS%20protein%20state%20assay", '_blank');
        console.log("message");
        console.log(message);

    };
    $scope.customDownloadGCP = function(msg){
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:Global%20chromatin%20epigenetic%20profiling%20assay", '_blank');
        console.log("message");
        console.log(message);

    };

    $scope.customDownloadP100 = function(msg){
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:P100%20phosphoprotein%20quantification%20assay", '_blank');
        console.log("message");
        console.log(message);

    };
    $scope.showNetwork = function(item){
        //var net = item.value;
        console.log(item);
        //console.log(item.value);
        var net = item.toString();
        console.log(net);

        var network = self.initNetworkJSON[net];
        console.log('network');
        console.log(network);

        if (net === "P100"){

            self.showP100div = true;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
        }
        if (net === "GCP"){
            self.showP100div = false;
            self.showGCPdiv = true;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
        }
        if (net === "RPPA"){
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = true;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
        }
        if (net === "SWATH"){
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = true;
            self.showDToxSdiv = false;
        }
        if (net === "DToxS"){
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = true;
        }





        var force;

        var xScale = d3.scale.linear().range([5, 15]);
        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#767776", "#f91104", "#0af702"])
            .domain([0,1,2]);
        var colNodeScale = d3.scale.linear().range(["grey", "red"]);
        var colScale = d3.scale.linear().range(["grey", "red"]);

        d3.select("svg").remove();
        //d3.select("svg").remove();
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        var svg = d3.selectAll("#chart").append("svg");
        var svg2 = d3.selectAll("#chart2").append("svg");








        function updateKinase2(nodes, links) {
            var force;

            var xScale = d3.scale.linear().range([5, 15]);
            var colNodeScaleSeparate = d3.scale.ordinal()
                .range(["#767776", "#f91104", "#0af702"])
                .domain([0,1,2]);
            var colNodeScale = d3.scale.linear().range(["grey", "red"]);
            var colScale = d3.scale.linear().range(["grey", "red"]);

            d3.select("svg").remove();
            //d3.select("svg").remove();
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //var svg = d3.selectAll("#chart2").append("svg");

            console.log("In update kinase 2")
            var margin = 100,
                w = 1500 -2*margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;

            svg = d3.select("#chart3")
                .append("svg")
                .attr("style", "outline: thin solid blue;")
                .attr("width", w)
                .attr("height", h);

            // var pool = svg.append('circle')
            //     .style('stroke-width', strokeWidth * 2)
            //     .style('stroke-width', strokeWidth * 2)
            //     .attr({
            //         class: 'pool',
            //         r: radius,
            //         index: -1,
            //         cy: 0,
            //         cx: 0,
            //         transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
            //     });

            force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h])
                .gravity(.25)
                .linkDistance(100)
                .charge(-500)
                //.gravity(0.05)
                .on("tick", tick)
                .start();


            xScale.domain(d3.extent(nodes, function (d) { return d.weight; }));
            colNodeScaleSeparate.domain(d3.extent(nodes, function (d) { return d.group; }));
            colScale.domain(d3.extent(links, function (d) { return d.weight; }));



//             function linkMouseover(d){
//                 chart.selectAll(".node").classed("active", function(p) { return d3.select(this).classed("active") || p === d.source || p === d.target; });
//             }
// // Highlight the node and connected links on mouseover.
//             function nodeMouseover(d) {
//                 chart.selectAll(".link").classed("active", function(p) { return d3.select(this).classed("active") || p.source === d || p.target === d; });
//                 chart.selectAll(".link.active").each(function(d){linkMouseover(d)})
//                 d3.select(this).classed("active", true);
//             }



            svg.append('defs').append('marker')
                .attr({'id':'arrowhead',
                    'viewBox':'-0 -5 10 10',
                    'refX':25,
                    'refY':0,
                    //'markerUnits':'strokeWidth',
                    'orient':'auto',
                    'markerWidth':5,
                    'markerHeight':6,
                    'xoverflow':'visible'})
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', 'black')
                .attr('stroke','#ccc');


            var path = svg.append("svg:g").selectAll("path")
            //.data(links)
                .data(force.links())
                .enter().append("svg:path")
                .style("stroke", function (d) {return colScale(d.value); })
                //.attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
                .attr("class", function(d) { return "link "; })
                .attr('marker-end','url(#arrowhead)');
            //.attr("marker-end", "url(#arrow)");


            var text = svg.append("svg:g").selectAll("g")
                .data(force.nodes())
                .enter().append("svg:g");
            // .on("mouseover", function(d) {
            //
            //     )};

            // A copy of the text with a thick white stroke for legibility.
            text.append("svg:text")
                .attr("x", 12)
                .attr("y", ".31em")
                .attr("class", "shadow")
                .text(function(d) { return d.name; });

            text.append("svg:text")
                .attr("x", 12)
                .attr("y", ".31em")
                .text(function(d) { return d.name; });
            // .on("mouseover", function(){ console.log("mouseOver"); d3.select(this).select("text").style("fill", "#000");} )
            // .on("mouseout", function(){ console.log("mouseOut"); d3.select(this).select("text").style("fill", "#ccc");} ); ;

            // function randomNodes(n) {
            //     var data = [],
            //         range = d3.range(n);
            //
            //     for (var i = range.length - 1; i >= 0; i--) {
            //         data.push({
            //             rad: Math.floor(Math.random() * 12)
            //         });
            //     }
            //     return data;
            // }


            // var city = svg.selectAll(".city")
            //     .data(cities)
            //     .enter().append("g")
            //     .attr("class", "city");
            //
            // city.append("path")
            //     .attr("class", "line")
            //     .attr("d", function(d) { return line(d.values); })
            //     .attr("data-legend",function(d) { return d.name})
            //     .style("stroke", function(d) { return color(d.name); });


            var circle = svg.append("svg:g").selectAll("circle")
            //.data(nodes)
                .data(force.nodes())
                .enter().append("svg:circle")
                .attr("r", function (d) { return xScale(d.weight); })
                //.attr("data-legend",function(d) { return d.group})
                .style("fill", function(d) { return colNodeScaleSeparate(d.group); })
                //.style("fill", function(d) { return color(d.type); })
                .on("dblclick", dblclick)
                .call(force.drag)

                //.call(drag)

                .on("mouseover", function(d) {
                    d3.select(this).append("text")
                        .attr("x", 12)
                        .attr("y", ".31em")
                        .attr("class", "shadow")
                        .text( d.name);

                    //d3.selectAll("text").remove();
                    d3.select(this).style("stroke-width", 6);

                    d3.select(this).style("stroke", "blue");

                    var nodeNeighbors = links.filter(function(link) {
                        // Filter the list of links to only those links that have our target
                        // node as a source or target
                        return link.source.index === d.index || link.target.index === d.index;})
                        .map(function(link) {
                            // Map the list of links to a simple array of the neighboring indices - this is
                            // technically not required but makes the code below simpler because we can use
                            // indexOf instead of iterating and searching ourselves.
                            return link.source.index === d.index ? link.target.index : link.source.index; });

                    d3.selectAll('circle').filter(function(node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    })
                        .style('stroke', 'blue')

                    //d3.selectAll('text').filter(d).style('fill', 'blue');

                    d3.selectAll('text').filter(function(node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    }).style('fill', 'blue')
                    //.style("font-size", "16px")
                        .style("font-weight", "bold");

                    path.style('stroke', function(l) {
                        if (d === l.source || d === l.target)
                            return "blue";
                        else
                            return "grey";
                    })

                    path.style('stroke-width', function(l) {
                        if (d === l.source || d === l.target)
                            return 3;
                        else
                            return 1;
                    })

                })
                .on("mouseout",  function(d) {
                    //d3.select(this).classed("hover", false);
                    // if(isConnected(d, o)) {
                    //svg.selectAll('circle').style('stroke', 'black');
                    d3.select(this).style("stroke-width", 3);
                    d3.select(this).style("stroke", "#333");
                    // d3.select(this).select("circle").style("stroke", "black");
                    // d3.select(this).select("text").style("font", "12px sans-serif");
                    // d3.selectAll("rect." + d.location).style("stroke-width", 1);
                    // d3.selectAll("rect." + d.location).style("stroke", "gray");
                    // d3.selectAll("text." + d.location).style("font", "12px sans-serif");
                    // d3.selectAll("tr." + d.name).style("background-color", "white");
                    path.style('stroke', "grey");
                    path.style('stroke-width', 1);
                    //circle.style('stroke', "grey");
                    circle.style("stroke-width", 3);
                    circle.style("stroke", "#333");
                    d3.selectAll('text').style('fill', 'black')
                        .style("font-weight", "normal");
                    //.style("font-size", "12px");
                    //}
                });


            function pythag(r, b, coord) {
                r += nodeBaseRad;

                // force use of b coord that exists in circle to avoid sqrt(x<0)
                b = Math.min(w - r - strokeWidth, Math.max(r + strokeWidth, b));

                var b2 = Math.pow((b - radius), 2),
                    a = Math.sqrt(hyp2 - b2);

                // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
                coord = Math.max(radius - a + r + strokeWidth,
                    Math.min(a + radius - r - strokeWidth, coord));

                return coord;
            }

            function tick(e) {
                path.attr("d", function(d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy),
                        drx = dr,
                        dry = dr,
                        xRotation = 0, // degrees
                        largeArc = 0, // 1 or 0
                        sweep = 1, // 1 or 0
                        x2 = d.target.x,
                        y2 = d.target.y;
                    //console.log(d.source.x);
                    // console.log(d.target.x);

                    if ( d.target.x === d.source.x && d.target.y === d.source.y ) {
                        // Fiddle with this angle to get loop oriented.
                        xRotation = -45;

                        // Needs to be 1.
                        largeArc = 1;

                        // Change sweep to change orientation of loop.
                        //sweep = 0;

                        // Make drx and dry different to get an ellipse
                        // instead of a circle.
                        drx = 30;
                        dry = 20;

                        // For whatever reason the arc collapses to a point if the beginning
                        // and ending points of the arc are the same, so kludge it.
                        x2 = d.target.x + 1;
                        y2 = d.target.y + 1;
                    }

                    return "M" + d.source.x + "," + d.source.y + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;


                    //return "M" + d.source.x + "," + d.source.y + ","+ d.target.x + "," + d.target.y;
                    //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                });

                circle.attr('x', function (d) { return d.x = pythag(Math.random() * 12, d.y, d.x); })
                    .attr('y', function (d) { return d.y = pythag(Math.random() * 12, d.x, d.y); })
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")"});

                // circle.attr("transform", function(d) {
                //     return "translate(" + d.x + "," + d.y + ")";
                // });

                text.attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            }

            //For not moving after drag
            var drag = force.drag()
                .on("dragstart", dragstart);

            //For not moving after drag
            function dblclick(d) {
                d3.select(this).classed("fixed", d.fixed = false);
            }
            //For not moving after drag
            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);
                for (var i=0;i<nodes.length;i++){nodes[i].fixed = true;}
            }


            // For legend
            var colNodeScaleSeparateInfo = d3.scale.ordinal()
                .range(["#767776", "#f91104", "#0af702"])
                .domain(["Query Gene Set","Activating Kinases, Phosphorylating the Query Gene Set","Down Stream Gene Sets, Phosphorylated by the Gene Set"]);


            var legend = svg.selectAll(".legend")
                .data(colNodeScaleSeparateInfo.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + (i) * 25 + ")"; });

            legend.append("rect")
                .attr("x", w - 25)
                .attr("width",  25)
                .attr("height",  25)
                .style("fill", colNodeScaleSeparateInfo);

            legend.append("text")
                .attr("x", w - 35)
                .attr("y", 12.5)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });






            d3.select("#download2").on("click", function(){
                d3.select(this)
                    .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart3").html()))
                    .attr("download", "kinase_network.svg")
            })
        }





        updateKinase2(network.nodes, network.edges);
        self.showSVG = true;
        //$scope.itemList.push(item.value);
    }

}]);

appModule.controller('MainCtrl', ['$http', '$scope', '$window', function ($http, $scope, $window) {

    var self = this;


    self.showSVG = false;



    // if (!self.formatInput) {
    //     self.textArea = self.textAreaFormatMD;
    // } else {
    //     self.textArea = self.textAreaFormatSN;
    // }



    var newModificationString;

    self.waiting = false;
    self.showOutput = false;
    self.noResponse = false;
    self.showP100div = false;
    self.showGCPdiv = false;
    self.showRPPAdiv = false;
    self.showSWATHdiv = false;
    self.showDToxSdiv = false;

    self.modificationPattern = /[^A-Z]/g;
    self.modificationPatternWithLetter = /[A-Z]\[\+[\d\.]+]/g;
    self.modificationPatternSecondFormat = /\[[a-z]+[A-Z]+\]/g;
    self.rowSplitPattern = /[,;\n]/;
    self.rowSplitPatternGenes = /[,;\n]/;
    self.cleanFormattedModifications = /\[/;
    self.patt1=/[A-Z]/;
    self.patt2=/[a-z]/;
    self.modificationMap = {'a':42.03, 'm':14.02, 'p':79.97};

    var protPlace = 0;
    var emptyList = [];
    self.prResponseList = [];
    self.prResponseJson = {};

    var distinct = [];
    var firstPrositeResponseFiltered = [];
    self.parsedMotifs = [];
    self.genes = [];
    self.parsedGenes = [];
    self.parsedModifications = [];
    self.parsedModificationsFormatter = [];
    self.ontologyMappings = [];
    self.ontologyMappingsUnique = [];
    self.numResponsesFromProsite = 0;
    self.numResponsesFromUniprot;
    self.plnFormatOne = [];
    self.plnFormatTwo = [];
    self.plnFirstHit = [];
    self.sequence_acList = [];
    self.geneIdList = [];
    self.sequence_acListComplete = [];
    self.initNetworkJSON = {};

    // self.activeSite = '';
    // self.changeSite = function (el) {
    //     self.activeSite = el;
    //     console.log("activeSite");
    //     console.log(self.activeSite);
    // };

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    // $scope.newPage = function (){
    //     location.href = '#/new-page.html';
    // };

    //function($scope, $window) {
    $scope.customNavigateApi = function(msg){
        $window.open("/pln/api/pathway/genes/" + msg, '_blank');
    };

    $scope.customNavigateGraphics = function(msg){
        $window.localStorage.setItem("genes", msg);
        $window.open("/pln/pathway.html", '_blank');
        self.inputGenesForPathway = $window.localStorage.getItem("genes");
        var inputGenesForPathway = $window.localStorage.getItem("genes");
        console.log("inputGenes");
        console.log(self.inputGenesForPathway);
        console.log(inputGenesForPathway);
    };



    self.onSubmitPathway = function () {

        var force;

        var xScale = d3.scale.linear().range([5, 15]);
        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#767776", "#f91104", "#0af702"])
            .domain([0,1,2]);
        var colNodeScale = d3.scale.linear().range(["grey", "red"]);
        var colScale = d3.scale.linear().range(["grey", "red"]);

        d3.select("svg").remove();
        //d3.select("svg").remove();
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        var svg = d3.selectAll("#chart").append("svg");
        var svg2 = d3.selectAll("#chart2").append("svg");
        function update(nodes, links) {
            //
            //var svg;
            svg.remove();

            var margin = 100,
                w = 1500 -2*margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;

            svg = d3.select("#chart")
                .append("svg")
                .attr("style", "outline: thin solid blue;")
                .attr("width", w)
                .attr("height", h);

            // var pool = svg.append('circle')
            //     .style('stroke-width', strokeWidth * 2)
            //     .style('stroke-width', strokeWidth * 2)
            //     .attr({
            //         class: 'pool',
            //         r: radius,
            //         index: -1,
            //         cy: 0,
            //         cx: 0,
            //         transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
            //     });

            force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h])
                .gravity(.25)
                .linkDistance(100)
                .charge(-500)
                //.gravity(0.05)
                .on("tick", tick)
                .start();


            xScale.domain(d3.extent(nodes, function (d) { return d.weight; }));
            colNodeScale.domain(d3.extent(nodes, function (d) { return d.group; }));
            colScale.domain(d3.extent(links, function (d) { return d.weight; }));



//             function linkMouseover(d){
//                 chart.selectAll(".node").classed("active", function(p) { return d3.select(this).classed("active") || p === d.source || p === d.target; });
//             }
// // Highlight the node and connected links on mouseover.
//             function nodeMouseover(d) {
//                 chart.selectAll(".link").classed("active", function(p) { return d3.select(this).classed("active") || p.source === d || p.target === d; });
//                 chart.selectAll(".link.active").each(function(d){linkMouseover(d)})
//                 d3.select(this).classed("active", true);
//             }



            var path = svg.append("svg:g").selectAll("path")
                //.data(links)
                .data(force.links())
                .enter().append("svg:path")
                .style("stroke", function (d) {return colScale(d.value); })
                .attr("class", function(d) { return "link "; });


            var text = svg.append("svg:g").selectAll("g")
                .data(force.nodes())
                .enter().append("svg:g");
                // .on("mouseover", function(d) {
                //
                //     )};

            // A copy of the text with a thick white stroke for legibility.
            text.append("svg:text")
                .attr("x", 12)
                .attr("y", ".31em")
                .attr("class", "shadow")
                .text(function(d) { return d.name; });

            text.append("svg:text")
                .attr("x", 12)
                .attr("y", ".31em")
                .text(function(d) { return d.name; });
                // .on("mouseover", function(){ console.log("mouseOver"); d3.select(this).select("text").style("fill", "#000");} )
                // .on("mouseout", function(){ console.log("mouseOut"); d3.select(this).select("text").style("fill", "#ccc");} ); ;

            // function randomNodes(n) {
            //     var data = [],
            //         range = d3.range(n);
            //
            //     for (var i = range.length - 1; i >= 0; i--) {
            //         data.push({
            //             rad: Math.floor(Math.random() * 12)
            //         });
            //     }
            //     return data;
            // }


            var circle = svg.append("svg:g").selectAll("circle")
                //.data(nodes)
                .data(force.nodes())
            // for (var i = range.length - 1; i >= 0; i--) {
            //     data.push({
            //         rad: Math.floor(Math.random() * 12)
            //     });
            // }
                .enter().append("svg:circle")
                .attr("r", function (d) { return xScale(d.weight); })
                .style("fill", function(d) { return colNodeScale(d.group); })
                .on("dblclick", dblclick)
                .call(force.drag)
                .on("mouseover", function(d) {
                    d3.select(this).append("text")
                        .attr("x", 12)
                        .attr("y", ".31em")
                        .attr("class", "shadow")
                        .text( d.name);

                    //d3.selectAll("text").remove();
                    d3.select(this).style("stroke-width", 6);

                    d3.select(this).style("stroke", "blue");

                    var nodeNeighbors = links.filter(function(link) {
                        // Filter the list of links to only those links that have our target
                        // node as a source or target
                        return link.source.index === d.index || link.target.index === d.index;})
                        .map(function(link) {
                            // Map the list of links to a simple array of the neighboring indices - this is
                            // technically not required but makes the code below simpler because we can use
                            // indexOf instead of iterating and searching ourselves.
                            return link.source.index === d.index ? link.target.index : link.source.index; });

                    d3.selectAll('circle').filter(function(node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    })
                        .style('stroke', 'blue')

                    //d3.selectAll('text').filter(d).style('fill', 'blue');

                    d3.selectAll('text').filter(function(node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    }).style('fill', 'blue')
                        //.style("font-size", "16px")
                        .style("font-weight", "bold");

                    path.style('stroke', function(l) {
                        if (d === l.source || d === l.target)
                            return "blue";
                        else
                        return "grey";
                    })

                    path.style('stroke-width', function(l) {
                        if (d === l.source || d === l.target)
                            return 3;
                        else
                            return 1;
                    })

                })
                .on("mouseout",  function(d) {
                    //d3.select(this).classed("hover", false);
                    // if(isConnected(d, o)) {
                    //svg.selectAll('circle').style('stroke', 'black');
                    d3.select(this).style("stroke-width", 3);
                    d3.select(this).style("stroke", "#333");
                    // d3.select(this).select("circle").style("stroke", "black");
                    // d3.select(this).select("text").style("font", "12px sans-serif");
                    // d3.selectAll("rect." + d.location).style("stroke-width", 1);
                    // d3.selectAll("rect." + d.location).style("stroke", "gray");
                    // d3.selectAll("text." + d.location).style("font", "12px sans-serif");
                    // d3.selectAll("tr." + d.name).style("background-color", "white");
                    path.style('stroke', "grey");
                    path.style('stroke-width', 1);
                    //circle.style('stroke', "grey");
                    circle.style("stroke-width", 3);
                    circle.style("stroke", "#333");
                    d3.selectAll('text').style('fill', 'black')
                    .style("font-weight", "normal");
                    //.style("font-size", "12px");
                    //}
                });


            function pythag(r, b, coord) {
                r += nodeBaseRad;

                // force use of b coord that exists in circle to avoid sqrt(x<0)
                b = Math.min(w - r - strokeWidth, Math.max(r + strokeWidth, b));

                var b2 = Math.pow((b - radius), 2),
                    a = Math.sqrt(hyp2 - b2);

                // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
                coord = Math.max(radius - a + r + strokeWidth,
                    Math.min(a + radius - r - strokeWidth, coord));

                return coord;
            }

            function tick(e) {
                path.attr("d", function(d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,

                        dr = Math.sqrt(dx * dx + dy * dy);
                    //console.log(d.source.x);
                    // console.log(d.target.x);
                    return "M" + d.source.x + "," + d.source.y + ","+ d.target.x + "," + d.target.y;
                    //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                });

                circle.attr('x', function (d) { return d.x = pythag(Math.random() * 12, d.y, d.x); })
                    .attr('y', function (d) { return d.y = pythag(Math.random() * 12, d.x, d.y); })
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")"});

                // circle.attr("transform", function(d) {
                //     return "translate(" + d.x + "," + d.y + ")";
                // });

                text.attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            }
            //For not moving after drag
            var drag = force.drag()
                .on("dragstart", dragstart);

            //For not moving after drag
            function dblclick(d) {
                d3.select(this).classed("fixed", d.fixed = false);
            }
            //For not moving after drag
            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);
                for (var i=0;i<nodes.length;i++){nodes[i].fixed = true;}
            }


            // For legend
            var colNodeScaleSeparateInfo = d3.scale.ordinal()
                .range(["#767776", "#f91104"])
                .domain(["Query Gene Set","Pathways / Kinases Perturbation"]);


            var legend = svg.selectAll(".legend")
                .data(colNodeScaleSeparateInfo.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + (i) * 25 + ")"; });

            legend.append("rect")
                .attr("x", w - 25)
                .attr("width",  25)
                .attr("height",  25)
                .style("fill", colNodeScaleSeparateInfo);

            legend.append("text")
                .attr("x", w - 35)
                .attr("y", 12.5)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });

            d3.select("#download").on("click", function(){
                d3.select(this)
                    .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart").html()))
                    .attr("download", "pathway_network.svg")
            })
        }



        function updateKinase(nodes, links) {
            // d3.select("svg").remove();
            svg2.remove();
            console.log("In update kinase")
            var margin = 100,
                w = 1500 -2*margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;

            svg2 = d3.select("#chart2")
                .append("svg")
                .attr("style", "outline: thin solid blue;")
                .attr("width", w)
                .attr("height", h);

            // var pool = svg.append('circle')
            //     .style('stroke-width', strokeWidth * 2)
            //     .style('stroke-width', strokeWidth * 2)
            //     .attr({
            //         class: 'pool',
            //         r: radius,
            //         index: -1,
            //         cy: 0,
            //         cx: 0,
            //         transform: 'translate(' + w / 2 + ',' + h / 2 + ')'
            //     });

            force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h])
                .gravity(.25)
                .linkDistance(100)
                .charge(-500)
                //.gravity(0.05)
                .on("tick", tick)
                .start();


            xScale.domain(d3.extent(nodes, function (d) { return d.weight; }));
            colNodeScaleSeparate.domain(d3.extent(nodes, function (d) { return d.group; }));
            colScale.domain(d3.extent(links, function (d) { return d.weight; }));



//             function linkMouseover(d){
//                 chart.selectAll(".node").classed("active", function(p) { return d3.select(this).classed("active") || p === d.source || p === d.target; });
//             }
// // Highlight the node and connected links on mouseover.
//             function nodeMouseover(d) {
//                 chart.selectAll(".link").classed("active", function(p) { return d3.select(this).classed("active") || p.source === d || p.target === d; });
//                 chart.selectAll(".link.active").each(function(d){linkMouseover(d)})
//                 d3.select(this).classed("active", true);
//             }



            svg2.append('defs').append('marker')
                .attr({'id':'arrowhead',
                    'viewBox':'-0 -5 10 10',
                    'refX':25,
                    'refY':0,
                    //'markerUnits':'strokeWidth',
                    'orient':'auto',
                    'markerWidth':5,
                    'markerHeight':6,
                    'xoverflow':'visible'})
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', 'black')
                .attr('stroke','#ccc');


            var path = svg2.append("svg:g").selectAll("path")
            //.data(links)
                .data(force.links())
                .enter().append("svg:path")
                .style("stroke", function (d) {return colScale(d.value); })
                //.attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
                .attr("class", function(d) { return "link "; })
                .attr('marker-end','url(#arrowhead)');
                //.attr("marker-end", "url(#arrow)");


            var text = svg2.append("svg:g").selectAll("g")
                .data(force.nodes())
                .enter().append("svg:g");
            // .on("mouseover", function(d) {
            //
            //     )};

            // A copy of the text with a thick white stroke for legibility.
            text.append("svg:text")
                .attr("x", 12)
                .attr("y", ".31em")
                .attr("class", "shadow")
                .text(function(d) { return d.name; });

            text.append("svg:text")
                .attr("x", 12)
                .attr("y", ".31em")
                .text(function(d) { return d.name; });
            // .on("mouseover", function(){ console.log("mouseOver"); d3.select(this).select("text").style("fill", "#000");} )
            // .on("mouseout", function(){ console.log("mouseOut"); d3.select(this).select("text").style("fill", "#ccc");} ); ;

            // function randomNodes(n) {
            //     var data = [],
            //         range = d3.range(n);
            //
            //     for (var i = range.length - 1; i >= 0; i--) {
            //         data.push({
            //             rad: Math.floor(Math.random() * 12)
            //         });
            //     }
            //     return data;
            // }


            // var city = svg.selectAll(".city")
            //     .data(cities)
            //     .enter().append("g")
            //     .attr("class", "city");
            //
            // city.append("path")
            //     .attr("class", "line")
            //     .attr("d", function(d) { return line(d.values); })
            //     .attr("data-legend",function(d) { return d.name})
            //     .style("stroke", function(d) { return color(d.name); });


            var circle = svg2.append("svg:g").selectAll("circle")
            //.data(nodes)
                .data(force.nodes())
                .enter().append("svg:circle")
                .attr("r", function (d) { return xScale(d.weight); })
                //.attr("data-legend",function(d) { return d.group})
                .style("fill", function(d) { return colNodeScaleSeparate(d.group); })
                //.style("fill", function(d) { return color(d.type); })
                .on("dblclick", dblclick)
                .call(force.drag)

                //.call(drag)

                .on("mouseover", function(d) {
                    d3.select(this).append("text")
                        .attr("x", 12)
                        .attr("y", ".31em")
                        .attr("class", "shadow")
                        .text( d.name);

                    //d3.selectAll("text").remove();
                    d3.select(this).style("stroke-width", 6);

                    d3.select(this).style("stroke", "blue");

                    var nodeNeighbors = links.filter(function(link) {
                        // Filter the list of links to only those links that have our target
                        // node as a source or target
                        return link.source.index === d.index || link.target.index === d.index;})
                        .map(function(link) {
                            // Map the list of links to a simple array of the neighboring indices - this is
                            // technically not required but makes the code below simpler because we can use
                            // indexOf instead of iterating and searching ourselves.
                            return link.source.index === d.index ? link.target.index : link.source.index; });

                    d3.selectAll('circle').filter(function(node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    })
                        .style('stroke', 'blue')

                    //d3.selectAll('text').filter(d).style('fill', 'blue');

                    d3.selectAll('text').filter(function(node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    }).style('fill', 'blue')
                    //.style("font-size", "16px")
                        .style("font-weight", "bold");

                    path.style('stroke', function(l) {
                        if (d === l.source || d === l.target)
                            return "blue";
                        else
                            return "grey";
                    })

                    path.style('stroke-width', function(l) {
                        if (d === l.source || d === l.target)
                            return 3;
                        else
                            return 1;
                    })

                })
                .on("mouseout",  function(d) {
                    //d3.select(this).classed("hover", false);
                    // if(isConnected(d, o)) {
                    //svg.selectAll('circle').style('stroke', 'black');
                    d3.select(this).style("stroke-width", 3);
                    d3.select(this).style("stroke", "#333");
                    // d3.select(this).select("circle").style("stroke", "black");
                    // d3.select(this).select("text").style("font", "12px sans-serif");
                    // d3.selectAll("rect." + d.location).style("stroke-width", 1);
                    // d3.selectAll("rect." + d.location).style("stroke", "gray");
                    // d3.selectAll("text." + d.location).style("font", "12px sans-serif");
                    // d3.selectAll("tr." + d.name).style("background-color", "white");
                    path.style('stroke', "grey");
                    path.style('stroke-width', 1);
                    //circle.style('stroke', "grey");
                    circle.style("stroke-width", 3);
                    circle.style("stroke", "#333");
                    d3.selectAll('text').style('fill', 'black')
                        .style("font-weight", "normal");
                    //.style("font-size", "12px");
                    //}
                });


            function pythag(r, b, coord) {
                r += nodeBaseRad;

                // force use of b coord that exists in circle to avoid sqrt(x<0)
                b = Math.min(w - r - strokeWidth, Math.max(r + strokeWidth, b));

                var b2 = Math.pow((b - radius), 2),
                    a = Math.sqrt(hyp2 - b2);

                // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
                coord = Math.max(radius - a + r + strokeWidth,
                    Math.min(a + radius - r - strokeWidth, coord));

                return coord;
            }

            function tick(e) {
                path.attr("d", function(d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy),
                        drx = dr,
                        dry = dr,
                        xRotation = 0, // degrees
                        largeArc = 0, // 1 or 0
                        sweep = 1, // 1 or 0
                    x2 = d.target.x,
                    y2 = d.target.y;
                    //console.log(d.source.x);
                    // console.log(d.target.x);

                    if ( d.target.x === d.source.x && d.target.y === d.source.y ) {
                        // Fiddle with this angle to get loop oriented.
                        xRotation = -45;

                        // Needs to be 1.
                        largeArc = 1;

                        // Change sweep to change orientation of loop.
                        //sweep = 0;

                        // Make drx and dry different to get an ellipse
                        // instead of a circle.
                        drx = 30;
                        dry = 20;

                        // For whatever reason the arc collapses to a point if the beginning
                        // and ending points of the arc are the same, so kludge it.
                        x2 = d.target.x + 1;
                        y2 = d.target.y + 1;
                    }

                    return "M" + d.source.x + "," + d.source.y + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;


                    //return "M" + d.source.x + "," + d.source.y + ","+ d.target.x + "," + d.target.y;
                    //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                });

                circle.attr('x', function (d) { return d.x = pythag(Math.random() * 12, d.y, d.x); })
                    .attr('y', function (d) { return d.y = pythag(Math.random() * 12, d.x, d.y); })
                    .attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")"});

                // circle.attr("transform", function(d) {
                //     return "translate(" + d.x + "," + d.y + ")";
                // });

                text.attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
            }

            //For not moving after drag
            var drag = force.drag()
                .on("dragstart", dragstart);

            //For not moving after drag
            function dblclick(d) {
                d3.select(this).classed("fixed", d.fixed = false);
            }
            //For not moving after drag
            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);
                for (var i=0;i<nodes.length;i++){nodes[i].fixed = true;}
            }


            // For legend
            var colNodeScaleSeparateInfo = d3.scale.ordinal()
                .range(["#767776", "#f91104", "#0af702"])
                .domain(["Query Gene Set","Activating Kinases, Phosphorylating the Query Gene Set","Down Stream Gene Sets, Phosphorylated by the Gene Set"]);


            var legend = svg2.selectAll(".legend")
                .data(colNodeScaleSeparateInfo.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + (i) * 25 + ")"; });

            legend.append("rect")
                .attr("x", w - 25)
                .attr("width",  25)
                .attr("height",  25)
                .style("fill", colNodeScaleSeparateInfo);

            legend.append("text")
                .attr("x", w - 35)
                .attr("y", 12.5)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; });






            d3.select("#download2").on("click", function(){
                d3.select(this)
                    .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart2").html()))
                    .attr("download", "kinase_network.svg")
            })
        }


        // Enrichr pathway analysis

        $http.get("api/network/genes/" + self.parsedGenes)
            .success(function (apiNetwork) {

                self.network = apiNetwork;
                console.log(self.network);


                $scope.pathways = [
                    {value : "KEGG_2013"},
                    {value : "KEGG_2015"},
                    {value : "KEGG_2016"},
                    {value : "WikiPathways_2013"},
                    {value : "WikiPathways_2015"},
                    {value : "WikiPathways_2016"},
                    {value : "Panther_2015"},
                    {value : "Panther_2016"},
                    {value : "Kinase_Perturbations_from_GEO"}
                ];
                $scope.selectedPathways = $scope.pathways[2];
                var network = self.network.KEGG_2016;
                update(network.nodes, network.edges);
                $scope.changedValue=function(item){
                    //var net = item.value;
                    console.log(item);
                    console.log(item.value);
                    var net = item.value.toString();
                    console.log(net);

                    var network = self.network[net];
                    console.log('network');
                    console.log(network);
                    update(network.nodes, network.edges);
                    //$scope.itemList.push(item.value);
                }

                console.log(self.network);

            })
            .error(function () {
                console.log("Error in obtaining network from api/network/genes/");
            });


        // Kinase pathway analysis

        $http.get("api/kinase/genes/" + self.parsedGenes)
            .success(function (apiKinaseNetwork) {
                console.log("kinaseNetwork");
                self.kinaseNetwork = apiKinaseNetwork;
                console.log(self.kinaseNetwork);

                updateKinase(self.kinaseNetwork.nodes, self.kinaseNetwork.edges);

                console.log(self.kinaseNetwork);

            })
            .error(function () {
                console.log("Error in obtaining network from api/kinase/genes/");
            });

        self.waitingPathway = false;
        self.showOutputPathway = true;
        // self.waitingPathway = false;
        // self.showOutputPathway = true;
    }








    // $scope.showMoreFunc = function(view) {
    //     $scope.display.appliedsciences = (view == "appliedsciences" && !$scope.display.appliedsciences);
    //     $scope.display.academic = (view == "academic" && !$scope.display.academic);
    //
    //     /*
    //      if(view == "appliedsciences") {
    //      if($scope.display.appliedsciences) {
    //      $scope.display.appliedsciences = false;
    //      } else {
    //      $scope.display.appliedsciences = true;
    //      $scope.display.academic = false;
    //      }
    //      } else {
    //      if($scope.display.academic) {
    //      $scope.display.academic = false;
    //      } else {
    //      $scope.display.appliedsciences = false;
    //      $scope.display.academic = true;
    //      }
    //      }*/
    // }


}]);
