/**
 * Created by Behrouzsh on 12/7/16.
 */
//var appModule = angular.module('plpModule', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
var appModule = angular.module('plpModule', ['mgcrea.ngStrap']);


appModule.controller('DataViewCtrl', ['$scope', '$location', '$http', '$timeout', function ($scope, $templateCache, $http, $timeout) {

    'use strict';

//This is for showing nav-bar header in scroll down
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 800) {
            $('.topMenu').fadeIn();

        } else {
            $('.topMenu').fadeOut();

        }

    });
    //Start of script from guide ========================

    // iPad and iPod detection
    var isiPad = function () {
        return (navigator.platform.indexOf("iPad") != -1);
    };

    var isiPhone = function () {
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    };

    // Go to next section
    var gotToNextSection = function () {
        var el = $('.fh5co-learn-more'),
            w = el.width(),
            divide = -w / 2;
        el.css('margin-left', divide);
    };

    // Loading page
    var loaderPage = function () {
        $(".fh5co-loader").fadeOut("slow");
    };

    // FullHeight
    var fullHeight = function () {
        if (!isiPad() && !isiPhone()) {
            $('.js-fullheight').css('height', $(window).height() - 49);
            $(window).resize(function () {
                $('.js-fullheight').css('height', $(window).height() - 49);
            })
        }
    };

    var toggleBtnColor = function () {


        if ($('#fh5co-hero').length > 0) {
            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'down') {
                    $('.fh5co-nav-toggle').addClass('dark');
                }
            }, {offset: -$('#fh5co-hero').height()});

            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'up') {
                    $('.fh5co-nav-toggle').removeClass('dark');
                }
            }, {
                offset: function () {
                    return -$(this.element).height() + 0;
                }
            });
        }


    };


    // Scroll Next
    var ScrollNext = function () {
        $('body').on('click', '.scroll-btn', function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: $($(this).closest('[data-next="yes"]').next()).offset().top
            }, 1000, 'easeInOutExpo');
            return false;
        });
    };

    // Click outside of offcanvass
    var mobileMenuOutsideClick = function () {

        $(document).click(function (e) {
            var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas-visible')) {

                    $('body').removeClass('offcanvas-visible');
                    $('.js-fh5co-nav-toggle').removeClass('active');

                }


            }
        });

    };


    // Offcanvas
    var offcanvasMenu = function () {
        $('body').prepend('<div id="fh5co-offcanvas" />');
        $('#fh5co-offcanvas').prepend('<ul id="fh5co-side-links">');
        $('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');

        $('.left-menu li, .right-menu li').each(function () {

            var $this = $(this);

            $('#fh5co-offcanvas ul').append($this.clone());

        });
    };

    // Burger Menu
    var burgerMenu = function () {

        $('body').on('click', '.js-fh5co-nav-toggle', function (event) {
            var $this = $(this);

            $('body').toggleClass('fh5co-overflow offcanvas-visible');
            $this.toggleClass('active');
            event.preventDefault();

        });

        $(window).resize(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

        $(window).scroll(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

    };


    var testimonialFlexslider = function () {
        var $flexslider = $('.flexslider');
        $flexslider.flexslider({
            animation: "fade",
            manualControls: ".flex-control-nav li",
            directionNav: false,
            smoothHeight: true,
            useCSS: false /* Chrome fix*/
        });
    }


    var goToTop = function () {

        $('.js-gotop').on('click', function (event) {

            event.preventDefault();

            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500);

            return false;
        });

    };


    // Animations

    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            el.addClass('fadeInUp animated');
                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, {offset: '95%'});
    };


    // Document on load.
    $(function () {
        gotToNextSection();
        loaderPage();
        fullHeight();
        toggleBtnColor();
        ScrollNext();
        mobileMenuOutsideClick();
        offcanvasMenu();
        burgerMenu();
        testimonialFlexslider();
        goToTop();

        // Animate
        contentWayPoint();

    });


    var self = this;
    self.showSVG = false;
    self.initNetworkJSON = {};
    self.perturbJSON = {};
    self.P100ProcessedJSON = {};

    $scope.initNetworkApi = function () {

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


    function callPilincsPerturbagen(inputPert) {

        console.log("in callPilincsPerturbagen");
        console.log("input");
        console.log(inputPert);
        self.showTable = false;
        self.showSVG = false;
        //*************** HeatMap Stuff ***************************
        //*************** HeatMap Stuff ***************************
        //*************** HeatMap Stuff ***************************
        var margin = {top: 50, right: 0, bottom: 100, left: 400},
            width = 960 - margin.left - margin.right,
            height = 2400 - margin.top - margin.bottom,
            height_legend = margin.bottom,
            gridSize = Math.floor(width / 24),
            legendElementWidth = gridSize * 1.15 * 2,
            buckets = 7,
            colors = ["#0c02fc", "#6e68f9", "#b2aff7", "#f9f9f7", "#fcfaa6", "#f9f657", "#fffa00"]; // alternatively colorbrewer.YlGnBu[9]
        //     days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        //     times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
        // //datasets = ["heatmap_data.tsv", "data2.tsv"];

        var svg = d3.select("#chart2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        self.pertAnnotation = [];
        var heatmapChart = function (perturbagen) {

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
                .text(function (d) {
                    return d;
                })
                .attr("x", 0)
                .attr("y", function (d, i) {
                    return i * gridSize;
                })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")");
            //.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "pepLabel mono axis axis-workweek" : "pepLabel mono axis"); });

            var pertLabels = svg.selectAll(".pertLabel")
                .data(perturbagen.pertId)
                .enter().append("text")
                .text(function (d) {
                    return d
                })
                .attr("x", function (d, i) {
                    return i * gridSize;
                })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)");

            //.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "pertLabel mono axis axis-worktime" : "pertLabel mono axis"); });


            // console.log(input);
            // console.log(error);
            var data = perturbagen.pertData;
            console.log(data);
            var min_data = d3.min(data, function (d) {
                return d.value;
            });
            var max_data = d3.max(data, function (d) {
                return d.value;
            });
            max_data = max_data + 0.01;
            min_data = min_data - 0.01;
            var domain_data = [min_data + (max_data - min_data) / 7, min_data + 2 * (max_data - min_data) / 7, min_data + 3 * (max_data - min_data) / 7, min_data + 4 * (max_data - min_data) / 7, min_data + 5 * (max_data - min_data) / 7, min_data + 6 * (max_data - min_data) / 7, max_data];
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

            // console.log("colorScale");
            // console.log(colorScale);
            var cards = svg.selectAll(".pertId")
                .data(data, function (d) {
                    return d.pepId + ':' + d.pertId;
                });

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function (d) {
                    return (d.pertId - 1) * gridSize;
                })
                .attr("y", function (d) {
                    return (d.pepId - 1) * gridSize;
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

            cards.transition().duration(1000)
                .style("fill", function (d) {
                    return colorScale(d.value);
                });

            cards.select("title").text(function (d) {
                return d.value;
            });

            cards.exit().remove();

            // var legend = svg.selectAll(".legend")
            //     .data([min_data].concat(colorScale.quantiles()), function(d) { return d; });

            var legend = svg.selectAll(".legend")
                .data([min_data, min_data + (max_data - min_data) / 7, min_data + 2 * (max_data - min_data) / 7, min_data + 3 * (max_data - min_data) / 7, min_data + 4 * (max_data - min_data) / 7, min_data + 5 * (max_data - min_data) / 7, min_data + 6 * (max_data - min_data) / 7], function (d) {
                    return d;
                });

            // console.log("colorScale.quantiles()");
            // console.log(colorScale.quantiles());
            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function (d, i) {
                    return legendElementWidth * i;
                })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function (d, i) {
                    return colors[i];
                });

            legend.append("text")
            //.attr("class", "mono")
                .text(function (d) {
                    return "≥ " + parseFloat(Math.round(d * 100) / 100).toFixed(2);
                })
                .attr("x", function (d, i) {
                    return legendElementWidth * i;
                })
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
        }
        ;
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
    var timeout;
    self.initNetworkJSON = {};
    self.perturbJSON = {};
    self.P100ProcessedJSON = {};
    self.showP100Table = false;
//This is for showing nav-bar header in scroll down
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 800) {
            $('.topMenu').fadeIn();

        } else {
            $('.topMenu').fadeOut();

        }

    });
    //Start of script from guide ========================

    // iPad and iPod detection
    var isiPad = function () {
        return (navigator.platform.indexOf("iPad") != -1);
    };

    var isiPhone = function () {
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    };

    // Go to next section
    var gotToNextSection = function () {
        var el = $('.fh5co-learn-more'),
            w = el.width(),
            divide = -w / 2;
        el.css('margin-left', divide);
    };

    // Loading page
    var loaderPage = function () {
        $(".fh5co-loader").fadeOut("slow");
    };

    // FullHeight
    var fullHeight = function () {
        if (!isiPad() && !isiPhone()) {
            $('.js-fullheight').css('height', $(window).height() - 49);
            $(window).resize(function () {
                $('.js-fullheight').css('height', $(window).height() - 49);
            })
        }
    };

    var toggleBtnColor = function () {


        if ($('#fh5co-hero').length > 0) {
            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'down') {
                    $('.fh5co-nav-toggle').addClass('dark');
                }
            }, {offset: -$('#fh5co-hero').height()});

            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'up') {
                    $('.fh5co-nav-toggle').removeClass('dark');
                }
            }, {
                offset: function () {
                    return -$(this.element).height() + 0;
                }
            });
        }


    };


    // Scroll Next
    var ScrollNext = function () {
        $('body').on('click', '.scroll-btn', function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: $($(this).closest('[data-next="yes"]').next()).offset().top
            }, 1000, 'easeInOutExpo');
            return false;
        });
    };

    // Click outside of offcanvass
    var mobileMenuOutsideClick = function () {

        $(document).click(function (e) {
            var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas-visible')) {

                    $('body').removeClass('offcanvas-visible');
                    $('.js-fh5co-nav-toggle').removeClass('active');

                }


            }
        });

    };


    // Offcanvas
    var offcanvasMenu = function () {
        $('body').prepend('<div id="fh5co-offcanvas" />');
        $('#fh5co-offcanvas').prepend('<ul id="fh5co-side-links">');
        $('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');

        $('.left-menu li, .right-menu li').each(function () {

            var $this = $(this);

            $('#fh5co-offcanvas ul').append($this.clone());

        });
    };

    // Burger Menu
    var burgerMenu = function () {

        $('body').on('click', '.js-fh5co-nav-toggle', function (event) {
            var $this = $(this);

            $('body').toggleClass('fh5co-overflow offcanvas-visible');
            $this.toggleClass('active');
            event.preventDefault();

        });

        $(window).resize(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

        $(window).scroll(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

    };


    var testimonialFlexslider = function () {
        var $flexslider = $('.flexslider');
        $flexslider.flexslider({
            animation: "fade",
            manualControls: ".flex-control-nav li",
            directionNav: false,
            smoothHeight: true,
            useCSS: false /* Chrome fix*/
        });
    }


    var goToTop = function () {

        $('.js-gotop').on('click', function (event) {

            event.preventDefault();

            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500);

            return false;
        });

    };


    // Animations

    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            el.addClass('fadeInUp animated');
                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, {offset: '95%'});
    };


    // Document on load.
    $(function () {
        gotToNextSection();
        loaderPage();
        fullHeight();
        toggleBtnColor();
        ScrollNext();
        mobileMenuOutsideClick();
        offcanvasMenu();
        burgerMenu();
        testimonialFlexslider();
        goToTop();

        // Animate
        contentWayPoint();

    });








    function callPilincsPerturbagen(inputPert) {

        console.log("in callPilincsPerturbagen");
        console.log("input");
        console.log(inputPert);
        self.showTable = false;
        self.showSVG = false;

        //*************** HeatMap Stuff ***************************
        //*************** HeatMap Stuff ***************************
        //*************** HeatMap Stuff ***************************
        var margin = {top: 50, right: 0, bottom: 100, left: 400},
            width = 960 - margin.left - margin.right,
            height = 2400 - margin.top - margin.bottom,
            height_legend = margin.bottom,
            gridSize = Math.floor(width / 24),
            legendElementWidth = gridSize * 1.15 * 2,
            buckets = 7,
            colors = ["#0c02fc", "#6e68f9", "#b2aff7", "#f9f9f7", "#fcfaa6", "#f9f657", "#fffa00"]; // alternatively colorbrewer.YlGnBu[9]
        //     days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        //     times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
        // //datasets = ["heatmap_data.tsv", "data2.tsv"];

        var svg = d3.select("#chart2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        self.pertAnnotation = [];
        var heatmapChart = function (perturbagen) {

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
                .text(function (d) {
                    return d;
                })
                .attr("x", 0)
                .attr("y", function (d, i) {
                    return i * gridSize;
                })
                .style("text-anchor", "end")
                .attr("transform", "translate(-6," + gridSize / 1.5 + ")");
            //.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "pepLabel mono axis axis-workweek" : "pepLabel mono axis"); });

            var pertLabels = svg.selectAll(".pertLabel")
                .data(perturbagen.pertId)
                .enter().append("text")
                .text(function (d) {
                    return d
                })
                .attr("x", function (d, i) {
                    return i * gridSize;
                })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .attr("transform", "translate(" + gridSize / 2 + ", -6)");

            //.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "pertLabel mono axis axis-worktime" : "pertLabel mono axis"); });


            // console.log(input);
            // console.log(error);
            var data = perturbagen.pertData;
            console.log(data);
            var min_data = d3.min(data, function (d) {
                return d.value;
            });
            var max_data = d3.max(data, function (d) {
                return d.value;
            });
            max_data = max_data + 0.01;
            min_data = min_data - 0.01;
            var domain_data = [min_data + (max_data - min_data) / 7, min_data + 2 * (max_data - min_data) / 7, min_data + 3 * (max_data - min_data) / 7, min_data + 4 * (max_data - min_data) / 7, min_data + 5 * (max_data - min_data) / 7, min_data + 6 * (max_data - min_data) / 7, max_data];
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

            // console.log("colorScale");
            // console.log(colorScale);
            var cards = svg.selectAll(".pertId")
                .data(data, function (d) {
                    return d.pepId + ':' + d.pertId;
                });

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function (d) {
                    return (d.pertId - 1) * gridSize;
                })
                .attr("y", function (d) {
                    return (d.pepId - 1) * gridSize;
                })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

            cards.transition().duration(1000)
                .style("fill", function (d) {
                    return colorScale(d.value);
                });

            cards.select("title").text(function (d) {
                return d.value;
            });

            cards.exit().remove();

            // var legend = svg.selectAll(".legend")
            //     .data([min_data].concat(colorScale.quantiles()), function(d) { return d; });

            var legend = svg.selectAll(".legend")
                .data([min_data, min_data + (max_data - min_data) / 7, min_data + 2 * (max_data - min_data) / 7, min_data + 3 * (max_data - min_data) / 7, min_data + 4 * (max_data - min_data) / 7, min_data + 5 * (max_data - min_data) / 7, min_data + 6 * (max_data - min_data) / 7], function (d) {
                    return d;
                });

            // console.log("colorScale.quantiles()");
            // console.log(colorScale.quantiles());
            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function (d, i) {
                    return legendElementWidth * i;
                })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function (d, i) {
                    return colors[i];
                });

            legend.append("text")
            //.attr("class", "mono")
                .text(function (d) {
                    return "≥ " + parseFloat(Math.round(d * 100) / 100).toFixed(2);
                })
                .attr("x", function (d, i) {
                    return legendElementWidth * i;
                })
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


    $scope.updatePerturbagen = function (inputPerturbagen) {
        self.showP100Table = false;
        console.log("in updatePerturbagen");
        self.selectedPerturbation = inputPerturbagen;
        var localPerturbagen = self.selectedPerturbation;
        console.log("Before callPilincsPerturbagen");
        console.log("input");
        console.log(self.selectedPerturbation);
        console.log(localPerturbagen);
        console.log(self.P100ProcessedJSON);
        console.log(self.P100ProcessedJSON[localPerturbagen]);


            self.pertTable = self.P100ProcessedJSON[localPerturbagen].pertAnnotation;
            self.showP100Table = true;

            //d3.select("svg").remove();
            //callPilincsPerturbagen(self.P100ProcessedJSON[localPerturbagen]);



        //$timeout(callPilincsPerturbagen(self.P100ProcessedJSON.localPerturbagen), 20000);
    };

    // $scope.$watch(function () {
    //
    //     return self.selectedPerturbation;
    // }, function (newVal, oldVal) {
    //     self.showTable = false;
    //     var localPerturbagen = self.selectedPerturbation;
    //     console.log("Before callPilincsPerturbagen");
    //     console.log("input");
    //     console.log(self.selectedPerturbation);
    //     console.log(localPerturbagen);
    //     console.log(self.P100ProcessedJSON);
    //     console.log(self.P100ProcessedJSON[localPerturbagen]);
    //     if (timeout) {
    //         $timeout.cancel(timeout);
    //     }
    //     ;
    //     $timeout(function () {
    //         console.log("In timeout");
    //         console.log(self.selectedPerturbation);
    //         console.log(localPerturbagen);
    //         console.log(self.P100ProcessedJSON);
    //         console.log(self.P100ProcessedJSON[localPerturbagen]);
    //         self.pertTable = self.P100ProcessedJSON[localPerturbagen].pertAnnotation;
    //         self.showTable = true;
    //         d3.select("svg").remove();
    //         callPilincsPerturbagen(self.P100ProcessedJSON[localPerturbagen]);
    //     }, 1100);
    //
    //
    //     //function() { callPilincsPerturbagen(self.P100ProcessedJSON.localPerturbagen) }, 20000);
    //     console.log("Before callPilincsPerturbagen Again");
    //     console.log("input  Again");
    //     console.log(self.selectedPerturbation);
    //     console.log(localPerturbagen);
    //     console.log(self.P100ProcessedJSON);
    //     console.log(self.P100ProcessedJSON.localPerturbagen);
    //     //$timeout(callPilincsPerturbagen(self.P100ProcessedJSON.localPerturbagen), 20000);
    // });

    self.showSVG = true;



    $scope.initNetworkApi = function () {

        $http.get('/lincsproteomics/data/P100_processed_perturb_new.json').success(function (data) {
            self.P100ProcessedJSON = data;
            console.log(self.P100ProcessedJSON);
            console.log(self.P100ProcessedJSON.Trametinib);
            self.selectedPerturbation = 'Trametinib';
            $scope.perturbation = self.P100ProcessedJSON.uniquePert;
        });

        $http.get('/lincsproteomics/data/assay-view.json').success(function (data) {
            self.assayData = data;
            console.log(self.assayData);
            console.log(self.assayData.GCP);

        });

        $http.get('/lincsproteomics/data/P100_ptm_to_peptide_to_abundance.json').success(function (data) {
            self.ptmToPeptideToAbundance = data;
            console.log("ptmToPeptideToAbundance");
            console.log(self.ptmToPeptideToAbundance);


        });

        $http.get('/lincsproteomics/data/phospho_network_p100_new.json').success(function (data) {
            self.p100phospho = data;
            console.log("p100phospho");
            console.log(self.p100phospho);


        });

        $http.get('/lincsproteomics/data/gcp-assay-view.json').success(function (data) {
            self.gcpData = data;
            console.log("gcpData");
            console.log(self.gcpData);


        });
        self.selectedPerturbation = 'Trametinib';
    };


    var svg = d3.selectAll("#chart5").append("svg");

    $scope.showGCPNetwork = function (item) {
        //var net = item.value;

        //var net = item.value;
        console.log(item);
        //console.log(item.value);
        var net = item.toString();
        console.log(net);


        // {value: "Known+Predicted_Probability_Kinase_TargetGene"}
        // ];
        //


        if (net === "GCP") {

            self.showP100div = false;
            self.showGCPdiv = true;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
        }



        var xScale = d3.scale.linear().range([5, 15]);
        // var colNodeScaleSeparate = d3.scale.ordinal()
        //     .range(["#767776", "#f91104", "#0af702"])
        //     .domain([0, 1, 2]);

        var colNodeScale = d3.scale.ordinal()
            .range(["Grey", "Purple", "Blue", "Red", "Yellow", "Green", "DarkOrange"])
            .domain([0, 1, 2, 3, 4, 5, 6]);
        // var colNodeScale = d3.scale.linear().range(["grey", "red"]);
        //var colScale = d3.scale.linear().range(["grey", "red"]);
        var edgeWeightScale = d3.scale.linear().range([0.5, 1]);

        function updateGCP(nodes, links) {
            //
            //var svg;
            //svg.remove();
            var force;



            d3.select("svg").remove();

            //d3.select('#circularView1').on('click', function() {
            //svg.remove();


            var margin = 75,
                w = 1550 - 2 * margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;


            svg = d3.select("#chart5")
                .append("svg")
                //.attr("style", "outline: thin solid yellow;")
                .attr("width", w)
                .attr("height", h);
            // svg.append("rect")
            //     .attr("width", "100%")
            //     .attr("height", "100%")
            //     .attr("fill", "white");


            // This is for grouping nodes


            var force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h]);

            colNodeScale.domain(d3.extent(nodes, function (d) {
                return d.group;
            }));
            // colScale.domain(d3.extent(links, function (d) {
            //     return d.weight;
            // }));
            xScale.domain(d3.extent(nodes, function (d) {
                return d.weight;
            }));

            var groupId = [];
            var maxId = 0;
            for (var i = 0; i < nodes.length; i++){
                var item = nodes[i];

                if (!groupId[item.group]){
                    groupId[item.group] = [];
                }

                groupId[item.group].push({name: item.name});
                // console.log(item.group);
                // console.log(groupId[item.group]);
                if (maxId < item.group){
                    maxId = item.group;
                }
            }
            console.log(maxId);
            console.log(groupId[0]);
            console.log(groupId[0].length);
            console.log(groupId[2]);

            var n1 = groupId[0].length;
            var n2 = groupId[2].length;
            console.log(n1);
            console.log(n2);



