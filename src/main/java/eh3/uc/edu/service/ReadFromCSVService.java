package eh3.uc.edu.service;

import eh3.uc.edu.structure.CSV2ColBean;
import eh3.uc.edu.utils.UtilsIO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.openscience.cdk.exception.CDKException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

/**
 * Created by shamsabz on 7/27/18.
 */
@Service
public class ReadFromCSVService {
    private static final Logger log = LoggerFactory.getLogger(ReadFromCSVService.class);

    @Value("${resources.LSMCSVFile}")
    String LSMCSVFile;

    public JSONArray computeFpForAll() throws CDKException, IOException {
        List<CSV2ColBean> mapping;

        mapping = UtilsIO.readCSV(LSMCSVFile);


        JSONArray network = new JSONArray();
        //log.info(mapping.toString());
//        log.info("here");

        String SM_Name ;
        String SM_LINCS_ID ;
        String SM_Alternative_Name ;
        String SM_PubChem_CID ;
        String SM_SMILES_Parent ;
        int idx = 0;

        for(int i = 0; i < mapping.size(); i++) {

            SM_Name = (String) mapping.get(i).getcol1();
            SM_LINCS_ID = (String) mapping.get(i).getcol2();

            SM_Alternative_Name = (String) mapping.get(i).getcol3();
            SM_PubChem_CID = (String) mapping.get(i).getcol4();

            SM_SMILES_Parent = (String) mapping.get(i).getcol5();

            System.out.println(SM_Name);
            System.out.println(SM_LINCS_ID);
            System.out.println(SM_Alternative_Name);
            System.out.println(SM_PubChem_CID);
            System.out.println(SM_SMILES_Parent);
            System.out.println("======================");
            JSONObject networkItem = new JSONObject();
            networkItem.put("SM_Name",SM_Name);
            networkItem.put("SM_LINCS_ID",SM_LINCS_ID);
            networkItem.put("SM_Alternative_Name",SM_Alternative_Name);
            networkItem.put("SM_PubChem_CID",SM_PubChem_CID);
            networkItem.put("SM_SMILES_Parent",SM_SMILES_Parent);
            JSONArray fingerPrint =  new JSONArray();
            fingerPrint = SmileConverterService.computeFingerPrint(SM_SMILES_Parent);
            networkItem.put("fingerPrint",fingerPrint);
            network.add(networkItem);
//            log.info(gene);
//            log.info(pathway);



        }

        return network;
    }
}
