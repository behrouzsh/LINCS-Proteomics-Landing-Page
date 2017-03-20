package edu.uc.eh.controller;

import edu.uc.eh.service.KinaseService;
import edu.uc.eh.service.PCGService;
import edu.uc.eh.service.PilincsApiAssayService;
import edu.uc.eh.service.PilincsApiGetService;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;

//import org.json.JSONObject;

/**
 * Created by chojnasm on 11/9/15.
 * Modified by Behrouz on 9/2/16.
 */


/**
 * This endpoint is to test slashes in values of parameters submitted to REST API
 * @param
 * @return
 */

@Controller
public class RestAPI {

    private static final Logger log = LoggerFactory.getLogger(RestAPI.class);
    //private static final Logger log2 = LoggerFactory.getLogger(UniprotService.class);


    private final PCGService pcgService;
    private final KinaseService kinaseService;
    private final PilincsApiGetService pilincsApiGetService;
    private final PilincsApiAssayService pilincsApiAssayService;

    @Autowired
    public RestAPI(PCGService pcgService, KinaseService kinaseService, PilincsApiGetService pilincsApiGetService, PilincsApiAssayService pilincsApiAssayService) {

        this.pilincsApiGetService = pilincsApiGetService;
        this.pilincsApiAssayService = pilincsApiAssayService;
        this.pcgService = pcgService;
        this.kinaseService = kinaseService;
    }


    @RequestMapping(value = "api/pilincs/", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONArray getApiFromPilincs() {
        log.info("Get the perturbagen and cell line information from pilincs");

        return pilincsApiGetService.getPilincsmetaData();
    }

    @RequestMapping(value = "api/pilincs/perturb/{perturb}", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONArray getApiFromPilincs(@PathVariable String perturb) {
        log.info("Get the perturbagen data information from pilincs");

        return pilincsApiAssayService.getPilincsPerturbData(perturb);
    }



    @RequestMapping(value = "api/pcg/checkgenes/{geneList}", method = RequestMethod.GET)
    public
    @ResponseBody
    ArrayList checkFromPCG(@PathVariable String[] geneList) {
        ArrayList<Integer> genePlaces;

        log.info(String.format("Get gene positions from api/pcg/checkgenes/%s", geneList));
        //log.info(String.format("==== %s ======", modification));
        genePlaces = pcgService.checkGenes(geneList);
        return genePlaces;
    }


    @RequestMapping(value = "api/pcg/geneinfo/{genePositions}", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONArray getFromPCG(@PathVariable ArrayList<Integer> genePositions) {
        //Integer[] genePlaces;
        log.info(String.format("Get information about protein coding genes in positions %s from api/pcg/geneinfo/%s", genePositions, genePositions));
        //log.info(String.format("==== %s ======", modification));

        return pcgService.getTable(genePositions);
    }


    @RequestMapping(value = "api/kinase/genes/{geneList}", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONObject computeNetworkForKinase(@PathVariable String[] geneList) {

        JSONObject kinaseNetwork = new JSONObject();
        kinaseNetwork = kinaseService.computeKinaseNetwork(geneList);
        return kinaseNetwork;
    }

    @RequestMapping(value = "api/test/{notation}", method = RequestMethod.GET)
    public
    @ResponseBody
    String parseTest(@PathVariable String notation) {
        //log.info(notation);
        return notation;
    }
}
