package eh3.uc.edu.controller;


//import com.jayway.jsonpath.internal.Path;
import eh3.uc.edu.service.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ErrorAttributes;
import org.springframework.boot.autoconfigure.web.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.io.FileReader;
import java.io.IOException;
import java.util.Map;

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
public class RestAPI implements ErrorController {

    private static final Logger log = LoggerFactory.getLogger(RestAPI.class);
    //private static final Logger log2 = LoggerFactory.getLogger(UniprotService.class);


    private final EmailService emailService;
    private final ReadFromCSVService readFromCSVService;
    private final SmileConverterService smileConverterService;
    private final StringGeneNetworkService stringGeneNetworkService;
    private final HarmonizomeGeneService harmonizomeGeneService;
    private final ClusterFromPython clusterFromPython;
//    private final servletContext servletContext;

//    private final HarmonizomeProteinService harmonizomeProteinService;
//    private final HarmonizomeGeneService harmonizomeGeneService;

//    @Value("${resources.pathway}")
//    String pathWay;


    @Autowired
    //public RestAPI(HarmonizomeGeneService harmonizomeGeneService, HarmonizomeProteinService harmonizomeProteinService, PrositeService prositeService, PsiModService psiModService, UniprotService uniprotService, EnrichrService enrichrService, PCGService pcgService, KinaseService kinaseService, ShorthandService shorthandService, PhosphoService phosphoService, HarmonizomeGeneService harmonizomeGeneServics1) {
    public RestAPI(ErrorAttributes errorAttributes, EmailService emailService, ReadFromCSVService readFromCSVService, SmileConverterService smileConverterService, StringGeneNetworkService stringGeneNetworkService, HarmonizomeGeneService harmonizomeGeneService, ClusterFromPython clusterFromPython) {


        this.emailService = emailService;
        this.errorAttributes = errorAttributes;
        this.readFromCSVService = readFromCSVService;
        this.smileConverterService = smileConverterService;
        this.stringGeneNetworkService = stringGeneNetworkService;
        this.harmonizomeGeneService = harmonizomeGeneService;
        this.clusterFromPython = clusterFromPython;
    }

    //This part is for error handling, going to home page if there was an error in the address
    private ErrorAttributes errorAttributes;

    private final static String ERROR_PATH = "/error";

    /**
     * Controller for the Error Controller
     * @param errorAttributes
     */


    /**
     * Supports the HTML Error View
     * @param request
     * @return
     */
    @RequestMapping(value = ERROR_PATH, produces = "text/html")
    public ModelAndView errorHtml(HttpServletRequest request) {
        return new ModelAndView("/", getErrorAttributes(request, false));
    }