// evenly spaces nodes along arc
            var circleCoord = function (node, index, num_nodes) {
                var circumference = circle.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circle.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            // evenly spaces nodes along arc
            var circleCoordInner = function (node, index, num_nodes) {
                var circumference = circleInner.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circleInner.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            // evenly spaces nodes along arc
            var circleCoordOuter = function (node, index, num_nodes) {
                var circumference = circleOuter.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circleOuter.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            var is_connected = function (d, opacity) {
                lines.transition().style("stroke-opacity", function (o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
                //     lines.transition().style("stroke", function (o) {
                //         return o.source === d || o.target === d ? 2 : 1;
                //     });
            }

            var dim = w - 400;
            var circle = svg.append("path")
                .attr("d", "M 200, " + (dim / 2 + 200) + " a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim + ",0 a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim * -1 + ",0")
                .style("fill", "#f5f5f5");

            var dimInner = w - 400;
            var circleInner = svg.append("path")
                .attr("d", "M 200, " + (dimInner / 2 + 200) + " a " + dimInner / 2 + "," + dimInner / 2 + " 0 1,0 " + dimInner + ",0 a " + dimInner / 2 + "," + dimInner / 2 + " 0 1,0 " + dimInner * -1 + ",0")
                .style("fill", "#f5f5f5");

            var dimOuter = w - 800;
            var circleOuter = svg.append("path")
                .attr("d", "M 400, " + (dimOuter / 2 + 400) + " a " + dimOuter / 2 + "," + dimOuter / 2 + " 0 1,0 " + dimOuter + ",0 a " + dimOuter / 2 + "," + dimOuter / 2 + " 0 1,0 " + dimOuter * -1 + ",0")
                .style("fill", "#f5f5f5");


            force.start();

            if (nodes.length < 500){
                nodes.forEach(function (n, i) {
                    var coord = circleCoord(n, i, nodes.length)
                    n.x = coord.x
                    n.y = coord.y
                });
            }
            else{
                var innerIter = 0,
                    outerIter = 0;
                nodes.forEach(function(n, i) {
                    var item = nodes[i];


                    if (n.group == 0){
                        var coord = circleCoordInner(n, innerIter, n1)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordInner(n.group)
                        // n.y = parallelCoordy(n1, groupId[1].length)
                        innerIter = innerIter + 1;
                    }
                    if (n.group == 2){
                        coord = circleCoordOuter(n, outerIter, n2)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordx(n.group)
                        // n.y = parallelCoordy(n2, groupId[2].length)
                        outerIter = outerIter + 1;
                    }

                });
            }



            // use this one for straight line links...
            // var lines = svg.selectAll("line.node-link")
            //     .data(links).enter().append("line")
            //     .attr("class", "node-link")
            //     .attr("x1", function(d) { return d.source.x; })
            //     .attr("y1", function(d) { return d.source.y; })
            //     .attr("x2", function(d) { return d.target.x; })
            //     .attr("y2", function(d) { return d.target.y; });

            var lines = svg.selectAll("path.node-link")
                .data(links).enter().append("path")
                .style("fill", "none")
                .attr("stroke-dasharray", function (d) {
                    if (d.value < 100) {
                        return "5,5"; //these classes are defined in custom.css
                    } else {
                        return "5,0";//these classes are defined in custom.css
                    }
                })
                .style("stroke-width", function (d) { return Math.log(edgeWeightScale(d.value))/10.0 + "px"; })
                //.style("stroke-width", function (d) { return edgeWeightScale(d.value)/100.0 + "px"; })
                .style("stroke", "#514646")
                .attr("class", "node-link")
                .attr("d", function (d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                    return "M" +
                        d.source.x + "," +
                        d.source.y + "," +
                        d.target.x + "," +
                        d.target.y;

                });


            var gnodes = svg.selectAll('g.gnode')
                .data(nodes).enter().append('g')
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")"
                })
                .classed('gnode', true);


            // node.append("circle")
            //     .attr("r", function (d) { return xScale(d.weight); })
            //     .style("fill", function(d) { return colNodeScale(d.group); });

            var node = gnodes.append("circle")
                .style("fill", function (d) {
                    return colNodeScale(d.group);
                })
                .style("stroke", "#333")
                .style("stroke-width", "2px")
                .attr("r", function (d) {
                    return xScale(d.weight);
                })
                //.attr("class", "node")
                .on("mouseenter", function (d) {
                    is_connected(d, 0.05)
                    node.transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    d3.select(this).transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight + 10);
                    })
                })
                .on("mouseleave", function (d) {
                    node.transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    is_connected(d, 1);
                })
                .call(force.drag);

            // var node = gnodes
            //     .attr("r", function (d) {
            //         return xScale(d.weight);
            //     })

            var labels = gnodes.append("text")
                .attr("dx", 4)
                .attr("dy", 4)
                .attr("text-anchor", function (d) {
                    return d.x < w / 2 ? "end" : "start";
                })
                .attr("transform", function (d) {
                    return d.x < w / 2 ? "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(-20)" : "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(20)";
                })
                //.attr("transform", function(d) { return  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")"})
                //.attr("transform", function(d) { return (d.x-w/2)/(d.y-w/2) < 0 ?  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")" : "rotate(180)"; })
                .text(function (d) {
                    return d.name
                })

            var drag = force.drag()
                .on("dragstart", dragstart);
            //.on("dragstart", dragstartAll);


            //For not moving after drag
            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);

                for (i = 0; i < nodes.length; i++) {
                    nodes[i].fixed = true;
                }
            }


        }


        var pNetwork = self.gcpData;
        console.log("here");
        console.log(pNetwork);
        console.log(self.gcpData);
        updateGCP(pNetwork.nodes, pNetwork.edges);



        //
        //
        // console.log('network');
        // console.log(network);
        //
        //
        // updatePhospho(network.nodes, network.links);

        self.showSVG = true;
    }

    self.computeWeightForUpdatePhospho = true;
    $scope.makePhosphoGraph = function (signatureId) {

        // if(self.showPhosphoGraphTmp){
        //     //self.showPhosphoGraphTmp = false;
        //     self.showPhosphoGraph = true;
        // }
        // else {

        self.showP100div = true;
        self.showGCPdiv = false;
        self.showRPPAdiv = false;
        self.showSWATHdiv = false;
        self.showDToxSdiv = false;
$scope.signatureIdView = signatureId;
        console.log(signatureId);


        if(signatureId in self.P100ProcessedJSON){
            var peptideAbundance = self.P100ProcessedJSON[signatureId];
            console.log(peptideAbundance);
            console.log(self.ptmToPeptideToAbundance);
            var pNetwork = self.p100phospho["Known+PredictedbyPWM_Kinase_TargetGene"];
            for (var iterNetNode = 0; iterNetNode < pNetwork.nodes.length; iterNetNode++) {
                var iterNetNodeKey = pNetwork.nodes[iterNetNode]["name"];
                var iterNetNodeKeyPTM = iterNetNodeKey.split('(')[0];
                console.log(iterNetNodeKeyPTM);
                if (iterNetNodeKeyPTM in self.ptmToPeptideToAbundance) {
                    //console.log(self.ptmToPeptideToAbundance);
                    var localptmPeptideValue = self.ptmToPeptideToAbundance[iterNetNodeKeyPTM];
                    console.log(localptmPeptideValue);
                    var localptmPeptide = localptmPeptideValue['Peptide'];
                    console.log(localptmPeptide);
                    var localptmAbundance = localptmPeptideValue['abundance'];
                    console.log(localptmAbundance);

                    ptmToAbundance[iterNetNodeKey] = peptideAbundance[localptmPeptide]*localptmAbundance;

                }
                else{
                    ptmToAbundance[iterNetNodeKey] = "NA";
                }
            }
            console.log(ptmToAbundance);

        }
        else{
            ptmToAbundance = {};


        }



        self.showPhosphoGraphTmp = true;
        console.log("in makePhosphoGraph");

        d3.select("#chart5").select("svg").remove();
        if (typeof svg5 === 'undefined') {
            var svg5 = d3.selectAll("#chart5").append("svg");
        }
        //var svg3 = d3.selectAll("#chart3").append("svg");


        var force;
        self.showPhosphoGraph = false;


        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#987024", "#ed0909", "#0af702"])
            //.range(["#987024", "#982482", "#0af702"])
            .domain([0, 1, 2]);
//#f9a3f5
        // var colNodeScaleSeparate = d3.scale.ordinal()
        //     .range(["#767776", "#f91104", "#0af702"])
        //     .domain([0,1,2]);

        var colNodeScale = d3.scale.linear().range(["#987024", "#ed0909"]);
        var colScale = d3.scale.linear().range(["#987024", "#ed0909"]);
        var edgeWeightScale = d3.scale.linear().range([1, 3]);
        var xScale = d3.scale.linear().range([5, 15]);
        var textPlacePlusMinus = d3.scale.ordinal()
            .range([18, -18])
            .domain([1, 2]);
        var textPlaceStartEnd = d3.scale.ordinal().range(["start", "end"])
            .domain([1, 2]);
        //d3.selectAll("svg > *").remove();

        var colorsForAbundance = ["#00A6FF", "#1097E0", "#2885B7", "#35799E", "#4C7991", "#6D828D", "#8C8C8C", "#8E8E5C", "#92923C", "#A5A52E", "#BDBD24", "#DDDD15", "#FFFF00"];
        var domain_data = [-2.0, -1.6, -1.2, -0.8, -0.4, -0.01, 0.01, 0.4, 0.8, 1.2, 1.6, 2.0, 1000];
        var colorScale = d3.scale.threshold()
            .domain(domain_data)
            .range(colorsForAbundance);




        function updatePhospho(nodes, links) {
            //
            //var svg;


            // $('force1').click();
            //document.getElementById('force1').click();

            // console.log(circularLayout);
            function defaultSVG() {


                svg5.remove();

                xScale.domain(d3.extent(nodes, function (d) {
                    return d.weight;
                }));
                colNodeScale.domain(d3.extent(nodes, function (d) {
                    return d.group;
                }));
                colScale.domain(d3.extent(links, function (d) {
                    return d.weight;
                }));
                edgeWeightScale.domain(d3.extent(links, function (d) {
                    return d.weight;
                }));
                var margin = 75,
                    w = 1550 - 2 * margin,
                    h = w,
                    radius = w / 2,
                    strokeWidth = 4,
                    hyp2 = Math.pow(radius, 2),
                    nodeBaseRad = 5;

//These variables are global variables
                globalH = h;
                globalHPlus50 = h + 50;
                globalW = w;

                svg5 = d3.select("#chart5")
                    .append("svg")
                    .attr("style", "outline: thin solid yellow;")
                    .attr("width", w)
                    .attr("height", globalHPlus50);
                svg5.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "white");


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


                var path = svg5.append("svg:g").selectAll("path")
                //.data(links)
                    .data(force.links())
                    .enter().append("svg:path")
                    .style("stroke-width", 1)
                    .style('stroke', "black")
                    .style("stroke-width", function (d) {
                        return edgeWeightScale(d.score) + "px";
                    })
                    .attr("stroke-dasharray", function (d) {
                        if (d.score < 100) {
                            return "5,5"; //these classes are defined in custom.css
                        } else {
                            return "5,0";//these classes are defined in custom.css
                        }
                    })
                    //.style("stroke", function (d) {return colScale(d.value); })
                    .attr("class", function (d) {
                        return "link ";
                    });


                var node = svg5.append("svg:g").selectAll("g.node")
                    .data(force.nodes())
                    .enter().append("svg:g")
                    // .style("stroke-width", 3)
                    // .style('stroke', "black")
                    //.attr("class", "node")
                    .call(force.drag);

                // nodes.forEach(function(v) {
                //     var nd;
                //     var cx = v.coord[0];
                //     var cy = v.coord[1];
                //
                //     switch (v.group) {
                //         case 1:
                //             nd = svg.append("circle");
                //             break;
                //         case 2:
                //             nd = svg.append("rect");
                //             break;
                //     }
                // });

                node.append("circle")
                    .attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    .style("fill", function (d) {
                        if (d.group == 1) {
                            return colorScale(d.value);
                        }
                        else {
                            return colNodeScale(d.group);
                        }
                        //return colNodeScale(d.group);
                    })
                    // .style("fill", function (d) {
                    //     return colNodeScale(d.group);
                    // })
                    .style("stroke", "#333")
                    .style("stroke-width", "2px");
                //.on("dblclick", dblclick);


                function openLink() {
                    return function (d) {
                        var url = "";
                        if (d.slug != "") {
                            url = d.slug
                        } //else if(d.type == 2) {
                        //url = "clients/" + d.slug
                        //} else if(d.type == 3) {
                        //url = "agencies/" + d.slug
                        //}
                        window.open("//" + url)
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
                    .attr("class", function (d) {
                        return d.full_name
                    })
                    //****************************************
                    .attr("x", 16)
                    .attr("y", ".31em")
                    //.attr("class", "shadow")
                    //.style("font-size","10px")
                    // .attr("dx", 0)
                    // .attr("dy", ".35em")
                    //.style("font-size","12px")
                    //****************************************
                    //text.shadow {
                    .style("stroke", "#fff")
                    .style("stroke-width", "4px")
                    //}
                    //.attr("class", "shadow")
                    .style("font", "14px Times New Roman")
                    //****************************************
                    //.attr("text-anchor", "middle")
                    //****************************************
                    .text(function (d) {
                        return d.full_name
                    });
                //****************************************


                //This one is for the actual text
                node.append("svg:text")
                //****************************************
                    .attr("class", function (d) {
                        return d.full_name
                    })
                    //****************************************
                    .attr("x", 16)
                    .attr("y", ".31em")
                    //.attr("class", "shadow")
                    //.style("font-size","10px")
                    // .attr("dx", 0)
                    // .attr("dy", ".35em")
                    //.style("font-size","12px")
                    //****************************************
                    .style("font", "14px Times New Roman")
                    //****************************************
                    //.attr("text-anchor", "middle")
                    //****************************************
                    .text(function (d) {
                        return d.full_name
                    });
                //****************************************


                node.on("mouseover", function (d) {
                    // d3.select(this).select("text")
                    //     .transition()
                    //     .duration(300)
                    //     .text(function (d) {
                    //         return d.full_name;
                    //     })
                    // //.style("font-size", "15px")
                    // .style("font", "14px Times New Roman");
                    //
                    // d3.select(this).select("text")
                    //     .transition()
                    //     .duration(300)
                    //     .text(function (d) {
                    //         return d.full_name;
                    //     })
                    //     //.style("font-size", "15px")
                    //     //.attr("class", "shadow")
                    //     .style("font", "14px Times New Roman");
                    // d3.select(this).select("text")
                    //     .transition()
                    //     .duration(300)
                    //     .text(function (d) {
                    //         return d.full_name;
                    //     })
                    //
                    //     .style("fill",'black')
                    //     .style("font", "14px Times New Roman");

                    //d3.selectAll("text").remove();
                    //d3.select(this).style("stroke-width", 6);

                    //d3.select(this).select("text").style("stroke", "blue");

                    var nodeNeighbors = links.filter(function (link) {
                        // Filter the list of links to only those links that have our target
                        // node as a source or target
                        return link.source.index === d.index || link.target.index === d.index;
                    })
                        .map(function (link) {
                            // Map the list of links to a simple array of the neighboring indices - this is
                            // technically not required but makes the code below simpler because we can use
                            // indexOf instead of iterating and searching ourselves.
                            return link.source.index === d.index ? link.target.index : link.source.index;
                        });

                    d3.selectAll('circle').filter(function (node) {
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
                    path.style('stroke', function (l) {
                        if (d === l.source || d === l.target)
                            return "blue";
                        else
                            return "grey";
                    })

                    path.style('stroke-width', function (l) {
                        if (d === l.source || d === l.target)
                            return 2;
                        else
                            return 1;
                    })

                })
                    .on("mouseout", function (d) {
                        d3.select(this).select("text")
                            .transition()
                            .duration(300)
                            .text(function (d) {

                                return d.full_name;
                            });
                        // d3.select(this).select("text")
                        //     //*******************************
                        //     .style("font", "14px Times New Roman")
                        //     //*******************************
                        //     .style("font-size", "14px")
                        //     .style("fill",'black')
                        //     .style("font-weight", "normal");

                        // d3.select(this).select("text")
                        // //*******************************
                        //     .style("font", "14px Times New Roman")
                        //     //*******************************
                        //     .style("font-size", "14px")
                        //     .style("fill",'black')
                        //     .style("font-weight", "normal");
                        //d3.select(this).style("stroke", "black");
                        //d3.select(this).style("stroke-width", 1);
                        //d3.select(this).style("stroke", "#333");
                        path.style('stroke', "grey");
                        path.style('stroke-width', 1);
                        //circle.style('stroke', "grey");
                        //node.style("stroke-width", 3);
                        //node.style("stroke", "#333");
                        //d3.selectAll('text').style('fill', 'black')
                        // d3.selectAll('text').style('fill', 'black')
                        //     .style("font-weight", "normal");
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
                        return function (d) {
                            var url = "";
                            if (d.slug != "") {
                                url = d.slug
                            } //else if(d.type == 2) {
                            //url = "clients/" + d.slug
                            //} else if(d.type == 3) {
                            //url = "agencies/" + d.slug
                            //}
                            window.open("//" + url)
                        }
                    }

                    // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
                    coord = Math.max(radius - a + r + strokeWidth,
                        Math.min(a + radius - r - strokeWidth, coord));

                    return coord;
                }

                function tick(e) {
                    path.attr("d", function (d) {
                        var dx = d.target.x - d.source.x,
                            dy = d.target.y - d.source.y,

                            dr = Math.sqrt(dx * dx + dy * dy);
                        //console.log(d.source.x);
                        // console.log(d.target.x);
                        return "M" + d.source.x + "," + d.source.y + "," + d.target.x + "," + d.target.y;
                        //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                    });

                    node.attr('x', function (d) {
                        return d.x = pythag(Math.random() * 12, d.y, d.x);
                    })
                        .attr('y', function (d) {
                            return d.y = pythag(Math.random() * 12, d.x, d.y);
                        })
                        .attr("transform", function (d) {
                            return "translate(" + d.x + "," + d.y + ")"
                        });

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

                    for (i = 0; i < nodes.length; i++) {
                        nodes[i].fixed = true;
                    }
                }


                var svgText = svg5.append("text");
                svgText.attr("x", 10).attr("y", globalHPlus50 - 50).text("LINCS Proteomics @ www.lincsproteomics.org").style("font", "14px Times New Roman");

                //Added from here for coloring the legend
                max_data = 1000;
                min_data = -1000;


                var colors = ["#00A6FF", "#1097E0", "#2885B7", "#35799E", "#4C7991", "#6D828D", "#8C8C8C", "#8E8E5C", "#92923C", "#A5A52E", "#BDBD24", "#DDDD15", "#FFFF00"];
                var domain_data = [-2.0, -1.6, -1.2, -0.8, -0.4, -0.01, 0.01, 0.4, 0.8, 1.2, 1.6, 2.0, 1000];


                var colorScale2 = d3.scale.threshold()
                    .domain(domain_data)
                    .range(colors);


                var legend2 = svg5.selectAll(".legend")

                //.data([min_data, min_data + (max_data - min_data) / 7, min_data + 2 * (max_data - min_data) / 7, min_data + 3 * (max_data - min_data) / 7, min_data + 4 * (max_data - min_data) / 7, min_data + 5 * (max_data - min_data) / 7, min_data + 6 * (max_data - min_data) / 7], function (d) {
                    .data([-2.0, -1.6, -1.2, -0.8, -0.4, -0.01, 0.01, 0.4, 0.8, 1.2, 1.6, 2.0, 10.0], function (d) {

                        return d;
                    });

                // console.log("colorScale.quantiles()");
                // console.log(colorScale.quantiles());
                legend2.enter().append("g")
                    .attr("class", "legend");
                var gridSize = Math.floor(globalW / 50)
                var legendElementWidth = gridSize * 2;
                legend2.append("rect")
                    .attr("x", function (d, i) {
                        return legendElementWidth * i;
                    })
                    .attr("y", globalHPlus50 - 40)
                    .attr("width", legendElementWidth)
                    .attr("height", gridSize / 2)
                    .style("fill", function (d, i) {
                        return colors[i];
                    });

                legend2.append("text")
                //.attr("class", "mono")
                    .text(function (d) {
                        return parseFloat(Math.round(d * 100) / 100).toFixed(2) + "≥ a";
                    })
                    .style("font", "11px Times New Roman")
                    .attr("x", function (d, i) {
                        return legendElementWidth * i;
                    })
                    .attr("y", globalHPlus50 - 40 + gridSize);

                legend2.exit().remove();

                //till here for coloring the legend

                // For legend
                // var colNodeScaleSeparateInfo = d3.scale.ordinal()
                //     .range(["#767776", "#f91104"])
                //     .domain(["Query Gene Set", "Pathways / Kinases Perturbation"]);
                //
                //
                // var legend = svg3.selectAll(".legend")
                //     .data(colNodeScaleSeparateInfo.domain())
                //     .enter().append("g")
                //     .attr("class", "legend")
                //     .attr("transform", function (d, i) {
                //         return "translate(0," + (i) * 25 + ")";
                //     });
                //
                // legend.append("rect")
                //     .attr("x", w - 25)
                //     .attr("width", 25)
                //     .attr("height", 25)
                //     .style("fill", colNodeScaleSeparateInfo);
                //
                // legend.append("text")
                //     .attr("x", w - 35)
                //     .attr("y", 12.5)
                //     .attr("dy", ".35em")
                //     .style("text-anchor", "end")
                //     .text(function (d) {
                //         return d;
                //     });
                //
                //
                // d3.select("#download").on("click", function () {
                //     d3.select(this)
                //         .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart").html()))
                //         .attr("download", "pathway_network.svg")
                // })

            };

            defaultSVG();

            d3.select('#force5').on('click', function () {
                defaultSVG();
            });
            // Set-up the export button
            // d3.select('#download-png').on('click', function() {
            //
            // })

            d3.select('#circularView5').on('click', function () {
                svg5.remove();

                xScale.domain(d3.extent(nodes, function (d) {
                    return d.weight;
                }));
                colNodeScale.domain(d3.extent(nodes, function (d) {
                    return d.group;
                }));
                colScale.domain(d3.extent(links, function (d) {
                    return d.weight;
                }));
                var margin = 75,
                    w = 1550 - 2 * margin,
                    h = w,
                    radius = w / 2,
                    strokeWidth = 4,
                    hyp2 = Math.pow(radius, 2),
                    nodeBaseRad = 5;

//These variables are global variables
                globalH = h;
                globalHPlus50 = h + 50;
                globalW = w;

                svg5 = d3.select("#chart5")
                    .append("svg")
                    .attr("style", "outline: thin solid yellow;")
                    .attr("width", w)
                    .attr("height", globalHPlus50);
                svg5.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "white");


                // This is for grouping nodes


                var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .size([w, h]);

// evenly spaces nodes along arc
                var circleCoord = function (node, index, num_nodes) {
                    var circumference = circle.node().getTotalLength();
                    var pointAtLength = function (l) {
                        return circle.node().getPointAtLength(l)
                    };
                    var sectionLength = (circumference) / num_nodes;
                    var position = sectionLength * index + sectionLength / 2;
                    return pointAtLength(circumference - position)
                }

                var is_connected = function (d, opacity) {
                    lines.transition().style("stroke-opacity", function (o) {
                        return o.source === d || o.target === d ? 1 : opacity;
                    });
                }

                var dim = w - 900
                var circle = svg5.append("path")
                    .attr("d", "M 450, " + (dim / 2 + 450) + " a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim + ",0 a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim * -1 + ",0")
                    .style("fill", "white");

                force.start();

                nodes.forEach(function (n, i) {
                    var coord = circleCoord(n, i, nodes.length)
                    n.x = coord.x
                    n.y = coord.y
                });


                // use this one for straight line links...
                // var lines = svg.selectAll("line.node-link")
                //     .data(links).enter().append("line")
                //     .attr("class", "node-link")
                //     .attr("x1", function(d) { return d.source.x; })
                //     .attr("y1", function(d) { return d.source.y; })
                //     .attr("x2", function(d) { return d.target.x; })
                //     .attr("y2", function(d) { return d.target.y; });

                var lines = svg5.selectAll("path.node-link")
                    .data(links).enter().append("path")
                    .style("fill", "none")
                    .style("stroke", "#726363")
                    .attr("class", "node-link")
                    .style("stroke-width", function (d) {
                        return edgeWeightScale(d.score) + "px";
                    })
                    .attr("stroke-dasharray", function (d) {
                        if (d.score < 100) {
                            return "5,5"; //these classes are defined in custom.css
                        } else {
                            return "5,0";//these classes are defined in custom.css
                        }
                    })
                    .attr("d", function (d) {
                        var dx = d.target.x - d.source.x,
                            dy = d.target.y - d.source.y,
                            dr = Math.sqrt(dx * dx + dy * dy);
                        return "M" +
                            d.source.x + "," +
                            d.source.y + "," +
                            d.target.x + "," +
                            d.target.y;

                    });


                var gnodes = svg5.selectAll('g.gnode')
                    .data(nodes).enter().append('g')
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")"
                    })
                    .classed('gnode', true);


                // node.append("circle")
                //     .attr("r", function (d) { return xScale(d.weight); })
                //     .style("fill", function(d) { return colNodeScale(d.group); });

                var node = gnodes.append("circle")
                    .attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    .style("fill", function (d) {
                        if (d.group == 1) {
                            return colorScale(d.value);
                        }
                        else {
                            return colNodeScale(d.group);
                        }
                        //return colNodeScale(d.group);
                    })
                    // .style("fill", function (d) {
                    //     return colNodeScale(d.group);
                    // })
                    .style("stroke", "#333")
                    .style("stroke-width", "2px")
                    //.attr("class", "node")
                    .on("mouseenter", function (d) {
                        is_connected(d, 0.1)
                        node.transition().duration(100).attr("r", function (d) {
                            return xScale(d.weight);
                        })
                        d3.select(this).transition().duration(100).attr("r", function (d) {
                            return xScale(d.weight + 10);
                        })
                    })
                    .on("mouseleave", function (d) {
                        node.transition().duration(100).attr("r", function (d) {
                            return xScale(d.weight);
                        })
                        is_connected(d, 1);
                    })
                    .call(force.drag);

                var labels = gnodes.append("text")
                    .attr("dx", 4)
                    .attr("dy", 4)
                    .style("font", "14px Times New Roman")
                    .attr("text-anchor", function (d) {
                        return d.x < w / 2 ? "end" : "start";
                    })
                    .attr("transform", function (d) {
                        return d.x < w / 2 ? "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(-20)" : "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(20)";
                    })
                    //.attr("transform", function(d) { return  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")"})
                    //.attr("transform", function(d) { return (d.x-w/2)/(d.y-w/2) < 0 ?  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")" : "rotate(180)"; })
                    .text(function (d) {
                        return d.full_name
                    })

                var drag = force.drag()
                    .on("dragstart", dragstart);
                //.on("dragstart", dragstartAll);


                //For not moving after drag
                function dragstart(d) {
                    d3.select(this).classed("fixed", d.fixed = true);

                    for (i = 0; i < nodes.length; i++) {
                        nodes[i].fixed = true;
                    }
                }

                var svgText = svg5.append("text");
                svgText.attr("x", 10).attr("y", globalHPlus50 - 50).text("LINCS Proteomics @ www.lincsproteomics.org").style("font", "14px Times New Roman");

                //Added from here for coloring the legend
                max_data = 1000;
                min_data = -1000;


                var colors = ["#00A6FF", "#1097E0", "#2885B7", "#35799E", "#4C7991", "#6D828D", "#8C8C8C", "#8E8E5C", "#92923C", "#A5A52E", "#BDBD24", "#DDDD15", "#FFFF00"];
                var domain_data = [-2.0, -1.6, -1.2, -0.8, -0.4, -0.01, 0.01, 0.4, 0.8, 1.2, 1.6, 2.0, 1000];


                var colorScale2 = d3.scale.threshold()
                    .domain(domain_data)
                    .range(colors);


                var legend2 = svg5.selectAll(".legend")

                //.data([min_data, min_data + (max_data - min_data) / 7, min_data + 2 * (max_data - min_data) / 7, min_data + 3 * (max_data - min_data) / 7, min_data + 4 * (max_data - min_data) / 7, min_data + 5 * (max_data - min_data) / 7, min_data + 6 * (max_data - min_data) / 7], function (d) {
                    .data([-2.0, -1.6, -1.2, -0.8, -0.4, -0.01, 0.01, 0.4, 0.8, 1.2, 1.6, 2.0, 10.0], function (d) {

                        return d;
                    });

                // console.log("colorScale.quantiles()");
                // console.log(colorScale.quantiles());
                legend2.enter().append("g")
                    .attr("class", "legend");
                var gridSize = Math.floor(globalW / 50)
                var legendElementWidth = gridSize * 2;
                legend2.append("rect")
                    .attr("x", function (d, i) {
                        return legendElementWidth * i;
                    })
                    .attr("y", globalHPlus50 - 40)
                    .attr("width", legendElementWidth)
                    .attr("height", gridSize / 2)
                    .style("fill", function (d, i) {
                        return colors[i];
                    });

                legend2.append("text")
                //.attr("class", "mono")
                    .text(function (d) {
                        return parseFloat(Math.round(d * 100) / 100).toFixed(2) + "≥ a";
                    })
                    .style("font", "11px Times New Roman")
                    .attr("x", function (d, i) {
                        return legendElementWidth * i;
                    })
                    .attr("y", globalHPlus50 - 40 + gridSize);

                legend2.exit().remove();

            });


            function parallelView5() {
                svg5.remove();

                //xPosition.domain(d3.extent(nodes, function (d) { return d.text; }));
                xScale.domain(d3.extent(nodes, function (d) {
                    return d.weight;
                }));
                colNodeScale.domain(d3.extent(nodes, function (d) {
                    return d.group;
                }));
                colScale.domain(d3.extent(links, function (d) {
                    return d.weight;
                }));
                textPlacePlusMinus.domain(d3.extent(nodes, function (d) {
                    return d.group;
                }));
                textPlaceStartEnd.domain(d3.extent(nodes, function (d) {
                    return d.group;
                }));


                n1 = 0;
                n2 = 0;


                nodes.forEach(function (n, i) {


                    if (n.group == 1) {

                        n1 = n1 + 1;
                    }
                    if (n.group == 2) {

                        n2 = n2 + 1;
                    }

                });

                console.log(n1);
                console.log(n1 * 12);
                console.log(n2);
                console.log(n2 * 12);
                var parallelH = Math.max(n1 * 12, n2 * 12, 500);
                //var parallelH = Math.max(n1 * 12, n2 * 12);

                var margin = 75,
                    w = 1550 - 2 * margin,
                    h = parallelH,
                    radius = w / 2,
                    strokeWidth = 4,
                    hyp2 = Math.pow(radius, 2),
                    nodeBaseRad = 5;

                globalH = h;
                globalHPlus50 = h + 50;
                globalW = w;


                svg5 = d3.select("#chart5")
                    .append("svg")
                    .attr("style", "outline: thin solid yellow;")
                    .attr("width", w)
                    .attr("height", globalHPlus50);

                svg5.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "white");


                var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .size([w, h]);


                var parallelCoordx = function (group) {

                    if (group == 1) {
                        return w * 2 / 3;
                    }
                    else {
                        return w / 2.2;
                    }
                }

                var parallelCoordy = function (index, num_nodes) {
                    var dist = h / (num_nodes + 1);

                    return (index + 1) * dist;
                }

                var is_connected = function (d, opacity) {
                    lines.transition().style("stroke-opacity", function (o) {
                        return o.source === d || o.target === d ? 1 : opacity;
                    });
                }

                //var dim = w-80
                // var circle = svg.append("path")
                //     .attr("d", "M 40, "+(dim/2+40)+" a "+dim/2+","+dim/2+" 0 1,0 "+dim+",0 a "+dim/2+","+dim/2+" 0 1,0 "+dim*-1+",0")
                //     .style("fill", "#f5f5f5");

                force.start();


                // console.log(nodes.length);
                var groupId = [];
                var maxId = 0;
                for (var i = 0; i < nodes.length; i++) {
                    var item = nodes[i];

                    if (!groupId[item.group]) {
                        groupId[item.group] = [];
                    }

                    groupId[item.group].push({name: item.name});
                    // console.log(item.group);
                    // console.log(groupId[item.group]);
                    if (maxId < item.group) {
                        maxId = item.group;
                    }
                }
                // console.log(maxId);
                // console.log(groupId[1].length);
                // console.log(groupId[2].length);

                n1 = 0;
                n2 = 0;

                nodes.forEach(function (n, i) {
                    var item = nodes[i];

                    if (n.group == 1) {
                        n.x = parallelCoordx(n.group)
                        n.y = parallelCoordy(n1, groupId[1].length)
                        n1 = n1 + 1;
                    }
                    if (n.group == 2) {
                        n.x = parallelCoordx(n.group)
                        n.y = parallelCoordy(n2, groupId[2].length)
                        n2 = n2 + 1;
                    }

                });


                // use this one for straight line links...
                // var lines = svg.selectAll("line.node-link")
                //   .data(links).enter().append("line")
                //     .attr("class", "node-link")
                //   .attr("x1", function(d) { return d.source.x; })
                //   .attr("y1", function(d) { return d.source.y; })
                //   .attr("x2", function(d) { return d.target.x; })
                //   .attr("y2", function(d) { return d.target.y; });

                var lines = svg5.selectAll("path.node-link")
                    .data(links).enter().append("path")
                    .style("fill", "none")
                    .style("stroke", "#726363")
                    .attr("class", "node-link")
                    .style("stroke-width", function (d) {
                        return edgeWeightScale(d.score) + "px";
                    })
                    .attr("stroke-dasharray", function (d) {
                        if (d.score < 100) {
                            return "5,5"; //these classes are defined in custom.css
                        } else {
                            return "5,0";//these classes are defined in custom.css
                        }
                    })
                    .attr("d", function (d) {
                        var dx = d.target.x - d.source.x,
                            dy = d.target.y - d.source.y,
                            dr = Math.sqrt(dx * dx + dy * dy);
                        return "M" +
                            d.source.x + "," +
                            d.source.y + "," +
                            d.target.x + "," +
                            d.target.y;
                    });

                // var lines = svg.selectAll("path.node-link")
                //     .data(links).enter().append("path")
                //     .style("fill", "none")
                //     .style("stroke", "black")
                //     .attr("class", "node-link")
                //     .attr("d", function(d) {
                //         var dx = d.target.x - d.source.x,
                //             dy = d.target.y - d.source.y,
                //             dr = Math.sqrt(dx * dx + dy * dy);
                //         return "M" +
                //             d.source.x + "," +
                //             d.source.y + "A" +
                //             dr + "," + dr + " 0 0,1 " +
                //             d.target.x + "," +
                //             d.target.y;
                //     });

                var gnodes = svg5.selectAll('g.gnode')
                    .data(nodes).enter().append('g')
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")"
                    })
                    .classed('gnode', true);

                var node = gnodes.append("circle")
                    .attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    .style("fill", function (d) {
                        if (d.group == 1) {
                            return colorScale(d.value);
                        }
                        else {
                            return colNodeScale(d.group);
                        }
                        //return colNodeScale(d.group);
                    })
                    // .style("fill", function (d) {
                    //     return colNodeScale(d.group);
                    // })
                    .style("stroke", "#333")
                    .style("stroke-width", "2px")
                    //.attr("class", "node")
                    .on("mouseenter", function (d) {
                        is_connected(d, 0.1)
                        node.transition().duration(100).attr("r", function (d) {
                            return xScale(d.weight);
                        })
                        d3.select(this).transition().duration(100).attr("r", function (d) {
                            return xScale(d.weight + 10);
                        })
                    })
                    .on("mouseleave", function (d) {
                        node.transition().duration(100).attr("r", function (d) {
                            return xScale(d.weight);
                        })
                        is_connected(d, 1);
                    })
                    .call(force.drag);
                // var bbox = textElement.getBBox();
                // var width = bbox.width;
                // var height = bbox.height;
                var labels = gnodes.append("text")
                    .style("font", "14px Times New Roman")
                    .attr("dx", function (d) {
                        return textPlacePlusMinus(d.group);
                    })
                    .attr("dy", 4)
                    .attr("text-anchor", function (d) {
                        return textPlaceStartEnd(d.group);
                    })
                    .text(function (d) {
                        return d.full_name
                    })

                var svgText = svg5.append("text");
                svgText.attr("x", 10).attr("y", globalHPlus50 - 50).text("LINCS Proteomics @ www.lincsproteomics.org").style("font", "14px Times New Roman");

                //Added from here for coloring the legend
                max_data = 1000;
                min_data = -1000;


                var colors = ["#00A6FF", "#1097E0", "#2885B7", "#35799E", "#4C7991", "#6D828D", "#8C8C8C", "#8E8E5C", "#92923C", "#A5A52E", "#BDBD24", "#DDDD15", "#FFFF00"];
                var domain_data = [-2.0, -1.6, -1.2, -0.8, -0.4, -0.01, 0.01, 0.4, 0.8, 1.2, 1.6, 2.0, 1000];


                var colorScale2 = d3.scale.threshold()
                    .domain(domain_data)
                    .range(colors);


                var legend2 = svg5.selectAll(".legend")

                //.data([min_data, min_data + (max_data - min_data) / 7, min_data + 2 * (max_data - min_data) / 7, min_data + 3 * (max_data - min_data) / 7, min_data + 4 * (max_data - min_data) / 7, min_data + 5 * (max_data - min_data) / 7, min_data + 6 * (max_data - min_data) / 7], function (d) {
                    .data([-2.0, -1.6, -1.2, -0.8, -0.4, -0.01, 0.01, 0.4, 0.8, 1.2, 1.6, 2.0, 10.0], function (d) {

                        return d;
                    });

                // console.log("colorScale.quantiles()");
                // console.log(colorScale.quantiles());
                legend2.enter().append("g")
                    .attr("class", "legend");
                var gridSize = Math.floor(globalW / 50)
                var legendElementWidth = gridSize * 2;
                legend2.append("rect")
                    .attr("x", function (d, i) {
                        return legendElementWidth * i;
                    })
                    .attr("y", globalHPlus50 - 40)
                    .attr("width", legendElementWidth)
                    .attr("height", gridSize / 2)
                    .style("fill", function (d, i) {
                        return colors[i];
                    });

                legend2.append("text")
                //.attr("class", "mono")
                    .text(function (d) {
                        return parseFloat(Math.round(d * 100) / 100).toFixed(2) + "≥ a";
                    })
                    .style("font", "11px Times New Roman")
                    .attr("x", function (d, i) {
                        return legendElementWidth * i;
                    })
                    .attr("y", globalHPlus50 - 40 + gridSize);

                legend2.exit().remove();

            };

            parallelView5();
            d3.select('#parallelView5').on('click', function () {
                parallelView5()
            });

            // Set-up the export button
            d3.select('#download-png5').on('click', function () {
                var svgString = getSVGString(svg5.node());

                svgString2Image(svgString, 4 * globalW, 4 * globalHPlus50, 'png', save); // passes Blob and filesize String to the callback

                function save(dataBlob, filesize) {
                    saveAs(dataBlob, 'LINCSProteomics-P100-Kinase-Network.png'); // FileSaver.js function
                }
            });

            function getSVGString(svgNode) {
                svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
                var cssStyleText = getCSSStyles(svgNode);
                appendCSS(cssStyleText, svgNode);

                var serializer = new XMLSerializer();
                var svgString = serializer.serializeToString(svgNode);
                svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
                svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

                return svgString;

                function getCSSStyles(parentElement) {
                    var selectorTextArr = [];

                    // Add Parent element Id and Classes to the list
                    selectorTextArr.push('#' + parentElement.id);
                    for (var c = 0; c < parentElement.classList.length; c++)
                        if (!contains('.' + parentElement.classList[c], selectorTextArr))
                            selectorTextArr.push('.' + parentElement.classList[c]);

                    // Add Children element Ids and Classes to the list
                    var nodes = parentElement.getElementsByTagName("*");
                    for (var i = 0; i < nodes.length; i++) {
                        var id = nodes[i].id;
                        if (!contains('#' + id, selectorTextArr))
                            selectorTextArr.push('#' + id);

                        var classes = nodes[i].classList;
                        for (var c = 0; c < classes.length; c++)
                            if (!contains('.' + classes[c], selectorTextArr))
                                selectorTextArr.push('.' + classes[c]);
                    }

                    // Extract CSS Rules
                    var extractedCSSText = "";
                    for (var i = 0; i < document.styleSheets.length; i++) {
                        var s = document.styleSheets[i];

                        try {
                            if (!s.cssRules) continue;
                        } catch (e) {
                            if (e.name !== 'SecurityError') throw e; // for Firefox
                            continue;
                        }

                        var cssRules = s.cssRules;
                        for (var r = 0; r < cssRules.length; r++) {
                            if (contains(cssRules[r].selectorText, selectorTextArr))
                                extractedCSSText += cssRules[r].cssText;
                        }
                    }


                    return extractedCSSText;

                    function contains(str, arr) {
                        return arr.indexOf(str) === -1 ? false : true;
                    }

                }

                function appendCSS(cssText, element) {
                    var styleElement = document.createElement("style");
                    styleElement.setAttribute("type", "text/css");
                    styleElement.innerHTML = cssText;
                    var refNode = element.hasChildNodes() ? element.children[0] : null;
                    element.insertBefore(styleElement, refNode);
                }
            }


            function svgString2Image(svgString, width, height, format, callback) {
                var format = format ? format : 'png';

                var imgsrc = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");

                canvas.width = width;
                canvas.height = height;

                var image = new Image();
                image.onload = function () {
                    context.clearRect(0, 0, width, height);
                    context.drawImage(image, 0, 0, width, height);

                    canvas.toBlob(function (blob) {
                        var filesize = Math.round(blob.length / 1024) + ' KB';
                        if (callback) callback(blob, filesize);
                    });


                };

                image.src = imgsrc;
            }




        }


        $scope.phosphoOptions = [
            {value: "Known_Kinase_TargetGene"},
            {value: "Known+PredictedbyBlosum50_Kinase_TargetGene"},
            {value: "Known+PredictedbyPWM_Kinase_TargetGene"}
        ];
        //SharedService.setVar('phosphoOptions', $scope.phosphoOptions);
        $scope.selectedphosphoPathways = $scope.phosphoOptions[2];
        //SharedService.setVar('selectedphosphoPathways', $scope.selectedphosphoPathways);

        var pNetwork = self.p100phospho["Known+PredictedbyPWM_Kinase_TargetGene"];
        console.log("here");
        console.log(pNetwork);



            // var pNetwork = phosphoNetwork['Known+PredictedbyBlosum50_Kinase_TargetGene'];

            for (var iterNetNode = 0; iterNetNode < pNetwork.nodes.length; iterNetNode++) {
                var iterNetNodeKey = pNetwork.nodes[iterNetNode]["name"]
                if (iterNetNodeKey in ptmToAbundance) {
                    //console.log(iterNetNodeKey);
                    if (ptmToAbundance[iterNetNodeKey] == "NA") {
                        pNetwork.nodes[iterNetNode]["value"] = 0.0;
                    }
                    else {
                        pNetwork.nodes[iterNetNode]["value"] = ptmToAbundance[iterNetNodeKey];
                    }
                }
                else{
                    pNetwork.nodes[iterNetNode]["value"] = 0.0;
                }
            }
            if (self.computeWeightForUpdatePhospho){
                for (var iterNetNode = 0; iterNetNode < pNetwork.edges.length; iterNetNode++) {
                    //var iterNetNodeKey = network.nodes[iterNetNode]["name"];
                    var idx1 = pNetwork.edges[iterNetNode]["source"];
                    var idx2 = pNetwork.edges[iterNetNode]["target"];
                    pNetwork.nodes[idx1]["weight"] += 1;
                    pNetwork.nodes[idx2]["weight"] += 1;

                }
                self.computeWeightForUpdatePhospho = false;
                //SharedService.setVar('computeWeightForUpdatePhospho',self.computeWeightForUpdatePhospho);
            }

            updatePhospho(pNetwork.nodes, pNetwork.edges);
            $scope.changedPhosphoValue = function (item) {
                //var net = item.value;
                console.log(item);
                console.log(item.value);
                var net = item.value.toString();
                console.log(net);

                var pNetwork = self.p100phospho[net];
                for (var iterNetNode = 0; iterNetNode < pNetwork.nodes.length; iterNetNode++)
                {
                    //pNetwork.nodes[iterNetNode]["weight"] = 0;
                    var iterNetNodeKey = pNetwork.nodes[iterNetNode]["name"]
                    if (iterNetNodeKey in ptmToAbundance)
                    {
                        console.log(iterNetNodeKey);
                        if (ptmToAbundance[iterNetNodeKey] == "NA")
                        {
                            pNetwork.nodes[iterNetNode]["value"] = 0.0;
                        }
                        else {
                            pNetwork.nodes[iterNetNode]["value"] = ptmToAbundance[iterNetNodeKey];
                        }
                    }
                    else{
                        pNetwork.nodes[iterNetNode]["value"] = 0.0;
                    }
                }
                // for (var iterNetNode = 0; iterNetNode < pNetwork.edges.length; iterNetNode++)
                // {
                //     //var iterNetNodeKey = network.nodes[iterNetNode]["name"];
                //     console.log(pNetwork);
                //     console.log(pNetwork.edges);
                //     console.log(pNetwork.edges[iterNetNode]);
                //     console.log(pNetwork.edges[iterNetNode]["source"]);
                //     console.log(pNetwork.edges[iterNetNode]["target"]);
                //     var idx1 = pNetwork.edges[iterNetNode]["source"];
                //     var idx2 = pNetwork.edges[iterNetNode]["target"];
                //     console.log(iterNetNode);
                //     console.log(idx1);
                //     console.log(idx1);
                //     console.log(pNetwork.nodes[idx1]);
                //     pNetwork.nodes[idx1]["weight"] += 1;
                //     pNetwork.nodes[idx2]["weight"] += 1;
                //
                // }

                console.log('network');
                console.log(pNetwork);
                updatePhospho(pNetwork.nodes, pNetwork.edges);
                //$scope.itemList.push(item.value);
            }


            self.showPhosphoGraph = true;

            console.log("self.showPhosphoGraph");
            console.log(self.showPhosphoGraph);
            // self.waitingPathway = false;
            // self.showOutputPathway = true;
        // }
    }

    $scope.updatePhosphoGraph = function(signatureId){
        console.log(signatureId);
        var peptideAbundance = self.P100ProcessedJSON[signatureId];

        //var networkNodeAbundance = $scope.ptmToPeptideToAbundance[];

    };

    $scope.showPhosphoNetwork = function (item) {
        //var net = item.value;

        //var net = item.value;
        console.log(item);
        //console.log(item.value);
        var net = item.toString();
        console.log(net);


        // {value: "Known+Predicted_Probability_Kinase_TargetGene"}
        // ];
        //


        if (net === "P100") {

            self.showP100div = true;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
        }


        var xScale = d3.scale.linear().range([5, 15]);
        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#767776", "#f91104", "#0af702"])
            .domain([0, 1, 2]);
        var colNodeScale = d3.scale.linear().range(["grey", "red"]);
        var colScale = d3.scale.linear().range(["grey", "red"]);
        var edgeWeightScale = d3.scale.linear().range([0.5, 1]);

        function updatePhospho(nodes, links) {
            //
            //var svg;
            //svg.remove();
            var force;



            d3.select("svg").remove();

            //d3.select('#circularView1').on('click', function() {
            //svg.remove();


            var margin = 75,
                w = 1550 - 2 * margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;


            svg = d3.select("#chart5")
                .append("svg")
                //.attr("style", "outline: thin solid yellow;")
                .attr("width", w)
                .attr("height", h);
            // svg.append("rect")
            //     .attr("width", "100%")
            //     .attr("height", "100%")
            //     .attr("fill", "white");


            // This is for grouping nodes


            var force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h]);

            colNodeScale.domain(d3.extent(nodes, function (d) {
                return d.group;
            }));
            // colScale.domain(d3.extent(links, function (d) {
            //     return d.weight;
            // }));
            xScale.domain(d3.extent(nodes, function (d) {
                return d.weight;
            }));

            var groupId = [];
            var maxId = 0;
            for (var i = 0; i < nodes.length; i++){
                var item = nodes[i];

                if (!groupId[item.group]){
                    groupId[item.group] = [];
                }

                groupId[item.group].push({name: item.name});
                // console.log(item.group);
                // console.log(groupId[item.group]);
                if (maxId < item.group){
                    maxId = item.group;
                }
            }
            console.log(maxId);
            console.log(groupId[1]);
            console.log(groupId[1].length);
            console.log(groupId[2]);

            var n1 = groupId[1].length;
            var n2 = groupId[2].length;
            console.log(n1);
            console.log(n2);



