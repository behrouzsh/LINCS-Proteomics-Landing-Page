package eh3.uc.edu.service;

import eh3.uc.edu.utils.UtilsNetwork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Created by shamsabz on 9/8/18.
 */

@Service
public class ClusterFromPython {
    private static final Logger log = LoggerFactory.getLogger(eh3.uc.edu.service.ClusterFromPython.class);



    @Value("${urls.pythonGCPApi}")
    String pythonGCPApi;


    @Value("${urls.pythonP100Api}")
    String pythonP100Api;

    @Value("${urls.downloadGCPApi}")
    String downloadGCPApi;


    @Value("${urls.downloadP100Api}")
    String downloadP100Api;

    public String getDownloadP100(String cpName) {

        String response;


        String stringUrl = String.format(downloadP100Api, cpName);

        log.info("Querying: " + stringUrl);
        //log.info("PsiMod: " + UtilsIO.getInstance());



        try {
            //response = UtilsNetwork.getInstance().readUrl(prositeUrl);
            response = UtilsNetwork.getInstance().readUrl(stringUrl);
            String msg =  String.format("success", response);

            log.warn(msg);

        } catch (Exception e) {

            String msg =  String.format("python api error! Gene %s not found", cpName);
            log.warn(msg);
            throw new RuntimeException(msg);
            //response = toString({"n_match" : "NA", "n_seq" : 0, "matchset" : [ {"sequence_ac" : " ", "sequence_id" : "Prosite API error", "sequence_db" : " ", "start" : 0, "stop" : 0, "signature_ac" : " " } ] });

        }

        log.info("Python Flask Response: " + response);
        return  response;
    }

    public String getResponseP100(String cpName) {

        String response;


        String stringUrl = String.format(pythonP100Api, cpName);

        log.info("Querying: " + stringUrl);
        //log.info("PsiMod: " + UtilsIO.getInstance());



        try {
            //response = UtilsNetwork.getInstance().readUrl(prositeUrl);
            response = UtilsNetwork.getInstance().readUrl(stringUrl);
            String msg =  String.format("success", response);

            log.warn(msg);

        } catch (Exception e) {

            String msg =  String.format("python api error! Gene %s not found", cpName);
            log.warn(msg);
            throw new RuntimeException(msg);
            //response = toString({"n_match" : "NA", "n_seq" : 0, "matchset" : [ {"sequence_ac" : " ", "sequence_id" : "Prosite API error", "sequence_db" : " ", "start" : 0, "stop" : 0, "signature_ac" : " " } ] });

        }

        log.info("Python Flask Response: " + response);
        return  response;
    }

    public String getDownloadGCP(String cpName) {

        String response;


        String stringUrl = String.format(downloadGCPApi, cpName);

        log.info("Querying: " + stringUrl);
        //log.info("PsiMod: " + UtilsIO.getInstance());



        try {
            //response = UtilsNetwork.getInstance().readUrl(prositeUrl);
            response = UtilsNetwork.getInstance().readUrl(stringUrl);
            String msg =  String.format("success", response);

            log.warn(msg);

        } catch (Exception e) {

            String msg =  String.format("python api error! Gene %s not found", cpName);
            log.warn(msg);
            throw new RuntimeException(msg);
            //response = toString({"n_match" : "NA", "n_seq" : 0, "matchset" : [ {"sequence_ac" : " ", "sequence_id" : "Prosite API error", "sequence_db" : " ", "start" : 0, "stop" : 0, "signature_ac" : " " } ] });

        }

        log.info("Python Flask Response: " + response);
        return  response;
    }

    public String getResponseGCP(String cpName) {

        String response;


        String stringUrl = String.format(pythonGCPApi, cpName);

        log.info("Querying: " + stringUrl);
        //log.info("PsiMod: " + UtilsIO.getInstance());



        try {
            //response = UtilsNetwork.getInstance().readUrl(prositeUrl);
            response = UtilsNetwork.getInstance().readUrl(stringUrl);
            String msg =  String.format("success", response);

            log.warn(msg);

        } catch (Exception e) {

            String msg =  String.format("python api error! Gene %s not found", cpName);
            log.warn(msg);
            throw new RuntimeException(msg);
            //response = toString({"n_match" : "NA", "n_seq" : 0, "matchset" : [ {"sequence_ac" : " ", "sequence_id" : "Prosite API error", "sequence_db" : " ", "start" : 0, "stop" : 0, "signature_ac" : " " } ] });

        }

        log.info("Python Flask Response: " + response);
        return  response;
    }
}
