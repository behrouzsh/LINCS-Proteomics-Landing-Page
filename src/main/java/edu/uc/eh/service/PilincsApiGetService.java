package edu.uc.eh.service;

import edu.uc.eh.utils.UtilsNetwork;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


/**
 * Created by behrouz on 3/10/17.
 */
@Service
public class PilincsApiGetService {

    private static final Logger log = LoggerFactory.getLogger(PilincsApiGetService.class);


    @Value("${urls.pilincsApiTags}")
    String pilincsDataInfo;

    JSONArray inputArray = new JSONArray();

    public JSONArray getPilincsmetaData() {

        log.info("Getting Pilincs metadata");
        JSONArray inputArray = new JSONArray();
        JSONArray outArray = new JSONArray();

        String response;
        String pilincsMetaUrl = pilincsDataInfo;

        log.info("Querying: " + pilincsMetaUrl);
        //log.info("PsiMod: " + UtilsIO.getInstance());



        try {
            //response = UtilsNetwork.getInstance().readUrl(prositeUrl);
            response = UtilsNetwork.getInstance().readUrl(pilincsMetaUrl);
            String msg =  String.format("success", response);

            //log.warn(msg);
            JSONParser parser = new JSONParser();
            inputArray = (JSONArray) parser.parse(response);

            for (int i = 0 ; i < inputArray.size(); i++) {
                JSONObject obj = (JSONObject)inputArray.get(i);
                //String A = (String) obj.get("flag");
//                log.info(obj.get("flag").toString());
//                log.info(obj.get("name").toString());

                if(obj.get("flag").toString().equals("Perturbation") ){
//                    log.info("====================================");
//                    log.info(obj.get("name").toString());
                    outArray.add(obj.get("name").toString());
                }

            }
            //log.info(String.valueOf(inputArray));
            //log.info(kinase2GeneJson.toString());

        } catch (Exception e) {
            String msg = String.format("Error in obtaining Pilincs MetaData");
            log.warn(msg);
            throw new RuntimeException(msg);
        }
        return outArray;
    }

}