// evenly spaces nodes along arc
            var circleCoord = function (node, index, num_nodes) {
                var circumference = circle.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circle.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            // evenly spaces nodes along arc
            var circleCoordInner = function (node, index, num_nodes) {
                var circumference = circleInner.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circleInner.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            // evenly spaces nodes along arc
            var circleCoordOuter = function (node, index, num_nodes) {
                var circumference = circleOuter.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circleOuter.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            var is_connected = function (d, opacity) {
                lines.transition().style("stroke-opacity", function (o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
                //     lines.transition().style("stroke", function (o) {
                //         return o.source === d || o.target === d ? 2 : 1;
                //     });
            }

            var dim = w - 400;
            var circle = svg.append("path")
                .attr("d", "M 200, " + (dim / 2 + 200) + " a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim + ",0 a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim * -1 + ",0")
                .style("fill", "#f5f5f5");

            var dimInner = w - 400;
            var circleInner = svg.append("path")
                .attr("d", "M 200, " + (dimInner / 2 + 200) + " a " + dimInner / 2 + "," + dimInner / 2 + " 0 1,0 " + dimInner + ",0 a " + dimInner / 2 + "," + dimInner / 2 + " 0 1,0 " + dimInner * -1 + ",0")
                .style("fill", "#f5f5f5");

            var dimOuter = w - 800;
            var circleOuter = svg.append("path")
                .attr("d", "M 400, " + (dimOuter / 2 + 400) + " a " + dimOuter / 2 + "," + dimOuter / 2 + " 0 1,0 " + dimOuter + ",0 a " + dimOuter / 2 + "," + dimOuter / 2 + " 0 1,0 " + dimOuter * -1 + ",0")
                .style("fill", "#f5f5f5");


            force.start();

            if (nodes.length < 500){
                nodes.forEach(function (n, i) {
                    var coord = circleCoord(n, i, nodes.length)
                    n.x = coord.x
                    n.y = coord.y
                });
            }
            else{
                var innerIter = 0,
                    outerIter = 0;
                nodes.forEach(function(n, i) {
                    var item = nodes[i];


                    if (n.group == 1){
                        var coord = circleCoordInner(n, innerIter, n1)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordInner(n.group)
                        // n.y = parallelCoordy(n1, groupId[1].length)
                        innerIter = innerIter + 1;
                    }
                    if (n.group == 2){
                        coord = circleCoordOuter(n, outerIter, n2)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordx(n.group)
                        // n.y = parallelCoordy(n2, groupId[2].length)
                        outerIter = outerIter + 1;
                    }

                });
            }



            // use this one for straight line links...
            // var lines = svg.selectAll("line.node-link")
            //     .data(links).enter().append("line")
            //     .attr("class", "node-link")
            //     .attr("x1", function(d) { return d.source.x; })
            //     .attr("y1", function(d) { return d.source.y; })
            //     .attr("x2", function(d) { return d.target.x; })
            //     .attr("y2", function(d) { return d.target.y; });

            var lines = svg.selectAll("path.node-link")
                .data(links).enter().append("path")
                .style("fill", "none")
                .attr("stroke-dasharray", function (d) {
                    if (d.value < 100) {
                        return "5,5"; //these classes are defined in custom.css
                    } else {
                        return "5,0";//these classes are defined in custom.css
                    }
                })
                .style("stroke-width", function (d) { return Math.log(edgeWeightScale(d.value))/2.0 + "px"; })
                //.style("stroke-width", function (d) { return edgeWeightScale(d.value)/100.0 + "px"; })
                .style("stroke", "#514646")
                .attr("class", "node-link")
                .attr("d", function (d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                    return "M" +
                        d.source.x + "," +
                        d.source.y + "," +
                        d.target.x + "," +
                        d.target.y;

                });


            var gnodes = svg.selectAll('g.gnode')
                .data(nodes).enter().append('g')
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")"
                })
                .classed('gnode', true);


            // node.append("circle")
            //     .attr("r", function (d) { return xScale(d.weight); })
            //     .style("fill", function(d) { return colNodeScale(d.group); });

            var node = gnodes.append("circle")
                .style("fill", function (d) {
                    return colNodeScale(d.group);
                })
                .style("stroke", "#333")
                .style("stroke-width", "2px")
                .attr("r", function (d) {
                    return xScale(d.weight);
                })
                //.attr("class", "node")
                .on("mouseenter", function (d) {
                    is_connected(d, 0.05)
                    node.transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    d3.select(this).transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight + 10);
                    })
                })
                .on("mouseleave", function (d) {
                    node.transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    is_connected(d, 1);
                })
                .call(force.drag);

            // var node = gnodes
            //     .attr("r", function (d) {
            //         return xScale(d.weight);
            //     })

            var labels = gnodes.append("text")
                .attr("dx", 4)
                .attr("dy", 4)
                .attr("text-anchor", function (d) {
                    return d.x < w / 2 ? "end" : "start";
                })
                .attr("transform", function (d) {
                    return d.x < w / 2 ? "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(-20)" : "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(20)";
                })
                //.attr("transform", function(d) { return  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")"})
                //.attr("transform", function(d) { return (d.x-w/2)/(d.y-w/2) < 0 ?  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")" : "rotate(180)"; })
                .text(function (d) {
                    return d.name
                })

            var drag = force.drag()
                .on("dragstart", dragstart);
            //.on("dragstart", dragstartAll);


            //For not moving after drag
            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);

                for (i = 0; i < nodes.length; i++) {
                    nodes[i].fixed = true;
                }
            }


        }


        $scope.phosphoOptions = [
        {value: "Known_Kinase_TargetGene"},
        {value: "Known+PredictedbyBlosum50_Kinase_TargetGene"},
        {value: "Known+PredictedbyPWM_Kinase_TargetGene"}
        ];

        // $scope.selectedphosphoPathways = $scope.phosphoOptions[2];
        // // var pNetwork = self.phosphoNetwork.Known+Predicted_Probability_Kinase_TargetGene;
        // var network = self.phosphoNetwork.["Known+Predicted_Probability_Kinase_TargetGene"];
        // console.log('network');
        // console.log(network);

        $scope.selectedphosphoPathways = $scope.phosphoOptions[2];
        var pNetwork = self.p100phospho["Known+PredictedbyPWM_Kinase_TargetGene"];
        console.log("here");
        console.log(pNetwork);
        console.log(self.p100phospho);
        updatePhospho(pNetwork.nodes, pNetwork.edges);
        $scope.changedPhosphoValue = function (item) {
            //var net = item.value;
            console.log(item);
            console.log(item.value);
            var net = item.value.toString();
            console.log(net);

            var pNetwork = self.p100phospho[net];
            console.log('network');
            console.log(pNetwork);
            updatePhospho(pNetwork.nodes, pNetwork.edges);
            //$scope.itemList.push(item.value);
        }


        //
        //
        // console.log('network');
        // console.log(network);
        //
        //
        // updatePhospho(network.nodes, network.links);

        self.showSVG = true;
    }





    $scope.showNetwork = function (item) {
        //var net = item.value;
        console.log(item);
        //console.log(item.value);
        var net = item.toString();
        console.log(net);
        self.initNetworkJSON = self.assayData[net];
        //var network = self.assayData[net];
        //var network = self.initNetworkJSON[net];
        console.log('self.initNetworkJSON');
        console.log(self.initNetworkJSON);

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







        var force;

        var xScale = d3.scale.linear().range([5, 15]);
        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#767776", "#f91104", "#0af702"])
            .domain([0, 1, 2]);
        var colNodeScale = d3.scale.linear().range(["grey", "red"]);
        var colScale = d3.scale.linear().range(["grey", "red"]);
        var edgeWeightScale = d3.scale.linear().range([1, 3]);
        d3.selectAll("svg > *").remove();
        var textPlacePlusMinus = d3.scale.ordinal()
            .range([18, -18])
            .domain([1,2]);
        var textPlaceStartEnd = d3.scale.ordinal().range(["start", "end"])
            .domain([1,2]);


        function update(nodes, links) {
            //
            //var svg;












            // d3.select('#parallelView1').on('click', function(){
            svg.remove();

            //xPosition.domain(d3.extent(nodes, function (d) { return d.text; }));
            xScale.domain(d3.extent(nodes, function (d) { return d.weight; }));
            colNodeScale.domain(d3.extent(nodes, function (d) { return d.group; }));
            colScale.domain(d3.extent(links, function (d) { return d.weight; }));
            textPlacePlusMinus.domain(d3.extent(nodes, function (d) { return d.group; }));
            textPlaceStartEnd.domain(d3.extent(nodes, function (d) { return d.group; }));

            var margin = 75,
                h = Math.max(1550-2*margin,nodes.length/200.0*1550),
                w = 1550 - 2*margin,
                //h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;


            svg = d3.select("#chart5")
                .append("svg")
                //.attr("style", "outline: thin solid yellow;")
                .attr("width", w)
                .attr("height", h);

            // svg.append("rect")
            //     .attr("width", "100%")
            //     .attr("height", "100%")
            //     .attr("fill", "white");



            var force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h]);


            var parallelCoordx = function(group){

                if (group == 1){return w*2/3;}
                else{return w/2.2;}
            }

            var parallelCoordy = function(index, num_nodes){
                var dist = h/(num_nodes+1);

                return (index + 1)*dist;
            }

            var is_connected = function(d, opacity) {
                lines.transition().style("stroke-opacity", function(o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
            }

            //var dim = w-80
            // var circle = svg.append("path")
            //     .attr("d", "M 40, "+(dim/2+40)+" a "+dim/2+","+dim/2+" 0 1,0 "+dim+",0 a "+dim/2+","+dim/2+" 0 1,0 "+dim*-1+",0")
            //     .style("fill", "#f5f5f5");

            force.start();


            // console.log(nodes.length);
            var groupId = [];
            var maxId = 0;
            for (var i = 0; i < nodes.length; i++){
                var item = nodes[i];

                if (!groupId[item.group]){
                    groupId[item.group] = [];
                }

                groupId[item.group].push({name: item.name});
                // console.log(item.group);
                // console.log(groupId[item.group]);
                if (maxId < item.group){
                    maxId = item.group;
                }
            }
            // console.log(maxId);
            // console.log(groupId[1].length);
            // console.log(groupId[2].length);

            n1 = 0;
            n2 = 0;

            nodes.forEach(function(n, i) {
                var item = nodes[i];

                if (n.group == 1){
                    n.x = parallelCoordx(n.group)
                    n.y = parallelCoordy(n1, groupId[1].length)
                    n1 = n1 + 1;
                }
                if (n.group == 2){
                    n.x = parallelCoordx(n.group)
                    n.y = parallelCoordy(n2, groupId[2].length)
                    n2 = n2 + 1;
                }

            });


            // use this one for straight line links...
            // var lines = svg.selectAll("line.node-link")
            //   .data(links).enter().append("line")
            //     .attr("class", "node-link")
            //   .attr("x1", function(d) { return d.source.x; })
            //   .attr("y1", function(d) { return d.source.y; })
            //   .attr("x2", function(d) { return d.target.x; })
            //   .attr("y2", function(d) { return d.target.y; });

            var lines = svg.selectAll("path.node-link")
                .data(links).enter().append("path")
                .style("fill", "none")
                .style("stroke", "#726363")
                .attr("class", "node-link")
                .attr("d", function(d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                    return "M" +
                        d.source.x + "," +
                        d.source.y + "," +
                        d.target.x + "," +
                        d.target.y;
                });

            // var lines = svg.selectAll("path.node-link")
            //     .data(links).enter().append("path")
            //     .style("fill", "none")
            //     .style("stroke", "black")
            //     .attr("class", "node-link")
            //     .attr("d", function(d) {
            //         var dx = d.target.x - d.source.x,
            //             dy = d.target.y - d.source.y,
            //             dr = Math.sqrt(dx * dx + dy * dy);
            //         return "M" +
            //             d.source.x + "," +
            //             d.source.y + "A" +
            //             dr + "," + dr + " 0 0,1 " +
            //             d.target.x + "," +
            //             d.target.y;
            //     });

            var gnodes = svg.selectAll('g.gnode')
                .data(nodes).enter().append('g')
                .attr("transform", function(d) {
                    return "translate("+d.x+","+d.y+")"
                })
                .classed('gnode', true);

            var node = gnodes.append("circle")
                .attr("r", function (d) { return xScale(d.weight); })
                .style("fill", function(d) { return colNodeScale(d.group); })
                .style("stroke","#333")
                .style("stroke-width","2px")
                //.attr("class", "node")
                .on("mouseenter", function (d) {
                    is_connected(d, 0.1)
                    node.transition().duration(100).attr("r", function (d) { return xScale(d.weight); })
                    d3.select(this).transition().duration(100).attr("r", function (d) { return xScale(d.weight+10); })
                })
                .on("mouseleave", function (d) {
                    node.transition().duration(100).attr("r", function (d) { return xScale(d.weight); })
                    is_connected(d, 1);
                })
                .call(force.drag);
            // var bbox = textElement.getBBox();
            // var width = bbox.width;
            // var height = bbox.height;
            var labels = gnodes.append("text")

                .attr("dx", function(d) { return textPlacePlusMinus(d.group); })
                .attr("dy", 4)
                .attr("text-anchor", function(d) { return textPlaceStartEnd(d.group); })
                .text(function(d){return d.full_name})

            // });
































/*
            svg.remove();
            var margin = 100,
                w = 1500 - 2 * margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;

            svg = d3.select("#chart5")
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


            xScale.domain(d3.extent(nodes, function (d) {
                return d.weight;
            }));
            colNodeScale.domain(d3.extent(nodes, function (d) {
                return d.group;
            }));
            colScale.domain(d3.extent(links, function (d) {
                return d.weight;
            }));


            var path = svg.append("svg:g").selectAll("path")
            //.data(links)
                .data(force.links())
                .enter().append("svg:path")
                .style("stroke", function (d) {
                    return colScale(d.value);
                })
                .attr("class", function (d) {
                    return "link ";
                });


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
                .attr("r", function (d) {
                    return xScale(d.weight);
                })
                .style("fill", function (d) {
                    return colNodeScale(d.group);
                });
            //.on("dblclick", dblclick);


            function openLink() {
                return function (d) {
                    var url = "";
                    if (d.slug != "") {
                        url = d.slug
                    } //else if(d.type == 2) {
                    //url = "clients/" + d.slug
                    //} else if(d.type == 3) {
                    //url = "agencies/" + d.slug
                    //}
                    window.open("//" + url)
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
                .attr("class", function (d) {
                    return d.full_name
                })
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
                .style("font", "14px Times New Roman")
                //****************************************
                //.attr("text-anchor", "middle")
                //****************************************
                .text(function (d) {
                    return d.full_name
                });
            //****************************************


            //This one is for the actual text
            node.append("svg:text")
            //****************************************
                .attr("class", function (d) {
                    return d.full_name
                })
                //****************************************
                .attr("x", 16)
                .attr("y", ".31em")
                //.attr("class", "shadow")
                //.style("font-size","10px")
                // .attr("dx", 0)
                // .attr("dy", ".35em")
                //.style("font-size","12px")
                //****************************************
                .style("font", "14px Times New Roman")
                //****************************************
                //.attr("text-anchor", "middle")
                //****************************************
                .text(function (d) {
                    return d.full_name
                });
            //****************************************


            node.on("mouseover", function (d) {
                d3.select(this).select("text")
                    .transition()
                    .duration(300)
                    .text(function (d) {
                        return d.full_name;
                    })
                    //.style("font-size", "15px")
                    .style("font", "14px Times New Roman");

                d3.select(this).select("text")
                    .transition()
                    .duration(300)
                    .text(function (d) {
                        return d.full_name;
                    })
                    //.style("font-size", "15px")
                    //.attr("class", "shadow")
                    .style("font", "14px Times New Roman");
                d3.select(this).select("text")
                    .transition()
                    .duration(300)
                    .text(function (d) {
                        return d.full_name;
                    })

                    .style("fill", 'black')
                    .style("font", "14px Times New Roman");

                //d3.selectAll("text").remove();
                //d3.select(this).style("stroke-width", 6);

                //d3.select(this).select("text").style("stroke", "blue");

                var nodeNeighbors = links.filter(function (link) {
                    // Filter the list of links to only those links that have our target
                    // node as a source or target
                    return link.source.index === d.index || link.target.index === d.index;
                })
                    .map(function (link) {
                        // Map the list of links to a simple array of the neighboring indices - this is
                        // technically not required but makes the code below simpler because we can use
                        // indexOf instead of iterating and searching ourselves.
                        return link.source.index === d.index ? link.target.index : link.source.index;
                    });

                d3.selectAll('circle').filter(function (node) {
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
                path.style('stroke', function (l) {
                    if (d === l.source || d === l.target)
                        return "blue";
                    else
                        return "grey";
                })

                path.style('stroke-width', function (l) {
                    if (d === l.source || d === l.target)
                        return 3;
                    else
                        return 1;
                })

            })
                .on("mouseout", function (d) {
                    d3.select(this).select("text")
                        .transition()
                        .duration(300)
                        .text(function (d) {

                            return d.name;
                        });
                    d3.select(this).select("text")
                    //*******************************
                        .style("font", "14px Times New Roman")
                        //*******************************
                        .style("font-size", "14px")
                        .style("fill", 'black')
                        .style("font-weight", "normal");

                    d3.select(this).select("text")
                    //*******************************
                        .style("font", "14px Times New Roman")
                        //*******************************
                        .style("font-size", "14px")
                        .style("fill", 'black')
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
                    return function (d) {
                        var url = "";
                        if (d.slug != "") {
                            url = d.slug
                        } //else if(d.type == 2) {
                        //url = "clients/" + d.slug
                        //} else if(d.type == 3) {
                        //url = "agencies/" + d.slug
                        //}
                        window.open("//" + url)
                    }
                }

                // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
                coord = Math.max(radius - a + r + strokeWidth,
                    Math.min(a + radius - r - strokeWidth, coord));

                return coord;
            }

            function tick(e) {
                path.attr("d", function (d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,

                        dr = Math.sqrt(dx * dx + dy * dy);
                    //console.log(d.source.x);
                    // console.log(d.target.x);
                    return "M" + d.source.x + "," + d.source.y + "," + d.target.x + "," + d.target.y;
                    //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                });

                node.attr('x', function (d) {
                    return d.x = pythag(Math.random() * 12, d.y, d.x);
                })
                    .attr('y', function (d) {
                        return d.y = pythag(Math.random() * 12, d.x, d.y);
                    })
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")"
                    });

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

                for (i = 0; i < nodes.length; i++) {
                    nodes[i].fixed = true;
                }
            }


            // For legend
            var colNodeScaleSeparateInfo = d3.scale.ordinal()
                .range(["#767776", "#f91104"])
                .domain(["Query Gene Set", "Pathways / Kinases Perturbation"]);


            var legend = svg.selectAll(".legend")
                .data(colNodeScaleSeparateInfo.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + (i) * 25 + ")";
                });

            legend.append("rect")
                .attr("x", w - 25)
                .attr("width", 25)
                .attr("height", 25)
                .style("fill", colNodeScaleSeparateInfo);

            legend.append("text")
                .attr("x", w - 35)
                .attr("y", 12.5)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });


            d3.select("#download").on("click", function () {
                d3.select(this)
                    .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart5").html()))
                    .attr("download", "pathway_network.svg")
            })
*/

        }


        $scope.pathways = [
            {value: "KEGG_2013"},
            {value: "KEGG_2015"},
            {value: "KEGG_2016"},
            {value: "WikiPathways_2013"},
            {value: "WikiPathways_2015"},
            {value: "WikiPathways_2016"},
            {value: "Panther_2015"},
            {value: "Panther_2016"},
            {value: "Kinase_Perturbations_from_GEO_up"},
            {value: "Kinase_Perturbations_from_GEO_down"},
            // {value: "LINCS_L1000_Kinase_Perturbations_up"},
            // {value: "LINCS_L1000_Kinase_Perturbations_down"},
            {value: "Kinase_Perturbations_from_GEO"}
        ];
        self.showSVG = true;
        console.log("here-assay");

        $scope.selectedPathways = $scope.pathways[2];


        //self.initNetworkJSON = self.assayData[net];
        var network = self.initNetworkJSON.KEGG_2016;
        //var network = self.network.KEGG_2016;
        //console.log(self.network);
        console.log(network);
        update(network.nodes, network.edges);

        $scope.changedValue = function (item) {
            //var net = item.value;
            //self.showSVG = false;
            console.log(item);
            console.log(item.value);
            var net = item.value.toString();
            console.log(net);

            var network = self.initNetworkJSON[net];
            console.log('network');
            console.log(network);
            update(network.nodes, network.edges);
            self.showSVG = true;
            //$scope.itemList.push(item.value);
        }

    }


}]);

