package eh3.uc.edu.controller;


import eh3.uc.edu.service.EmailService;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.mail.MessagingException;

//import org.json.JSONObject;

/**
 * Created by Behrouz on 07/05/17.

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


    private final EmailService emailService;

//    private final HarmonizomeProteinService harmonizomeProteinService;
//    private final HarmonizomeGeneService harmonizomeGeneService;

//    @Value("${resources.pathway}")
//    String pathWay;


    @Autowired
    //public RestAPI(HarmonizomeGeneService harmonizomeGeneService, HarmonizomeProteinService harmonizomeProteinService, PrositeService prositeService, PsiModService psiModService, UniprotService uniprotService, EnrichrService enrichrService, PCGService pcgService, KinaseService kinaseService, ShorthandService shorthandService, PhosphoService phosphoService, HarmonizomeGeneService harmonizomeGeneServics1) {
    public RestAPI(EmailService emailService ) {


        this.emailService = emailService;

    }

    @RequestMapping(value = "api/sendEmail/{text}", method = RequestMethod.GET)
    public
    @ResponseBody
    void sendEmail(@PathVariable String text) throws MessagingException {
        //log.info(String.format("Run pathway analysis with argument: %s ", library));
//        String[] geneList =
//        String[] geneListSplit = geneList.split(",");
        //JSONObject networkInput = new JSONObject();
        //JSONObject textJson = new JSONObject();
        //textJson.put("Name", "Behrouz");

        emailService.sendEmail(text);
//        System.out.println(Arrays.toString(geneList));
//        for (int i = 0; i < geneList.length; i++) {
//            System.out.println(geneList[i]);
//            geneListinfo.put(geneList[i].replaceAll("[^a-zA-Z0-9\\s]", ""), enrichrService.getGeneInfo(geneList[i].replaceAll("[^a-zA-Z0-9\\s]", "")));
//        }

        return;
    }



    @RequestMapping(value = "api/test/{notation}", method = RequestMethod.GET)
    public
    @ResponseBody
    String parseTest(@PathVariable String notation) {
        //log.info(notation);
        return notation;
    }
}
