package eh3.uc.edu.service;

import eh3.uc.edu.utils.UtilsNetwork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


/**
 * Created by shamsabz on 8/28/18.
 */

@Service
public class EnsemblService {
    private static final Logger log = LoggerFactory.getLogger(eh3.uc.edu.service.EnsemblService.class);



    @Value("${urls.ensembleApiAddress}")
    String ensembleApi;




    public String getResponse(String geneName) {

        String response;


        String stringUrl = String.format(ensembleApi, geneName);

        log.info("Querying: " + stringUrl);
        //log.info("PsiMod: " + UtilsIO.getInstance());



        try {
            //response = UtilsNetwork.getInstance().readUrl(prositeUrl);
            response = UtilsNetwork.getInstance().readUrl(stringUrl);
            String msg =  String.format("success", response);

            log.warn(msg);

        } catch (Exception e) {

            String msg =  String.format("ensembleApi error! Gene %s not found", geneName);
            log.warn(msg);
            throw new RuntimeException(msg);
            //response = toString({"n_match" : "NA", "n_seq" : 0, "matchset" : [ {"sequence_ac" : " ", "sequence_id" : "Prosite API error", "sequence_db" : " ", "start" : 0, "stop" : 0, "signature_ac" : " " } ] });

        }

        log.info("ensembleApi Response: " + response);
        return  response;
    }
}