appModule.controller('ToolsCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
    var self = this;
//This is for showing nav-bar header in scroll down
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 800) {
            $('.topMenu').fadeIn();

        } else {
            $('.topMenu').fadeOut();

        }

    });

    //Start of script from guide ========================

    // iPad and iPod detection
    var isiPad = function () {
        return (navigator.platform.indexOf("iPad") != -1);
    };

    var isiPhone = function () {
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    };

    // Go to next section
    var gotToNextSection = function () {
        var el = $('.fh5co-learn-more'),
            w = el.width(),
            divide = -w / 2;
        el.css('margin-left', divide);
    };

    // Loading page
    var loaderPage = function () {
        $(".fh5co-loader").fadeOut("slow");
    };

    // FullHeight
    var fullHeight = function () {
        if (!isiPad() && !isiPhone()) {
            $('.js-fullheight').css('height', $(window).height() - 49);
            $(window).resize(function () {
                $('.js-fullheight').css('height', $(window).height() - 49);
            })
        }
    };

    var toggleBtnColor = function () {


        if ($('#fh5co-hero').length > 0) {
            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'down') {
                    $('.fh5co-nav-toggle').addClass('dark');
                }
            }, {offset: -$('#fh5co-hero').height()});

            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'up') {
                    $('.fh5co-nav-toggle').removeClass('dark');
                }
            }, {
                offset: function () {
                    return -$(this.element).height() + 0;
                }
            });
        }


    };


    // Scroll Next
    var ScrollNext = function () {
        $('body').on('click', '.scroll-btn', function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: $($(this).closest('[data-next="yes"]').next()).offset().top
            }, 1000, 'easeInOutExpo');
            return false;
        });
    };

    // Click outside of offcanvass
    var mobileMenuOutsideClick = function () {

        $(document).click(function (e) {
            var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas-visible')) {

                    $('body').removeClass('offcanvas-visible');
                    $('.js-fh5co-nav-toggle').removeClass('active');

                }


            }
        });

    };


    // Offcanvas
    var offcanvasMenu = function () {
        $('body').prepend('<div id="fh5co-offcanvas" />');
        $('#fh5co-offcanvas').prepend('<ul id="fh5co-side-links">');
        $('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');

        $('.left-menu li, .right-menu li').each(function () {

            var $this = $(this);

            $('#fh5co-offcanvas ul').append($this.clone());

        });
    };

    // Burger Menu
    var burgerMenu = function () {

        $('body').on('click', '.js-fh5co-nav-toggle', function (event) {
            var $this = $(this);

            $('body').toggleClass('fh5co-overflow offcanvas-visible');
            $this.toggleClass('active');
            event.preventDefault();

        });

        $(window).resize(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

        $(window).scroll(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

    };


    var testimonialFlexslider = function () {
        var $flexslider = $('.flexslider');
        $flexslider.flexslider({
            animation: "fade",
            manualControls: ".flex-control-nav li",
            directionNav: false,
            smoothHeight: true,
            useCSS: false /* Chrome fix*/
        });
    }


    var goToTop = function () {

        $('.js-gotop').on('click', function (event) {

            event.preventDefault();

            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500);

            return false;
        });

    };


    // Animations

    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            el.addClass('fadeInUp animated');
                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, {offset: '95%'});
    };


    // Document on load.
    $(function () {
        gotToNextSection();
        loaderPage();
        fullHeight();
        toggleBtnColor();
        ScrollNext();
        mobileMenuOutsideClick();
        offcanvasMenu();
        burgerMenu();
        testimonialFlexslider();
        goToTop();

        // Animate
        contentWayPoint();

    });


}]);




