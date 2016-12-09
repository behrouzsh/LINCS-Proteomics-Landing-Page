package edu.uc.eh.controller;

import edu.uc.eh.service.*;
import edu.uc.eh.structures.StringDoubleStringList;
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
import java.util.Arrays;

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

    private final PrositeService prositeService;
    private final PsiModService psiModService;
    private final UniprotService uniprotService;
    private final EnrichrService enrichrService;
    private final ShorthandService shorthandService;
    private final PCGService pcgService;
    private final KinaseService kinaseService;

//    @Value("${resources.pathway}")
//    String pathWay;


    @Autowired
    public RestAPI(PrositeService prositeService, PsiModService psiModService, UniprotService uniprotService, EnrichrService enrichrService, PCGService pcgService, KinaseService kinaseService, ShorthandService shorthandService) {

        this.prositeService = prositeService;
        this.psiModService = psiModService;
        this.uniprotService = uniprotService;
        this.enrichrService = enrichrService;
        this.shorthandService = shorthandService;
        this.pcgService = pcgService;
        this.kinaseService = kinaseService;
    }

//    @RequestMapping(value = "api/shorthand.html", method = RequestMethod.GET)
//    public
//    @ResponseBody
//    String getFromUniprot(@PathVariable String protein) {
//        log.info(String.format("Get the protein information from uniprot with argument: %s", protein));
//
//        return uniprotService.getTable(protein);
//    }





    @RequestMapping(value = "api/uniprot/{protein}", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONObject getFromUniprot(@PathVariable String protein) {
        log.info(String.format("Get the protein information from uniprot with argument: %s", protein));

        return uniprotService.getTable(protein);
    }

    @RequestMapping(value = "api/prosite/{peptide}", method = RequestMethod.GET)
    public
    @ResponseBody
    String getFromProsite(@PathVariable String peptide) {
        //log.info(String.format("Run convertToPLN with argument: %s", peptide));

        return prositeService.getTable(peptide);
    }


    @RequestMapping(value = "api/psimod/{modification:.+}", method = RequestMethod.GET)
    public
    @ResponseBody
    StringDoubleStringList getFromPsiMod(@PathVariable("modification") String modification) {
        log.info(String.format("Get modification from api/psimod identifier: %s", modification));
        //log.info(String.format("==== %s ======", modification));
        return psiModService.getIdentifier(modification, 1.0);
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




    @RequestMapping(value = "api/pathway/genes/{geneList}", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONObject getFromEnrichr(@PathVariable String[] geneList) {
        //log.info(String.format("Run pathway analysis with argument: %s ", library));
//        String[] geneList =
//        String[] geneListSplit = geneList.split(",");
        JSONObject geneListInfo = new JSONObject();

        System.out.println(Arrays.toString(geneList));
        for (int i = 0; i < geneList.length; i++) {
            System.out.println(geneList[i]);
            geneListInfo.put(geneList[i].replaceAll("[^a-zA-Z0-9\\s]", ""), enrichrService.getGeneInfo(geneList[i].replaceAll("[^a-zA-Z0-9\\s]", "")));
        }

        return geneListInfo;
    }

    @RequestMapping(value = "api/network/genes/{geneList}", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONObject computeNetworkFromEnrichr(@PathVariable String[] geneList) {
        //log.info(String.format("Run pathway analysis with argument: %s ", library));
//        String[] geneList =
//        String[] geneListSplit = geneList.split(",");
        JSONObject networkInput = new JSONObject();
        JSONObject network = new JSONObject();

        networkInput = getFromEnrichr(geneList);
        network = enrichrService.computeNetwork(networkInput);
//        System.out.println(Arrays.toString(geneList));
//        for (int i = 0; i < geneList.length; i++) {
//            System.out.println(geneList[i]);
//            geneListinfo.put(geneList[i].replaceAll("[^a-zA-Z0-9\\s]", ""), enrichrService.getGeneInfo(geneList[i].replaceAll("[^a-zA-Z0-9\\s]", "")));
//        }

        return network;
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
