/**
 * Created by Behrouzsh on 12/7/16.
 */
//var appModule = angular.module('plpModule', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap']);
var appModule = angular.module('plpModule', ['ui.bootstrap', , 'ngSanitize', 'angular.filter','angularUtils.directives.dirPagination','mgcrea.ngStrap']);
//var appModule = angular.module('plpModule', ['ui.bootstrap', 'angularUtils.directives.dirPagination', 'mgcrea.ngStrap']);

appModule.factory("SVGFetcher", ['$http', function($http) {
    var get = function(inputUrl) {
        return $http({
            method: "GET",
            url:inputUrl,
            transformResponse : function(data) {
                // string -> XML document object
                return $.parseXML(data);
            }
            //url: "svg.html"
        }).success(function(resp, status, headers, config) {
            return resp;
        }).error(function(resp, status, headers, config) {
            console.log("EPIC fail", resp);
        });
    };

    return { get: get };
}]);

appModule.factory('SharedService', function( $http, $q, $sce, $location, NgTableParams) {
    //Defining Start point variables
    var self = this;
    var vars = {};
    //vars.selectedPerturbation = "None";
    vars.assayTab = "P100";
    vars.exploreTab = "P100";
    vars.downloadTab = "None";
    vars.exploreCompound = "None";

    vars.P100ExploreCompoundInput = "None";
    vars.GCPExploreCompoundInput = "None";
    vars.RPPAExploreCompoundInput = "None";
    vars.MicroExploreCompoundInput = "None";
    vars.SWATHExploreCompoundInput = "None";
    vars.DToxSExploreCompoundInput = "None";

    vars.P100ExploreCompounds = [];
    vars.GCPExploreCompounds = [];
    vars.RPPAExploreCompounds = [];
    vars.MicroExploreCompounds = [];
    vars.SWATHExploreCompounds = [];
    vars.DToxSExploreCompounds = [];

    vars.showCompoundToDSTable = false;
    vars.compoundAndDS = "None";
    vars.showCompoundToDSTableSmiles = false;
    vars.compoundAndDSSmiles = "None";

    vars.showP100Table = false;
    vars.showGCPTable = false;
    vars.showSWATHTable = false;
    vars.showDToxSTable = false;
    vars.showRPPATable = false;
    vars.showMicroTable = false;


    vars.showExploreP100Table = false;
    vars.showExploreGCPTable = false;
    vars.showExploreSWATHTable = false;
    vars.showExploreDToxSTable = false;
    vars.showExploreRPPATable = false;
    vars.showExploreMicroTable = false;

    vars.showPartFlag = 1;


    vars.selectedGeneAsInput = "SETD1B";
    vars.showCompoundToDSTableGenes = false;
    vars.selectedPerturbationGenes = "";
    vars.selectedCpInfoGenes = "";
    vars.tableGeneSimilar = new NgTableParams({
        count: 5
    }, {
        total: 0,  dataset: [],counts: [5, 10, 25]});



    vars.P100TableParams = new NgTableParams({
        count: 5
    }, {
        total: 0,  dataset: [],counts: [5, 10, 25]});
    vars.GCPTableParams = new NgTableParams({
        count: 5
    }, {
        total: 0,  dataset: [],counts: [5, 10, 25]});
    vars.RPPATableParams = new NgTableParams({
        count: 5
    }, {
        total: 0,  dataset: [],counts: [5, 10, 25]});
    vars.MicroTableParams = new NgTableParams({
        count: 5
    }, {
        total: 0,  dataset: [],counts: [5, 10, 25]});
    vars.SWATHTableParams = new NgTableParams({
        count: 5
    }, {
        total: 0,  dataset: [],counts: [5, 10, 25]});
    vars.DToxSTableParams = new NgTableParams({
        count: 5
    }, {
        total: 0,  dataset: [],counts: [5, 10, 25]});

    vars.showGeneSvg = false;
    vars.compoundAndDSGenes = [];





    vars.selectedSmile = "COC1CC(CC(C)C2CC(=O)C(C)C=C(C)C(O)C(OC)C(=O)C(C)CC(C)C=CC=CC=C(C)C(CC3CCC(C)C(O)(O3)C(=O)C(=O)N4CCCCC4C(=O)O2)OC)CCC1O";
    vars.showSimilarSmileCompounds = false;
    vars.cpSmileSimilar = {};
    vars.gotSVGForSmile = false;
    vars.svgImg2;

    vars.selectedPerturbation = "TRAMETINIB";
    vars.selectedPerturbationSmiles = "";

    vars.selectedCpInfoSmiles = "";

    vars.selectedCpInfo = "";
    var htmlSce = '<ul><li>render me please</li></ul>';



    vars.apiSMILESSvg = $sce.trustAsHtml(htmlSce);
    vars.showSimilarSmileCompoundsFinal = false;
    vars.tableSmileSimilar = new NgTableParams({
        count: 5
    }, {
        total: 0,  dataset: [],counts: [5, 10, 25]});

    vars.svgImg2 = '<a id="a"><b id="b">hey!</b></a>';
        // "<?xml version='1.0' encoding='UTF-8'?><!DOCTYPE ><svg version='1.2' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='18.97mm' height='22.49mm' viewBox='0 0 18.97 22.49'></svg>";

    vars.showSmileSvg = false;

    var sharedCompound = '';
    // SharedService.setVar('exploreCompound',selectedPerturbation);
    // SharedService.setVar('exploreTab',"GCP");
    var deferred = $q.defer();

    function setCompound(data) {
        // console.log("In setting conpound");
        sharedCompound = data;
        // console.log(sharedCompound);
        // console.log("End of setting conpound");
    }
    function getSharedCompound() {

        return sharedCompound;
    }





    return {

        setCompound: setCompound,

        getVar: function (variable) {

            return vars[variable.toString()];
        },

        getSharedCompound: getSharedCompound,

        setVar: function (key,value) {
            vars[key.toString()] = value;
            // console.log("In shared service+++++");
            // console.log(key);
            // console.log(value);
            //console.log(vars[key.toString()]);
        }
    }

});