appModule.controller('ContactCtrl', ['$scope', '$location', '$http', '$window', function ($scope, $location, $http, $window) {







    //Start of script from guide ========================

    // iPad and iPod detection
    var isiPad = function () {
        return (navigator.platform.indexOf("iPad") != -1);
    };

    var isiPhone = function () {
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    };

    // Go to next section
    var gotToNextSection = function () {
        var el = $('.fh5co-learn-more'),
            w = el.width(),
            divide = -w / 2;
        el.css('margin-left', divide);
    };

    // Loading page
    var loaderPage = function () {
        $(".fh5co-loader").fadeOut("slow");
    };

    // FullHeight
    var fullHeight = function () {
        if (!isiPad() && !isiPhone()) {
            $('.js-fullheight').css('height', $(window).height() - 49);
            $(window).resize(function () {
                $('.js-fullheight').css('height', $(window).height() - 49);
            })
        }
    };

    var toggleBtnColor = function () {


        if ($('#fh5co-hero').length > 0) {
            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'down') {
                    $('.fh5co-nav-toggle').addClass('dark');
                }
            }, {offset: -$('#fh5co-hero').height()});

            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'up') {
                    $('.fh5co-nav-toggle').removeClass('dark');
                }
            }, {
                offset: function () {
                    return -$(this.element).height() + 0;
                }
            });
        }


    };


    // Scroll Next
    var ScrollNext = function () {
        $('body').on('click', '.scroll-btn', function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: $($(this).closest('[data-next="yes"]').next()).offset().top
            }, 1000, 'easeInOutExpo');
            return false;
        });
    };

    // Click outside of offcanvass
    var mobileMenuOutsideClick = function () {

        $(document).click(function (e) {
            var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas-visible')) {

                    $('body').removeClass('offcanvas-visible');
                    $('.js-fh5co-nav-toggle').removeClass('active');

                }


            }
        });

    };


    // Offcanvas
    var offcanvasMenu = function () {
        $('body').prepend('<div id="fh5co-offcanvas" />');
        $('#fh5co-offcanvas').prepend('<ul id="fh5co-side-links">');
        $('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');

        $('.left-menu li, .right-menu li').each(function () {

            var $this = $(this);

            $('#fh5co-offcanvas ul').append($this.clone());

        });
    };

    // Burger Menu
    var burgerMenu = function () {

        $('body').on('click', '.js-fh5co-nav-toggle', function (event) {
            var $this = $(this);

            $('body').toggleClass('fh5co-overflow offcanvas-visible');
            $this.toggleClass('active');
            event.preventDefault();

        });

        $(window).resize(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

        $(window).scroll(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

    };


    var testimonialFlexslider = function () {
        var $flexslider = $('.flexslider');
        $flexslider.flexslider({
            animation: "fade",
            manualControls: ".flex-control-nav li",
            directionNav: false,
            smoothHeight: true,
            useCSS: false /* Chrome fix*/
        });
    }


    var goToTop = function () {

        $('.js-gotop').on('click', function (event) {

            event.preventDefault();

            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500);

            return false;
        });

    };


    // Animations

    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            el.addClass('fadeInUp animated');
                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, {offset: '95%'});
    };


    // Document on load.
    $(function () {
        gotToNextSection();
        loaderPage();
        fullHeight();
        toggleBtnColor();
        ScrollNext();
        mobileMenuOutsideClick();
        offcanvasMenu();
        burgerMenu();
        testimonialFlexslider();
        goToTop();

        // Animate
        contentWayPoint();

    });

    //End of script from guide ========================
    var self = this;
    console.log("here");


    $(document).scroll(function () {
        var y = $(this).scrollTop();
        //if (y > 0) {
            $('.topMenu').fadeIn();

        // } else {
        //     $('.topMenu').fadeOut();
        //
        // }

    });

    $scope.customNavigateApi = function(msg){
        $window.open("/pln/api/pathway/genes/" + msg, '_blank');
    };


    self.onSubmit = function () {
        var x = document.getElementById("frm");

        //var nameValue = document.getElementById("uniqueID").value;

        // function myFunction() {
        //
        //     //document.getElementById("demo").innerHTML = y;
        // }


        var text = "";
        var i;
        for (i = 0; i < x.length ;i++) {
            text += x.elements[i].value + "<br>";
        }
        console.log(text);
        var y = document.getElementById("frm").elements[0].value +" | "+ document.getElementById("frm").elements[1].value +" | " + document.getElementById("frm").elements[2].value + " | " + document.getElementById("frm").elements[3].value + " | ";

        console.log(y);

        var url = 'api/sendEmail/';
        (function (query) {
            console.log(query);
            $http.get(url + query)
                .success(function (data) {
                    console.log("Message sent.");
                    // setTimeout(function() {
                    //     document.getElementById('messageSuccess').style.display='none';
                    //     document.getElementById("messageSuccess").innerHTML = "Your message is sent, somebody from our team " +
                    //         "will contact you via the provided email address, shortly.";
                    // }, 10000);


                    $("#messageSuccess").fadeIn();
                    document.getElementById("messageSuccess").innerHTML = "Your message is sent, somebody from our team " +
                        "will contact you via the provided email address, shortly.";
                    //$("messageSuccess").fadeIn();
                    $("#messageSuccess").fadeOut(15000);
                    // $("#messageSuccess").delay(10000).hide(0);
                    // $("messageSuccess").replaceWith(function() {
                    //     return $(txt).hide().fadeIn(1000);});

                })
                .error(function (data, status) {

                    console.log(data);
                    console.log(status);

                });


        })(y);
    }

}]);





    appModule.controller('NavigationCtrl', ['$scope', '$location', '$http', '$window', function ($scope, $location, $http, $window) {




        $scope.button_m_all= true;
        $scope.button_p100_m = false;
        $scope.button_gcp_m = false;
        $scope.button_mass_m = false;
        $scope.button_swath_m = false;
        $scope.button_rppa_m = false;

        $scope.button_c_all= true;
        $scope.button_pccse_c= false;
        $scope.button_dtoxs_c= false;
        $scope.button_neuro_c= false;
        $scope.button_hms_c= false;

        $scope.button_a_all= true;
        $scope.button_p100_a= false;
        $scope.button_gcp_a= false;
        $scope.button_mass_a= false;
        $scope.button_swath_a= false;
        $scope.button_rppa_a= false;





        //Start of script from guide ========================
$scope.showCenterInfo = false;
    // iPad and iPod detection
    var isiPad = function () {
        return (navigator.platform.indexOf("iPad") != -1);
    };

    var isiPhone = function () {
        return (
            (navigator.platform.indexOf("iPhone") != -1) ||
            (navigator.platform.indexOf("iPod") != -1)
        );
    };

    // Go to next section
    var gotToNextSection = function () {
        var el = $('.fh5co-learn-more'),
            w = el.width(),
            divide = -w / 2;
        el.css('margin-left', divide);
    };

    // Loading page
    var loaderPage = function () {
        $(".fh5co-loader").fadeOut("slow");
    };

    // FullHeight
    var fullHeight = function () {
        if (!isiPad() && !isiPhone()) {
            $('.js-fullheight').css('height', $(window).height() - 49);
            $(window).resize(function () {
                $('.js-fullheight').css('height', $(window).height() - 49);
            })
        }
    };

    var toggleBtnColor = function () {


        if ($('#fh5co-hero').length > 0) {
            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'down') {
                    $('.fh5co-nav-toggle').addClass('dark');
                }
            }, {offset: -$('#fh5co-hero').height()});

            $('#fh5co-hero').waypoint(function (direction) {
                if (direction === 'up') {
                    $('.fh5co-nav-toggle').removeClass('dark');
                }
            }, {
                offset: function () {
                    return -$(this.element).height() + 0;
                }
            });
        }


    };


    // Scroll Next
    var ScrollNext = function () {
        $('body').on('click', '.scroll-btn', function (e) {
            e.preventDefault();

            $('html, body').animate({
                scrollTop: $($(this).closest('[data-next="yes"]').next()).offset().top
            }, 1000, 'easeInOutExpo');
            return false;
        });
    };

    // Click outside of offcanvass
    var mobileMenuOutsideClick = function () {

        $(document).click(function (e) {
            var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {

                if ($('body').hasClass('offcanvas-visible')) {

                    $('body').removeClass('offcanvas-visible');
                    $('.js-fh5co-nav-toggle').removeClass('active');

                }


            }
        });

    };


    // Offcanvas
    var offcanvasMenu = function () {
        $('body').prepend('<div id="fh5co-offcanvas" />');
        $('#fh5co-offcanvas').prepend('<ul id="fh5co-side-links">');
        $('body').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle"><i></i></a>');

        $('.left-menu li, .right-menu li').each(function () {

            var $this = $(this);

            $('#fh5co-offcanvas ul').append($this.clone());

        });
    };

    // Burger Menu
    var burgerMenu = function () {

        $('body').on('click', '.js-fh5co-nav-toggle', function (event) {
            var $this = $(this);

            $('body').toggleClass('fh5co-overflow offcanvas-visible');
            $this.toggleClass('active');
            event.preventDefault();

        });

        $(window).resize(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

        $(window).scroll(function () {
            if ($('body').hasClass('offcanvas-visible')) {
                $('body').removeClass('offcanvas-visible');
                $('.js-fh5co-nav-toggle').removeClass('active');
            }
        });

    };


    var testimonialFlexslider = function () {
        var $flexslider = $('.flexslider');
        $flexslider.flexslider({
            animation: "fade",
            manualControls: ".flex-control-nav li",
            directionNav: false,
            smoothHeight: true,
            useCSS: false /* Chrome fix*/
        });
    }


    var goToTop = function () {

        $('.js-gotop').on('click', function (event) {

            event.preventDefault();

            $('html, body').animate({
                scrollTop: $('html').offset().top
            }, 500);

            return false;
        });

    };


    // Animations

    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            el.addClass('fadeInUp animated');
                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, {offset: '95%'});
    };


    // Document on load.
    $(function () {
        gotToNextSection();
        loaderPage();
        fullHeight();
        toggleBtnColor();
        ScrollNext();
        mobileMenuOutsideClick();
        offcanvasMenu();
        burgerMenu();
        testimonialFlexslider();
        goToTop();

        // Animate
        contentWayPoint();

    });

    //End of script from guide ========================
    var self = this;
    console.log("here");


    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 800) {
            $('.topMenu').fadeIn();

        } else {
            $('.topMenu').fadeOut();

        }

    });
    // $scope.tabs = [
    //     {link: '#/', label: 'Home'},
    //     {link: '#/assay-view', label: 'Assay View'},
    //     {link: '#/data-view', label: 'Data View'},
    //     {link: '#/tools', label: 'Tools'},
    //     {link: '#/about', label: 'About'}
    // ];

    // $scope.selectedTab = $scope.tabs[0];
    // $scope.setSelectedTab = function (tab) {
    //     $scope.selectedTab = tab;
    //     console.log($scope.selectedTab.link);
    //     console.log($scope.selectedTab.label);
    //     self.activeSite = $scope.selectedTab.link;
    // }
    // console.log($scope.selectedTab.link);
    // console.log($scope.selectedTab.label);
    // $scope.tabClass = function (tab) {
    //     if ($scope.selectedTab == tab) {
    //         self.activeSite = $scope.selectedTab.link;
    //         return "active";
    //
    //     } else {
    //         return "";
    //     }
    // }
    self.showSVG = false;
    // Load tags for autocomplete
    self.initNetworkJSON = {};


    $scope.initNetwork = function () {

        $http.get('/lincsproteomics/data/content.json').success(function (data) {
            self.initNetworkJSON = data;
            console.log("initNetworkJSON");
            console.log(self.initNetworkJSON);
        });

        $http.get('/lincsproteomics/data/phospho_network_p100.json').success(function (data) {
            self.p100phospho = data;
            console.log("p100phospho");
            console.log(self.p100phospho);


        });
    };
    //$scope.initNetwork();


    $scope.customDownload = function (msg) {
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
    $scope.customDownloadSWATH = function (msg) {
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:SWATH-MS%20protein%20quantification%20assay", '_blank');
        console.log("message");
        console.log(message);

    };
    $scope.customDownloadRPPA = function (msg) {
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:RPPA%20protein%20state%20assay", '_blank');
        console.log("message");
        console.log(message);

    };
    $scope.customDownloadDToxS = function (msg) {
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:MS%20protein%20state%20assay", '_blank');
        console.log("message");
        console.log(message);

    };
    $scope.customDownloadGCP = function (msg) {
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:Global%20chromatin%20epigenetic%20profiling%20assay", '_blank');
        console.log("message");
        console.log(message);

    };

    $scope.customDownloadP100 = function (msg) {
        $window.localStorage.setItem("message", msg);
        $window.open("http://lincsportal.ccs.miami.edu/datasets-beta/#?query=assayname:P100%20phosphoprotein%20quantification%20assay", '_blank');
        console.log("message");
        console.log(message);

    };

    var svg = d3.selectAll("#chart").append("svg");





    $scope.showNetwork = function (item) {
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


        var force;

        var xScale = d3.scale.linear().range([5, 15]);
        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#767776", "#f91104", "#0af702"])
            .domain([0, 1, 2]);
        var colNodeScale = d3.scale.linear().range(["grey", "red"]);
        var colScale = d3.scale.linear().range(["grey", "red"]);

        d3.select("svg").remove();
        //d3.select("svg").remove();
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // var svg = d3.selectAll("#chart").append("svg");
        // var svg2 = d3.selectAll("#chart2").append("svg");


        function updateKinase2(nodes, links) {
            var force;



            //d3.select('#circularView1').on('click', function() {
            //svg.remove();




            /* This is for the circular view


             d3.select("svg").remove();

            var groupId = [];
            var maxId = 0;
            for (var i = 0; i < nodes.length; i++){
                var item = nodes[i];

                if (!groupId[item.group]){
                    groupId[item.group] = [];
                }

                groupId[item.group].push({name: item.name});
                // console.log(item.group);
                // console.log(groupId[item.group]);
                if (maxId < item.group){
                    maxId = item.group;
                }
            }

            var margin = 75,

                w = Math.max(1550 - 2 * margin,groupId[0].length/300*1550 - 2 * margin),
                //w = 1550 - 2 * margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;







            svg = d3.select("#chart")
                .append("svg")
                //.attr("style", "outline: thin solid yellow;")
                .attr("width", w)
                .attr("height", h);
            // svg.append("rect")
            //     .attr("width", "100%")
            //     .attr("height", "100%")
            //     .attr("fill", "white");


            // This is for grouping nodes


            var force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h]);


            colNodeScale.domain(d3.extent(nodes, function (d) {
                return d.group;
            }));
            // colScale.domain(d3.extent(links, function (d) {
            //     return d.weight;
            // }));
            xScale.domain(d3.extent(nodes, function (d) {
                return d.weight;
            }));





            // console.log(maxId);
            // console.log(groupId[0]);
            // console.log(groupId[0].length);
            // console.log(groupId[2]);
            //
            // var n1 = groupId[0].length;
            // var n2 = groupId[1].length;
            // var n3 = groupId[2].length;
            // console.log(n1);
            // console.log(n2);
            // console.log(n3);



// evenly spaces nodes along arc
            // evenly spaces nodes along arc
            var circleCoord = function (node, index, num_nodes) {
                var circumference = circle.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circle.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            // evenly spaces nodes along arc
            var circleCoordMiddle = function (node, index, num_nodes) {
                var circumference = circleMiddle.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circleMiddle.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }



            // evenly spaces nodes along arc
            var circleCoordInner = function (node, index, num_nodes) {
                var circumference = circleInner.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circleInner.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            // evenly spaces nodes along arc
            var circleCoordOuter = function (node, index, num_nodes) {
                var circumference = circleOuter.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circleOuter.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            var is_connected = function (d, opacity) {
                lines.transition().style("stroke-opacity", function (o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
                //     lines.transition().style("stroke", function (o) {
                //         return o.source === d || o.target === d ? 2 : 1;
                //     });
            }

            var dim = w - 400;
            var circle = svg.append("path")
                .attr("d", "M 200, " + (dim / 2 + 200) + " a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim + ",0 a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim * -1 + ",0")
                .style("fill", "#f5f5f5");

            var dimInner = w - 400;
            var circleInner = svg.append("path")
                .attr("d", "M 200, " + (dimInner / 2 + 200) + " a " + dimInner / 2 + "," + dimInner / 2 + " 0 1,0 " + dimInner + ",0 a " + dimInner / 2 + "," + dimInner / 2 + " 0 1,0 " + dimInner * -1 + ",0")
                .style("fill", "#f5f5f5");

            var dimMiddle = w - 600;
            var circleMiddle = svg.append("path")
                .attr("d", "M 300, " + (dimMiddle / 2 + 300) + " a " + dimMiddle / 2 + "," + dimMiddle / 2 + " 0 1,0 " + dimMiddle + ",0 a " + dimMiddle / 2 + "," + dimMiddle / 2 + " 0 1,0 " + dimMiddle * -1 + ",0")
                .style("fill", "#f5f5f5");

            var dimOuter = w - 800;
            var circleOuter = svg.append("path")
                .attr("d", "M 400, " + (dimOuter / 2 + 400) + " a " + dimOuter / 2 + "," + dimOuter / 2 + " 0 1,0 " + dimOuter + ",0 a " + dimOuter / 2 + "," + dimOuter / 2 + " 0 1,0 " + dimOuter * -1 + ",0")
                .style("fill", "#f5f5f5");


            force.start();
            console.log(nodes.length);

            if (nodes.length < 500){
                nodes.forEach(function (n, i) {
                    var coord = circleCoord(n, i, nodes.length)
                    n.x = coord.x
                    n.y = coord.y
                });
            }
            else{
                var innerIter = 0,
                    outerIter = 0,
                    middleIter = 0;
                nodes.forEach(function(n, i) {
                    var item = nodes[i];


                    if (n.group == 0){
                        var coord = circleCoordInner(n, innerIter, groupId[0].length)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordInner(n.group)
                        // n.y = parallelCoordy(n1, groupId[1].length)
                        innerIter = innerIter + 1;
                    }
                    if (n.group == 1){
                        var coord = circleCoordMiddle(n, middleIter, groupId[1].length)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordInner(n.group)
                        // n.y = parallelCoordy(n1, groupId[1].length)
                        middleIter = middleIter + 1;
                    }
                    if (n.group == 2){
                        coord = circleCoordOuter(n, outerIter, groupId[2].length)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordx(n.group)
                        // n.y = parallelCoordy(n2, groupId[2].length)
                        outerIter = outerIter + 1;
                    }

                });
            }



// evenly spaces nodes along arc
//             var circleCoord = function (node, index, num_nodes) {
//                 var circumference = circle.node().getTotalLength();
//                 var pointAtLength = function (l) {
//                     return circle.node().getPointAtLength(l)
//                 };
//                 var sectionLength = (circumference) / num_nodes;
//                 var position = sectionLength * index + sectionLength / 2;
//                 return pointAtLength(circumference - position)
//             }

            var is_connected = function (d, opacity) {
                lines.transition().style("stroke-opacity", function (o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
                // lines.transition().style("stroke-opacity", function (o) {
                //     return o.source === d || o.target === d ? 1 : opacity;
                // });
                //     lines.transition().style("stroke", function (o) {
                //         return o.source === d || o.target === d ? 2 : 1;
                //     });
            }
            var is_connected_arrow = function (d, opacity) {
                lines.transition().style("stroke-opacity", function (o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
                //     lines.transition().style("stroke", function (o) {
                //         return o.source === d || o.target === d ? 2 : 1;
                //     });
            }
            //
            // var dim = w - 400
            // var circle = svg.append("path")
            //     .attr("d", "M 200, " + (dim / 2 + 200) + " a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim + ",0 a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim * -1 + ",0")
            //     .style("fill", "#f5f5f5");
            //
            // force.start();
            //
            // nodes.forEach(function (n, i) {
            //     var coord = circleCoord(n, i, nodes.length)
            //     n.x = coord.x
            //     n.y = coord.y
            // });


            // use this one for straight line links...
            // var lines = svg.selectAll("line.node-link")
            //     .data(links).enter().append("line")
            //     .attr("class", "node-link")
            //     .attr("x1", function(d) { return d.source.x; })
            //     .attr("y1", function(d) { return d.source.y; })
            //     .attr("x2", function(d) { return d.target.x; })
            //     .attr("y2", function(d) { return d.target.y; });

            svg.append('defs').append('marker')
                .attr({'id':'arrowhead',
                    'viewBox':'-0 -5 10 10',
                    'refX':25,
                    'refY':0,
                    //'markerUnits':'strokeWidth',
                    'orient':'auto',
                    'markerWidth':10,
                    'markerHeight':10,
                    'xoverflow':'visible'})
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', "#514646")
                .attr('stroke','#ccc');

            // svg.append("svg:defs").selectAll("marker")
            //     //.data(["end"])      // Different link/path types can be defined here
            //     .enter().append("svg:marker")    // This section adds in the arrows
            //     .attr('id', function(d,i){
            //         return 'end-arrow' + i; //<-- append index postion
            //     })
            //     //.attr("id", String)
            //     .attr("viewBox", "0 -5 10 10")
            //     .attr("refX", 15)
            //     .attr("refY", -1.5)
            //     .attr("markerWidth", 10)
            //     .attr("markerHeight", 10)
            //     .attr('fill', "#514646")
            //     .attr('stroke','#ccc')
            //     .attr("orient", "auto")
            //     .append("svg:path")
            //     .attr("d", "M0,-5L10,0L0,5");
            //     //.style("fill", function(d) { return color(d['brand']); });


            var lines = svg.selectAll("path.node-link")
                .data(links).enter().append("path")
                .style("fill", "none")
                // .attr("stroke-dasharray", function (d) {
                //     if (d.value < 100) {
                //         return "5,5"; //these classes are defined in custom.css
                //     } else {
                //         return "5,0";//these classes are defined in custom.css
                //     }
                // })
                //.style("stroke-width", function (d) { return Math.log(edgeWeightScale(d.value))/2.0 + "px"; })
                //.style("stroke-width", function (d) { return edgeWeightScale(d.value)/100.0 + "px"; })
                .style("stroke", "#514646")
                .attr("class", "node-link")
                .style('marker-end', function(d,i){
                    return "url(#arrowhead)"; //<--use the one with the right id
                })
                .attr("d", function (d) {
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
                        //;


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

                    // return "M" +
                    //     d.source.x + ","
                    //     + d.source.y + "A" +
                    //     drx + "," + dry + " " +
                    //     xRotation + "," +
                    //     largeArc + "," +
                    //     dr + "," + dr + " 0 0,1 " +
                    //     sweep + " " +
                    //     d.target.x + "," +
                    //     d.target.y;





                    // return "M" +
                    //     d.source.x + "," +
                    //     d.source.y + "A" +
                    //     dr + "," + dr + " 0 0,1 " +
                    //     d.target.x + "," +
                    //     d.target.y;


                    //
                    //
                    // function tick(e) {
                    //     path.attr("d", function(d) {
                    //         var dx = d.target.x - d.source.x,
                    //             dy = d.target.y - d.source.y,
                    //             dr = Math.sqrt(dx * dx + dy * dy),
                    //             drx = dr,
                    //             dry = dr,
                    //             xRotation = 0, // degrees
                    //             largeArc = 0, // 1 or 0
                    //             sweep = 1, // 1 or 0
                    //             x2 = d.target.x,
                    //             y2 = d.target.y;
                    //         //console.log(d.source.x);
                    //         // console.log(d.target.x);
                    //
                    //         if ( d.target.x === d.source.x && d.target.y === d.source.y ) {
                    //             // Fiddle with this angle to get loop oriented.
                    //             xRotation = -45;
                    //
                    //             // Needs to be 1.
                    //             largeArc = 1;
                    //
                    //             // Change sweep to change orientation of loop.
                    //             //sweep = 0;
                    //
                    //             // Make drx and dry different to get an ellipse
                    //             // instead of a circle.
                    //             drx = 30;
                    //             dry = 20;
                    //
                    //             // For whatever reason the arc collapses to a point if the beginning
                    //             // and ending points of the arc are the same, so kludge it.
                    //             x2 = d.target.x + 1;
                    //             y2 = d.target.y + 1;
                    //         }
                    //
                    //         return "M" + d.source.x + "," + d.source.y + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
                    //
                    //
                    //         //return "M" + d.source.x + "," + d.source.y + ","+ d.target.x + "," + d.target.y;
                    //         //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                    //     });






                    // return "M" +
                    //     d.source.x + "," +
                    //     d.source.y + "," +
                    //     d.target.x + "," +
                    //     d.target.y;

                });


            var gnodes = svg.selectAll('g.gnode')
                .data(nodes).enter().append('g')
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")"
                })
                .classed('gnode', true);


            // node.append("circle")
            //     .attr("r", function (d) { return xScale(d.weight); })
            //     .style("fill", function(d) { return colNodeScale(d.group); });

            var node = gnodes.append("circle")
                .style("fill", function (d) {
                    return colNodeScale(d.group);
                })
                .style("stroke", "#333")
                .style("stroke-width", "2px")
                .attr("r", function (d) {
                    return xScale(d.weight);
                })
                //.attr("class", "node")
                .on("mouseenter", function (d) {
                    is_connected(d, 0.05)
                    node.transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    d3.select(this).transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight + 10);
                    })
                })
                .on("mouseleave", function (d) {
                    node.transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    is_connected(d, 1);
                })
                .call(force.drag);

            // var node = gnodes
            //     .attr("r", function (d) {
            //         return xScale(d.weight);
            //     })

            var labels = gnodes.append("text")
                .attr("dx", 4)
                .attr("dy", 4)
                .attr("text-anchor", function (d) {
                    return d.x < w / 2 ? "end" : "start";
                })
                .attr("transform", function (d) {
                    return d.x < w / 2 ? "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(-20)" : "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(20)";
                })
                //.attr("transform", function(d) { return  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")"})
                //.attr("transform", function(d) { return (d.x-w/2)/(d.y-w/2) < 0 ?  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")" : "rotate(180)"; })
                .text(function (d) {
                    return d.name
                })

            var drag = force.drag()
                .on("dragstart", dragstart);
            //.on("dragstart", dragstartAll);


            //For not moving after drag
            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);

                for (i = 0; i < nodes.length; i++) {
                    nodes[i].fixed = true;
                }
            }


            //End of circular view
            */




            // var xScale = d3.scale.linear().range([5, 15]);
            // var colNodeScaleSeparate = d3.scale.ordinal()
            //     .range(["#767776", "#f91104", "#0af702"])
            //     .domain([0, 1, 2]);
            // var colNodeScale = d3.scale.linear().range(["grey", "red"]);
            // var colScale = d3.scale.linear().range(["grey", "red"]);

            d3.select("svg").remove();
            //d3.select("svg").remove();
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //var svg = d3.selectAll("#chart2").append("svg");

            console.log("In update kinase 2")
            var margin = 100,
                w = 1550 - 2 * margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;

            svg = d3.select("#chart")
                .append("svg")
                //.attr("style", "outline: thin solid blue;")
                .attr("width", w + 2*margin)
                .attr("height", h+ 2*margin);

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


            xScale.domain(d3.extent(nodes, function (d) {
                return d.weight;
            }));
            colNodeScaleSeparate.domain(d3.extent(nodes, function (d) {
                return d.group;
            }));
            colScale.domain(d3.extent(links, function (d) {
                return d.weight;
            }));


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
                .attr({
                    'id': 'arrowhead',
                    'viewBox': '-0 -5 10 10',
                    'refX': 25,
                    'refY': 0,
                    //'markerUnits':'strokeWidth',
                    'orient': 'auto',
                    'markerWidth': 5,
                    'markerHeight': 6,
                    'xoverflow': 'visible'
                })
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', 'black')
                .attr('stroke', '#ccc');


            var path = svg.append("svg:g").selectAll("path")
            //.data(links)
                .data(force.links())
                .enter().append("svg:path")
                .style("stroke", function (d) {
                    return colScale(d.value);
                })
                //.attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
                .attr("class", function (d) {
                    return "link ";
                })
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("stroke", "#666")
            /*stroke: #666;*/
            //stroke-width: 1px;
            //fill: none;
                .attr('marker-end', 'url(#arrowhead)');
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
                .text(function (d) {
                    return d.name;
                });

            text.append("svg:text")
                .attr("x", 12)
                .attr("y", ".31em")
                .text(function (d) {
                    return d.name;
                });
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
                .attr("r", function (d) {
                    return xScale(d.weight);
                })
                //.attr("data-legend",function(d) { return d.group})
                .style("fill", function (d) {
                    return colNodeScaleSeparate(d.group);
                })
            // fill: #ccc;
            // stroke: #333;
            // stroke-width: 3px;

                .style("stroke", "#333")
                .style("stroke-width", "2px")
                .on("dblclick", dblclick)
                .call(force.drag)

                //.call(drag)

                .on("mouseover", function (d) {
                    d3.select(this).append("text")
                        .attr("x", 12)
                        .attr("y", ".31em")
                        .attr("class", "shadow")
                        .text(d.name);

                    //d3.selectAll("text").remove();
                    d3.select(this).style("stroke-width", 6);

                    d3.select(this).style("stroke", "blue");

                    var nodeNeighbors = links.filter(function (link) {
                        // Filter the list of links to only those links that have our target
                        // node as a source or target
                        return link.source.index === d.index || link.target.index === d.index;
                    })
                        .map(function (link) {
                            // Map the list of links to a simple array of the neighboring indices - this is
                            // technically not required but makes the code below simpler because we can use
                            // indexOf instead of iterating and searching ourselves.
                            return link.source.index === d.index ? link.target.index : link.source.index;
                        });

                    d3.selectAll('circle').filter(function (node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    })
                        .style('stroke', 'blue')

                    //d3.selectAll('text').filter(d).style('fill', 'blue');

                    d3.selectAll('text').filter(function (node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    }).style('fill', 'blue')
                    //.style("font-size", "16px")
                        .style("font-weight", "bold");

                    path.style('stroke', function (l) {
                        if (d === l.source || d === l.target)
                            return "blue";
                        else
                            return "grey";
                    })

                    path.style('stroke-width', function (l) {
                        if (d === l.source || d === l.target)
                            return 3;
                        else
                            return 1;
                    })

                })
                .on("mouseout", function (d) {
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
                path.attr("d", function (d) {
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

                    if (d.target.x === d.source.x && d.target.y === d.source.y) {
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

                circle.attr('x', function (d) {
                    return d.x = pythag(Math.random() * 12, d.y, d.x);
                })
                    .attr('y', function (d) {
                        return d.y = pythag(Math.random() * 12, d.x, d.y);
                    })
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")"
                    });

                // circle.attr("transform", function(d) {
                //     return "translate(" + d.x + "," + d.y + ")";
                // });

                text.attr("transform", function (d) {
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
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].fixed = true;
                }
            }

/*
            // For legend
            var colNodeScaleSeparateInfo = d3.scale.ordinal()
                .range(["#767776", "#f91104", "#0af702"])
                .domain(["Query Gene Set", "Activating Kinases, Phosphorylating the Query Gene Set", "Down Stream Gene Sets, Phosphorylated by the Gene Set"]);


            var legend = svg.selectAll(".legend")
                .data(colNodeScaleSeparateInfo.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + (i) * 25 + ")";
                });

            legend.append("rect")
                .attr("x", w - 25)
                .attr("width", 25)
                .attr("height", 25)
                .style("fill", colNodeScaleSeparateInfo);

            legend.append("text")
                .attr("x", w - 35)
                .attr("y", 12.5)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });
*/

            // d3.select("#download").on("click", function(){
            //     d3.select(this)
            //         .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart").html()))
            //         .attr("download", "pathway_network.svg")
            // })
            // d3.select("#download").on("click", function(){
            //     d3.select(this
            //         .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart").html()))
            //         .attr("download", "kinase_network.svg")
            // })
            /*
            */
        }


        updateKinase2(network.nodes, network.edges);
        self.showSVG = true;
        //$scope.itemList.push(item.value);
    }





    $scope.showPhosphoNetwork = function (item) {
        //var net = item.value;

        //var net = item.value;
        console.log(item);
        //console.log(item.value);
        var net = item.toString();
        console.log(net);


        // {value: "Known+Predicted_Probability_Kinase_TargetGene"}
        // ];
        //


        if (net === "P100") {

            self.showP100div = true;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
        }



        var xScale = d3.scale.linear().range([5, 15]);
        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#767776", "#f91104", "#0af702"])
            .domain([0, 1, 2]);
        var colNodeScale = d3.scale.linear().range(["grey", "red"]);
        var colScale = d3.scale.linear().range(["grey", "red"]);
        var edgeWeightScale = d3.scale.linear().range([0.5, 1]);

        function updatePhospho(nodes, links) {
            //
            //var svg;
            //svg.remove();
            var force;



            d3.select("svg").remove();

            //d3.select('#circularView1').on('click', function() {
            //svg.remove();


            var margin = 75,
                w = 1550 - 2 * margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;


            svg = d3.select("#chart")
                .append("svg")
                //.attr("style", "outline: thin solid yellow;")
                .attr("width", w)
                .attr("height", h);
            // svg.append("rect")
            //     .attr("width", "100%")
            //     .attr("height", "100%")
            //     .attr("fill", "white");


            // This is for grouping nodes


            var force = d3.layout.force()
                .nodes(nodes)
                .links(links)
                .size([w, h]);

            colNodeScale.domain(d3.extent(nodes, function (d) {
                return d.group;
            }));
            // colScale.domain(d3.extent(links, function (d) {
            //     return d.weight;
            // }));
            xScale.domain(d3.extent(nodes, function (d) {
                return d.weight;
            }));

            var groupId = [];
            var maxId = 0;
            for (var i = 0; i < nodes.length; i++){
                var item = nodes[i];

                if (!groupId[item.group]){
                    groupId[item.group] = [];
                }

                groupId[item.group].push({name: item.name});
                // console.log(item.group);
                // console.log(groupId[item.group]);
                if (maxId < item.group){
                    maxId = item.group;
                }
            }
            console.log(maxId);
            console.log(groupId[0]);
            console.log(groupId[0].length);
            console.log(groupId[2]);

            var n1 = groupId[0].length;
            var n2 = groupId[2].length;
            console.log(n1);
            console.log(n2);



// evenly spaces nodes along arc
            var circleCoord = function (node, index, num_nodes) {
                var circumference = circle.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circle.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            // evenly spaces nodes along arc
            var circleCoordInner = function (node, index, num_nodes) {
                var circumference = circleInner.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circleInner.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            // evenly spaces nodes along arc
            var circleCoordOuter = function (node, index, num_nodes) {
                var circumference = circleOuter.node().getTotalLength();
                var pointAtLength = function (l) {
                    return circleOuter.node().getPointAtLength(l)
                };
                var sectionLength = (circumference) / num_nodes;
                var position = sectionLength * index + sectionLength / 2;
                return pointAtLength(circumference - position)
            }

            var is_connected = function (d, opacity) {
                lines.transition().style("stroke-opacity", function (o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
            //     lines.transition().style("stroke", function (o) {
            //         return o.source === d || o.target === d ? 2 : 1;
            //     });
            }

            var dim = w - 400;
            var circle = svg.append("path")
                .attr("d", "M 200, " + (dim / 2 + 200) + " a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim + ",0 a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim * -1 + ",0")
                .style("fill", "#f5f5f5");

            var dimInner = w - 400;
            var circleInner = svg.append("path")
                .attr("d", "M 200, " + (dimInner / 2 + 200) + " a " + dimInner / 2 + "," + dimInner / 2 + " 0 1,0 " + dimInner + ",0 a " + dimInner / 2 + "," + dimInner / 2 + " 0 1,0 " + dimInner * -1 + ",0")
                .style("fill", "#f5f5f5");

            var dimOuter = w - 800;
            var circleOuter = svg.append("path")
                .attr("d", "M 400, " + (dimOuter / 2 + 400) + " a " + dimOuter / 2 + "," + dimOuter / 2 + " 0 1,0 " + dimOuter + ",0 a " + dimOuter / 2 + "," + dimOuter / 2 + " 0 1,0 " + dimOuter * -1 + ",0")
             .style("fill", "#f5f5f5");


            force.start();

            if (nodes.length < 500){
                nodes.forEach(function (n, i) {
                    var coord = circleCoord(n, i, nodes.length)
                    n.x = coord.x
                    n.y = coord.y
                });
            }
            else{
                var innerIter = 0,
                    outerIter = 0;
                nodes.forEach(function(n, i) {
                    var item = nodes[i];


                    if (n.group == 0){
                        var coord = circleCoordInner(n, innerIter, n1)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordInner(n.group)
                        // n.y = parallelCoordy(n1, groupId[1].length)
                        innerIter = innerIter + 1;
                    }
                    if (n.group == 2){
                        coord = circleCoordOuter(n, outerIter, n2)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordx(n.group)
                        // n.y = parallelCoordy(n2, groupId[2].length)
                        outerIter = outerIter + 1;
                    }

                });
            }



            // use this one for straight line links...
            // var lines = svg.selectAll("line.node-link")
            //     .data(links).enter().append("line")
            //     .attr("class", "node-link")
            //     .attr("x1", function(d) { return d.source.x; })
            //     .attr("y1", function(d) { return d.source.y; })
            //     .attr("x2", function(d) { return d.target.x; })
            //     .attr("y2", function(d) { return d.target.y; });

            var lines = svg.selectAll("path.node-link")
                .data(links).enter().append("path")
                .style("fill", "none")
                .attr("stroke-dasharray", function (d) {
                    if (d.value < 100) {
                        return "5,5"; //these classes are defined in custom.css
                    } else {
                        return "5,0";//these classes are defined in custom.css
                    }
                })
                .style("stroke-width", function (d) { return Math.log(edgeWeightScale(d.value))/2.0 + "px"; })
                //.style("stroke-width", function (d) { return edgeWeightScale(d.value)/100.0 + "px"; })
                .style("stroke", "#514646")
                .attr("class", "node-link")
                .attr("d", function (d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                    return "M" +
                        d.source.x + "," +
                        d.source.y + "," +
                        d.target.x + "," +
                        d.target.y;

                });


            var gnodes = svg.selectAll('g.gnode')
                .data(nodes).enter().append('g')
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")"
                })
                .classed('gnode', true);


            // node.append("circle")
            //     .attr("r", function (d) { return xScale(d.weight); })
            //     .style("fill", function(d) { return colNodeScale(d.group); });

            var node = gnodes.append("circle")
                .style("fill", function (d) {
                    return colNodeScale(d.group);
                })
                .style("stroke", "#333")
                .style("stroke-width", "2px")
                .attr("r", function (d) {
                    return xScale(d.weight);
                })
                //.attr("class", "node")
                .on("mouseenter", function (d) {
                    is_connected(d, 0.05)
                    node.transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    d3.select(this).transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight + 10);
                    })
                })
                .on("mouseleave", function (d) {
                    node.transition().duration(100).attr("r", function (d) {
                        return xScale(d.weight);
                    })
                    is_connected(d, 1);
                })
                .call(force.drag);

            // var node = gnodes
            //     .attr("r", function (d) {
            //         return xScale(d.weight);
            //     })

            var labels = gnodes.append("text")
                .attr("dx", 4)
                .attr("dy", 4)
                .attr("text-anchor", function (d) {
                    return d.x < w / 2 ? "end" : "start";
                })
                .attr("transform", function (d) {
                    return d.x < w / 2 ? "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(-20)" : "rotate(" + Math.atan((d.y - w / 2) / (d.x - w / 2)) * 180 / Math.PI + ")translate(20)";
                })
                //.attr("transform", function(d) { return  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")"})
                //.attr("transform", function(d) { return (d.x-w/2)/(d.y-w/2) < 0 ?  "rotate(" +Math.atan((d.y-w/2)/(d.x-w/2))*180/Math.PI+ ")" : "rotate(180)"; })
                .text(function (d) {
                    return d.name
                })

            var drag = force.drag()
                .on("dragstart", dragstart);
            //.on("dragstart", dragstartAll);


            //For not moving after drag
            function dragstart(d) {
                d3.select(this).classed("fixed", d.fixed = true);

                for (i = 0; i < nodes.length; i++) {
                    nodes[i].fixed = true;
                }
            }


        }

        //);


        /*

         var margin = 100,
         w = 1500 - 2 * margin,
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


         xScale.domain(d3.extent(nodes, function (d) {
         return d.weight;
         }));
         colNodeScale.domain(d3.extent(nodes, function (d) {
         return d.group;
         }));
         colScale.domain(d3.extent(links, function (d) {
         return d.weight;
         }));
         // edgeWeightScale.domain(d3.extent(links, function (d) {
         //     return d.value;
         // }));

         //var edgeWeightScale = d3.scale.linear().range([1, 300]);

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
         .attr("r", function (d) {
         return xScale(d.weight);
         })
         .enter().append("svg:path")
         // .style("stroke-width", function (d) {
         //     return edgeWeightScale(d.value) + "px";
         // })
         .attr("stroke-dasharray", function (d) {
         if (d.value < 100) {
         return "5,5"; //these classes are defined in custom.css
         } else {
         return "5,0";//these classes are defined in custom.css
         }
         })
         //.style("stroke-dasharray", function (d) { return edgeWeightScale(d.value) + "px"; })
         //.style("stroke", function (d) {return colScale(d.value); })
         .attr("class", function (d) {
         return "link";
         });


         var text = svg.append("svg:g").selectAll("g")
         .data(force.nodes())
         .style("font", "15px Times New Roman")
         .enter().append("svg:g");
         // .on("mouseover", function(d) {
         //
         //     )};

         // A copy of the text with a thick white stroke for legibility.
         text.append("svg:text")
         .attr("x", 16)
         .attr("y", ".31em")
         .attr("class", "shadow")
         .style("font", "15px Times New Roman")
         .text(function (d) {
         return d.name;
         });


         //This one is for the actual text
         text.append("svg:text")
         .attr("x", 16)
         .attr("y", ".31em")
         .style("font", "15px Times New Roman")
         .text(function (d) {
         return d.name;
         });


         // text.append("svg:text")
         //     .attr("x", 12)
         //     .attr("y", ".31em")
         //     .style("font", "15px Times New Roman")
         //     .text(function(d) { return d.name; });
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
         .attr("r", function (d) {
         return xScale(d.weight);
         })
         .style("fill", function (d) {
         return colNodeScale(d.group);
         })
         .on("dblclick", dblclick)
         .call(force.drag)
         .on("mouseover", function (d) {
         d3.select(this).append("text")
         .attr("x", 16)
         .attr("y", ".31em")
         .attr("class", "shadow")
         .text(d.name);

         //d3.selectAll("text").remove();
         d3.select(this).style("stroke-width", 6);

         d3.select(this).style("stroke", "blue");

         var nodeNeighbors = links.filter(function (link) {
         // Filter the list of links to only those links that have our target
         // node as a source or target
         return link.source.index === d.index || link.target.index === d.index;
         })
         .map(function (link) {
         // Map the list of links to a simple array of the neighboring indices - this is
         // technically not required but makes the code below simpler because we can use
         // indexOf instead of iterating and searching ourselves.
         return link.source.index === d.index ? link.target.index : link.source.index;
         });

         d3.selectAll('circle').filter(function (node) {
         // I filter the selection of all circles to only those that hold a node with an
         // index in my listg of neighbors
         return nodeNeighbors.indexOf(node.index) > -1;
         })
         .style('stroke', 'blue')

         //d3.selectAll('text').filter(d).style('fill', 'blue');

         d3.selectAll('text').filter(function (node) {
         // I filter the selection of all circles to only those that hold a node with an
         // index in my listg of neighbors
         return nodeNeighbors.indexOf(node.index) > -1;
         }).style('fill', 'blue')
         //.style("font-size", "16px")
         .style("font-weight", "bold");

         path.style('stroke', function (l) {
         if (d === l.source || d === l.target)
         return "blue";
         else
         return "grey";
         })

         // path.style('stroke-width', function(l) {
         //     if (d === l.source || d === l.target)
         //         return 3;
         //     else
         //         return 1;
         // })

         })
         .on("mouseout", function (d) {
         //d3.select(this).classed("hover", false);
         // if(isConnected(d, o)) {
         //svg.selectAll('circle').style('stroke', 'black');
         //d3.select(this).style("stroke-width", 3);
         d3.select(this).style("stroke", "#333");
         // d3.select(this).select("circle").style("stroke", "black");
         // d3.select(this).select("text").style("font", "12px Times New Roman");
         // d3.selectAll("rect." + d.location).style("stroke-width", 1);
         // d3.selectAll("rect." + d.location).style("stroke", "gray");
         // d3.selectAll("text." + d.location).style("font", "12px Times New Roman");
         // d3.selectAll("tr." + d.name).style("background-color", "white");
         path.style('stroke', "grey");
         //path.style('stroke-width', 1);
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
         path.attr("d", function (d) {
         var dx = d.target.x - d.source.x,
         dy = d.target.y - d.source.y,

         dr = Math.sqrt(dx * dx + dy * dy);
         //console.log(d.source.x);
         // console.log(d.target.x);
         return "M" + d.source.x + "," + d.source.y + "," + d.target.x + "," + d.target.y;
         //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
         });

         circle.attr('x', function (d) {
         return d.x = pythag(Math.random() * 12, d.y, d.x);
         })
         .attr('y', function (d) {
         return d.y = pythag(Math.random() * 12, d.x, d.y);
         })
         .attr("transform", function (d) {
         return "translate(" + d.x + "," + d.y + ")"
         });

         // circle.attr("transform", function(d) {
         //     return "translate(" + d.x + "," + d.y + ")";
         // });

         text.attr("transform", function (d) {
         return "translate(" + d.x + "," + d.y + ")";
         });
         }

         //For not moving after drag
         var drag = force.drag()
         .on("dragstart", dragstart);
         //.on("dblclick", dblclick);

         //For not moving after drag
         function dblclick(d) {
         d3.select(this).classed("fixed", d.fixed = false);
         }

         //For not moving after drag
         function dragstart(d) {
         d3.select(this).classed("fixed", d.fixed = true);
         for (i = 0; i < nodes.length; i++) {
         nodes[i].fixed = true;
         }

         }


         // For legend
         var colNodeScaleSeparateInfo = d3.scale.ordinal()
         .range(["#767776", "#f91104"])
         .domain(["Query Gene Set", "Kinases Perturbation"]);


         var legend = svg.selectAll(".legend")
         .data(colNodeScaleSeparateInfo.domain())
         .enter().append("g")
         .attr("class", "legend")
         .attr("transform", function (d, i) {
         return "translate(0," + (i) * 25 + ")";
         });

         legend.append("rect")
         .attr("x", w - 25)
         .attr("width", 25)
         .attr("height", 25)
         .style("fill", colNodeScaleSeparateInfo);

         legend.append("text")
         .attr("x", w - 35)
         .attr("y", 12.5)
         .attr("dy", ".35em")
         .style("text-anchor", "end")
         .text(function (d) {
         return d;
         });

         d3.select("#download3").on("click", function () {
         d3.select(this)
         .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart").html()))
         .attr("download", "phospho_network.svg")
         })
         }
         */

         // $scope.phosphoOptions = [
         // {value: "Known_Kinase_TargetGene"},
         // {value: "Known+Predicted_Blosum50_Kinase_TargetGene"},
         // {value: "Known+Predicted_Probability_Kinase_TargetGene"}
         // ];

         // $scope.selectedphosphoPathways = $scope.phosphoOptions[0];
         // var pNetwork = self.phosphoNetwork.Known+Predicted_Probability_Kinase_TargetGene;
         // var network = self.phosphoNetwork.Known+Predicted_Probability_Kinase_TargetGene;
         // console.log('network');
         // console.log(network);

         //$scope.selectedphosphoPathways = $scope.phosphoOptions[0];
         var pNetwork = self.p100phospho["Known+Predicted_Probability_Kinase_TargetGene"];
         console.log("here");
         console.log(pNetwork);
         console.log(self.p100phospho);
         updatePhospho(pNetwork.nodes, pNetwork.edges);
         $scope.changedPhosphoValue = function (item) {
         //var net = item.value;
         console.log(item);
         console.log(item.value);
         var net = item.value.toString();
         console.log(net);

         var pNetwork = self.p100phospho[net];
         console.log('network');
         console.log(pNetwork);
         updatePhospho(pNetwork.nodes, pNetwork.edges);
         //$scope.itemList.push(item.value);
         }


         //
         //
         // console.log('network');
         // console.log(network);
         //
         //
         // updatePhospho(network.nodes, network.links);

        self.showSVG = true;
    }


}])
;


