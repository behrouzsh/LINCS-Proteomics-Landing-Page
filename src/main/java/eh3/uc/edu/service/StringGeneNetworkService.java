package eh3.uc.edu.service;

import eh3.uc.edu.utils.UtilsNetwork;
import org.json.simple.JSONArray;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Created by shamsabz on 8/24/18.
 */

@Service
public class StringGeneNetworkService {
    private static final Logger log = LoggerFactory.getLogger(eh3.uc.edu.service.StringGeneNetworkService.class);



    @Value("${urls.stringNetworkJSON}")
    String stringNetworkJSON;




    public String getResponse(String geneName) {

        String response;


        String stringUrl = String.format(stringNetworkJSON, geneName);

        log.info("Querying: " + stringUrl);
        //log.info("PsiMod: " + UtilsIO.getInstance());



        try {
            //response = UtilsNetwork.getInstance().readUrl(prositeUrl);
            response = UtilsNetwork.getInstance().readUrl(stringUrl);
            String msg =  String.format("success", response);

            log.warn(msg);

        } catch (Exception e) {

            String msg =  String.format("String error! Gene %s not found", geneName);
            log.warn(msg);
            throw new RuntimeException(msg);
            //response = toString({"n_match" : "NA", "n_seq" : 0, "matchset" : [ {"sequence_ac" : " ", "sequence_id" : "Prosite API error", "sequence_db" : " ", "start" : 0, "stop" : 0, "signature_ac" : " " } ] });

        }

        log.info("String Network Response: " + response);
        return  response;
    }
}