appModule.controller('DataViewCtrl', ['$scope', '$location', '$anchorScroll', '$http', '$timeout', '$window', '$routeParams', '$filter', '$q', 'SharedService', function ($scope, $location, $anchorScroll, $http, $timeout, $window, $routeParams, $filter, $q, SharedService) {

    'use strict';

//This is for showing nav-bar header in scroll down
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 500) {
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
            console.log(self.P100ProcessedJSON.TRAMETINIB);
            self.selectedPerturbation = 'TRAMETINIB';
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
    self.selectedPerturbation = 'TRAMETINIB';


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



//("assayViewCtrl", ['$scope', '$http', '$location', '$window', '$timeout', '$interval', '$routeParams', '$filter', 'filterFilter', 'SharedService', function ($scope, $http, $location, $window, $timeout, $interval, $routeParams, $filter, filterFilter, SharedService)
appModule.controller("assayViewCtrl", ['$scope', '$http', '$location', '$window', '$timeout', '$interval', '$routeParams', 'NgTableParams','SharedService', function ($scope, $http, $location, $window, $timeout, $interval, $routeParams, NgTableParams ,SharedService) {

    var self = this;
    self.showSVG = false;
    self.showSignature = false;
    var timeout;
    self.initNetworkJSON = {};
    self.perturbJSON = {};
    self.P100ProcessedJSON = {};
    self.showP100Table = false;
    self.exploreTab = SharedService.getVar('exploreTab');

    self.showP100ExplreCompoundInput = false;
    self.showGCPExplreCompoundInput = false;
    self.showSWATHExplreCompoundInput = false;
    self.showMicroExplreCompoundInput = false;
    self.showRPPAExplreCompoundInput = false;
    self.showDToxSExplreCompoundInput = false;


    self.P100ExploreCompounds = SharedService.getVar('P100ExploreCompounds');
    self.GCPExploreCompounds = SharedService.getVar('GCPExploreCompounds');
    self.RPPAExploreCompounds = SharedService.getVar('RPPAExploreCompounds');
    self.MicroExploreCompounds = SharedService.getVar('MicroExploreCompounds');
    self.SWATHExploreCompounds = SharedService.getVar('SWATHExploreCompounds');
    self.DToxSExploreCompounds = SharedService.getVar('DToxSExploreCompounds');


    self.P100ExploreCompoundInput = SharedService.getVar('P100ExploreCompoundInput');
    self.GCPExploreCompoundInput = SharedService.getVar('GCPExploreCompoundInput');
    self.RPPAExploreCompoundInput = SharedService.getVar('RPPAExploreCompoundInput');
    self.MicroExploreCompoundInput = SharedService.getVar('MicroExploreCompoundInput');
    self.SWATHExploreCompoundInput = SharedService.getVar('SWATHExploreCompoundInput');
    self.DToxSExploreCompoundInput = SharedService.getVar('DToxSExploreCompoundInput');

    $scope.removeFromGCPCps = function (cp) {
        var index = self.GCPExploreCompounds.indexOf(cp);
        if (index > -1) {
            self.GCPExploreCompounds.splice(index, 1);
        }
    }
    $scope.removeFromP100Cps = function (cp) {
        var index = self.P100ExploreCompounds.indexOf(cp);
        if (index > -1) {
            self.P100ExploreCompounds.splice(index, 1);
        }
    }
    $scope.removeFromRPPACps = function (cp) {
        var index = self.RPPAExploreCompounds.indexOf(cp);
        if (index > -1) {
            self.RPPAExploreCompounds.splice(index, 1);
        }
    }
    $scope.removeFromMicroCps = function (cp) {
        var index = self.MicroExploreCompounds.indexOf(cp);
        if (index > -1) {
            self.MicroExploreCompounds.splice(index, 1);
        }
    }
    $scope.removeFromDToxSCps = function (cp) {
        var index = self.DToxSExploreCompounds.indexOf(cp);
        if (index > -1) {
            self.DToxSExploreCompounds.splice(index, 1);
        }
    }
    $scope.removeFromSWATHCps = function (cp) {
        var index = self.SWATHExploreCompounds.indexOf(cp);
        if (index > -1) {
            self.SWATHExploreCompounds.splice(index, 1);
        }
    }


    $scope.addToGCPCps = function (cp) {
        if (self.GCPExploreCompounds.indexOf(cp) == -1) {
            self.GCPExploreCompounds.push(cp)
            SharedService.setVar('GCPExploreCompounds', self.GCPExploreCompounds);
        }
    }



    $scope.addToP100Cps = function (cp) {
        if (self.P100ExploreCompounds.indexOf(cp) == -1) {
            self.P100ExploreCompounds.push(cp)
            SharedService.setVar('P100ExploreCompounds', self.P100ExploreCompounds);
        }
    }
    $scope.addToMicroCps = function (cp) {
        if (self.MicroExploreCompounds.indexOf(cp) == -1) {
            self.MicroExploreCompounds.push(cp)
            SharedService.setVar('MicroExploreCompounds', self.MicroExploreCompounds);
        }
    }
    $scope.addToDToxSCps = function (cp) {
        if (self.DToxSExploreCompounds.indexOf(cp) == -1) {
            self.DToxSExploreCompounds.push(cp)
            SharedService.setVar('DToxSExploreCompounds', self.DToxSExploreCompounds);
        }
    }
    $scope.addToSWATHCps = function (cp) {
        if (self.SWATHExploreCompounds.indexOf(cp) == -1) {
            self.SWATHExploreCompounds.push(cp)
            SharedService.setVar('SWATHExploreCompounds', self.SWATHExploreCompounds);
        }
    }
    $scope.addToRPPACps = function (cp) {
        if (self.RPPAExploreCompounds.indexOf(cp) == -1) {
            self.RPPAExploreCompounds.push(cp)
            SharedService.setVar('RPPAExploreCompounds', self.RPPAExploreCompounds);
        }
    }




    $scope.changeGCPCp = function (cp) {
        self.GCPExploreCompoundInput = cp;
        SharedService.setVar('GCPExploreCompoundInput', self.GCPExploreCompoundInput);

    }
    $scope.changeP100Cp = function (cp) {
        self.P100ExploreCompoundInput = cp;
        SharedService.setVar('P100ExploreCompoundInput', self.P100ExploreCompoundInput);

    }
    $scope.changeDToxSCp = function (cp) {
        self.DToxSExploreCompoundInput = cp;
        SharedService.setVar('DToxSExploreCompoundInput', self.DToxSExploreCompoundInput);

    }
    $scope.changeMicroCp = function (cp) {
        self.MicroExploreCompoundInput = cp;
        SharedService.setVar('MicroExploreCompoundInput', self.MicroExploreCompoundInput);

    }
    $scope.changeSWATHCp = function (cp) {
        self.SWATHExploreCompoundInput = cp;
        SharedService.setVar('SWATHExploreCompoundInput', self.SWATHExploreCompoundInput);

    }
    $scope.changeRPPACp = function (cp) {
        self.RPPAExploreCompoundInput = cp;
        SharedService.setVar('RPPAExploreCompoundInput', self.RPPAExploreCompoundInput);

    }

    if(self.P100ExploreCompoundInput !== "None")
    {
        $http.get('/lincsproteomics/data/P100_processed_perturb_new.json').success(function (data) {

            self.P100ProcessedJSON = data;
            self.showP100ExplreCompoundInput = true;
            console.log(self.P100ProcessedJSON);
            console.log(self.P100ProcessedJSON[self.P100ExploreCompoundInput]);
            self.P100TableParams = new NgTableParams({

                count: 5
            }, {
                total: self.P100ProcessedJSON[self.P100ExploreCompoundInput].length,
                dataset: self.P100ProcessedJSON[self.P100ExploreCompoundInput],
                counts: [5, 10, 25]
            });
            console.log(self.P100TableParams);
            self.showExploreP100Table = true;
            SharedService.setVar("showExploreP100Table", self.showExploreP100Table);
            SharedService.setVar("P100TableParams", self.P100TableParams);
        })

        // self.tableP100Params = new NgTableParams({
        //
        //     count: 5
        // }, {
        //     total: self.P100ProcessedJSON[self.P100ExplreCompoundInput].length,  dataset: self.P100ProcessedJSON[self.P100ExplreCompoundInput],counts: [5, 10, 25]});

    }



    if(self.GCPExploreCompoundInput !== "None")
    {
        self.showGCPExplreCompoundInput = true;



        $http.get('/lincsproteomics/data/GCP_processed_perturb_new.json').success(function (data) {
            self.GCPProcessedJSON = data;


            self.GCPTableParams = new NgTableParams({

                count: 5
            }, {
                total: self.GCPProcessedJSON[self.GCPExploreCompoundInput].length,
                dataset: self.GCPProcessedJSON[self.GCPExploreCompoundInput],
                counts: [5, 10, 25]
            });

            self.showExploreGCPTable = true;
            SharedService.setVar("showExploreGCPTable", self.showExploreGCPTable);
            SharedService.setVar("GCPTableParams", self.GCPTableParams);
        })
    }
    if(self.DToxSExploreCompoundInput !== "None")
    {
        self.showDToxSExplreCompoundInput = true;
    }
    if(self.SWATHExploreCompoundInput !== "None")
    {
        self.showSWATHExplreCompoundInput = true;
    }
    if(self.MicroExplreCompoundInput !== "None")
    {
        self.showMicroExplreCompoundInput = true;
    }
    if(self.RPPAExploreCompoundInput !== "None")
    {
        self.showRPPAExplreCompoundInput = true;
    }
    self.showP100Table = SharedService.getVar("showP100Table");
    self.showGCPTable = SharedService.getVar("showGCPTable");

    self.showExploreP100Table = SharedService.getVar("showExploreP100Table");
    self.showExploreGCPTable = SharedService.getVar("showExploreGCPTable");
    self.showExploreSWATHTable = SharedService.getVar("showExploreSWATHTable");
    self.showExploreRPPATable = SharedService.getVar("showExploreRPPATable");
    self.showExploreDToxSTable = SharedService.getVar("showExploreDToxSTable");
    self.showExploreMicroTable = SharedService.getVar("showExploreMicroTable");

    self.assayHeatmap = "None"

    console.log("In explore page");
    console.log(self.exploreTab);
    //console.log(self.explreCompoundInput);
    console.log(SharedService.getSharedCompound());

    $scope.showPart = function (num) {

        $scope.showPartFlag = num;
        SharedService.setVar('showPartFlag', num);

    }
    //getVar2
//This is for showing nav-bar header in scroll down
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 500) {
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

    $(document).ready(function(){



        if(self.exploreTab === "P100"){
            $("#exploreViewTab li:eq(0) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing P100 tab");
            self.showP100div = true;
            self.showGCPdiv = false;
            self.showSWATHdiv = false;
            self.showRPPAdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;

            self.P100FirstTab = true;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

        }
        if(self.exploreTab === "GCP"){
            $("#exploreViewTab li:eq(1) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing GCP tab");
            self.showP100div = false;
            self.showGCPdiv = true;
            self.showSWATHdiv = false;
            self.showRPPAdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;

            self.P100FirstTab = false;
            self.GCPFirstTab = true;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

        }
        if(self.exploreTab === "DToxS"){
            $("#exploreViewTab li:eq(2) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing DToxS tab");
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showSWATHdiv = false;
            self.showRPPAdiv = false;
            self.showDToxSdiv = true;
            self.showMicrodiv = false;

            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = true;
            self.MicroFirstTab = false;

        }
        if(self.exploreTab === "SWATH"){
            $("#exploreViewTab li:eq(3) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing SWATH tab");
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showSWATHdiv = true;
            self.showRPPAdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;

            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = true;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

        }
        if(self.exploreTab === "RPPA"){
            $("#exploreViewTab li:eq(4) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing RPPA tab");
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showSWATHdiv = false;
            self.showRPPAdiv = true;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;

            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = true;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

        }
        if(self.exploreTab === "Micro"){
            $("#exploreViewTab li:eq(5) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing Micro tab");
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showSWATHdiv = false;
            self.showRPPAdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = true;

            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = true;

        }

    });


    $scope.selectExploreFirstTab = function(input){

        if(input === "None"){

            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;

        }

        if(input === "DToxS"){

            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = true;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;

        }
        if(input === "SWATH"){
            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = true;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;
        }
        if(input === "RPPA"){
            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = true;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;
        }
        if(input === "Micro"){
            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = true;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;
        }
        if(input === "GCP"){
            self.P100FirstTab = false;
            self.GCPFirstTab = true;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;
        }
        if(input === "P100"){
            self.P100FirstTab = true;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;
        }

    }

    $scope.selectExploreDiv = function(input) {

        self.P100SecondTab = false;
        self.GCPSecondTab = false;
        self.RPPASecondTab = false;
        self.DToxSSecondTab = false;
        self.SWATHSecondTab = false;
        self.MicroSecondTab = false;

        $("#GCPExploreTabs li:eq(0) a").tab('show');
        $("#P100ExploreTabs li:eq(0) a").tab('show');

        if(input === "DToxS"){
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showSWATHdiv = false;
            self.showRPPAdiv = false;
            self.showDToxSdiv = true;
            self.showMicrodiv = false;


        }
        if(input === "SWATH"){

            self.showP100div = false;
            self.showGCPdiv = false;
            self.showSWATHdiv = true;
            self.showRPPAdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;
        }
        if(input === "RPPA"){
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showSWATHdiv = false;
            self.showRPPAdiv = true;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;
        }
        if(input === "Micro"){
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showSWATHdiv = false;
            self.showRPPAdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = true;
        }
        if(input === "GCP"){
            self.showP100div = false;
            self.showGCPdiv = true;
            self.showSWATHdiv = false;
            self.showRPPAdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;

            self.P100FirstTab = false;
            self.GCPFirstTab = true;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.SWATHFirstTab = false;
            self.MicroFirstTab = false;
        }
        if(input === "P100"){
            self.showP100div = true;
            self.showGCPdiv = false;
            self.showSWATHdiv = false;
            self.showRPPAdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;

            self.P100FirstTab = true;
            self.GCPFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.SWATHFirstTab = false;
            self.MicroFirstTab = false;
        }

    }
    $scope.selectExploreSecondTab = function(input){

        if(input === "None"){

            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;

        }

        if(input === "DToxS"){

            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = true;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;

        }
        if(input === "SWATH"){

            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = true;
            self.MicroSecondTab = false;
        }
        if(input === "RPPA"){
            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = true;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;
        }
        if(input === "Micro"){
            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = true;
        }
        if(input === "GCP"){
            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = false;
            self.GCPSecondTab = true;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;
        }
        if(input === "P100"){
            self.P100FirstTab = false;
            self.GCPFirstTab = false;
            self.SWATHFirstTab = false;
            self.RPPAFirstTab = false;
            self.DToxSFirstTab = false;
            self.MicroFirstTab = false;

            self.P100SecondTab = true;
            self.GCPSecondTab = false;
            self.RPPASecondTab = false;
            self.DToxSSecondTab = false;
            self.SWATHSecondTab = false;
            self.MicroSecondTab = false;
        }

    }



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



    self.make_clust = function(inst_network) {
        console.log(inst_network);
        var about_string = 'Zoom, scroll, and click buttons to interact with the clustergram. <a href="http://amp.pharm.mssm.edu/clustergrammer/help"> <i class="fa fa-question-circle" aria-hidden="true"></i> </a>';


        function matrix_update_callback() {

            if (genes_were_found[this.root]) {
                enr_obj[this.root].clear_enrichr_results(false);
            }
        }

        function cat_update_callback() {
            console.log('callback to run after cats are updated');
        }

        function test_tile_callback(tile_data) {
            var row_name = tile_data.row_name;
            var col_name = tile_data.col_name;

        }

        function test_col_callback(col_data) {
            var col_name = col_data.name;
        }

        function dendro_callback(inst_selection) {

            var inst_rc;
            var inst_data = inst_selection.__data__;

            // toggle enrichr export section
            if (inst_data.inst_rc === 'row') {
                d3.select('.enrichr_export_section')
                    .style('display', 'block');
            } else {
                d3.select('.enrichr_export_section')
                    .style('display', 'none');
            }

        }

        function resize_container(args) {

            var screen_width = window.innerWidth - 80;
            var screen_height = window.innerHeight - 20;

            d3.select(args.root)
                .style('width', screen_width + 'px')
                .style('height', screen_height + 'px');
        }

        // d3.json('static/clustergrammer/' + inst_network, function (network_data) {
        //d3.json(inst_network, function (network_data) {
        network_data = inst_network;
        // define arguments object
        var args = {
            root: '#container-id-1',
            'network_data': network_data,
            'about': about_string,
            //'row_tip_callback':hzome.gene_info,
            'col_tip_callback': test_col_callback,
            'tile_tip_callback': test_tile_callback,
            'dendro_callback': dendro_callback,
            'matrix_update_callback': matrix_update_callback,
            'cat_update_callback': cat_update_callback,
            'sidebar_width': 150,
            // 'ini_view':{'N_row_var':20}
            // 'ini_expand':true
        };

        resize_container(args);

        d3.select(window).on('resize', function () {
            resize_container(args);
            cgm.resize_viz();
        });

        cgm = Clustergrammer(args);

        check_setup_enrichr(cgm);

        d3.select(cgm.params.root + ' .wait_message').remove();

        //});

    }

    self.runClusterGramSliced = function(in_network,cpInput){

        self.clusterWait = true;
        self.clusterResult = false;
        console.log(in_network);
        console.log(cpInput);
        if(Array.isArray(cpInput)){
            var cp = "";
            console.log("is array");
            var arrayLength = cpInput.length;
            for (var i = 0; i < arrayLength - 1; i++) {
                var item = cpInput[i];
                cp = cp.concat(item.toString());
                cp = cp.concat(",");
                //Do something
            }
            cp = cp.concat(cpInput[arrayLength - 1].toString());
        }
        else{
            var cp = cpInput
        }
        ;
        console.log(cp);
        if(in_network === "P100") {
            var url = 'api/clustFromPython/P100/';
            console.log(url + cp);
            $http.get(url + cp).then(function (data) {
                self.HEATMAP = data;
                self.make_clust(self.HEATMAP);
                //self.make_clust('mult_view.json');
                console.log('hello I am in runClusterGram');
                self.clusterWait = false;
                self.clusterResult = true;
                self.assayHeatmap = in_network;

            }, function (error) {
                console.log("there is an error in /runClusterGram api");
                self.clusterWait = false;
                self.clusterResult = false;
                self.assayHeatmap = in_network;
            });
        }
        if(in_network === "GCP") {
            var url = 'api/clustFromPython/GCP/';
            console.log(url + cp);
            $http.get(url + cp).then(function (data) {
                self.HEATMAP = data;
                self.make_clust(self.HEATMAP);
                //self.make_clust('mult_view.json');
                console.log('hello I am in runClusterGram');
                self.clusterWait = false;
                self.clusterResult = true;
                self.assayHeatmap = in_network;

            }, function (error) {
                console.log("there is an error in /runClusterGram api");
                self.clusterWait = false;
                self.clusterResult = false;
                self.assayHeatmap = in_network;
            });
        }


    }

    self.runClusterGram = function (in_network) {
        //console.log("in main ctrl");

        self.clusterWait = true;
        self.clusterResult = false;
        if(in_network === "P100") {
            $http.get('api/clust/P100').then(function (data) {
                self.HEATMAP = data;
                self.make_clust(self.HEATMAP);
                //self.make_clust('mult_view.json');
                console.log('hello I am in runClusterGram');
                self.clusterWait = false;
                self.clusterResult = true;
                self.assayHeatmap = in_network;

            }, function (error) {
                console.log("there is an error in /runClusterGram api");
                self.clusterWait = false;
                self.clusterResult = false;
                self.assayHeatmap = in_network;
            });
        }
        if(in_network === "GCP") {
            $http.get('api/clust/GCP').then(function (data) {
                self.HEATMAP = data;
                self.make_clust(self.HEATMAP);
                //self.make_clust('mult_view.json');
                console.log('hello I am in runClusterGram');
                self.clusterWait = false;
                self.clusterResult = true;
                self.assayHeatmap = in_network;

            }, function (error) {
                console.log("there is an error in /runClusterGram api");
                self.clusterWait = false;
                self.clusterResult = false;
                self.assayHeatmap = in_network;
            });
        }
        if(in_network === "Micro") {
            $http.get('api/clust/Micro').then(function (data) {
                self.HEATMAP = data;
                self.make_clust(self.HEATMAP);
                //self.make_clust('mult_view.json');
                console.log('hello I am in runClusterGram');
                self.clusterWait = false;
                self.clusterResult = true;
                self.assayHeatmap = in_network;

            }, function (error) {
                console.log("there is an error in /runClusterGram api");
                self.clusterWait = false;
                self.clusterResult = false;
                self.assayHeatmap = in_network;
            });
        }
        if(in_network === "DToxS") {
            $http.get('api/clust/DToxS').then(function (data) {
                self.HEATMAP = data;
                self.make_clust(self.HEATMAP);
                //self.make_clust('mult_view.json');
                console.log('hello I am in runClusterGram');
                self.clusterWait = false;
                self.clusterResult = true;
                self.assayHeatmap = in_network;

            }, function (error) {
                console.log("there is an error in /runClusterGram api");
                self.clusterWait = false;
                self.clusterResult = false;
                self.assayHeatmap = in_network;
            });
        }
        if(in_network === "RPPA") {
            $http.get('api/clust/RPPA').then(function (data) {
                self.HEATMAP = data;
                self.make_clust(self.HEATMAP);
                //self.make_clust('mult_view.json');
                console.log('hello I am in runClusterGram');
                self.clusterWait = false;
                self.clusterResult = true;
                self.assayHeatmap = in_network;

            }, function (error) {
                console.log("there is an error in /runClusterGram api");
                self.clusterWait = false;
                self.clusterResult = false;
                self.assayHeatmap = in_network;
            });
        }
        if(in_network === "SWATH") {
            $http.get('api/clust/SWATH').then(function (data) {
                self.HEATMAP = data;
                self.make_clust(self.HEATMAP);
                //self.make_clust('mult_view.json');
                console.log('hello I am in runClusterGram');
                self.clusterWait = false;
                self.clusterResult = true;
                self.assayHeatmap = in_network;

            }, function (error) {
                console.log("there is an error in /runClusterGram api");
                self.clusterWait = false;
                self.clusterResult = false;
                self.assayHeatmap = in_network;
            });
        }

    }


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


        self.pertTable = self.P100ProcessedJSON[localPerturbagen];


        self.GCPtableParams = new NgTableParams({

            count: 5
        }, {
            total: self.P100ProcessedJSON[localPerturbagen].length,  dataset: self.P100ProcessedJSON[localPerturbagen],counts: [5, 10, 25]});

        self.showP100Table = true;
        SharedService.setVar("showP100Table",self.showP100Table);


    };

    $scope.updateGCPPerturbagen = function (inputPerturbagen) {
        self.showExploreGCPTable = false;
        console.log("in updatePerturbagen");
        self.GCPExploreCompoundInput = inputPerturbagen;
        var localPerturbagen = self.GCPExploreCompoundInput;



        self.pertTable = self.GCPProcessedJSON[localPerturbagen];


        self.GCPTableParams = new NgTableParams({

            count: 5
        }, {
            total: self.GCPProcessedJSON[localPerturbagen].length,  dataset: self.GCPProcessedJSON[localPerturbagen],counts: [5, 10, 25]});

        self.showExploreGCPTable = true;
        SharedService.setVar("showExploreP100Table",self.showExploreGCPTable);
        SharedService.setVar("GCPTableParams",self.GCPTableParams);

        SharedService.setVar("GCPExploreCompoundInput",self.GCPExploreCompoundInput);


    };

    $scope.updateP100Perturbagen = function (inputPerturbagen) {
        self.showExploreP100Table = false;
        console.log("in updatePerturbagen");
        self.P100ExploreCompoundInput = inputPerturbagen;
        var localPerturbagen = self.P100ExploreCompoundInput;



        self.pertTable = self.P100ProcessedJSON[localPerturbagen];


        self.P100TableParams = new NgTableParams({

            count: 5
        }, {
            total: self.P100ProcessedJSON[localPerturbagen].length,  dataset: self.P100ProcessedJSON[localPerturbagen],counts: [5, 10, 25]});

        self.showExploreP100Table = true;
        SharedService.setVar("showExploreP100Table",self.showExploreP100Table);
        SharedService.setVar("P100TableParams",self.P100TableParams);

        SharedService.setVar("P100ExploreCompoundInput",self.P100ExploreCompoundInput);


    };



    self.showSVG = true;



    $scope.initNetworkApi = function () {
        //This has the information about P100 lincs_unique signature information and perturbagen to lincs_unique info
        $http.get('/lincsproteomics/data/P100_processed_perturb_new.json').success(function (data) {
            self.P100ProcessedJSON = data;
            console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.TRAMETINIB);
            // self.selectedPerturbation = 'TRAMETINIB';
            // $scope.perturbation = self.P100ProcessedJSON.uniquePert;


        });

        $http.get('/lincsproteomics/data/proteomics_compound_info.json').success(function (data) {
            // self.P100ProcessedJSON = data;
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.Trametinib);
            //self.selectedPerturbation = 'Trametinib';
            $scope.compound_info = data;
            console.log($scope.compound_info);
        })

        $http.get('/lincsproteomics/data/GCP_processed_perturb_new.json').success(function (data) {
            self.GCPProcessedJSON = data;
            console.log(self.GCPProcessedJSON);
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.TRAMETINIB);
            // self.selectedPerturbation = 'TRAMETINIB';
            // $scope.perturbation = self.P100ProcessedJSON.uniquePert;


        });

        self.exploreTabInput = SharedService.getVar("exploreTab");








        //This is for network view of DTox, SWATH and RPPA
        $http.get('/lincsproteomics/data/assay-view.json').success(function (data) {
            self.assayData = data;
            console.log(self.assayData);
            console.log(self.assayData.GCP);
            if(self.exploreTabInput === "DToxS"){

                console.log("showing DToxS tab");
                $scope.showNetwork("DToxS");
            }
            if(self.exploreTabInput === "SWATH"){

                console.log("showing SWATH tab");
                $scope.showNetwork("SWATH");
            }
            if(self.exploreTabInput === "RPPA"){

                console.log("showing RPPA tab");
                $scope.showNetwork("RPPA");
            }
            if(self.exploreTabInput === "Micro"){

                console.log("showing Micro tab");
                $scope.showNetwork("Micro");
            }
        });
        //This is about mapping P100 proteins to peptides, depricated in new version of lincs proteomics
        // $http.get('/lincsproteomics/data/P100_ptm_to_peptide_to_abundance.json').success(function (data) {
        //     self.ptmToPeptideToAbundance = data;
        //     console.log("ptmToPeptideToAbundance");
        //     console.log(self.ptmToPeptideToAbundance);
        //
        //
        // });

        //This is for the network of known and predicted kinase to ptm network
        $http.get('/lincsproteomics/data/phospho_network_p100_new.json').success(function (data) {
            self.p100phospho = data;
            console.log("p100phospho");
            console.log(self.p100phospho);

            if(self.exploreTabInput === "P100" || self.exploreTabInput === "None"){

                console.log("showing P100 tab");
                $scope.makePhosphoGraph('None');
            }
        });
        $http.get('/lincsproteomics/data/gcp_network.json').success(function (data) {
            self.gcp_network = data;
            console.log("p100phospho");
            console.log(self.gcp_network);
            if(self.exploreTabInput === "GCP"){

                console.log("showing GCP tab");
                $scope.makeGCPGraph("None");
            }
            // if(self.exploreTabInput === "P100" || self.exploreTabInput === "None"){
            //
            //     console.log("showing P100 tab");
            //     $scope.makePhosphoGraph('None');
            // }
        });
        //This is for network view of GCP
        $http.get('/lincsproteomics/data/gcp-assay-view.json').success(function (data) {
            self.gcpData = data;
            console.log("gcpData");
            console.log(self.gcpData);


        });

        $http.get('/lincsproteomics/data/data_sets_2_compounds.json').success(function (data) {
            self.data_sets_2_compounds = data;
            console.log("gcpData");
            console.log(self.gcpData);
            if(self.exploreTabInput === "GCP"){


                self.selectedPerturbation = self.data_sets_2_compounds["GCP"][0];
            }
            if(self.exploreTabInput === "P100"){


                self.selectedPerturbation = self.data_sets_2_compounds["P100"][0];
            }
            if(self.exploreTabInput === "RPPA"){


                self.selectedPerturbation = self.data_sets_2_compounds["RPPA"][0];
            }
            if(self.exploreTabInput === "DToxS"){


                self.selectedPerturbation = self.data_sets_2_compounds["DToxS"][0];
            }
            if(self.exploreTabInput === "SWATH"){


                self.selectedPerturbation = self.data_sets_2_compounds["SWATH"][0];
            }
            if(self.exploreTabInput === "Micro"){


                self.selectedPerturbation = self.data_sets_2_compounds["Micro"][0];
            }

        });
        //
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




        self.showP100div = false;
        self.showGCPdiv = true;
        self.showRPPAdiv = false;
        self.showSWATHdiv = false;
        self.showDToxSdiv = false;
        self.showMicrodiv = false;




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
                w = window.innerWidth - 2 * margin,
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
                 //.attr("fill", "white");


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
    self.computeWeightForUpdateGCP = true;
    $scope.makeGCPGraph = function (signatureId) {

        // if(self.showPhosphoGraphTmp){
        //     //self.showPhosphoGraphTmp = false;
        //     self.showPhosphoGraph = true;
        // }
        // else {

        self.showP100div = false;
        self.showGCPdiv = true;
        self.showRPPAdiv = false;
        self.showSWATHdiv = false;
        self.showDToxSdiv = false;
        self.showMicrodiv = false;
        $scope.signatureIdView = signatureId;

        console.log(signatureId);
        console.log(self.GCPProcessedJSON[signatureId]);


        if(signatureId in self.GCPProcessedJSON){
            var peptideAbundance = self.GCPProcessedJSON[signatureId];
            console.log(peptideAbundance);
            // console.log(self.ptmToPeptideToAbundance);
            var pNetwork = self.gcp_network;
            console.log(pNetwork);
            for (var iterNetNode = 0; iterNetNode < pNetwork.nodes.length; iterNetNode++) {
                var iterNetNodeKey = pNetwork.nodes[iterNetNode]["full_name"];
                // var iterNetNodeKeyPTM = iterNetNodeKey.split('(')[0];
                console.log(iterNetNodeKey);
                if (iterNetNodeKey in peptideAbundance) {


                    ptmToAbundance[iterNetNodeKey] = peptideAbundance[iterNetNodeKey];

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



        self.showGCPGraphTmp = true;
        console.log("in makeGCPGraph");

        d3.select("#chart5").select("svg").remove();
        if (typeof svg5 === 'undefined') {
            var svg5 = d3.selectAll("#chart5").append("svg");
        }
        //var svg3 = d3.selectAll("#chart3").append("svg");


        var force;
        self.showGCPGraph = false;


        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#987024", "#ed0909", "#0af702"])
            //.range(["#987024", "#982482", "#0af702"])
            .domain([0, 1, 2]);
//#f9a3f5
        // var colNodeScaleSeparate = d3.scale.ordinal()
        //     .range(["#767776", "#f91104", "#0af702"])
        //     .domain([0,1,2]);

        var colNodeScale = d3.scale.ordinal()
            .range(["Grey", "Fuchsia ", "Red", "Blue", "Yellow", "Green", "DarkOrange"])
            .domain([0, 1, 2, 3, 4, 5, 6]);
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




        function updateGCP(nodes, links) {
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
                    w = 1350 - 2 * margin,
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
                    //.attr("style", "outline: thin solid yellow;")
                    .attr("width", w)
                    .attr("height", globalHPlus50);
                svg5.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "#f9f9f9");


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
                    // .attr("stroke-dasharray", function (d) {
                    //     if (d.score < 100) {
                    //         return "5,5"; //these classes are defined in custom.css
                    //     } else {
                    //         return "5,0";//these classes are defined in custom.css
                    //     }
                    // })
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
                        if (d.group == 0) {
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


                node.append("circle")
                    .attr("r", function (d) {
                        return xScale(d.weight-2);
                    })
                    .style("fill", function (d) {
                        if (d.group == 0) {
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
                    .style("stroke", "blue")
                    .style("stroke-width", "2px");

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
                    w = 1350 - 2 * margin,
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
                    //.attr("style", "outline: thin solid yellow;")
                    .attr("width", w)
                    .attr("height", globalHPlus50);
                svg5.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "#f9f9f9");


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

                var dim = w - 600
                var circle = svg5.append("path")
                    .attr("d", "M 300, " + (dim / 2 + 300) + " a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim + ",0 a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim * -1 + ",0")
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
                    // .attr("stroke-dasharray", function (d) {
                    //     if (d.score < 100) {
                    //         return "5,5"; //these classes are defined in custom.css
                    //     } else {
                    //         return "5,0";//these classes are defined in custom.css
                    //     }
                    // })
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
                        if (d.group == 0) {
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


                    if (n.group == 0) {

                        n1 = n1 + 1;
                    }
                    if (n.group != 0) {

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
                    w = 1350 - 2 * margin,
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
                    //.attr("style", "outline: thin solid yellow;")
                    .attr("width", w)
                    .attr("height", globalHPlus50);

                svg5.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "#f9f9f9");


                var force = d3.layout.force()
                    .nodes(nodes)
                    .links(links)
                    .size([w, h]);


                var parallelCoordx = function (group) {

                    if (group == 0) {
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
                groupId[1] = [];
                groupId[2] = [];
                for (var i = 0; i < nodes.length; i++) {
                    var item = nodes[i];




                    if (item.group == 0) {
                    groupId[1].push({name: item.name});
                    }
                    else{
                        groupId[2].push({name: item.name});
                    }
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

                    if (n.group == 0) {
                        n.x = parallelCoordx(n.group)
                        n.y = parallelCoordy(n1, groupId[1].length)
                        n1 = n1 + 1;
                    }
                    if (n.group != 0) {
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
                    // .attr("stroke-dasharray", function (d) {
                    //     if (d.score < 100) {
                    //         return "5,5"; //these classes are defined in custom.css
                    //     } else {
                    //         return "5,0";//these classes are defined in custom.css
                    //     }
                    // })
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
                        if (d.group == 0) {
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
                    saveAs(dataBlob, 'LINCSProteomics-GCP-iPTMNet-Network.png'); // FileSaver.js function
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



        //SharedService.setVar('selectedphosphoPathways', $scope.selectedphosphoPathways);

        var pNetwork = self.gcp_network;
        console.log("here");
        console.log(pNetwork);



        // var pNetwork = phosphoNetwork['Known+PredictedbyBlosum50_Kinase_TargetGene'];

        for (var iterNetNode = 0; iterNetNode < pNetwork.nodes.length; iterNetNode++) {
            var iterNetNodeKey = pNetwork.nodes[iterNetNode]["full_name"]
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
        if (self.computeWeightForUpdateGCP){
            for (var iterNetNode = 0; iterNetNode < pNetwork.edges.length; iterNetNode++) {
                //var iterNetNodeKey = network.nodes[iterNetNode]["name"];
                var idx1 = pNetwork.edges[iterNetNode]["source"];
                var idx2 = pNetwork.edges[iterNetNode]["target"];
                pNetwork.nodes[idx1]["weight"] += 1;
                pNetwork.nodes[idx2]["weight"] += 1;

            }
            self.computeWeightForUpdateGCP = false;
            //SharedService.setVar('computeWeightForUpdatePhospho',self.computeWeightForUpdatePhospho);
        }

        updateGCP(pNetwork.nodes, pNetwork.edges);



        self.showPhosphoGraph = true;

        console.log("self.showGCPGraph");
        console.log(self.showGCPGraph);
        // self.waitingPathway = false;
        // self.showOutputPathway = true;
        // }
    }
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
        self.showMicrodiv = false;
$scope.signatureIdView = signatureId;

        console.log(signatureId);
        console.log(self.P100ProcessedJSON[signatureId]);


        if(signatureId in self.P100ProcessedJSON){
            var peptideAbundance = self.P100ProcessedJSON[signatureId];
            console.log(peptideAbundance);
            // console.log(self.ptmToPeptideToAbundance);
            var pNetwork = self.p100phospho["Known+PredictedbyPWM_Kinase_TargetGene"];
            console.log(pNetwork);
            for (var iterNetNode = 0; iterNetNode < pNetwork.nodes.length; iterNetNode++) {
                var iterNetNodeKey = pNetwork.nodes[iterNetNode]["full_name"];
                // var iterNetNodeKeyPTM = iterNetNodeKey.split('(')[0];
                console.log(iterNetNodeKey);
                if (iterNetNodeKey in peptideAbundance) {


                    ptmToAbundance[iterNetNodeKey] = peptideAbundance[iterNetNodeKey];

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
                    w = 1350 - 2 * margin,
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
                    //.attr("style", "outline: thin solid yellow;")
                    .attr("width", w)
                    .attr("height", globalHPlus50);
                svg5.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "#f9f9f9");


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


                node.append("circle")
                    .attr("r", function (d) {
                        return xScale(d.weight-2);
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
                    .style("stroke", "blue")
                    .style("stroke-width", "2px");

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
                    w = 1350 - 2 * margin,
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
                    //.attr("style", "outline: thin solid yellow;")
                    .attr("width", w)
                    .attr("height", globalHPlus50);
                svg5.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "#f9f9f9");


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

                var dim = w - 600
                var circle = svg5.append("path")
                    .attr("d", "M 300, " + (dim / 2 + 300) + " a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim + ",0 a " + dim / 2 + "," + dim / 2 + " 0 1,0 " + dim * -1 + ",0")
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
                    w = 1350 - 2 * margin,
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
                    //.attr("style", "outline: thin solid yellow;")
                    .attr("width", w)
                    .attr("height", globalHPlus50);

                svg5.append("rect")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .attr("fill", "#f9f9f9");


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
            var iterNetNodeKey = pNetwork.nodes[iterNetNode]["full_name"]
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
                var iterNetNodeKey = pNetwork.nodes[iterNetNode]["full_name"]
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
            self.showMicrodiv = false;
        }
        if (net === "GCP") {
            self.showP100div = false;
            self.showGCPdiv = true;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;
        }
        if (net === "RPPA") {
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = true;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;
        }
        if (net === "SWATH") {
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = true;
            self.showDToxSdiv = false;
            self.showMicrodiv = false;
        }
        if (net === "DToxS") {
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = true;
            self.showMicrodiv = false;
        }
        if (net === "Micro") {
            self.showP100div = false;
            self.showGCPdiv = false;
            self.showRPPAdiv = false;
            self.showSWATHdiv = false;
            self.showDToxSdiv = false;
            self.showMicrodiv = true;
        }







        var force;

        var xScale = d3.scale.linear().range([5, 15]);
        var colNodeScaleSeparate = d3.scale.ordinal()
            .range(["#767776", "#f91104", "#0af702"])
            .domain([0, 1, 2]);
        var colNodeScale = d3.scale.linear().range(["grey", "red"]);
        var colScale = d3.scale.linear().range(["grey", "red"]);
        var edgeWeightScale = d3.scale.linear().range([1, 3]);
        d3.select("svg").remove();
        //d3.selectAll("svg > *").remove();
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
                h = Math.max(1340-2*margin,nodes.length/200.0*window.innerWidth),
                w = 1340 - 2*margin,
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
                //.attr("fill", "white");



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

appModule.controller('ToolsCtrl', ['$scope', '$location', '$http', 'SharedService', function ($scope, $location, $http, SharedService) {
    var self = this;
//This is for showing nav-bar header in scroll down
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 500) {
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




appModule.controller('ContactCtrl', ['$scope', '$location', '$http', '$window', 'SharedService', function ($scope, $location, $http, $window, SharedService) {







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

appModule.controller('GlossaryCtrl', ['$scope', '$sce', '$location', '$anchorScroll', '$http', '$timeout', '$window', '$routeParams', '$filter', '$q','NgTableParams','SharedService','SVGFetcher', function ($scope, $sce, $location, $anchorScroll, $http, $timeout, $window, $routeParams, $filter, $q, NgTableParams, SharedService,SVGFetcher) {


    console.log("in GlossaryCtrl");
    var self = this;
    $scope.exploreCompound = SharedService.getVar("exploreCompound");
    $scope.button_m_all = true;
    $scope.button_p100_m = false;
    $scope.button_gcp_m = false;
    $scope.button_mass_m = false;
    $scope.button_swath_m = false;
    $scope.button_rppa_m = false;

    $scope.button_c_all = true;
    $scope.button_pccse_c = false;
    $scope.button_dtoxs_c = false;
    $scope.button_neuro_c = false;
    $scope.button_hms_c = false;

    $scope.button_a_all = true;
    $scope.button_p100_a = false;
    $scope.button_gcp_a = false;
    $scope.button_mass_a = false;
    $scope.button_swath_a = false;
    $scope.button_rppa_a = false;

    $scope.showAssaysSubTabVal = true;
    $scope.showGlossarySubTabVal = false;




    self.showCompoundToDSTable = SharedService.getVar("showCompoundToDSTable");

    self.assayTab = SharedService.getVar("assayTab");
    self.exploreTab = SharedService.getVar("exploreTab");
    self.downloadTab = SharedService.getVar("downloadTab");
    self.exploreCompound = SharedService.getVar("exploreCompound");
    self.compoundAndDS = SharedService.getVar("compoundAndDS");
    self.selectedSmile = SharedService.getVar('selectedSmile');
    self.showSimilarSmileCompounds = SharedService.getVar('showSimilarSmileCompounds');
    self.cpSmileSimilar = SharedService.getVar('cpSmileSimilar');
    self.showSimilarSmileCompoundsFinal = SharedService.getVar('showSimilarSmileCompoundsFinal');



    self.documents = [{
        "name": "2-D-PAGE",
        "text": "2-D-PAGE 2D PAGE is a separation method for gel-based proteomics (also known as classical proteomic approach). " +
        "This method separates complex mixture of proteins based on " +
        "molecular mass and charge, and can resolve hundreds to thousands intact proteins in" +
        "a single gel. After 2D-PAGE, protein identification is usually performed by in-gel" +
        "tryptic digestion and mass spectrometry. 2-D PAGE has two steps of protein separation. First, proteins in a complex sample" +
        "are separated by their molecular charges (or isoelectric points; pI) in an IPG-strip" +
        "(a precast gel strip with internal pI gradient) using isoelectric focusing. Second," +
        "after isoelectric focusing, the separated proteins are resolved in SDS-PAGE" +
        "by their molecular weights. This two-step separation results in a 2-D map of" +
        "numerous protein spots. Ideally, one protein spot contains one proteoform. For" +
        "protein identification, protein spots of interest are picked up and subjected to" +
        "in-gel tryptic digestion. The digested peptides can be analyzed by mass spectrometry" +
        "Application:" +

        "2D-PAGE is considered a great tool for detecting proteins with potentially changed" +
        "post-translational" +
            "modifications, i.e., phosphorylation and glycosylation. Phosphorylation adds" +
        "negative charges to a protein, causing a shift of phosphorylated protein to more" +
            "acidic pI. Glycosylation adds glycan branches to a protein, resulting in a shift of" +
        "molecular size." +
            "Limitations:" +

        "Although gel-based proteomics has very simple analytical workflow, as a front-end" +
            "separation strategy, 2-D PAGE is a laborious and time-consuming procedure which are" +
        "disadvantages for large-scale proteomic projects. One needs a period of training to" +
            "master this procedure and to achieve an acceptable level of result reproducibility." +
        "In addition, depth of proteome coverage from a single analysis is much lower than" +
            "mass spectrometric-based proteomics. All these limitations lead to decreased" +
        "popularity of 2-D PAGE and gel-based proteomics in the field."
},
    {   "name":"AspN",
        "text": "AspN aspn A metalloprotease enzyme that cleaves amino side of aspartic acid residues."
    },

    {   "name": "b-and-y-ion-series",
        "text": "Refers to fragment ions derived from peptide breakage at the peptide bonds during" +
        "mass spectrometric analysis. The b- and y-ions are indicated if the charge retained" +
            "on the N-terminus and C-terminus fragments, respectively." +

        "The mass differences obtained from the b- and y-ion series of a peptide can be used" +
        "to interpret its amino acid sequence." +

        "Ref: Marcotte EM. Nat Biotechnol. 2007 Jul;25(7):755-7. PMID: 17621303"
    },

    {   "name": "CAD",
        "text": "cad CAD Refers to collisional activation dissociation, a synonym of CID."
    },

    {   "name": "Bottom-up-proteomics",
        "text": "Bottom-up-proteomics Bottom up proteomicsRefers to the characterization of proteins by analysis of proteolytic peptides. Of" +
        "several proteases, trypsin has become a gold standard for" +
        "protein digestion in bottom-up analysis. When bottom-up proteomics is performed on a" +
        "mixture of proteins in complex samples for discovery purposes, it is called shotgun proteomics." +
        " See also “Top-down proteomics” for comparison." +

        " Ref: Zhang Y, et al. Chem Rev. 2013 Apr 10;113(4):2343-94. PMID: 23438204"
    },

    {   "name": "Carbamidomethylation-(CAM)",
        "text": "Carbamidomethylation CAM is a chemical modification introduced to cysteine residues by alkylation with" +
        "iodoacetamide during proteomic sample preparation."
    },

    {   "name": "Chemical-proteomics-(also-known-as-chemoproteomics)",
        "text": "Chemical proteomics  chemoproteomics Refers to a research area at the interface between chemistry, biochemistry and cell" +
        "biology that focused on the mechanisms of actions of small molecular compounds i.e.," +
        "the mapping of their interacted proteins and their effects on protein expression and" +
        "post-translational modification in target cells or tissue of interest. There are two main approaches; first, global" +
        "chemoproteomic profiling to evaluate the cellular response to small molecule" +
        "treatment in a global view; and second, targeted chemoproteomic approach which" +
        "adopted affinity-based techniques to determine protein binding profiles of small" +
        "molecular drug" +

        "Ref: Bantscheff M. Methods Mol Biol. 2012;803:3-13. PMID: 22065214"
    },

    {   "name": "Clinical-proteomics",
        "text": " Clinical proteomics Refers to the application of proteomic analysis with the aim of solving a specific" +
        "clinical problem within the context of a clinical study. The value of clinical" +
        " proteomics lies in its application with the ultimate goal to improve patient care," +
        "for example, detecting biomarkers for early diagnosis, classification for" +
        " patient-tailored therapy, evaluation of therapeutic response, etc. Accordingly," +
        " clinical proteomics should follow the principles and rules of clinical" +
        "trials/studies, when proteomics should be used to obtain biomarker outcomes." +
        "Recommended steps for clinical proteomics are shown as follows:" +
        "" +
        "1) Define a clear clinical question and how the outcome of the study would improve" +
        "the diagnosis and/or treatment of the disease." +

        " 2) Define the patient and control populations, clinical data to be collected, as" +
        "well as protocols for sampling and sample preparation." +

        "3) Define the type of samples needed for the discovery and validation phases." +

        "4) Define and validate the analytical platforms for discovery (those for validation" +
        "    may well differ)." +

        "5) Obtain IRB approval and written informed consent from the participant." +

        "6) Perform a pilot study on a validated discovery platform." +

        "7) Statistically evaluate data from the pilot study to calculate the number of cases" +
        "and controls for the training set." +

        "8) Perform study of the training set on the validated platform based on the" +
        "calculated number of cases and controls." +

        "9) Evaluate findings from the training set on blinded samples." +

        "10) Deposit datasets in a public database." +

        "11) Using these results, transfer the assay to the application platform and test" +
        "using a training (if applicable) and subsequently a blinded set." +

        "12) Apply towards clinical use to show whether the findings improve the current" +
        "clinical situation." +

        "Ref: Mischak H, et al. Proteomics Clin. Appl. 2007, 1, 148–156. PMID: 21136664."
},

    {   "name": "CE",
        "text": "CE Refers to capillary electrophoresis, an alternative to chromatography for peptide" +
        " and intact protein separation prior to mass spectrometric analysis."
    },

    {   "name": "Collision-induced-dissociation-(CID)",
        "text": " Collision induced dissociation  CID Dissociation of precursor ions into fragment ions by collision with gas molecules" +
        "within the collision cell of mass spectrometer."
    },

    {   "name": "Cycle-time",
        "text": "Cycle time Refers to the sum of the dwell times of all analyte ions" +
        "in a given set."
    },

    {   "name": "Data-dependent-acquisition-(DDA)",
        "text": " Data dependent acquisition DDA Refers to a process driven by an automated data acquisition that trigger MS/MS scan" +
        "depending on the signal intensity (or abundance) of the precursor (or MS1) ions. A subset of the most abundant precursor ions" +
        "reaching the mass spectrometers detector during MS1 scan are" +
        "individually isolated and fragmented in sequential MS/MS scan and can be analyzed" +
        "with a database search algorithm. Instrument setting up and data analysis of DDA is" +
        "simple, while this method typically yields 1000s of protein identifications. These" +
        "advantages make DDA the preferred LC-MS/MS method among the wider" +
        "scientific community. However, DDA method analyzes only a limited number of all" +
        "precursor ions (identifying the most abundant peptides but missing the rest) and" +
        "therefore has poor reproducibility of the detection and measurement of low-abundance" +
        "proteins in complex samples. Run-to-run peptide identification overlap for a given" +
        "sample is approximately 60%. DDA using a label-free approach has low precision of" +
        "protein quantification. although better precision of protein quantification can be" +
        "achieved by a variety of chemical labeling schemes, e.g., SILAC," +
        "iTRAQ and TMT labeling." +

        "Ref: Marcotte EM. Nat Biotechnol. 2007 Jul;25(7):755-7. PMID: 17621303" +
        "Hu A, et al. F1000Res. 2016; 5: F1000 Faculty Rev-419. PMID: 27092249"
    },

    {   "name": "Data-independent-acquisition-(DIA)",
        "text": "Data independent acquisition DIA  Refers to a process that the fragment ion spectra of all peptides within a mass" +
        "range are acquired in each cycle time without a" +
        " pre‐selection of the precursor ions, thus leading to an unbiased recording of all" +
        "detectable fragment ions derived from all peptide precursors of a given sample." +
        "However, this type of data cannot be interpreted by standard search algorithms," +
        "since the link between the precursor peptide and its fragment ions are lost." +
        "Interpretation of DIA data is also difficult because of the complex MS2 scans derived from the mixtures of peptides. Recent" +
        "developments in bioinformatics have overcome this DIA issue. The utilization of" +
        "spectral libraries containing sets of annotated and refined peptide-MS2 spectrum" +
        "matches from DDA experiments allows comparable" +
        "breadth of proteome coverage between DIA and DDA. In addition, peptide" +
        "quantification which relies on comparing DIA spectra to spectral libraries shows" +
        "highly accurate and reproducible results as SRM/MRM and PRM, although DIA has lower" +
        "precision in the measuring of very low abundance peptides due to interference of" +
        "higher abundant co-eluting peptides. See also “SWATH-MS”." +

        "Ref: Hu A, et al. F1000Res. 2016; 5: F1000 Faculty Rev-419. PMID: 27092249"
    },

    {   "name": "Discovery-proteomics",
        "text": "Discovery proteomics is the bottom up approach which employs globally unbiased" +
        "identification and quantification as many proteins as possible in biological samples" +
        "in the hope of discovering key molecular targets for further study and validation." +
        "" +
        "Ref: Angel TE et al., Chem Soc Rev. 2012 May 21; 41(10): 3912–3928. PMID: 22498958"
    },

    {   "name": "Dithiothreitol",
        "text": "Dithiothreitol Refers to a reversible reducing agent typically used to break intra- and" +
        "intermolecular disulfide bonds between cysteine residues of proteins."
    },

    {   "name": "Dwell-time",
        "text": "Dwell time Refers to a length of time in which a specific m/z ion signal is collected."
    },

    {   "name": "ECD",
        "text": "ECD Refers to ECD is based on the interaction of a free electron with a multiply" +
        "protonated molecule to induce specific N–Cα bond cleavages of the peptide backbone." +
        " As compared to CID, ECD provides" +
        "an extensive fragmentation resulting in improved sequence coverage. Moreover, the" +
        " nonergodic feature of ECD preserves the labile post-translational" +
        "modification and consequently enables the generation of ions diagnostic for the" +
        "modification site(s). The shortcoming of ECD resides in its availability merely on" +
        "costly and sophisticated high-resolution Fourier-transform ion cyclotron resonance" +
        "(FT-ICR) MS." +
        "" +
        "Ref: Sarbu M, et al., Amino Acids. 2014;46(7):1625-34. PMID: 24687149"
    },

    {   "name": "ESI",
        "text": "ESI Refers to electrospray ionization. ESI is the most widely used ionization method in" +
        "proteomic analysis as an interface between LC and MS/MS. The" +
        "ionization process is based on the formation of sprayed droplets at the end of the" +
        "electrospray capillary tip that subjected into an intense electrical field toward" +
        "the orifice of mass spectrometer. The sprayed droplets become evaporated and" +
        " shrinkage due to surface-Coulombic forces overcome surface-tension forces," +
        "ultimately leading to the unsolvated protonated or deprotonated analyte ions. The" +
        "sensitivity of ESI is improved by high-concentration low-volume samples, which led" +
        "to the development of low flow-rate ESI, for example, nanoLC-ESI." +

        "Ref: Griffiths WJ, et al., Biochem J. 2001 May 1;355(Pt 3):545-61." +
        "Wilm M. Mol Cell Proteomics. 2011 Jul;10(7):M111.009407. PMID: 21742801"
    },

    {   "name": "ETD",
        "text": "ETD Refers to electron transfer dissociation, an ECD-like activation" +
        "technique for use on more affordable ion-trap instruments. While" +
        "CID is a method of choice for" +
        "peptide sequencing, ETD is the method of choice for the analysis of post-translational" +
        "modification. ETD induces specific N–Cα bond cleavages of the peptide backbone" +
        "with the preservation of the post-translational" +
        "modifications and generation of product ions that are diagnostic for the" +
        "modification site(s). In addition, ETD contributed significantly to the development" +
        "of top-down approaches which enable tandem MS of intact protein ions." +

        "Ref: Zhou Y, et al., Curr Pharm Biotechnol. 2011 Oct;12(10):1558-67. PMID: 21542796" +
        "Sarbu M, et al., Amino Acids. 2014;46(7):1625-34. PMID: 24687149"
    },

    {   "name": "False-discovery-rate-(FDR)",
        "text": "False discovery rate FDR is the metric for global confidence assessment of a large-scale proteomics" +
    "dataset. In the large-scale high-throughput study when multiple independent" +
    "statistical hypothesis tests are conducted on peptide spectrum matches (PSM) or" +
    "hits, single hypothesis significance measures (like p-value) are not sufficient" +
    "since there will be a collection of hits (each with p<0.05) with a final error of" +
    "more than 5% globally. To address this issue, FDR is applied to adjust for multiple" +
        "comparison and control the false positives. In the context of proteomics, FDR is the" +
        "among the accepted hits obtained by a database search algorithm." +
        " In mass spectrometric-based proteomics, the dominant strategy of FDR calculation is" +
        "target-decoy (TD) database search, in which the database search is carried out on" +
        "the target database (i.e. Swiss-Prot) as well as a decoy database. the decoy" +
        " database is constructed by shuffling, randomizing or by simply reversing the target" +
        " database. The TD database search can be performed separately or together" +
        "(concatenated) and scored using a search algorithm. By using this approach, FDR can" +
        " be easily calculated from the number of false positives divided by the total hits." +

        " Ref: Aggarwal S et al. Methods Mol Biol. 2016;1362:119-28. PMID: 26519173"
    },

    {   "name": "Filter-aided-sample-preparation-(FASP)",
        "text": "Filter aided sample preparation FASP is an effective strategy of processing protein extracts for bottom-up proteomics." +
        " After an initial step of protein solubilization in a detergent-contained lysis buffer, FASP" +
        " repurposes centrifugal ultrafiltration concentrators for removal of detergents, protein" +
        "cleavage, and isolation of pure peptide fractions for further analysis by mass spectrometry." +

        "Ref: Wiśniewski JR. Methods Enzymol. 2017;585:15-27. PMID: 28109427"
    },

    {   "name": "GC",
        "text": "GC Refers to gas chromatography. GC is used to separate volatile compounds in gas" +
        "phase."
    },

    {   "name": "GCPInfo",
        "text": "GCP Refers to global chromatin profiles obtained from a targeted proteomic assay of ~60" +
        "probes that monitor combinations of post-translational" +
        "modifications on histones, representing epigenomic regulations of the cells" +
        "after various perturbations.For more information, please see https://panoramaweb.org/project/LINCS/GCP/begin.view"
            },

    {   "name": "HCD",
        "text": "HCD Refers to higher energy collisional dissociation (or beam-type CID) which is available in" +
        "Orbitrap. Compared with traditional ion trap-based collision-induced dissociation," +
        "HCD fragmentation with Orbitrap detection has no low-mass cutoff, high resolution" +
        " ion detection, and increased ion fragments resulting in higher quality MS/MS" +
        "spectra. With higher energy, HCD is enabling a wider range of fragmentation" +
    " pathways. One disadvantage is that spectral acquisition times are up to two-fold" +
    " longer because more ions are required for Fourier transform detection in the" +
    "Orbitrap compared with detection of CID spectra in the ion trap via electron multipliers." +

        "Ref: Jedrychowski MP, et al., Mol Cell Proteomics. 2011;10(12):M111.009910. PMID:" +
        "21917720"
    },

    {   "name": "IAA",
        "text": "IAA Iodoacetamide, an alkylating agent which commonly used as a part of sample" +
        " preparation and protein digestion before the MS/MS analysis. IAA covalently binds to" +
        "the thiol group of cysteine residues, thereby blocking disulfide bond formation of" +
        "proteins."
    },

    {   "name": "iTRAQ",
        "text": "iTRAQ Refers to Isobaric Tag for Relative and Absolute Quantitation. The iTRAQ reagent can" +
        "be used for protein identification and quantitation of up to 8 different samples in" +
        "a MS/MS analysis." +
        "  For more information, please see" +
                            "www.sciex.com/products/consumables-and-standards/itraq-reagent"
    },

    {   "name": "Label-free-quantification-(LFQ)",
        "text": "Label free quantification LFQ is mainly performed by two strategies; first, spectral counting; and second," +
        "intensity-based quantification which based on area under the curve (AUC) or MS1 signal intensity. LFQ gains popularity in proteomics due" +
        "to simplicity and low cost. However, accurate and efficient normalization is an" +
        "important issue in LFQ due to the lack of internal standard." +

        " Ref: Timms JF et al. Methods Mol Biol. 2010;658:19-45. PMID: 20839096" +
        "Mayne J et al. Anal Chem. 2016;88(1):95-121. PMID: 26558748"
    },

    {   "name": "Limit-of-Detection-(LOD)",
        "text": "Limit of Detection LOD Refers to the lowest concentration or amount of a protein that can be detected" +
        "confidently."
    },

    {   "name": "Limit-of-quantification-(LOQ)",
        "text": "Limit of quantification LOQ  Refers to the lowest concentration or amount of a protein that can be quantified" +
        "confidently."
    },

    {   "name": "LC",
        "text": "LC  Refers to liquid chromatography. LC separates the analyte in the liquid mobile phase" +
    "based on their physicochemical interaction with a solid stationary phase. LC can be" +
        "used for analytical or preparative applications."
    },

    {   "name": "LysC",
        "text": "LysC A serine protease with high activity and specificity for the carboxyl side of" +
    "lysine, but not at arginine residues. Unlike trypsin, LysC" +
        " can cleave lysines followed by prolines."
    },

    {   "name": "MALDI",
        "text": "MALDI Refers to matrix assisted laser desorption ionization. In MALDI, the analyte is" +
        "mixed and co-crystallized with the matrix (usually a small organic compound, e.g.," +
        "                   -cyano-4-hydroxycinnamic acid) on a target plate. The ionization is triggered by a" +
        "laser beam, in which the matrix absorbs the laser energy and then transfers to the" +
        "analyte molecules. Both matrix and analyte molecules are desorbed into gas phase as" +
        "ions that can be analyzed by mass spectrometric methods, the most common being" +
        "time-of-flight (TOF). MALDI-mass spectrometry is" +
        "applicable to measure a wide range of compounds, for example, peptides and proteins," +
        "lipids, and small molecules." +

        "Ref: Chaurand P, et al. J Am Soc Mass Spectrom. 1999 Feb;10(2):91-103. PMID: 9926404"
    },

    {   "name": "Mass-spectrometry",
        "text": " Mass spectrometry in proteomics is an instrument system that measures the mass of" +
        "ions derived from analyte molecules. Mass spectrometry can form, separate, detect" +
        "molecular ions based on their mass-to-charge ratio (m/z), and then select and" +
        "fragment ions of interest for specific structural information (MS/MS spectra). By" +
        "definition, a mass spectrometer consists of an ion source (commonly MALDI or ESI) that ionized peptides into" +
        "ions, a mass analyzer that measures the mass-to-charge ratio (m/z) and a detector" +
        "that registers the number of ions at each m/z value. The mass analyzers are central" +
        "to the technology. There are three main types of mass analyzers used for proteomic" +
        "experiments, including trapping type instruments (i.e., quadrupole ion trap (QIT)," +
        "linear ion trap (LIT), Fourier transform ion cyclotron resonance (FT-ICR), and" +
        "Orbitrap), quadrupole (Q), and time of flight (TOF) instruments. Mass analyzers can" +
        "be in combination, usually two or three analyzers within one instrument, in order to" +
        "take advantages of the strength of all combined analyzers simultaneously, for" +
            "examples, Q-Trap, QQQ, Q-TOF, TOF–TOF, QQ-LIT. These instruments are called hybrid" +
        "mass spectrometers, and are highly sensitive and also have a high resolution." +

        "Ref: Aebersold R and Mann M, Nature 422:198–207. PMID: 12634793" +
        "Woods AG, et al., Adv Exp Med Biol. 2014;806:1-32. PMID: 24952176v"
    },

    {   "name": "Missing-values",
        "text": " Missing values are a common issue in quantitative proteomics. Global proteomics" +
        "datasets typically are missing 20–50% of the total possible peptide values. There" +
        "are two common types of missing value:" +

        "1. Missing at random (MAR)/ missing completely at random (MCAR): value missing that" +
        " not directly explained by the nature of the peptide or by its measured" +
        "intensity" +

        "2. Missing not at random (MNAR): peptide value missing due to biological based" +
            "reason" +

        "Ref: Webb-Robertson BJ et al. J Proteome Res. 2015;14(5):1993-2001. PMID: 25855118" +
        "Lazar C et al. J. Proteome Res., 2016, 15 (4), pp 1116–1125. PMID: 26906401"
    },

    {   "name": "Missing-value-imputation",
        "text": "Missing value imputation Refers to a process to handle the missing values from" +
        "quantitative proteomic experiments. In general, these algorithms can be grouped into" +
        "three categories: i) imputation by a single-digit replacement (e.g., MinDet and" +
        " MinProb), ii) imputation based on local structures in datasets (i.e., kNN), and iii)" +
    " imputation based on global structures in datasets (e.g., SVDImpute). Because of the" +
    "complex mechanisms of missing data in proteomics, no individual method is a single" +
        "solution for imputation. Choosing a method adapted to the nature of the missing values is more important than choosing a" +
        "method itself, regardless of the nature of missing" +
        "values. For example, MNAR are best imputed by MinDet and MinProb, while MAR/MCAR" +
        " values are well accounted for by kNN and SVDimpute. In addition, imputation should" +
        "be performed at the peptide level to avoid suboptimal imputation." +

        "Ref: Webb-Robertson BJ et al. J Proteome Res. 2015;14(5):1993-2001. PMID: 25855118" +
        "Lazar C et al. J. Proteome Res., 2016, 15 (4), pp 1116–1125. PMID: 26906401"
},

    {   "name": "Multiple-Reaction-Monitoring-(MRM)",
        "text": "Multiple Reaction Monitoring  MRM is a term which represents multiplexing capability of single reaction monitoring (SRM)." +
        "MRM is frequently used as a synonym of SRM" +
        "in the literatures." +
        "Please see Single Reaction Monitoring" +
        "(SRM) for more details." +

            "Ref: Picotti P, et al. Nat Methods. 2012 May 30;9(6):555-66. PMID: 22669653"
    },

    {   "name": "MS1-ion",
        "text": "MS1 ion Refers to precursor ion"
    },

    {   "name": "MS2-ion",
        "text": "MS2 ion Refers to fragment ion"
    },

    {   "name": "OpenSWATH",
        "text": "Open SWATH OpenSWATH is a software for automated targeted data extraction from DIA (data-independent" +
        "acquisition) experiments in mass spectrometry." +
        " The main workflow consists of OpenSWATH, PyProphet, TRIC, IPF and TAPIR. OpenSWATH" +
        "is available as a stand-alone library and is also packaged within the OpenMS C++" +
        "library for mass-spectrometry based data analysis." +
        " For more information, please see http://www.openswath.org/en/latest/index.html"
        },

    {   "name": "P100Info",
        "text": "P100 Refers to the reduced representation phosphoproteomics dataset generated by using a" +
        "targeted proteomic assay of 96 phosphopeptide probes that are commonly observed in" +
        "diverse cell types. For more information, please see" +
        "https://panoramaweb.org/project/LINCS/P100/begin.view"
            },

    {   "name": "Parallel-Reaction-Monitoring-(PRM)",
        "text": "Parallel Reaction Monitoring PRM is a method of targeted proteomic approach. In similar to those in SRM, the precursor ion is selected" +
        "and fragmented in PRM. The difference for PRM is that full MS/MS spectra are" +
        "acquired for each precursor (i.e., the parallel detection of all product ions) in" +
        " the high-resolution accurate-mass (HR/AM) instrument, whereas in SRM only predefined product ions" +
    "(i.e., transitions) are monitored by the low-resolution" +
    "quadrupole mass analyzer." +
    "See also targeted proteomics for more details." +
"Ref: Shi T et al, Proteomics. 2016 Aug; 16(15-16): 2160–2182. PMID: 27302376"
    },

    {   "name": "Peakview",
        "text": "Peak view Peakview software is distributed by Sciex (Concord, Ontario, Canada). Peakview is a" +
        "standalone, general purpose application for exploring and interpreting qualitative" +
            "LC/MS data from *.wiff files. The software includes tools for" +
        "analyzing both nominal and accurate mass" +
            "spectrometry data from single and multiple samples, as well as tools for" +
        "elucidating chemical structures. With the add-in MS/MSALL SWATH" +
            "Acquisition MicroApp, Peakview can perform SWATH analysis. The" +
        "SWATH Acquisition MicroApp generates extracted ion" +
            "chromatograms (XIC) of fragment ions from MS/MS spectra of targeted proteins and" +
        "peptides and integrates the peak areas from the SWATH data" +
            "files." +

        "For more information, please see" +
            "https://sciex.com/products/software/peakview-software"
            },

    {   "name": "Post-translational-modification-(PTM)",
        "text": "Post translational modification PTM  Residue covalent modifications occurring in the specific protein form involved in an" +
        "interaction." +

        "Ref: Controlled vocabularies, HUPO Proteomics Standard Initiative (last maintenance" +
        "and update Oct 2015) (www.psidev.info/groups/controlled-vocabularies)"
    },

    {   "name": "Phosphoproteomics",
        "text": "Phosphoproteomics Refers to a sub-discipline of proteomics that is focused on deriving a comprehensive" +
        "view of the extent and dynamics of protein phosphorylation. The greatest promise of" +
        "phosphoproteomics is the rapid analysis of entire phosphorylation-based signaling" +
        "networks." +

        "Ref: Mumby M et al., Genome Biol. 2005; 6(9): 230. PMID: 16168091"
    },

    {   "name": "Plasma-proteomics",
        "text": "Plasma proteomics A comprehensive analysis of plasma proteins in healthy and disease conditions which" +
        "aims to discover and validate biomarkers of clinical values. Plasma proteomics is" +
        "one of the most complex human derived proteome which is always affected by high" +
        "abundance proteins (i.e., albumin and immunoglobulin) and has an issue of wide" +
        "dynamic range of protein concentration. It is generally accepted that plasma need" +
        "one or more prefractionation to reduce the plasma protein complexity before" +
        "proteomic analysis."
    },

    {   "name": "Precursor-m/z",
        "text": "Precursor m/z Refers to a mass per charge of a precursor peptide"
    },

    {   "name": "Precursor-z",
        "text": "Precursor-z Precursor z Refers to the charge state of a precursor peptide, usually 2+ - 4+"
    },

    {   "name": "Proteoforms",
        "text": "Proteoforms All different molecular forms of the protein arising from the same gene with changes" +
        "due to genetic variation, alternative spliced RNA transcripts or post-translational" +
        "modifications." +

        "Ref: Smith LM, et al., Nat Methods 2013;10(3):186-7. PMID: 23443629"
    },

    {   "name": "Proteotypic-peptides",
        "text": "Proteotypic peptides Refers to peptides that uniquely represent targeted proteins or protein isoforms." +
        "Identification of proteotypic peptides of target proteins is a pre-requisite step of" +
        "targeted proteomics workflow. Lists of" +
        "proteotypic peptides for any particular proteins can be obtained from own proteomic" +
        "experiments, predicted by using computational tools or retrieved from public" +
        "databases, i.e., SRMAtlas." +

        " Ref: Keerthikumar S et al. Methods Mol Biol. 2017;1549:101-107. PMID: 27975286"
    },

    {   "name": "Q1",
        "text": "Q1 Refers to the mass filter for particular precursor ions"
    },

    {   "name": "Q3",
        "text": "Q3 Refers to the mass filter for particular fragment ions"
    },

    {   "name": "Quantitative-proteomics",
        "text": "Quantitative proteomics There are two main approaches of quantitative proteomics, including the stable" +
        "isotope-based or label-free methods. Isotope-based methods incorporate heavy" +
        "versions of specific molecules into the peptides, either by chemical derivatization" +
        "(i.e., iTRAQ, TMT) or by metabolic labeling" +
        "(e.g., SILAC). Label-free methods (such as the spectral" +
        "counting and label-free quantitation) have less accurate peptide quantification than" +
        "the isotope-based strategies. However, label-free methods are robust and" +
        "cost-effective, giving these strategies are increasingly attractive for large-scale" +
    "proteomic studies." +

        "Ref: Cox J and Mann M, Annu Rev Biochem. 2011;80:273-99. PMID: 21548781"
    },

    {   "name": "Retention-time-(RT)",
        "text": "Retention time RT  Refers to a particular time of a specific peptide eluted from a LC" +
        "run."
    },

    {   "name": "SDS",
        "text": "SDS Refers to Sodium dodecyl sulphate, an ionic detergent constitutes in lysis buffers" +
        "used for protein solubilization."
    },

    {   "name": "Sequence-tag-identification",
        "text": "Sequence tag identification This approach leads to protein identification by combining mass measurement and" +
        "short amino acid sequence information obtained by tandem mass spectrometry. This information is then used" +
        "to automatically find the best match in a sequence database. The procedure is" +
        "repeated with several peptides from the digest, resulting in multiple" +
        "identifications of the same protein or identification of several proteins from the" +
        "peptide mixture." +

        "Ref: Controlled vocabularies, HUPO Proteomics Standard Initiative (last maintenance" +
        "and update Oct 2015) (www.psidev.info/groups/controlled-vocabularies)"
    },

    {   "name": "Shotgun-proteomics",
        "text": " Shotgun proteomics is the high-throughput protein identification in peptide mixture" +
        "obtained by the proteolytic digestion of complex samples. Shotgun proteomics is the" +
        "most widely used and the most generic approach of mass" +
        "spectrometry based proteomics." +
        "For detail information, please see Bottom-up" +
        "proteomics, Discovery proteomics” and “Data dependent acquisition" +

        "Ref: Aebersold R and Mann M, Nature 422:198–207. PMID: 12634793"
    },

    {   "name": "Skyline",
        "text": "Skyline is a freely-available, open-source Windows client application for building" +
        "SRM, " +
        "MRM," +
        " PRM, DIA,SWATH" +
        "and targeted DDA quantitative" +
        "methods and analyzing the resulting mass spectrometer data." +

        "For more information, please see" +
        "https://skyline.ms/project/home/software/Skyline/begin.view"
            },

    {   "name": "SIL-internal-standards",
        "text": "SIL internal standards  Refers to stable isotope labelled analog of the analyte. In the SIL internal" +
        "standards, several atoms in the analyte are replaced by their stable isotopes, such" +
        "as deuterium (D), 13C, 15N, or 18O. SIL peptides are typically used as the internal" +
        "standards to generate the calibration curve for precise and accurate quantitation of" +
        "targeted proteins in mass spectrometry proteomic" +
        "assay."
    },

    {   "name": "SILAC",
        "text": "SILAC Refers to stable isotope labeling using amino acids in cell culture. SILAC is a" +
        " metabolic labeling method that incorporates “heavy” 13C- or 15N-labeled amino acids" +
        "into cellular proteins in vivo for quantitative proteomics." +

        "For more information, please see" +
        "https://www.thermofisher.com/us/en/home/life-science/protein-biology/protein-mass-spectrometry-analysis/protein-quantitation-mass-spectrometry/silac-metabolic-labeling-systems.html"

    },

    {   "name": "Single-Reaction-Monitoring (SRM)",
        "text": "Single Reaction Monitoring SRM is a targeted proteomic approach. SRM primarily performs on triple quadrupole" +
        "(QqQ) mass spectrometry and serves as the MS" +
        "gold-standard for targeted proteomics. SRM is a very sensitive and highly" +
        "selective method to detect and quantify a target peptide, and by inference, a target" +
        "protein in complex samples. When applying multiple targets, a term of multiple reaction monitoring" +
        "(MRM) is used to represent multiplexing capability of SRM." +
        "SRM utilizes a unique capability of the Triple Quadrapole (QQQ) mass spectrometer to" +
        "act as mass filters (Q1) which then isolate the target analyte" +
        "(precursor ion) from the contaminants. The precursor ion is sent to fragmentation in" +
        "Q2 by collision-induced dissociation. A specific fragment ion from the precursor ion" +
        "is selected in Q3 and guided to the detector. The number of" +
        "specific fragment ions that reach the detector is counted over time, resulting in a" +
        "chromatographic trace with retention time and" +
        "signal intensity as coordinates. Monitoring several precursor-fragment ion pairs (or" +
        "transitions) yields the chromatographic peaks at a" +
        "specific retention time that supports relative or" +
        "absolute (if an appropriate SIS-peptide is used) quantification of a targeted" +
        "peptide. A set of suitable transitions can be applied to" +
        "generate a specific assay to detect and quantify the target peptide, and by" +
        "inference, the target protein in complex samples." +

        "1. Study of protein modifications. For example, SRM/MRM can be used to measure" +
        "abundance changes of phosphorylated proteins to a series of pertubations in multiple" +
            "cancer cell lines which can give insights into functional changes in the protein" +
        "pathways and networks responsible to the pertubagens (P100" +
        "set in the iLINC project)." +

        "2. Biology and diseases. SRM/MRM" +
        "can be used to accurately quantify a series of 50-100 proteins involved in cellular" +
        "biological pathways at different functional/pathological states." +

        "3. Clinical application. SRM/MRM" +
        "is well-suited for biomarker validation of multiple target proteins across large" +
        "sample sets of clinical relevant specimens, i.e., plasma, serum and urine. Future" +
        "developments of SRM/MRM as a" +
        "platform of multiplexing clinical assays is promising." +

        ": Number of measurable proteins is limited to 50-100 proteins per one LC-MS" +
        "run. Accurate quantification of low-abundant proteins in complex samples is also" +
        "limited by the sensitivity of SRM measurement, unless sample prefractionation or" +
        "enrichment steps are applied." +

        "Ref: Picotti P, et al. Nat Methods. 2012;9(6):555-66. PMID: 22669653"
    },

    {   "name": "SWATH-MS",
        "text": "SWATH MS Refers to Sequential Window Acquisition of all THeoretical fragment ion-mass spectrometry. SWATH-MS is a targeted" +
        "label-free proteomic approach that couples DIA with direct searching of" +
        "individual samples against the established spectral library. A major advantage is" +
        "that SWATH-MS can maximize peptide detection at a comparable coverage of shotgun proteomics while still quantitates" +
        "peptide amount with consistency and reproducibility across various samples as SRM/MRM and PRM, thus increasing experimental" +
        "efficiency and reducing quantitative variability in the proteomic study." +

        "Technique:" +

        "SWATH-MS is a 2-step process; first, the spectral library generation, and second, SWATH data extraction. The spectral libraries can be simply" +
        "built using the information of DDA" +
        "data of samples of interest in which the same set of samples is planned for further" +
        "analysis in DIA mode. This will" +
        "give a very basic spectral library for SWATH data extraction." +
        "Alternatively, information from multiple DDA runs of technical replicates" +
        "and/or samples obtained from different genotypes, phenotypes, perturbations and" +
        "fractionation strategies will help increase the depth of proteome coverage and more" +
        "inclusive spectral libraries." +
        "For SWATH data extraction, the DIA data are searched against the" +
        "generated spectral library that allows a set number of fragment ion chromatograms to" +
        "be extracted for a peptide within the window of its predicted retention time. The peak groups are scored to" +
        "discriminate a “true” peptide target from nonspecific noise and distribution of" +
        "these target scores is modeled against the distribution of scores attributed to" +
        "decoy peak groups to determine a score cut off, resulting in an acceptablefalse discovery rate using the" +
        "target-decoy approach. Peptide abundance is then inferred from the aggregate of the" +
        " area under the curve for each fragment ion extracted ion chromatograms (XICs), which" +
        "can be used to estimate the overall protein intensity." +
        "Applications:" +

        "SWATH-MS is a suitable platform for any proteomic project that need to accurately" +
        "quantify 1000s peptides across a large number of samples, therefore serving for both" +
        "discovery and targeted proteomic experiments." +
        "Limitations:" +
        "SWATH-MS has less selective and sensitive than SRM and PRM. Data analysis always needs" +
        "sophisticate analytical pipeline and particular software as compared to DDA, SRM/MRM or PRM." +

        "Ref: Holewinski RJ et al., Methods Mol Biol. 2016;1410:265-79. PMID: 26867750"

    },

    {   "name": "Targeted-proteomics",
        "text": "Targeted proteomics Refers to a proteomic approach which specifies targets in complex protein mixture" +
        "and determines their presence and quantity across a sample cohort. There are three" +
        "main methods including SRM/MRM, PRM, and SWATH." +

        "Ref: Vidova V et al. Anal Chim Acta. 2017 Apr 29;964:7-23. PMID: 28351641" +
        "Shi T et al, Proteomics. 2016 Aug; 16(15-16): 2160–2182. PMID: 27302376"
    },

    {   "name": "TCEP",
        "text": "TCEP Refers to tris(2-carboxyethyl)phosphine, an irreversible reducing agent that can use" +
        "to break disulfide bonds of proteins."
    },

    {   "name": "TMT",
        "text": "TMT Refers to Tandem Mass Tag reagent. The TMT reagent can be used to enable protein" +
        "identification and quantitation of up to 10 different samples at a single MS/MS" +
        "experiment." +

        "For more information, please see" +
        " www.thermofisher.com/us/en/home/life-science/protein-biology/protein-mass-spectrometry-analysis/protein-quantitation-mass-spectrometry/tandem-mass-tag-systems.html"

    },

    {   "name": "Top-down-proteomics",
        "text": "Top down proteomics Refers to the study of the proteoforms - all molecular" +
        "forms of genetic variation, alternative splicing of RNA transcripts and post-translational" +
    "modifications. As proteoforms are tightly linked the" +
    "functions of cells and tissues underlie the complex phenotypes, top-down proteomics" +
    "will provide critical insights into fundamental process of biological systems." +

        "Ref: Toby TK, et al., Annu Rev Anal Chem. 2016;9(1):499–519. PMID: 27306313" +
        "Smith LM et al. Science. 2018;359(6380)1106-1107. PMID: 29590032"
    },

    {   "name": "Transitions",
        "text": "Transitions Refers to the specific pair of m/z values associated to the precursor and the" +
        "selected fragment ions. Transition can be written as parent m/z > fragment m/z (e.g." +
        "440.7 > 201.1)." +

        "Source: http://www.mrmatlas.org/glossary2.php"
            },

    {   "name": "Trypsin",
        "text": "Trypsin The most common proteolytic enzyme uses in bottom up proteomic experiments. This" +
        "enzyme cleaves at C-terminus of lysine or arginine, producing peptides from a" +
        "protein. Note that trypsin cannot cleave lysines follow by prolines, resulting in" +
        "miss cleavage peptides."
    },

    {   "name": "Ubiquitin-modification",
        "text": "Ubiquitin modification A post-translational" +
        "modification involving a sequential reaction steps of E1/E2/E3 enzymes leading" +
        "to ubiquitin activation and transferring to the substrate proteins. Ubiquitin" +
        "modification (or ubiquitination) starts by the attachment of the 76-amino acid" +
    "protein ubiquitin to a substrate lysine residue via an isopeptide bond, resulting in" +
    " ubiquitinated lysine. Ubiquitin modification can occur in mono-ubiquitination and" +
        "poly-ubiquitination, while poly-ubiquitination can be homotypic and heterotypic" +
        "linkage types." +
        "After tryptic digestion, the ubiquitin is cleaved as same as the substrate protein" +
        "by the enzyme trypsin, resulting in a diglycine remnant of" +
        "ubiquitin remained on the lysine residue (GG--K) of the substrate peptide. The" +
        "GG--K is a basis of ubiquitin modified peptide enrichment and bottom-up proteomic" +
        "analysis."
    }
    ]

    self.divList = [];
    self.divListAll = [];
    self.documents.forEach(function (doc) {
        self.divList.push(doc.name);
        self.divListAll.push(doc.name);
    })

    $scope.showAll = function(){
        self.divList = self.divListAll;
    };

    var idx = lunr(function () {
        this.ref('name')
        this.field('text')

        self.documents.forEach(function (doc) {
            this.add(doc)
        }, this)
    });

    $scope.searchItem = function(itemKey){
        console.log(idx.search(itemKey));
        var searchResult = idx.search(itemKey);
        self.divList = [];
        searchResult.forEach(function (doc) {
            console.log(doc);
            console.log(doc['ref']);

            self.divList.push(doc['ref']);
        });
        $("h3").blast(false);
        $("h3")
        // Blast the text apart by word.
            .blast({ search: itemKey.toString() })
            // Fade the words into view using Velocity.js.
            .velocity("transition.fadeIn", {
                display: null,
                duration: 5000,
                stagger: 40,
                delay: 1000
            });
        $("p").blast(false);
        $("p")
        // Blast the text apart by word.
            .blast({ search: itemKey.toString() })
            // Fade the words into view using Velocity.js.
            .velocity("transition.fadeIn", {
                display: null,
                duration: 5000,
                stagger: 40,
                delay: 1000
            });

        $("div").blast(false);
        $("div")
        // Blast the text apart by word.
            .blast({ search: itemKey.toString() })
            // Fade the words into view using Velocity.js.
            .velocity("transition.fadeIn", {
                display: null,
                duration: 5000,
                stagger: 40,
                delay: 1000
            });
        console.log("=======================");
    };

    console.log(idx.search("substrate"));
    console.log("=======================");
    console.log("=======================");
    console.log("=======================");
    self.tableSmileSimilar = SharedService.getVar('tableSmileSimilar');
    self.tableGeneSimilar = SharedService.getVar('tableGeneSimilar');
    //SharedService.setVar('tableSmileSimilar', self.tableSmileSimilar);
    //SharedService.setVar('cpSvg4', $scope.cpSvg4);
    self.showSmileSvg = SharedService.getVar('showSmileSvg');



    $scope.showPartFlag = SharedService.getVar('showPartFlag');

    $scope.showPart = function (num) {

        $scope.showPartFlag = num;
        SharedService.setVar('showPartFlag', num);

    }
    //self.selectedSmile = SharedService.getVar('selectedSmile');
    $(document).ready(function(){
        if(self.assayTab === "P100"){
            $("#assayViewTab li:eq(0) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing P100 tab");

        }
        if(self.assayTab === "GCP"){
            $("#assayViewTab li:eq(1) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing GCP tab");

        }
        if(self.assayTab === "DToxS"){
            $("#assayViewTab li:eq(2) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing DToxS tab");

        }
        if(self.assayTab === "SWATH"){
            $("#assayViewTab li:eq(3) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing SWATH tab");

        }
        if(self.assayTab === "RPPA"){
            $("#assayViewTab li:eq(5) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing RPPA tab");

        }
        if(self.assayTab === "Micro"){
            $("#assayViewTab li:eq(4) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing Micro tab");

        }

    });


    $scope.showAssaysSubTab = function () {
        $scope.showAssaysSubTabVal = true;

        $scope.showGlossarySubTabVal = false;
    }
    $scope.showGlossarySubTab = function () {
        $scope.showAssaysSubTabVal = false;

        $scope.showGlossarySubTabVal = true;
    }

    $scope.showAboutSubTabVal = true;
    $scope.showCentersSubTabVal = false;
    $scope.showToolsSubTabVal = false;
    $scope.showPublicationSubTabVal = false;

    $scope.showAboutSubTab = function () {
        $scope.showAboutSubTabVal = true;
        $scope.showCentersSubTabVal = false;
        $scope.showToolsSubTabVal = false;
        $scope.showPublicationSubTabVal = false;
    }
    $scope.showCentersSubTab = function () {
        $scope.showAboutSubTabVal = false;
        $scope.showCentersSubTabVal = true;
        $scope.showToolsSubTabVal = false;
        $scope.showPublicationSubTabVal = false;
    }
    $scope.showToolsSubTab = function () {
        $scope.showAboutSubTabVal = false;
        $scope.showCentersSubTabVal = false;
        $scope.showToolsSubTabVal = true;
        $scope.showPublicationSubTabVal = false;
    }
    $scope.showPublicationSubTab = function () {
        $scope.showAboutSubTabVal = false;
        $scope.showCentersSubTabVal = false;
        $scope.showToolsSubTabVal = false;
        $scope.showPublicationSubTabVal = true;
    }


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

                }, 50);

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
    var leftOffset = parseInt($("#sidebar").css('margin-top')); //Grab the left position left first

    var botOffset = 220 ;

    $(document).scroll(function(){
        var y = $(this).scrollTop();
        var scrollBottom = $(document).height() - $(window).height() - $(window).scrollTop();
        // console.log($(window).height());
        // console.log(scrollBottom);
        // console.log(Math.max(0, botOffset - scrollBottom));
        // console.log("------");
        $('#sidebar').css({

            'margin-bottom': Math.max(0, botOffset - scrollBottom) //Use it later
        });
    });



    $(document).scroll(function(){
        var y = $(this).scrollTop();
        $('#sidebar').css({
            'margin-top': Math.max(0, leftOffset - y) //Use it later
        });
    });
    $(document).scroll(function(){
        var y = $(this).scrollTop();
        // console.log(y);
        $('#sidebar2').css({
            'margin-top': Math.max(0, leftOffset - y) //Use it later
        });
        // console.log(y);
    });

    //End of script from guide ========================

    console.log("here");
    self.showAllPapers = false;

    $(document).scroll(function () {
        var y = $(this).scrollTop();

        if (y > 500) {
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

    $scope.assayCenters = [
        {value: "P100 (PCCSE)"},
        {value: "GCP (PCCSE)"},
        {value: "MS Protein State (LINCS DToxS)"},
        {value: "SWATH-MS protein quantification (NeuroLINCS)"},
        {value: "RPPA protein state (HMS LINCS)"}
    ];

    $scope.selectedAssayCenter = $scope.assayCenters[0];

    $scope.changeAssayCenter = function (selectedAssayCenter) {

        SharedService.setVar('selectedAssayCenter', selectedAssayCenter);
        console.log(selectedAssayCenter);
    }
    //$scope.initNetwork();

    // $scope.goToPeptideToProtein = function () {
    //     $location.url("/peptideToProtein");
    //     self.url = $location.url();
    //     console.log($location.url());
    // };
    $scope.scrollToAbout = function (id) {
        $location.url("/about");
        self.url = $location.url();
        $location.hash(id);
        $anchorScroll();
    }

    $scope.scrollTo = function (id) {
        $location.hash(id);
        $anchorScroll();
    }
    $scope.scrollToDownloadId = function (id) {
        console.log("scrollToDownloadId");
        console.log(id);
        $location.path("/download");
        // window.location.href = "/lincsproteomics/assays";
        $timeout(function () {
            $location.hash(id);
            $anchorScroll();

            // $anchorScroll(id);
        }, 500);

    };

    $scope.scrollToAboutId = function (id) {
        window.location.href = "/lincsproteomics/about";

        $timeout(function () {
            $location.hash(id);
            $anchorScroll();

            // $anchorScroll(id);
        }, 500);
        // $location.url("about.html");
        $(window).on("load", function () {
            $location.hash(id);
            $anchorScroll();
            console.log(id);
        });
    };


    // $location.path("/lincsproteomics/about");
    //     $timeout(function () {
    //         $location.hash(id);
    //         $anchorScroll();
    //     }, 300);
    // }
    // $scope.goToAbout = function () {
    //
    //     window.location.href = "/lincsproteomics/about";
    // }












    $scope.goToDownload = function (selectedTab) {

        SharedService.setVar('downloadTab', selectedTab);
        $location.path("/download");

    }

    $scope.goToExplore = function (selectedTab, selectedCp) {

        SharedService.setVar('selectedTab', selectedTab);
        SharedService.setVar('exploreCompound', selectedCp.toUpperCase());
        $location.path("/explore");

    }

    $scope.goToAssays = function (selectedTab) {

        SharedService.setVar('assayTab', selectedTab);
        $location.path("/assays");

    }

    $scope.goToCentersInfo = function () {

        // SharedService.setVar('selectedPerturbation',selectedPerturbation);
        // console.log(selectedPerturbation);
        window.location.href = "about.html#foo";
        //href="explore.html";
        // self.url = $location.url();
        // console.log($location.url());
    }
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



    $scope.initNetwork = function () {

        $http.get('/lincsproteomics/data/content.json').success(function (data) {
            self.initNetworkJSON = data;
            console.log("initNetworkJSON");
            console.log(self.initNetworkJSON);
            $scope.showNetwork("P100");
        });

        $http.get('/lincsproteomics/data/phospho_network_p100.json').success(function (data) {
            self.p100phospho = data;
            console.log("p100phospho");
            console.log(self.p100phospho);


        });

        $http.get('/lincsproteomics/data/P100_processed_perturb.json').success(function (data) {
            self.P100ProcessedJSON = data;
            console.log(self.P100ProcessedJSON);
            console.log(self.P100ProcessedJSON.TRAMETINIB);

        })

        $http.get('/lincsproteomics/data/compounds_2_datasets.json').success(function (data) {
            // self.P100ProcessedJSON = data;
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.Trametinib);
            //self.selectedPerturbation = 'Trametinib';
            $scope.compounds_2_datasets = data;
            //console.log($scope.perturbation);
        })

        $http.get('/lincsproteomics/data/proteomics_compound_list.json').success(function (data) {
            // self.P100ProcessedJSON = data;
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.Trametinib);
            self.selectedPerturbation = 'TRAMETINIB';
            $scope.all_perturbations = data;
            console.log($scope.all_perturbations);
        })
    };
    self.selectedPerturbation = 'TRAMETINIB';
    self.selectedDataSets = 'P100 (PCCSE)';
    $scope.dataSets = ["P100 (PCCSE)", "GCP (PCCSE)", "MS Protein State (LINCS DToxS)", "SWATH-MS protein quantification (NeuroLINCS)", "RPPA protein state (HMS LINCS)"];




}])
;


appModule.controller('NavigationCtrl', ['$scope', '$sce', '$location', '$anchorScroll', '$http', '$timeout', '$window', '$routeParams', '$filter', '$q','NgTableParams','SharedService','SVGFetcher', function ($scope, $sce, $location, $anchorScroll, $http, $timeout, $window, $routeParams, $filter, $q, NgTableParams, SharedService,SVGFetcher) {


    console.log("in NavigationCtrl");
    var self = this;
    $scope.exploreCompound = SharedService.getVar("exploreCompound");
    $scope.button_m_all = true;
    $scope.button_p100_m = false;
    $scope.button_gcp_m = false;
    $scope.button_mass_m = false;
    $scope.button_swath_m = false;
    $scope.button_rppa_m = false;

    $scope.button_c_all = true;
    $scope.button_pccse_c = false;
    $scope.button_dtoxs_c = false;
    $scope.button_neuro_c = false;
    $scope.button_hms_c = false;

    $scope.button_a_all = true;
    $scope.button_p100_a = false;
    $scope.button_gcp_a = false;
    $scope.button_mass_a = false;
    $scope.button_swath_a = false;
    $scope.button_rppa_a = false;

    $scope.showAssaysSubTabVal = true;
    $scope.showGlossarySubTabVal = false;




    self.showCompoundToDSTable = SharedService.getVar("showCompoundToDSTable");
    self.compoundAndDS = SharedService.getVar("compoundAndDS");
    self.showCompoundToDSTableSmiles = SharedService.getVar("showCompoundToDSTableSmiles");
    self.compoundAndDSSmiles = SharedService.getVar("compoundAndDSSmiles");

    self.assayTab = SharedService.getVar("assayTab");
    console.log(self.assayTab);
    self.exploreTab = SharedService.getVar("exploreTab");
    self.downloadTab = SharedService.getVar("downloadTab");
    self.exploreCompound = SharedService.getVar("exploreCompound");

    self.selectedSmile = SharedService.getVar('selectedSmile');
    self.showSimilarSmileCompounds = SharedService.getVar('showSimilarSmileCompounds');
    self.cpSmileSimilar = SharedService.getVar('cpSmileSimilar');
    self.showSimilarSmileCompoundsFinal = SharedService.getVar('showSimilarSmileCompoundsFinal');

    self.tableSmileSimilar = SharedService.getVar('tableSmileSimilar');
    self.tableGeneSimilar = SharedService.getVar('tableGeneSimilar');
    //SharedService.setVar('tableSmileSimilar', self.tableSmileSimilar);
    //SharedService.setVar('cpSvg4', $scope.cpSvg4);
    self.showSmileSvg = SharedService.getVar('showSmileSvg');

    if (self.showSmileSvg){

        console.log("in gotSVGForSmile");
        self.translatedSmile = self.selectedSmile.replace(/\//g, '1234').replace(/\\/g, '4321');
        console.log(self.translatedSmile);
        self.showSmileSvg = false;
        $http({
            method: 'GET',
            url: "api/depictSmiles/" + self.translatedSmile,
            transformResponse: function (data) {
                // string -> XML document object
                return $.parseXML(data);
            }

        }).//$http.get("api/depictSmiles/" + self.translatedSmile)
        success(function (apiSMILESSvg) {

            var svgImg2 = new XMLSerializer().serializeToString(apiSMILESSvg.documentElement);

            console.log("apiSMILESSvg Success!");
            $scope.cpSvg4 = $sce.trustAsHtml(svgImg2);

            self.showSmileSvg = true;
            console.log(self.showSmileSvg);
            })
        .error(function () {
            console.log("Error in obtaining network from api/depictSmiles");

        });

    }



    self.selectedPerturbation = SharedService.getVar('selectedPerturbation');
    self.selectedPerturbationSmiles = SharedService.getVar('selectedPerturbationSmiles');
    self.selectedPerturbationGenes = SharedService.getVar('selectedPerturbationGenes');
    self.tableGeneSimilar = SharedService.getVar('tableGeneSimilar');
    self.showGeneSvg = SharedService.getVar('showGeneSvg');
    self.compoundAndDSGenes = SharedService.getVar('compoundAndDSGenes');

    self.selectedGeneAsInput = SharedService.getVar('selectedGeneAsInput');
    if(self.showGeneSvg) {
        $scope.stringUrlPng = "https://string-db.org/api/image/network?identifiers=" + self.selectedGeneAsInput;
    }



    self.selectedCpInfo = SharedService.getVar('selectedCpInfo');
    self.selectedCpInfoSmiles = SharedService.getVar('selectedCpInfoSmiles');
    self.selectedCpInfoGenes = SharedService.getVar('selectedCpInfoGenes');
    self.showCompoundToDSTableGenes = SharedService.getVar('showCompoundToDSTableGenes');
    $scope.showPartFlag = SharedService.getVar('showPartFlag');

    self.selectedCpInfoSmiles = SharedService.getVar('selectedCpInfoSmiles');
    console.log(self.selectedCpInfoSmiles);
    self.selectedCpInfo = SharedService.getVar('selectedCpInfo');
    $scope.showPart = function (num) {

        $scope.showPartFlag = num;
        SharedService.setVar('showPartFlag', num);

    }

    self.gotSVGForSmile = SharedService.getVar('gotSVGForSmile');
    console.log(self.gotSVGForSmile);


    // $(document).ready(function() {
    //     $(".left").addClass("active");
    //
    // });
    self.showPartLeft = true;
    self.showPartRight = false;

    $(document).ready(function() {
        $(".left").click(function () {
            $(".left").removeClass("active");
            console.log("left");
            $(".right").removeClass("active");
            // $(".tab").addClass("active"); // instead of this do the below
            $(".left").addClass("active");
            self.showPartLeft = true;
            self.showPartRight = false;
        });
    });
    $(document).ready(function() {
        $(".right").click(function () {
            $(".left").removeClass("active");
            $(".right").removeClass("active");
            console.log("right");
            // $(".tab").addClass("active"); // instead of this do the below
            $(".right").addClass("active");
            self.showPartLeft = false;
            self.showPartRight = true;
        });
    });
    // $scope.rightActive = function () {
    //     $(".left").removeClass("active");
    //     $(".right").removeClass("active");
    //     console.log("right");
    //     // $(".tab").addClass("active"); // instead of this do the below
    //     $(".right").addClass("active");
    // }
    // $scope.leftActive = function () {
    //     $(".left").removeClass("active");
    //     $(".right").removeClass("active");
    //     console.log("right");
    //     // $(".tab").addClass("active"); // instead of this do the below
    //     $(".left").addClass("active");
    // }

    // var leftDiv = document.getElementsByClassName("left");
    // leftDiv.addEventListener("click", function() {
    //     $(".left").removeClass("active");
    //     $(".right").removeClass("active");
    //     console.log("right");
    //     // $(".tab").addClass("active"); // instead of this do the below
    //     $(".left").addClass("active");
    // });
    // $(".left").on("mousedown mouseup mouseleave", function(e){
    //     $(this).toggleClass( "active", e.type === "mousedown" );
    // });
    // $(".right").on("mousedown mouseup mouseleave", function(e){
    //     $(this).toggleClass( "active", e.type === "mousedown" );
    // });



        //self.selectedSmile = SharedService.getVar('selectedSmile');
    $(document).ready(function(){
        if(self.assayTab === "P100"){
            $("#assayViewTab li:eq(0) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing P100 tab");

        }
        if(self.assayTab === "GCP"){
            $("#assayViewTab li:eq(1) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing GCP tab");

        }
        if(self.assayTab === "DToxS"){
            $("#assayViewTab li:eq(2) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing DToxS tab");

        }
        if(self.assayTab === "SWATH"){
            $("#assayViewTab li:eq(3) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing SWATH tab");

        }
        if(self.assayTab === "RPPA"){
            $("#assayViewTab li:eq(5) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing RPPA tab");

        }
        if(self.assayTab === "Micro"){
            $("#assayViewTab li:eq(4) a").tab('show'); // to select 2nd Tab(0-indexed)
            console.log("showing Micro tab");

        }

    });


    $scope.showAssaysSubTab = function () {
        $scope.showAssaysSubTabVal = true;

        $scope.showGlossarySubTabVal = false;
    }
    $scope.showGlossarySubTab = function () {
        $scope.showAssaysSubTabVal = false;

        $scope.showGlossarySubTabVal = true;
    }

    $scope.showAboutSubTabVal = true;
    $scope.showCentersSubTabVal = false;
    $scope.showToolsSubTabVal = false;
    $scope.showPublicationSubTabVal = false;

    $scope.showAboutSubTab = function () {
        $scope.showAboutSubTabVal = true;
        $scope.showCentersSubTabVal = false;
        $scope.showToolsSubTabVal = false;
        $scope.showPublicationSubTabVal = false;
    }
    $scope.showCentersSubTab = function () {
        $scope.showAboutSubTabVal = false;
        $scope.showCentersSubTabVal = true;
        $scope.showToolsSubTabVal = false;
        $scope.showPublicationSubTabVal = false;
    }
    $scope.showToolsSubTab = function () {
        $scope.showAboutSubTabVal = false;
        $scope.showCentersSubTabVal = false;
        $scope.showToolsSubTabVal = true;
        $scope.showPublicationSubTabVal = false;
    }
    $scope.showPublicationSubTab = function () {
        $scope.showAboutSubTabVal = false;
        $scope.showCentersSubTabVal = false;
        $scope.showToolsSubTabVal = false;
        $scope.showPublicationSubTabVal = true;
    }


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

                }, 50);

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

    console.log("here");
    self.showAllPapers = false;

    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 500) {
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

    $scope.assayCenters = [
        {value: "P100 (PCCSE)"},
        {value: "GCP (PCCSE)"},
        {value: "MS Protein State (LINCS DToxS)"},
        {value: "SWATH-MS protein quantification (NeuroLINCS)"},
        {value: "RPPA protein state (HMS LINCS)"}
    ];

    $scope.selectedAssayCenter = $scope.assayCenters[0];

    $scope.changeAssayCenter = function (selectedAssayCenter) {

        SharedService.setVar('selectedAssayCenter', selectedAssayCenter);
        console.log(selectedAssayCenter);
    }
    //$scope.initNetwork();

    // $scope.goToPeptideToProtein = function () {
    //     $location.url("/peptideToProtein");
    //     self.url = $location.url();
    //     console.log($location.url());
    // };
    $scope.scrollToAbout = function (id) {
        $location.url("/about");
        self.url = $location.url();
        $location.hash(id);
        $anchorScroll();
    }

    $scope.scrollTo = function (id) {
        $location.hash(id);
        $anchorScroll();
    }
    $scope.scrollToDownloadId = function (id) {
        console.log("scrollToDownloadId");
        console.log(id);
        $location.path("/download");
    // window.location.href = "/lincsproteomics/assays";
        $timeout(function () {
            $location.hash(id);
            $anchorScroll();

            // $anchorScroll(id);
        }, 500);

    };

    $scope.scrollToAboutId = function (id) {
        window.location.href = "/lincsproteomics/about";

        $timeout(function () {
            $location.hash(id);
            $anchorScroll();

            // $anchorScroll(id);
        }, 500);
        // $location.url("about.html");
        $(window).on("load", function () {
            $location.hash(id);
            $anchorScroll();
            console.log(id);
        });
    };


    // $location.path("/lincsproteomics/about");
    //     $timeout(function () {
    //         $location.hash(id);
    //         $anchorScroll();
    //     }, 300);
    // }
    // $scope.goToAbout = function () {
    //
    //     window.location.href = "/lincsproteomics/about";
    // }
    $scope.reportSimilarLINCSGenes = function (selectedGeneAsInput) {
        //console.log(SharedService.getVar('exploreCompound'));
        //console.log(SharedService.getVar('exploreTab'));
        //console.log(selectedPerturbation);
        self.showGeneSpinner = true;
        //SharedService.setVar('showGeneSpinner', self.showGeneSpinner);
        //SharedService.setVar('exploreTab', "GCP");

        //console.log(SharedService.getVar('exploreCompound'));
        //console.log(SharedService.getVar('exploreTab'));
        self.selectedGeneAsInput = selectedGeneAsInput;

        self.showGeneSvg = false;

        SharedService.setVar('selectedGeneAsInput', self.selectedGeneAsInput);
        SharedService.setVar('showGeneSvg', self.showGeneSvg);

        $scope.stringUrlPng = "https://string-db.org/api/image/network?identifiers=" + self.selectedGeneAsInput;


        $http({
            method: 'GET',
            url: "api/geneNetwork/" + self.selectedGeneAsInput,
        }).success(function (listOfGenes) {
            console.log(listOfGenes);

            $scope.stringGenes = [];
            $scope.stringGenesInfo = [];
            self.cpGeneSimilar = [];
            listOfGenes.forEach(function (n, i) {
                var item = listOfGenes[i];
                if ($scope.stringGenes.indexOf(item["preferredName_A"]) == -1) {
                    $scope.stringGenes.push(item["preferredName_A"]);
                }
            })

            var listOfGenesLen = $scope.stringGenes.length;
            var listOfGenesIter = 0;
            $scope.stringGenes.forEach(function (n, i) {
                $http({
                    method: 'GET',
                    url: "api/geneInfo/" + $scope.stringGenes[i],
                }).//$http.get("api/depictSmiles/" + self.translatedSmile)
                success(function (localGeneInfo) {
                    listOfGenesIter += 1;
                    console.log(localGeneInfo);
                    all_gene_names = [];
                    if("symbol" in localGeneInfo){
                    all_gene_names.push(localGeneInfo["symbol"]);
                    }
                    if("synonyms" in localGeneInfo) {
                        if (!(localGeneInfo["synonyms"] === undefined || localGeneInfo["synonyms"].length == 0)) {
                            localGeneInfo["synonyms"].forEach(function (l, k) {
                                all_gene_names.push(localGeneInfo["synonyms"][k]);
                            });
                        }
                    }

                    localGeneInfo["all_names"] = all_gene_names;


                    $scope.all_perturbations.forEach(function (m, j) {
                        var item = $scope.all_perturbations[j];
                        if (item.includes("SG01") || item.includes("SG02")) {
                            var itemName = item.split("_")[0];
                            console.log(all_gene_names);
                            if (all_gene_names !== undefined ) {
                                if (all_gene_names.length > 0 ) {
                                    console.log(all_gene_names.length);
                                    all_gene_names.forEach(function (k, l) {
                                        console.log(all_gene_names[l]);
                                        if (itemName === all_gene_names[l].toUpperCase() && self.cpGeneSimilar.indexOf(all_gene_names[l]) == -1) {
                                            var cp_entry = {}
                                            cp_entry["symbol"] = localGeneInfo["symbol"];
                                            cp_entry["synonyms"] = localGeneInfo["synonyms"];
                                            cp_entry["description"] = localGeneInfo["description"];
                                            cp_entry["name"] = localGeneInfo["name"];
                                            cp_entry["lincs_cp"] = item;
                                            cp_entry["target_gene"] = all_gene_names[l].toUpperCase();
                                            self.cpGeneSimilar.push(cp_entry)
                                        }
                                    })
                                }
                            }
                        }

                    })
                    if (listOfGenesIter >= listOfGenesLen) {
                        self.showGeneSvg = true;
                        SharedService.setVar('showGeneSvg', self.showGeneSvg);
                        console.log("=========================");
                        console.log(self.cpGeneSimilar);
                        self.tableGeneSimilar = new NgTableParams({

                            count: 5
                        }, {
                            total: self.cpGeneSimilar.length,  dataset: self.cpGeneSimilar,counts: [5, 10, 25]});
                        SharedService.setVar('tableGeneSimilar', self.tableGeneSimilar);
                        self.showGeneSpinner = false;
                    }

                    // $scope.stringGenesInfo.push(localGeneInfo);
                })
                    .error(function () {
                        listOfGenesIter += 1;
                        console.log("Error in obtaining gene info from api/geneInfo/");
                        if (listOfGenesIter >= listOfGenesLen) {
                            self.showGeneSvg = true;
                            SharedService.setVar('showGeneSvg', self.showGeneSvg);
                            console.log("=========================");
                            console.log(self.cpGeneSimilar);
                            self.tableGeneSimilar = new NgTableParams({

                                count: 5
                            }, {
                                total: self.cpGeneSimilar.length,  dataset: self.cpGeneSimilar,counts: [5, 10, 25]});
                            self.showGeneSpinner = false;
                            SharedService.setVar('tableGeneSimilar', self.tableGeneSimilar);
                        }
                    });
            })

        })
            .error(function () {

            console.log("Error in obtaining gene info from api/geneNetwork/");

        });


        if(1== 0){
            console.log($scope.all_perturbations);

            console.log(self.cpGeneSimilar);



            self.showP100Table = true;
            SharedService.setVar("showP100Table",self.showP100Table);

            SharedService.setVar('tableSmileSimilar', self.tableSmileSimilar);

            SharedService.setVar('cpSmileSimilar', self.cpSmileSimilar);
            //console.log(self.network);


            self.showSimilarSmileCompounds = true;
            SharedService.setVar('showSimilarSmileCompounds', self.showSimilarSmileCompounds);

            self.showSimilarSmileCompoundsFinal = self.showSmileSvg && self.showSimilarSmileCompounds;
            SharedService.setVar('showSimilarGenesCompounds', self.showSimilarGenesCompounds);

        }



    }





    $scope.showDataForPerturbationGenes = function (selectedPerturbation) {
        SharedService.setVar('selectedPerturbationGenes', selectedPerturbation);
        self.selectedPerturbationGenes = selectedPerturbation.toUpperCase();


        self.selectedCpInfoGenes =$scope.compound_info[self.selectedPerturbationGenes];
        console.log(self.selectedCpInfoGenes);
        SharedService.setVar('selectedCpInfoGenes', self.selectedCpInfoGenes);
        self.compoundAndDSGenes = $scope.compounds_2_datasets[self.selectedPerturbationGenes];
        SharedService.setVar('compoundAndDSGenes', self.compoundAndDSGenes);
        console.log(self.compoundAndDSGenes);
        self.showCompoundToDSTableGenes = true;
        SharedService.setVar('showCompoundToDSTableGenes', self.showCompoundToDSTableGenes);
    }


    $scope.reportSimilarLINCSCompounds = function (selectedSmile) {
        //console.log(SharedService.getVar('exploreCompound'));
        //console.log(SharedService.getVar('exploreTab'));
        //console.log(selectedPerturbation);
        self.showSmileSvgSpinner = true;
        SharedService.setVar('selectedSmile', selectedSmile);
        //SharedService.setVar('exploreTab', "GCP");

        //console.log(SharedService.getVar('exploreCompound'));
        //console.log(SharedService.getVar('exploreTab'));
        self.selectedSmile = selectedSmile;
        self.translatedSmile = selectedSmile.replace(/\//g, '1234').replace(/\\/g, '4321');
        console.log(self.translatedSmile);
        self.showSmileSvg = false;
        self.showSimilarSmileCompounds = false;
        SharedService.setVar('selectedSmile', self.selectedSmile);
        SharedService.setVar('showSmileSvg', self.showSmileSvg);
        SharedService.setVar('showSimilarSmileCompounds', self.showSimilarSmileCompounds);
        $scope.Message = "My name is <span><b>Behrouz</b></span>";



        // var req = {
        //     method: 'GET',
        //     url: 'api/depictSmiles/',
        //     headers: {
        //         'Content-Type': undefined
        //     },
        //     data: { test: 'test' }
        // }
        //
        // $http(req).then(function(){...}, function(){...});
        // $.ajax({
        //     type: "GET",
        //     url: "api/depictSmiles/" + self.translatedSmile,
        //     dataType: "svg",
        //     success: function(xml) {
        //         console.log(xml);
        //         console.log(xml.data);
        //         var svgImg = xml.data;
        //         console.log(svgImg);
        //         $scope.cpSvg3 = $sce.trustAsHtml(svgImg);
        //         console.log($scope.cpSvg3);
        //         // console.log($scope.cpSvg3.toString());
        //
        //     }
        // });

        //
        // SVGFetcher.get("http://www.w3.org/2000/svg").then(function(resp) {
        //     console.log(resp);
        //     console.log(resp.data);
        //     $scope.cpSvg4 = $sce.trustAsHtml(resp.data);
        // });

        // SVGFetcher.get("api/depictSmiles/" + self.translatedSmile).then(function(resp) {
        //
        //
        //
        //
        // });


    $http({
        method: 'GET',
        url: "api/depictSmiles/" + self.translatedSmile,
        transformResponse: function (data) {
            // string -> XML document object
            return $.parseXML(data);
        }

    }).//$http.get("api/depictSmiles/" + self.translatedSmile)
    success(function (apiSMILESSvg) {
        SharedService.setVar('apiSMILESSvg', apiSMILESSvg);
        // console.log(apiSMILESSvg);
        //
        // console.log(apiSMILESSvg.documentElement);
        var svgImg2 = new XMLSerializer().serializeToString(apiSMILESSvg.documentElement);
        //var svgImg2 = resp.data.value;
        // console.log(svgImg2);
        SharedService.setVar('gotSVGForSmile', true);
        // SharedService.setVar('svgImg2', svgImg2);
        //console.log(svgImg2);
        $scope.cpSvg4 = $sce.trustAsHtml(svgImg2);
        // console.log($scope.cpSvg4);
        self.showSmileSvg = true;
        console.log(self.showSmileSvg);
        SharedService.setVar('showSmileSvg', self.showSmileSvg);

        self.showSmileSvgSpinner = false;
        })
    .error(function () {
        console.log("Error in obtaining network from api/depictSmiles");
        self.showSmileSvgSpinner = false;
    });


        $http.get("api/convertSmilesToFigerPrint/" + self.translatedSmile)
            .success(function (apiFingerprint) {
                console.log(apiFingerprint);


            })
            .error(function () {
                console.log("Error in obtaining network from api/convertSmilesToFigerPrint");
            });

        $http.get("api/findSimilarCompounds/" + self.translatedSmile)
            .success(function (apiSimilarCp) {

                self.cpSmileSimilar = apiSimilarCp;

                self.tableSmileSimilar = new NgTableParams({

                    count: 5
                }, {
                    total: self.cpSmileSimilar.length,  dataset: self.cpSmileSimilar,counts: [5, 10, 25]});

                self.showP100Table = true;
                SharedService.setVar("showP100Table",self.showP100Table);

                SharedService.setVar('tableSmileSimilar', self.tableSmileSimilar);

                SharedService.setVar('cpSmileSimilar', self.cpSmileSimilar);
                //console.log(self.network);


                self.showSimilarSmileCompounds = true;
                SharedService.setVar('showSimilarSmileCompounds', self.showSimilarSmileCompounds);

            })
            .error(function () {
                console.log("Error in obtaining network from api/findSimilarCompounds");
            });

        //self.compoundAndDS = $scope.compounds_2_datasets[selectedPerturbation];
        // SharedService.setVar('compoundAndDS', self.compoundAndDS);
        // console.log(self.compoundAndDS);
        self.showSimilarSmileCompoundsFinal = self.showSmileSvg && self.showSimilarSmileCompounds;
        SharedService.setVar('showSimilarSmileCompounds', self.showSimilarSmileCompounds);

    }

    $scope.showDataForPerturbationSmiles = function (selectedPerturbation) {
        SharedService.setVar('selectedPerturbationSmiles', selectedPerturbation);
        self.selectedPerturbationSmiles = selectedPerturbation.toUpperCase();
        self.selectedCpInfoSmiles =$scope.compound_info[self.selectedPerturbationSmiles];
        console.log(self.selectedCpInfoSmiles);
        SharedService.setVar('selectedCpInfoSmiles', self.selectedCpInfoSmiles);
        self.compoundAndDSSmiles = $scope.compounds_2_datasets[self.selectedPerturbationSmiles];
        SharedService.setVar('compoundAndDSSmiles', self.compoundAndDSSmiles);
        console.log(self.compoundAndDSSmiles);
        self.showCompoundToDSTableSmiles = true;
        SharedService.setVar('showCompoundToDSTableSmiles', self.showCompoundToDSTableSmiles);
    }

    $scope.showDataForPerturbation = function (selectedPerturbation) {
        //console.log(SharedService.getVar('exploreCompound'));
        //console.log(SharedService.getVar('exploreTab'));
        //console.log(selectedPerturbation);
        SharedService.setVar('selectedPerturbation', selectedPerturbation);
        //SharedService.setVar('exploreTab', "GCP");

        //console.log(SharedService.getVar('exploreCompound'));
        //console.log(SharedService.getVar('exploreTab'));
        self.selectedPerturbation = selectedPerturbation.toUpperCase();
        console.log(self.selectedPerturbation);
        self.selectedCpInfo = $scope.compound_info[self.selectedPerturbation];
        SharedService.setVar('selectedCpInfo', self.selectedCpInfo);
        self.compoundAndDS = $scope.compounds_2_datasets[self.selectedPerturbation];
        SharedService.setVar('compoundAndDS', self.compoundAndDS);
        console.log(self.compoundAndDS);
        self.showCompoundToDSTable = true;
        SharedService.setVar('showCompoundToDSTable', self.showCompoundToDSTable);
        //window.location.href = "/lincsproteomics/explore";
        // $timeout(function() {
        //     window.location.href="explore.html";
        //
        //     // $anchorScroll(id);
        // }, 20000);

        // href="explore.html";
        // self.url = $location.url();
        // console.log($location.url());
    }


    $scope.goToDownload = function (selectedTab) {

        SharedService.setVar('downloadTab', selectedTab);
        $location.path("/download");

    }

    $scope.goToExplore = function (selectedTab, selectedCp) {

        console.log(selectedTab);
        console.log(selectedCp);
        SharedService.setVar('exploreTab', selectedTab);





        if(selectedTab === "P100"){
            SharedService.setVar('P100ExploreCompoundInput', selectedCp.toUpperCase());
            SharedService.setVar('showExploreP100Table', true);

            self.P100ExploreCompounds = [];

            self.P100ExploreCompounds.push(selectedCp.toUpperCase());
            SharedService.setVar('P100ExploreCompounds', self.P100ExploreCompounds);




        }
        if(selectedTab === "GCP"){
            SharedService.setVar('GCPExploreCompoundInput', selectedCp.toUpperCase());
            SharedService.setVar('showExploreGCPTable', true);

            self.GCPExploreCompounds = [];

            self.GCPExploreCompounds.push(selectedCp.toUpperCase());
            SharedService.setVar('GCPExploreCompounds', self.GCPExploreCompounds);
        }
        if(selectedTab === "RPPA"){
            SharedService.setVar('RPPAExploreCompoundInput', selectedCp.toUpperCase());
            SharedService.setVar('showExploreRPPATable', true);

            self.RPPAExploreCompounds = [];

            self.RPPAExploreCompounds.push(selectedCp.toUpperCase());
            SharedService.setVar('RPPAExploreCompounds', self.RPPAExploreCompounds);
        }
        if(selectedTab === "Micro"){
            SharedService.setVar('MicroExploreCompoundInput', selectedCp.toUpperCase());
            SharedService.setVar('showExploreMicroTable', true);

            self.MicroExploreCompounds = [];

            self.MicroExploreCompounds.push(selectedCp.toUpperCase());
            SharedService.setVar('MicroExploreCompounds', self.MicroExploreCompounds);
        }
        if(selectedTab === "SWATH"){
            SharedService.setVar('SWATHExploreCompoundInput', selectedCp.toUpperCase());
            SharedService.setVar('showExploreSWATHTable', true);

            self.SWATHExploreCompounds = [];

            self.SWATHExploreCompounds.push(selectedCp.toUpperCase());
            SharedService.setVar('SWATHExploreCompounds', self.SWATHExploreCompounds);
        }
        if(selectedTab === "DToxS"){
            SharedService.setVar('DToxSExploreCompoundInput', selectedCp.toUpperCase());
            SharedService.setVar('showExploreDToxSTable', true);

            self.DToxSExploreCompounds = [];
            self.DToxSExploreCompounds.push(selectedCp.toUpperCase());
            SharedService.setVar('DToxSExploreCompounds', self.DToxSExploreCompounds);
        }
        $location.path("/explore");

    }

    $scope.goToAssays = function (selectedTab) {

        SharedService.setVar('assayTab', selectedTab);
        $location.path("/assays");

    }

    $scope.goToCentersInfo = function () {

        // SharedService.setVar('selectedPerturbation',selectedPerturbation);
        // console.log(selectedPerturbation);
        window.location.href = "about.html#foo";
        //href="explore.html";
        // self.url = $location.url();
        // console.log($location.url());
    }
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

             w = Math.max(window.innerWidth - 2 * margin,groupId[0].length/300*window.innerWidth - 2 * margin),
             //w = window.innerWidth - 2 * margin,
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
            var margin = 10,
                w = 1000 - 2 * margin,
                h = w,
                radius = w / 2,
                strokeWidth = 4,
                hyp2 = Math.pow(radius, 2),
                nodeBaseRad = 5;

            svg = d3.select("#chart")
                .append("svg")
                //.attr("style", "outline: thin solid blue;")
                .attr("width", w + 2 * margin)
                .attr("height", h + 2 * margin);

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
                .charge(-100)

                .on("tick", tick)
                .start();
            // for (var i = 15; i > 0; --i)
            //     force.tick();


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
                    // d3.select(this).style("stroke-width", 6);

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
                    //     .style("font-weight", "bold");

                    path.style('stroke', function (l) {
                        if (d === l.source || d === l.target)
                            return "blue";
                        else
                            return "grey";
                    })

                    path.style('stroke-width', function (l) {
                        if (d === l.source || d === l.target)
                            return 1;
                        else
                            return 1;
                    })

                })
                .on("mouseout", function (d) {
                    //d3.select(this).classed("hover", false);
                    // if(isConnected(d, o)) {
                    //svg.selectAll('circle').style('stroke', 'black');
                    d3.select(this).style("stroke-width", 1);
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
                    circle.style("stroke-width", 1);
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


    $scope.initNetwork = function () {

        self.data_sets_2_compounds_info_show = false;
        $http.get('/lincsproteomics/data/content.json').success(function (data) {
            self.initNetworkJSON = data;
            console.log("initNetworkJSON");
            console.log(self.initNetworkJSON);
            $scope.showNetwork("P100");
        });

        $http.get('/lincsproteomics/data/phospho_network_p100.json').success(function (data) {
            self.p100phospho = data;
            console.log("p100phospho");
            console.log(self.p100phospho);


        });

        $http.get('/lincsproteomics/data/P100_processed_perturb.json').success(function (data) {
            self.P100ProcessedJSON = data;
            console.log(self.P100ProcessedJSON);
            console.log(self.P100ProcessedJSON.TRAMETINIB);

        })

        $http.get('/lincsproteomics/data/compounds_2_datasets.json').success(function (data) {
            // self.P100ProcessedJSON = data;
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.Trametinib);
            //self.selectedPerturbation = 'Trametinib';
            $scope.compounds_2_datasets = data;
            //console.log($scope.perturbation);
        })
        $http.get('/lincsproteomics/data/proteomics_compound_info.json').success(function (data) {
            // self.P100ProcessedJSON = data;
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.Trametinib);
            //self.selectedPerturbation = 'Trametinib';
            $scope.compound_info = data;
            console.log($scope.compound_info);
        })
        $http.get('/lincsproteomics/data/proteomics_compound_list.json').success(function (data) {
            // self.P100ProcessedJSON = data;
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.Trametinib);
            self.selectedPerturbation = 'TRAMETINIB';
            $scope.all_perturbations = data;
            console.log($scope.all_perturbations);
        })
        // upper case to original compound name
        $http.get('/lincsproteomics/data/data_sets_2_compounds_orig.json').success(function (data) {
            // self.P100ProcessedJSON = data;
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.Trametinib);

            $scope.data_sets_2_compounds_orig = data;
        })

        $http.get('/lincsproteomics/data/data_sets_2_compounds_info.json').success(function (data) {
            // self.P100ProcessedJSON = data;
            // console.log(self.P100ProcessedJSON);
            // console.log(self.P100ProcessedJSON.Trametinib);

            $scope.data_sets_2_compounds_info = data;

            self.tableP100Compounds = new NgTableParams({

                count: 5
            }, {
                total: data["P100"].length,  dataset: data["P100"],counts: [5, 10, 25]});

            self.tableGCPCompounds = new NgTableParams({

                count: 5
            }, {
                total: data["GCP"].length,  dataset: data["GCP"],counts: [5, 10, 25]});

            self.tableSWATHCompounds = new NgTableParams({

                count: 5
            }, {
                total: data["SWATH"].length,  dataset: data["SWATH"],counts: [5, 10, 25]});

            self.tableRPPACompounds = new NgTableParams({

                count: 5
            }, {
                total: data["RPPA"].length,  dataset: data["RPPA"],counts: [5, 10, 25]});

            self.tableDToxSCompounds = new NgTableParams({

                count: 5
            }, {
                total: data["DToxS"].length,  dataset: data["DToxS"],counts: [5, 10, 25]});

            self.tableMicroCompounds = new NgTableParams({

                count: 5
            }, {
                total: data["Micro"].length,  dataset: data["Micro"],counts: [5, 10, 25]});

            self.data_sets_2_compounds_info_show = true;
        })
    };
    self.selectedPerturbation = 'TRAMETINIB';
    self.selectedDataSets = 'P100 (PCCSE)';
    $scope.dataSets = ["P100 (PCCSE)", "GCP (PCCSE)", "MS Protein State (LINCS DToxS)", "SWATH-MS protein quantification (NeuroLINCS)", "RPPA protein state (HMS LINCS)"];


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
                w = window.innerWidth - 2 * margin,
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

            if (nodes.length < 500) {
                nodes.forEach(function (n, i) {
                    var coord = circleCoord(n, i, nodes.length)
                    n.x = coord.x
                    n.y = coord.y
                });
            }
            else {
                var innerIter = 0,
                    outerIter = 0;
                nodes.forEach(function (n, i) {
                    var item = nodes[i];


                    if (n.group == 0) {
                        var coord = circleCoordInner(n, innerIter, n1)
                        n.x = coord.x
                        n.y = coord.y;
                        // n.x = parallelCoordInner(n.group)
                        // n.y = parallelCoordy(n1, groupId[1].length)
                        innerIter = innerIter + 1;
                    }
                    if (n.group == 2) {
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
                .style("stroke-width", function (d) {
                    return Math.log(edgeWeightScale(d.value)) / 2.0 + "px";
                })
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


appModule.controller('MainCtrl', ['$scope', '$location', '$anchorScroll', '$http', '$timeout', '$window', '$routeParams', '$filter', '$q', 'SharedService', function ($scope, $location, $anchorScroll, $http, $timeout, $window, $routeParams, $filter, $q, SharedService) {

    var self = this;
//This is for showing nav-bar header in scroll down
    $(document).scroll(function () {
        var y = $(this).scrollTop();
        if (y > 500) {
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
                    //     .style("font-weight", "bold");

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
                    //     .style("font-weight", "bold");

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