appModule.controller('MainCtrl', ['$http', '$scope', '$window', function ($http, $scope, $window) {

    var self = this;
//This is for showing nav-bar header in scroll down
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 800) {
            $('.topMenu').fadeIn();

        } else {
            $('.topMenu').fadeOut();

        }

    });

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
    self.patt1 = /[A-Z]/;
    self.patt2 = /[a-z]/;
    self.modificationMap = {'a': 42.03, 'm': 14.02, 'p': 79.97};

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

    $scope.sort = function (keyname) {
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    // $scope.newPage = function (){
    //     location.href = '#/new-page.html';
    // };

    //function($scope, $window) {
    $scope.customNavigateApi = function (msg) {
        $window.open("/pln/api/pathway/genes/" + msg, '_blank');
    };

    $scope.customNavigateGraphics = function (msg) {
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
            .domain([0, 1, 2]);
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
                w = 1500 - 2 * margin,
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


            xScale.domain(d3.extent(nodes, function (d) {
                return d.weight;
            }));
            colNodeScale.domain(d3.extent(nodes, function (d) {
                return d.group;
            }));
            colScale.domain(d3.extent(links, function (d) {
                return d.weight;
            }));


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
                .style("stroke", function (d) {
                    return colScale(d.value);
                })
                .attr("class", function (d) {
                    return "link ";
                });


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
                .text(function (d) {
                    return d.name;
                });

            text.append("svg:text")
                .attr("x", 12)
                .attr("y", ".31em")
                .text(function (d) {
                    return d.name;
                });
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
                .attr("r", function (d) {
                    return xScale(d.weight);
                })
                .style("fill", function (d) {
                    return colNodeScale(d.group);
                })
                .on("dblclick", dblclick)
                .call(force.drag)
                .on("mouseover", function (d) {
                    d3.select(this).append("text")
                        .attr("x", 12)
                        .attr("y", ".31em")
                        .attr("class", "shadow")
                        .text(d.name);

                    //d3.selectAll("text").remove();
                    d3.select(this).style("stroke-width", 6);

                    d3.select(this).style("stroke", "blue");

                    var nodeNeighbors = links.filter(function (link) {
                        // Filter the list of links to only those links that have our target
                        // node as a source or target
                        return link.source.index === d.index || link.target.index === d.index;
                    })
                        .map(function (link) {
                            // Map the list of links to a simple array of the neighboring indices - this is
                            // technically not required but makes the code below simpler because we can use
                            // indexOf instead of iterating and searching ourselves.
                            return link.source.index === d.index ? link.target.index : link.source.index;
                        });

                    d3.selectAll('circle').filter(function (node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    })
                        .style('stroke', 'blue')

                    //d3.selectAll('text').filter(d).style('fill', 'blue');

                    d3.selectAll('text').filter(function (node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    }).style('fill', 'blue')
                    //.style("font-size", "16px")
                        .style("font-weight", "bold");

                    path.style('stroke', function (l) {
                        if (d === l.source || d === l.target)
                            return "blue";
                        else
                            return "grey";
                    })

                    path.style('stroke-width', function (l) {
                        if (d === l.source || d === l.target)
                            return 3;
                        else
                            return 1;
                    })

                })
                .on("mouseout", function (d) {
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
                path.attr("d", function (d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,

                        dr = Math.sqrt(dx * dx + dy * dy);
                    //console.log(d.source.x);
                    // console.log(d.target.x);
                    return "M" + d.source.x + "," + d.source.y + "," + d.target.x + "," + d.target.y;
                    //return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                });

                circle.attr('x', function (d) {
                    return d.x = pythag(Math.random() * 12, d.y, d.x);
                })
                    .attr('y', function (d) {
                        return d.y = pythag(Math.random() * 12, d.x, d.y);
                    })
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")"
                    });

                // circle.attr("transform", function(d) {
                //     return "translate(" + d.x + "," + d.y + ")";
                // });

                text.attr("transform", function (d) {
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
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].fixed = true;
                }
            }


            // For legend
            var colNodeScaleSeparateInfo = d3.scale.ordinal()
                .range(["#767776", "#f91104"])
                .domain(["Query Gene Set", "Pathways / Kinases Perturbation"]);


            var legend = svg.selectAll(".legend")
                .data(colNodeScaleSeparateInfo.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + (i) * 25 + ")";
                });

            legend.append("rect")
                .attr("x", w - 25)
                .attr("width", 25)
                .attr("height", 25)
                .style("fill", colNodeScaleSeparateInfo);

            legend.append("text")
                .attr("x", w - 35)
                .attr("y", 12.5)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });

            // d3.select("#download").on("click", function(){
            //     d3.select(this)
            //         .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#chart").html()))
            //         .attr("download", "pathway_network.svg")
            // })
        }


        function updateKinase(nodes, links) {
            // d3.select("svg").remove();
            svg2.remove();
            console.log("In update kinase")
            var margin = 100,
                w = 1500 - 2 * margin,
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


            xScale.domain(d3.extent(nodes, function (d) {
                return d.weight;
            }));
            colNodeScaleSeparate.domain(d3.extent(nodes, function (d) {
                return d.group;
            }));
            colScale.domain(d3.extent(links, function (d) {
                return d.weight;
            }));


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
                .attr({
                    'id': 'arrowhead',
                    'viewBox': '-0 -5 10 10',
                    'refX': 25,
                    'refY': 0,
                    //'markerUnits':'strokeWidth',
                    'orient': 'auto',
                    'markerWidth': 5,
                    'markerHeight': 6,
                    'xoverflow': 'visible'
                })
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', 'black')
                .attr('stroke', '#ccc');


            var path = svg2.append("svg:g").selectAll("path")
            //.data(links)
                .data(force.links())
                .enter().append("svg:path")
                .style("stroke", function (d) {
                    return colScale(d.value);
                })
                //.attr("marker-end", function(d) { return "url(#" + d.type + ")"; })
                .attr("class", function (d) {
                    return "link ";
                })
                .attr('marker-end', 'url(#arrowhead)');
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
                .text(function (d) {
                    return d.name;
                });

            text.append("svg:text")
                .attr("x", 12)
                .attr("y", ".31em")
                .text(function (d) {
                    return d.name;
                });
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
                .attr("r", function (d) {
                    return xScale(d.weight);
                })
                //.attr("data-legend",function(d) { return d.group})
                .style("fill", function (d) {
                    return colNodeScaleSeparate(d.group);
                })
                //.style("fill", function(d) { return color(d.type); })
                .on("dblclick", dblclick)
                .call(force.drag)

                //.call(drag)

                .on("mouseover", function (d) {
                    d3.select(this).append("text")
                        .attr("x", 12)
                        .attr("y", ".31em")
                        .attr("class", "shadow")
                        .text(d.name);

                    //d3.selectAll("text").remove();
                    d3.select(this).style("stroke-width", 6);

                    d3.select(this).style("stroke", "blue");

                    var nodeNeighbors = links.filter(function (link) {
                        // Filter the list of links to only those links that have our target
                        // node as a source or target
                        return link.source.index === d.index || link.target.index === d.index;
                    })
                        .map(function (link) {
                            // Map the list of links to a simple array of the neighboring indices - this is
                            // technically not required but makes the code below simpler because we can use
                            // indexOf instead of iterating and searching ourselves.
                            return link.source.index === d.index ? link.target.index : link.source.index;
                        });

                    d3.selectAll('circle').filter(function (node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    })
                        .style('stroke', 'blue')

                    //d3.selectAll('text').filter(d).style('fill', 'blue');

                    d3.selectAll('text').filter(function (node) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(node.index) > -1;
                    }).style('fill', 'blue')
                    //.style("font-size", "16px")
                        .style("font-weight", "bold");

                    path.style('stroke', function (l) {
                        if (d === l.source || d === l.target)
                            return "blue";
                        else
                            return "grey";
                    })

                    path.style('stroke-width', function (l) {
                        if (d === l.source || d === l.target)
                            return 3;
                        else
                            return 1;
                    })

                })
                .on("mouseout", function (d) {
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
                path.attr("d", function (d) {
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

                    if (d.target.x === d.source.x && d.target.y === d.source.y) {
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

                circle.attr('x', function (d) {
                    return d.x = pythag(Math.random() * 12, d.y, d.x);
                })
                    .attr('y', function (d) {
                        return d.y = pythag(Math.random() * 12, d.x, d.y);
                    })
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")"
                    });

                // circle.attr("transform", function(d) {
                //     return "translate(" + d.x + "," + d.y + ")";
                // });

                text.attr("transform", function (d) {
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
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].fixed = true;
                }
            }


            // For legend
            var colNodeScaleSeparateInfo = d3.scale.ordinal()
                .range(["#767776", "#f91104", "#0af702"])
                .domain(["Query Gene Set", "Activating Kinases, Phosphorylating the Query Gene Set", "Down Stream Gene Sets, Phosphorylated by the Gene Set"]);


            var legend = svg2.selectAll(".legend")
                .data(colNodeScaleSeparateInfo.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate(0," + (i) * 25 + ")";
                });

            legend.append("rect")
                .attr("x", w - 25)
                .attr("width", 25)
                .attr("height", 25)
                .style("fill", colNodeScaleSeparateInfo);

            legend.append("text")
                .attr("x", w - 35)
                .attr("y", 12.5)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) {
                    return d;
                });


            d3.select("#download2").on("click", function () {
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
                    {value: "KEGG_2013"},
                    {value: "KEGG_2015"},
                    {value: "KEGG_2016"},
                    {value: "WikiPathways_2013"},
                    {value: "WikiPathways_2015"},
                    {value: "WikiPathways_2016"},
                    {value: "Panther_2015"},
                    {value: "Panther_2016"},
                    {value: "Kinase_Perturbations_from_GEO"}
                ];
                $scope.selectedPathways = $scope.pathways[2];
                var network = self.network.KEGG_2016;
                update(network.nodes, network.edges);
                $scope.changedValue = function (item) {
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
