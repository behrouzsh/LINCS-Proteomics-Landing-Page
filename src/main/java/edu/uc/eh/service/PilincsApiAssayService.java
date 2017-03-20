package edu.uc.eh.service;

import edu.uc.eh.utils.UtilsNetwork;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;

/**
 * Created by behrouz on 3/11/17.
 */

@Service
public class PilincsApiAssayService {

    private static final Logger log = LoggerFactory.getLogger(PilincsApiAssayService.class);


    @Value("${urls.pilincsP100Api}")
    String pilincsDataInfo;

    JSONArray inputArray = new JSONArray();

    public JSONArray getPilincsPerturbData(String perturb) {

        log.info("Getting Pilincs metadata");
        JSONArray inputArray = new JSONArray();
        JSONObject inputObject = new JSONObject();
        JSONArray outArray = new JSONArray();
        ArrayList uniqueTuple = new ArrayList();
        String response;
        String pilincsDataUrl = String.format(pilincsDataInfo, perturb);


        log.info("Querying: " + pilincsDataUrl);
        //log.info("PsiMod: " + UtilsIO.getInstance());

        try {
            //response = UtilsNetwork.getInstance().readUrl(prositeUrl);

            response = UtilsNetwork.getInstance().readUrl(pilincsDataUrl);
            //log.info("response");
            //log.info(response);
            //String msg =  String.format("success", response);

            //log.warn(msg);
            JSONParser parser = new JSONParser();
            inputObject = (JSONObject) parser.parse(response);
            //log.info(String.valueOf(inputObject));
            //var total = ()
//            log.info(String.valueOf(inputObject.get("total")));
//            log.info(String.valueOf(inputObject.get("total").getClass()));
//            log.info(String.valueOf(inputObject.get("total").getClass()));
            int total =  ((Long) inputObject.get("total")).intValue();
            inputArray = (JSONArray) inputObject.get("rows");
            log.info("total");
            log.info(String.valueOf(total));


            if (total > 0) {
                for (int i = 0; i < inputArray.size(); i++) {
                    JSONObject obj = (JSONObject) inputArray.get(i);
                    log.info(String.valueOf(obj));
                    log.info(obj.get("value").toString());
                    log.info(obj.get("prModifiedPeptideCode").toString());
                    log.info(obj.get("cellId").toString());
                    log.info(obj.get("pertDose").toString());
                    log.info(obj.get("pertTime").toString());
                    log.info(obj.get("pertVehicle").toString());
                    log.info(obj.get("-----------------------").toString());
                    String tuple = obj.get("cellId").toString() + obj.get("pertDose").toString() +
                        obj.get("pertTime").toString() + obj.get("pertVehicle").toString();


                    log.info(tuple);
                    if(!uniqueTuple.contains(tuple)){
                        uniqueTuple.add(tuple);
                    }



                    outArray.add(obj.get("prModifiedPeptideCode").toString());


                }
                Collections.sort(uniqueTuple, String.CASE_INSENSITIVE_ORDER);
                //uniqueTuple.sort(String::compareToIgnoreCase);
            }else{
                return outArray;
            }


        } catch (Exception e) {
            String msg = String.format("Error in obtaining Pilincs perturbagen info");
            log.warn(msg);
            throw new RuntimeException(msg);
        }
        for(int uniqueIter = 0; uniqueIter < uniqueTuple.size(); uniqueIter++){
            log.info((String) uniqueTuple.get(uniqueIter));
        }
        return outArray;
    }

}
