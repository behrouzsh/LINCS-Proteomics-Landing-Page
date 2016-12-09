/**
 * Created by Behrouzsh on 12/7/16.
 */
var appModule = angular.module('plpModule', ['angular.filter', 'angularUtils.directives.dirPagination']);


appModule.directive('combineHorizontalScrolls', [function(){
    var scrollTop = 0;
    function combine(elements){
        elements.on('scroll', function(e){
            if(e.isTrigger){
                debugger;
                e.target.scrollTop = scrollTop;
            }else {
                scrollTop = e.target.scrollTop;
                elements.each(function (element) {
                    if( !this.isSameNode(e.target) ){
                        $(this).trigger('scroll');
                    }
                });
            }
        });
    }

    return {
        restrict: 'A',
        replace: false,
        compile: function(element, attrs){
            combine(element.find('.'+attrs.combineHorizontalScrolls));
        }
    };
}]);

appModule.controller("MainCtrl", ['$http', '$scope', '$window', function ($http, $scope, $window) {

    var self = this;

    self.formatAsInchOrAllhits = false;
    self.formatInput = false;
    self.formatAsJsonOrInline = false;
    self.allVsFirstPrositeHits = false;
    self.prositeFound = '';
    self.prositeFoundNum = 0;
    self.uniprotFound = '';
    self.uniprotFoundNum = 0;
    self.uniprotLength = 0;
    self.motifLength = 0;
    self.textAreaFormatMD = "IYQY[+80]IQSR[+42]\nK[+112.1]SAPATGGVK[+42]K[+56]PHR";
    self.textAreaFormatSN = "IYQ[pY]IQS[aR]\n[aK]SAPATGGVK[mK]PHR";



    // if (!self.formatInput) {
    //     self.textArea = self.textAreaFormatMD;
    // } else {
    //     self.textArea = self.textAreaFormatSN;
    // }



    var newModificationString;

    self.waiting = false;
    self.showOutput = false;
    self.noResponse = false;

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

    $scope.retrieveGenes = function() {
        self.genes = localStorage.getItem("genes");
        localStorage.setItem("genes", "");
        console.log(self.genes);
        //alert(self.genes);

    };


    $scope.$watch(function () {
        return self.formatInput
    }, function (newValue, oldValue) {
        if (!self.formatInput) {
            self.textArea = self.textAreaFormatMD;
        } else {
            self.textArea = self.textAreaFormatSN;
        }
    });

    // track changes in user input
    $scope.$watch(function () {
        return self.textArea
    }, function (newValue, oldValue) {


        // parse motifs
        self.parsedMotifs = self.textArea
            .split(self.rowSplitPattern)
            .map(function (e) {
                return e.replace(self.modificationPattern, '')
            });


        // parse modifications
        self.parsedModifications = self.textArea
            .split(self.rowSplitPattern)
            .map(function (e) {
                if(!self.formatInput) {
                    return e.match(self.modificationPatternWithLetter);
                }else
                {
                    return e.match(self.modificationPatternSecondFormat);
                }
            });

        // format parsed modifiacations
        self.parsedModificationsForOntology = self.parsedModifications;

        self.parsedModificationsFormatter = [];
        self.parsedModificationsFormatter = self.parsedModifications
            .map(function (e) {
                if (e != null)
                    return e.join(" ");
            });


        self.plnFirstHit = [];


    });

    // track changes in user input


    // track changes in parsed modifications and refresh psi-mod mapping
    $scope.$watch(function () {
        return self.parsedModifications
    }, function (nV, oV) {
        self.ontologyMappings = [];
        self.ontologyMappingsUnique = [];
        distinct = [];
        firstPrositeResponseFiltered = [];
        self.plnFormatOne = [];
        self.plnFormatTwo = [];
        self.plnFirstHit = [];


        self.parsedModifications.forEach(function (e) {
            if (e != null) {
                e.forEach(function (el) {
                    (function (el) {
                        if(self.formatInput) {
                            el2 = el.match(self.patt1)+"[+"+self.modificationMap[el.match(self.patt2)]+"]";
                        }else
                        {
                            el2 = el;
                        }
                        $http.get("api/psimod/" + el2)
                            .success(function (data) {

                                var result = {};
                                result.identifier = data.string;
                                result.modification = el;
                                result.diffavg = data.aDouble;


                                result.description = data.description;
                                if (data.description == null){
                                    result.description = "Not found in Psi-Mod ontology data base!";
                                }
                                result.similar = data.similar;
                                if (self.ontologyMappingsUnique.indexOf(el) === -1) {
                                    self.ontologyMappingsUnique.push(el);
                                    self.ontologyMappings.push(result);
                                }
                                //self.ontologyMappings.push(result);
                                //console.log("result");
                                console.log(result);
                            })
                            .error(function (data, status) {
                                // console.log(data);
                                // console.log(status);
                                var result = {};
                                result.identifier = "";
                                result.modification = el;
                                result.diffavg = "";
                                result.description = "Error!";
                                result.similar = "";
                                //self.ontologyMappings.push(result);
                                if (self.ontologyMappingsUnique.indexOf(el) === -1) {
                                    self.ontologyMappingsUnique.push(el);
                                    self.ontologyMappings.push(result);
                                }

                            });
                    }(el));
                })
            }
        });
    })


    self.onSubmit = function () {

        console.log("test logging");
        self.showInstruction = false;
        self.waiting = true;
        self.showOutput = false;
        self.sequence_acList = [];
        self.geneIdList = [];
        self.sequence_acListComplete = [];
        self.numResponsesFromProsite = 0;
        self.numResponsesFromUniprot = 0;
        self.responseRaw = [];
        self.responseRawLocal = [];
        self.prResponseList = [];
        self.prResponseJson = {};
        self.uniprotResponseRaw = [];
        self.uniprotResponseRawJson = [];
        var prositeHttpResponse = [];
        self.motifLength = self.parsedMotifs.length;
        self.uniprotFound = " ";
        self.uniprotFoundNum = 0;
        self.prositeFound = " ";
        self.prositeFoundNum = 0;
        //Capturing response from the prosite api
        var url = 'api/prosite/';

        var prositeResponseIterator = 0;

        for (var j = 0; j < self.parsedMotifs.length; j++) {

            var localMotif = self.parsedMotifs[j];

            (function (localMotif) {
                    $http.get(url + localMotif)
                    .success(function (data) {
                        self.responseRawLocal = [];
                        console.log("prosite success!");
                        console.log(localMotif);
                        console.log(data);


                        var matchset = data.matchset;
                        // console.log(matchset);
                        var nMatch = data.n_match;
                        if (nMatch > 0) {
                            self.prositeFoundNum = self.prositeFoundNum + 1;
                            self.prositeFound = localMotif;
                            self.showOutput = true;
                        }
                        data.matchset.map(function (e) {
                            e.motif = localMotif;
                            return e;
                        });

                        var flagFound = 1;
                        if (nMatch === 0) {
                            flagFound = 0;
                            self.responseRawLocal = self.responseRawLocal.concat([
                            {
                                "motif": localMotif,
                                "sequence_ac": " ",
                                "sequence_id": " ",
                                "sequence_db": " Not found in prosite data base! ",
                                "start": " ",
                                "stop": " ",
                                "signature_ac": " "
                            }]);
                        }
                        else {
                            self.responseRawLocal = self.responseRawLocal.concat(matchset);
                        }

                        self.responseRaw = self.responseRaw.concat(self.responseRawLocal);

                        self.prResponseJson = {"motif":localMotif, "length": self.responseRawLocal.length, "response":self.responseRawLocal}
                        self.prResponseList = self.prResponseList.concat(self.prResponseJson);
                        //for ()
                        //self.prResponseList
                        // console.log("Response Local");
                        // console.log(self.responseRawLocal);
                        //
                        // console.log("Response Raw");
                        // console.log(self.responseRaw);
                        //
                        // console.log("total response");
                        // console.log(self.prResponseJson);



                        //Uniprot query

                        var url2 = 'api/uniprot/';
                        prositeResponseIterator = 0;
                        if (flagFound === 1) {
                            while (prositeResponseIterator < self.responseRawLocal.length) {


                                var uniportQuery = self.responseRawLocal[prositeResponseIterator].sequence_ac;


                                var startMotif = self.responseRawLocal[prositeResponseIterator].start;
                                var stopMotif = self.responseRawLocal[prositeResponseIterator].stop;
                                var motifMotif = self.responseRawLocal[prositeResponseIterator].motif;



                                if (self.sequence_acList.indexOf(uniportQuery) === -1) {
                                    self.sequence_acList.push(uniportQuery);
                                    //console.log("sequence_acList: " + self.sequence_acList);
                                    var sequence_acListMember = {
                                        "id": self.sequence_acList.length,
                                        "name": uniportQuery,
                                        "length": 1,
                                        "members": emptyList
                                    };
                                    self.sequence_acListComplete = self.sequence_acListComplete.concat(sequence_acListMember);
                                    protPlace = self.sequence_acList.length - 1;
                                    self.uniprotLength = self.sequence_acList.length;
                                    console.log("sequence_acListComplete");
                                    console.log(self.sequence_acListComplete);
                                }
                                else {
                                    for (var prot = 0; prot < self.sequence_acListComplete.length; prot++) {
                                        if (uniportQuery === self.sequence_acListComplete[prot].name) {
                                            protPlace = prot;
                                            //console.log("Adding a member to" + uniportQuery);
                                            self.sequence_acListComplete[prot].length = self.sequence_acListComplete[prot].length + 1;
                                            prot = self.sequence_acListComplete.length;
                                        }
                                    }
                                }

                                // console.log(startMotif);
                                // console.log(stopMotif);
                                (function (uniportQuery, startMotif, stopMotif, motifMotif, protPlace) {

                                    $http.get(url2 + uniportQuery)
                                        .success(function (data) {


                                            self.uniprotFound = uniportQuery;
                                            if (self.uniprotFoundNum < self.uniprotLength) {
                                                self.uniprotFoundNum = self.uniprotFoundNum + 1;
                                            };
                                            self.showOutput = true;
                                            // console.log("Uniprot Response");
                                            var uniprotJsonObject = data;

                                            var geneId = uniprotJsonObject.gene_id;
                                            if (self.geneIdList.indexOf(geneId) === -1) {
                                                self.geneIdList.push(geneId);
                                                console.log("geneIdList");
                                                console.log(self.geneIdList);
                                            }


                                            //var uniprotJsonObject = data;
                                            // console.log(JSON.stringify(data));
                                            // var start = self.responseRaw[prositeResponseIterator].startMotif;
                                            // var stop = self.responseRaw[prositeResponseIterator].stopMotif;
                                            // console.log(start);
                                            // console.log(stop);

                                            // console.log(self.responseRaw[prositeResponseIterator].stop);
                                            uniprotJsonObject["start"] = startMotif;
                                            uniprotJsonObject["stop"] = stopMotif;
                                            uniprotJsonObject["motif"] = motifMotif;
                                            uniprotJsonObject["sequence_ac"] = uniportQuery;
                                            // console.log(uniprotJsonObject);

                                            // data.matchset.map(function (e) {
                                            //     e.motif = localMotif;
                                            //     return e;
                                            // });
                                            //+++++++++++++++++++++++++++++++++++++++++++++++++++
                                            //var matchset = data.matchset;
                                            //self.uniprotResponseRaw = self.uniprotResponseRaw.concat(uniprotJsonObject.toString());

                                            self.sequence_acListComplete[protPlace].members = self.sequence_acListComplete[protPlace].members.concat(uniprotJsonObject);

                                            // console.log("protPlace: " + protPlace);
                                            // console.log("sequence_acListComplete.name: " + self.sequence_acListComplete[protPlace].name);
                                            // console.log("sequence_acListComplete2.length: " + self.sequence_acListComplete[protPlace].length);
                                            // console.log("sequence_acListComplete3.members: " + self.sequence_acListComplete[protPlace].members);
                                            // for(var foo = 0; foo < self.sequence_acListComplete[protPlace].members.length; foo++)
                                            // {
                                            //     console.log("foo   "+ foo);
                                            //     console.log(self.sequence_acListComplete[protPlace].members[foo].sequence_ac);
                                            //     console.log(self.sequence_acListComplete[protPlace].members[foo].motif);
                                            //
                                            // }

                                            self.uniprotResponseRaw = self.uniprotResponseRaw.concat(uniprotJsonObject);
                                            //self.uniprotResponseRaw = self.uniprotResponseRaw.concat(JSON.stringify(data));

                                            //console.log("ResponseRaw: " + self.responseRaw);


                                        })
                                        .error(function (data, status) {
                                            //self.noResponse = true;
                                            // console.log(data);
                                            // console.log(status);

                                        });


                                })(uniportQuery, startMotif, stopMotif, motifMotif, protPlace);


                                prositeResponseIterator++;
                            }
                        }

                        self.numResponsesFromProsite++;
                        if (self.numResponsesFromProsite >= self.parsedMotifs.length) {
                            // self.waiting = false;
                            // self.showOutput = true;
                            self.showOutput = true;
                            console.log("Before updating pln! number of numResponsesFromProsite");
                            console.log(self.numResponsesFromProsite);
                            self.updatePln(self.parsedMotifs, self.textArea, self.responseRaw);
                        }
                        // console.log("prositeResponseIterator");
                        // console.log(prositeResponseIterator);

                    //++++++++++++++++++++++++++++++++++++++
                    })
                    .error(function (data, status) {
                        self.noResponse = true;
                        self.prositeFoundNum = self.prositeFoundNum + 1;
                        self.prositeFound = localMotif;
                        self.showOutput = true;
                        console.log("prosite error");
                        console.log(localMotif);
                        console.log(data);
                        console.log(status);
                        self.responseRawLocal = [];
                        self.responseRawLocal = self.responseRawLocal.concat({
                            "motif": localMotif,
                            "sequence_ac": " ",
                            "sequence_id": " ",
                            "sequence_db": " Prosite Response Error! ",
                            "start": " ",
                            "stop": " ",
                            "signature_ac": " "
                        });

                        self.responseRaw = self.responseRaw.concat(self.responseRawLocal);

                        self.prResponseJson = {"motif":localMotif, "length": self.responseRawLocal.length, "response":self.responseRaw}
                        self.prResponseList = self.prResponseList.concat(self.prResponseJson);
                        //for ()
                        //self.prResponseList
                        console.log("Response Local");
                        console.log(self.responseRawLocal);

                        console.log("Response Raw");
                        console.log(self.responseRaw);

                        console.log("total response");
                        console.log(self.prResponseJson);


                        self.numResponsesFromProsite++;
                        if (self.numResponsesFromProsite >= self.parsedMotifs.length) {

                            self.showOutput = true;
                            console.log("Before updating pln! number of numResponsesFromProsite");
                            console.log(self.numResponsesFromProsite);
                            self.updatePln(self.parsedMotifs, self.textArea, self.responseRaw);
                        }




                    })

                })(localMotif);
        }

    }


    self.updatePln = function (parsedMotifsInput, textAreaInput, responseRawInput) {
        self.plnFormatOne = [];
        self.plnFormatTwo = [];

        var motifs = parsedMotifsInput;
        var peptides = textAreaInput
            .split(self.rowSplitPattern);
        console.log("********************************");
        console.log("In update pln");
        console.log("motifs " + motifs);
        console.log("peptides " + peptides);

        for (var i = 0; i < peptides.length; i++) {
            var motif = motifs[i];
            var peptide = peptides[i];
            //console.log("in loop motif " + motif);
            var firstPrositeResponse = responseRawInput
                .filter(function (e) {
                    // console.log(motif);

                    return e.motif == motif;

                });

            distinct = [];
            firstPrositeResponseFiltered = [];

            for (var fpr = 0; fpr < firstPrositeResponse.length; fpr++) {
                if(distinct.indexOf(firstPrositeResponse[fpr].sequence_ac) === -1)
                {
                    distinct.push(firstPrositeResponse[fpr].sequence_ac);
                    firstPrositeResponseFiltered.push(firstPrositeResponse[fpr]);
                }
            }
            //
            //
            // console.log("distict: " + distinct);
            // console.log(distinct);
            // console.log("firstPrositeResponseFiltered: " );
            // console.log(firstPrositeResponseFiltered);
            // firstPrositeResponse
            //     .filter(function (value, index, self) {
            //         return self.indexOf()
            //         })



            //firstPrositeResponse = firstPrositeResponse[0];
            var uniprotArray = [];
            var hugoArray = [];
            var ptmArray = [];

            firstPrositeResponseFiltered.map(function(e){
                uniprotArray.push(e.sequence_ac);
                hugoArray.push(e.sequence_id);
                ptmArray.push(e.start);
            });
            // console.log("firstPrositeResponse: ");
            // console.log(firstPrositeResponse);
            var uniprot = uniprotArray;
            var hugo = hugoArray;


            var ptm = [];

            //

            ptmArray.map(function(start, ptmArrayIndex){

                var ptmLocal = [];

                // for a given peptide iterate through modifications, calculate its offset and return to ptmLocal
                self.ontologyMappings
                    .filter(function (el) {
                        return (peptide.indexOf(el.modification) > -1);
                    })
                    .map(function (e) {
                        var offset = peptide.indexOf(e.modification);
                        var beforeOffset = peptide.substring(0,offset);
                        var decreaseOffset = beforeOffset.length - beforeOffset.replace(self.modificationPattern, '').length;
                        // console.log(start);
                        // console.log(offset);
                        // console.log(decreaseOffset);
                        // console.log(offset - decreaseOffset + start);
                        // console.log(e.identifier);
                        // console.log(" +++++++++++++++++++ ");

                        ptmLocal.push({"identifier": e.identifier, "location": offset - decreaseOffset + start});
                    });

                ptm.push(ptmLocal);
            });


            self.plnFormatOne.push({
                "PLN": {"ver1": "InChl-like"},
                "REF": {"uniprot": uniprot},
                "SYM": {"hugo": hugo},
                "DES": {},
                "VAR": {},
                "PTM": ptm
            });

            self.plnFormatTwo.push({
                "PLN": {"ver1": "all_hits"},
                "REF": {"uniprot": uniprot},
                "SYM": {"hugo": hugo},
                "DES": {},
                "VAR": {},
                "PTM": ptm
            });

        }


        self.waiting = false;
    }

    // var timeoutPromise;
    // var delayInMs = 2000;
    //Pathway Analysis Text +++++++++++++++++++++++++++++++++++++++

    self.genePlaces = [];
    self.inputGeneInfo = [];



    // $scope.$watch(function () {
    //     return self.genes
    // }, function (newValue, oldValue) {
    //
    //     self.parsedGenes = self.genes
    //         .split(self.rowSplitPatternGenes)
    //         .map(function (e) {
    //             return e.toUpperCase();
    //         });
    // });

    $scope.$watch(function () {
        return self.parsedGenes
    }, function (nV, oV) {
        //self.showOutputPathway = false;
        self.flagFoundNPCG = false;
        self.waitingPathway = true;
        self.showOutputPathway = false;
        self.genePlaces = [];
        self.inputGeneInfo = [];
        self.nonValidGenes = [];
        self.network = {};
        self.kinaseNetwork = {};
        self.numberOfAllInputGenes = 0;
        self.numberOfAllValidGenes = 0;

        // $http.get("api/pcg/checkgenes/" + self.parsedGenes)
        //     .success(function (genePositions) {
        //         console.log(genePositions);
        //         self.genePlaces = genePositions;
        //         for (var geneIter = 0; geneIter < self.genePlaces.length; geneIter++) {
        //             self.numberOfAllInputGenes = self.numberOfAllInputGenes + 1;
        //             if (self.genePlaces[geneIter] != -1) {
        //                 self.numberOfAllValidGenes = self.numberOfAllValidGenes + 1;
        //             }
        //         else
        //             {
        //                 self.flagFoundNPCG = true;
        //                 self.nonValidGenes.push(self.parsedGenes[geneIter]);
        //                 console.log("self.nonValidGenes");
        //                 console.log(self.nonValidGenes);
        //             }
        //         }
        //         // self.genePlaces.forEach(function (e) {
        //         //     self.numberOfAllInputGenes = self.numberOfAllInputGenes + 1;
        //         //     if (e != -1) {
        //         //         self.numberOfAllValidGenes = self.numberOfAllValidGenes + 1;
        //         //     }
        //         //     else
        //         //     {
        //         //         self.nonValidGenes.push(self.parsedGenes[])
        //         //     }
        //         //     ;
        //         // });
        //
        //         $http.get("api/pcg/geneinfo/" + self.genePlaces)
        //             .success(function (geneInfos) {
        //                 console.log(geneInfos);
        //                 self.inputGeneInfo = geneInfos;
        //             })
        //             .error(function () {
        //                 console.log("Error in obtaining gene info from api/pcg/geneinfo/");
        //             });
        //
        //
        //
        //
        //
        //     })
        //     .error(function () {
        //         console.log("Error in obtaining gene place from api/pcg/checkgenes/");
        //
        //     });









    });


    var margin = 100,
        w = 1400 + margin,
        h = w,
        width =w,
        height = h;


    var svg3 = d3.select("#proteomics-chart")
        .append("svg")
        //.attr("style", "outline: thin solid blue;")
        .attr("width", w)
        .attr("height", h);

    var g = svg3.append("g").attr("transform", "translate(" + (width / 2 + 40) + "," + (height / 2 + 90) + ")");




    // var svg3 = d3.select("svg"),
    //     width = +svg3.attr("width"),
    //     height = +svg3.attr("height"),
    //     g = svg.append("g").attr("transform", "translate(" + (width / 2 + 40) + "," + (height / 2 + 90) + ")");

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(";")); });

    var tree = d3.tree()
        .size([360, 500])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    d3.csv("/plp/data/peptide.csv", function(error, data) {
        if (error) throw error;

        var root = tree(stratify(data));

        var link = g.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
            .attr("class", "link")
            .style("stroke", "blue")    // set the line colour
            .style("fill", "none")    // set the fill colour
            .attr("d", function(d) {
                return "M" + project(d.x, d.y)
                    + "C" + project(d.x, (d.y + d.parent.y) / 2)
                    + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
                    + " " + project(d.parent.x, d.parent.y);
            });

        var node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
            .attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

        node.append("circle")
            .attr("r", 2.5);

        node.append("text")
            .attr("dy", ".31em")
            .attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
            .style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
            .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
            .text(function(d) { return d.id.substring(d.id.lastIndexOf(";") + 1); });
    });

    function project(x, y) {
        var angle = (x - 90) / 180 * Math.PI, radius = y;
        return [radius * Math.cos(angle), radius * Math.sin(angle)];
    }





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
            }


            // For legend
            var colNodeScaleSeparateInfo = d3.scale.ordinal()
                .range(["#767776", "#f91104", "#0af702"])
                .domain(["Query Gene Set","Activating Kinases, Phosphorelating the Query Gene Set","Down Stream Gene Sets, Phosphorelated by the Gene Set"]);


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




}]);