    /**
     * Supports other formats like JSON, XML
     * @param request
     * @return
     */
    @RequestMapping(value = ERROR_PATH)
    @ResponseBody
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
        Map<String, Object> body = getErrorAttributes(request, getTraceParameter(request));
        HttpStatus status = getStatus(request);
        return new ResponseEntity<Map<String, Object>>(body, status);
    }

    /**
     * Returns the path of the error page.
     *
     * @return the error path
     */
    @Override
    public String getErrorPath() {
        return ERROR_PATH;
    }


    private boolean getTraceParameter(HttpServletRequest request) {
        String parameter = request.getParameter("trace");
        if (parameter == null) {
            return false;
        }
        return !"false".equals(parameter.toLowerCase());
    }

    private Map<String, Object> getErrorAttributes(HttpServletRequest request,
                                                   boolean includeStackTrace) {
        RequestAttributes requestAttributes = new ServletRequestAttributes(request);
        return this.errorAttributes.getErrorAttributes(requestAttributes,
                includeStackTrace);
    }

    private HttpStatus getStatus(HttpServletRequest request) {
        Integer statusCode = (Integer) request
                .getAttribute("javax.servlet.error.status_code");
        if (statusCode != null) {
            try {
                return HttpStatus.valueOf(statusCode);
            }
            catch (Exception ex) {
            }
        }
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
    // End of error handling.............




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
    @RequestMapping(value = "api/geneInfo/{geneName}", method = RequestMethod.GET)
    public
    @ResponseBody
    String reportHarmonizomeGeneInfo(@PathVariable("geneName") String geneName) throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        //JSONArray fp =new JSONArray();
        String fp = harmonizomeGeneService.getResponse(geneName);

        return fp;
    }

    @RequestMapping(value = "api/geneNetwork/{geneName}", method = RequestMethod.GET)
    public
    @ResponseBody
    String reportConnectedGenes(@PathVariable("geneName") String geneName) throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        //JSONArray fp =new JSONArray();
        String fp = stringGeneNetworkService.getResponse(geneName);

        return fp;
    }

    @RequestMapping(value = "api/clust", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONObject readClustergrammer( ) {
        JSONObject jsonFile = new JSONObject();
        JSONParser parser = new JSONParser();
        try {

            Object obj = parser.parse(new FileReader("src/main/resources/static/clustergrammer/mult_view.json"));
            jsonFile = (JSONObject) obj;
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {

            e.printStackTrace();
        }

        return jsonFile;
    }



    @RequestMapping(value = "api/clust/GCP", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONObject readGCPClustergrammer( ) {
        JSONObject jsonFile = new JSONObject();
        JSONParser parser = new JSONParser();
        try {

            Object obj = parser.parse(new FileReader("src/main/resources/static/clustergrammer/GCP_aggregated_clustergram.json"));
            jsonFile = (JSONObject) new JSONParser().parse(obj.toString());


//            jsonFile = (JSONObject) obj;
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {

            e.printStackTrace();
        }

        return jsonFile;
    }

    @RequestMapping(value = "api/download/P100/{compounds}", method = RequestMethod.GET)
    public
    @ResponseBody
    String downloadFromPythonP100(@PathVariable("compounds") String compounds) throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        //JSONArray fp =new JSONArray();
        String fp = clusterFromPython.getDownloadP100(compounds);

        return fp;
    }

    @RequestMapping(value = "api/download/GCP/{compounds}", method = RequestMethod.GET)
    public
    @ResponseBody
    String downloadFromPythonGCP(@PathVariable("compounds") String compounds) throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        //JSONArray fp =new JSONArray();
        String fp = clusterFromPython.getDownloadGCP(compounds);

        return fp;
    }

    @RequestMapping(value = "api/clustFromPython/P100/{compounds}", method = RequestMethod.GET)
    public
    @ResponseBody
    String clustFromPythonP100(@PathVariable("compounds") String compounds) throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        //JSONArray fp =new JSONArray();
        String fp = clusterFromPython.getResponseP100(compounds);

        return fp;
    }

    @RequestMapping(value = "api/clustFromPython/GCP/{compounds}", method = RequestMethod.GET)
    public
    @ResponseBody
    String clustFromPythonGCP(@PathVariable("compounds") String compounds) throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        //JSONArray fp =new JSONArray();
        String fp = clusterFromPython.getResponseGCP(compounds);

        return fp;
    }


    @RequestMapping(value = "api/clust/P100", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONObject readP100Clustergrammer( ) {
        JSONObject jsonFile = new JSONObject();
        JSONParser parser = new JSONParser();
        try {

            Object obj = parser.parse(new FileReader("src/main/resources/static/clustergrammer/P100_aggregated_clustergram.json"));
            jsonFile = (JSONObject) new JSONParser().parse(obj.toString());


//            jsonFile = (JSONObject) obj;
       } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {

            e.printStackTrace();
        }

        return jsonFile;
    }


    @RequestMapping(value = "api/test/{notation}", method = RequestMethod.GET)
    public
    @ResponseBody
    String parseTest(@PathVariable String notation) {
        //log.info(notation);
        return notation;
    }


    @RequestMapping(value = "api/translateAllLINCSCompounds", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONArray convertAllLINCSSmiles() throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        JSONArray fp = new JSONArray();
        //fp = readFromCSVService.computeFpForAll();
        fp = smileConverterService.computeFingerprintForRepLINCSLSM();
        return fp;
    }

    @RequestMapping(value = "api/translateAllLINCSProteomicsCompounds", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONArray convertAllSmiles() throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        JSONArray fp = new JSONArray();
        fp = smileConverterService.computeFingerprintForAllLINCSProteomicsLSM();

        return fp;
    }

    @RequestMapping(value = "api/findSimilarCompounds/{smile}", method = RequestMethod.GET)
    public
    @ResponseBody
    JSONArray findSimilarCompounds(@PathVariable("smile") String smile) throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        JSONArray fp =new JSONArray();
        fp = smileConverterService.findSimilarCompoundsToSmile(smile);

        return fp;
    }

//    @RequestMapping(value = "api/findSimilarToAllLINCSCompounds/{smile}", method = RequestMethod.GET)
//    public
//    @ResponseBody
//    JSONArray findSimilarToAllLINCSCompounds(@PathVariable("smile") String smile) throws Exception {
//        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
//        JSONArray fp =new JSONArray();
//        fp = smileConverterService.findSimilarToAllLINCSCompoundsToSmile(smile);
//
//        return fp;
//    }

    @RequestMapping(value = "api/convertSmilesToFigerPrint/{smile}", method = RequestMethod.GET)
    public
    @ResponseBody
    String convertSmile(@PathVariable("smile") String smile ) throws Exception {

        try {
            System.out.println("convertSmilesToFigerPrint");
            System.out.println(smile);
            //
            String smiles = smile;
            //smiles = "ONC(=O)\\C=C\\c1cccc(c1)S(=O)(=O)Nc2ccccc2";
            String decodesdSmile = smileConverterService.translateSmileForEncoding(smiles);
            System.out.println("decodesdSmile:");
            System.out.println(decodesdSmile);
            System.out.println(smiles);
            JSONArray fp;

            fp = smileConverterService.computeFingerPrint(smiles);
            return fp.toString();
        } catch (Exception e) {
            String msg = String.format("Error in obtaining convertSmilesToFigerPrint %s",smile);
            log.warn(msg);
            throw new RuntimeException(msg);

        }


    }

    @RequestMapping(value = "api/depictSmiles/{smile}", method = RequestMethod.GET)
    public
    @ResponseBody
    String depictSmile(@PathVariable String smile) throws Exception {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        System.out.println("depictSmiles");
        System.out.println(smile);
        String smiles = smile;
        String fp;
        fp = SmileConverterService.showSmile(smiles);
        return fp;
    }


}
