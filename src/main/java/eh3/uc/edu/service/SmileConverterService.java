package eh3.uc.edu.service;

import eh3.uc.edu.utils.UtilsIO;
import org.json.simple.JSONArray;
import org.json.simple.JSONAware;
import org.json.simple.JSONObject;
import org.openscience.cdk.CDKConstants;
import org.openscience.cdk.depict.DepictionGenerator;
import org.openscience.cdk.fingerprint.*;
import org.openscience.cdk.interfaces.IChemObjectBuilder;
import org.openscience.cdk.silent.SilentChemObjectBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import java.awt.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.BitSet;
import java.util.Iterator;

import junit.framework.Assert;
import org.junit.Test;
import org.openscience.cdk.DefaultChemObjectBuilder;
import org.openscience.cdk.AtomContainer;
import org.openscience.cdk.exception.CDKException;
import org.openscience.cdk.exception.InvalidSmilesException;
import org.openscience.cdk.interfaces.IAtomContainer;
import org.openscience.cdk.io.MDLV2000Reader;
import org.openscience.cdk.smiles.SmilesParser;
import org.openscience.cdk.tools.manipulator.AtomContainerManipulator;



/**
 * Created by shamsabz on 7/13/18.
 */
@Service
public class SmileConverterService {
    private static final Logger log = LoggerFactory.getLogger(SmileConverterService.class);



    @Value("${resources.compoundInfo}")
    String compoundInfo;

    @Value("${resources.representativeCompoundInfo}")
    String repCompoundInfo;

    @Value("${resources.proteomicsLSMWithFingerprint}")
    String proteomicsLSMWithFingerprint;

    public JSONArray computeFingerprintForRepLINCSLSM() {
        JSONObject output = new JSONObject();
        JSONArray outputWithFingerprint = new JSONArray();
        int iter = 0;
        try {
            output = UtilsIO.getInstance().readJsonFile(repCompoundInfo);

            for (Object key : output.keySet()) {
                iter += 1;
                System.out.println(iter);
                JSONObject outputWithFingerprintJson = new JSONObject();
                String keyStr = (String) key;
                JSONArray fingerprint = new JSONArray();

                JSONObject keyvalue = (JSONObject)output.get(keyStr);
                String smile = (String) keyvalue.get("SM_SMILES_Parent");
                String SM_LINCS_ID = (String) keyvalue.get("SM_LINCS_ID");
                String MOLECULAR_FORMULA = (String) keyvalue.get("MOLECULAR_FORMULA");

//                System.out.println(keyStr);
//                System.out.println(smile);
//                System.out.println("----------");
                String translated = translateSmileForEncoding(smile);
                //System.out.println(translated);
                fingerprint = computeFingerPrint(translated);


                //System.out.println(fingerprint.toString());

                //System.out.println("-----------------");
//                outputWithFingerprintJson.put("Name",keyStr);
//                outputWithFingerprintJson.put("Smile",smile);
//                outputWithFingerprintJson.put("SM_LINCS_ID",SM_LINCS_ID);
//                outputWithFingerprintJson.put("MOLECULAR_FORMULA",MOLECULAR_FORMULA);
//                outputWithFingerprintJson.put("Fingerprint",fingerprint);
                outputWithFingerprintJson.put(SM_LINCS_ID,fingerprint);
                outputWithFingerprint.add(outputWithFingerprintJson);
            }



        } catch (Exception e) {
            String msg = String.format("Error in obtaining compoundInfo");
            log.warn(msg);
            throw new RuntimeException(msg);
        }


        return outputWithFingerprint;

    }
    public JSONArray computeFingerprintForAllLINCSProteomicsLSM() {
        JSONObject output = new JSONObject();
        JSONArray outputWithFingerprint = new JSONArray();
        try {
            output = UtilsIO.getInstance().readJsonFile(compoundInfo);

            for (Object key : output.keySet()) {
                JSONObject outputWithFingerprintJson = new JSONObject();
                String keyStr = (String) key;
                JSONArray fingerprint = new JSONArray();

                JSONObject keyvalue = (JSONObject)output.get(keyStr);
                String smile = (String) keyvalue.get("SM_SMILES_Parent");
                String SM_LINCS_ID = (String) keyvalue.get("SM_LINCS_ID");
//                System.out.println(keyStr);
//                System.out.println(smile);
//                System.out.println("----------");
                String translated = translateSmileForEncoding(smile);
                //System.out.println(translated);
                fingerprint = computeFingerPrint(translated);


                //System.out.println(fingerprint.toString());

                //System.out.println("-----------------");
                outputWithFingerprintJson.put("Name",keyStr);
                outputWithFingerprintJson.put("SMILES",smile);
                outputWithFingerprintJson.put("LSM_ID",SM_LINCS_ID);
                outputWithFingerprintJson.put("Fingerprint",fingerprint);
                outputWithFingerprint.add(outputWithFingerprintJson);
            }



        } catch (Exception e) {
            String msg = String.format("Error in obtaining compoundInfo");
            log.warn(msg);
            throw new RuntimeException(msg);
        }


        return outputWithFingerprint;

    }

    public String translateSmileForEncoding(String smile){


        String outputSmile = smile.replace("\\", "1234").replace("/", "4321");
//        System.out.println(smile);
//        System.out.println(outputSmile);
        return outputSmile;

    }
    public static String translateSmileBackForEncoding(String smile){


        String outputSmile = smile.replace("1234","\\").replace("4321","/");
//        System.out.println(smile);
//        System.out.println(outputSmile);
        return outputSmile;

    }
    public static JSONArray computeFingerPrint(String smile) throws InvalidSmilesException, CDKException, IOException {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";

        try{
            String smiles = smile;
            String translatedBack = translateSmileBackForEncoding(smiles);
            JSONArray indexes = new JSONArray();
            BitSet fingerprint1;
            SmilesParser smilesParser = new SmilesParser(DefaultChemObjectBuilder.getInstance());
            IAtomContainer molecule = smilesParser.parseSmiles(translatedBack);
            System.out.println("Atom count " + molecule.getAtomCount());
            IFingerprinter fingerprint = new ExtendedFingerprinter();
            //IFingerprinter fingerprint = new HashedFingerprinter(1024);
            //IFingerprinter fingerprint = new SubstructureFingerprinter();


            fingerprint1 = fingerprint.getBitFingerprint(molecule).asBitSet();
            for (int i = fingerprint1.nextSetBit(0); i != -1; i = fingerprint1.nextSetBit(i + 1)) {
                indexes.add(i);
            }
            //fingerprintArray = fingerprint1.toByteArray();
//            System.out.println("+++++++++++++++++++++");
//            System.out.println("bitset: " + fingerprint1.toString());
//            System.out.println("list: " + indexes);
//            System.out.println("+++++++++++++++++++++");

            return indexes;
        } catch (Exception e) {
                String msg = String.format("Error in converting %s to smile",smile);
                log.warn(msg);

            JSONArray indexes2 = new JSONArray();
            //throw new RuntimeException(msg);
            return indexes2;
        }


    }

    public JSONArray findSimilarToAllLINCSCompoundsToSmile(String inputSmile)
    {
        JSONArray output = new JSONArray();
        JSONArray LSMWithFingerprintArray =  new JSONArray();

        String smiles = inputSmile;
        String translatedBack = translateSmileBackForEncoding(smiles);
        try {
            JSONArray cpFingerprint = computeFingerPrint(translatedBack);
            LSMWithFingerprintArray = UtilsIO.getInstance().readJsonArrayFile(repCompoundInfo);

            for (int i = 0 ; i < LSMWithFingerprintArray.size(); i++) {
                JSONObject obj = (JSONObject) LSMWithFingerprintArray.get(i);
                JSONArray fingerprint = (JSONArray) obj.get("Fingerprint");
                String Smile = (String) obj.get("Smile");
                String Name = (String) obj.get("Name");

                double similarity = computeSimilarity(fingerprint,cpFingerprint);
                if(similarity > 0.75)
                {
                    JSONObject newMember = new JSONObject();
                    newMember.put("Name", Name);
                    newMember.put("Smile", Smile);
                    newMember.put("Similarity", similarity);
                    output.add(newMember);
                }
            }

        }
        catch (InvalidSmilesException e) {
            String msg = String.format("Error in obtaining compoundInfo");
            log.warn(msg);
            throw new RuntimeException(msg);
            //e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (CDKException e) {
            e.printStackTrace();
        }



        return output;
    }


    public JSONArray findSimilarCompoundsToSmile(String inputSmile)
    {
        JSONArray output = new JSONArray();
        JSONArray LSMWithFingerprintArray =  new JSONArray();

        String smiles = inputSmile;
        String translatedBack = translateSmileBackForEncoding(smiles);
        try {
           JSONArray cpFingerprint = computeFingerPrint(translatedBack);
            LSMWithFingerprintArray = UtilsIO.getInstance().readJsonArrayFile(proteomicsLSMWithFingerprint);

            for (int i = 0 ; i < LSMWithFingerprintArray.size(); i++) {
                JSONObject obj = (JSONObject) LSMWithFingerprintArray.get(i);
                JSONArray fingerprint = (JSONArray) obj.get("Fingerprint");
                String Smile = (String) obj.get("Smile");
                String Name = (String) obj.get("Name");
                String LSM_ID = (String) obj.get("LSM_ID");

                double similarity = computeSimilarity(fingerprint,cpFingerprint);
                if(similarity > 0.75)
                {
                    JSONObject newMember = new JSONObject();
                    newMember.put("Name", Name);
                    newMember.put("Smile", Smile);
                    newMember.put("Similarity", similarity);
                    newMember.put("LSM_ID", LSM_ID);
                    output.add(newMember);
                }
            }

            }
            catch (InvalidSmilesException e) {
                String msg = String.format("Error in obtaining compoundInfo");
                log.warn(msg);
                throw new RuntimeException(msg);
            //e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (CDKException e) {
            e.printStackTrace();
        }



        return output;
    }

    public double computeSimilarity(JSONArray a, JSONArray b){
        double similarity = 0.0;
        int len1 = a.size();
        int len2 = b.size();
        int common = 0;
        int aNum,bNum;
        System.out.println("---------------------------");
        System.out.println(a.toString());
        System.out.println(b.toString());
        if(len1 == 0 || len2 == 0)
        {
            return 0.0;
        }
        else {

//            int[] numbersA = new int[a.size()];
//
//// Extract numbers from JSON array.
//            for (int i = 0; i < a.size(); ++i) {
//                numbersA[i] = a.optInt(i);;
//            }
//
//            int[] numbersB = new int[b.size()];
//
//// Extract numbers from JSON array.
//            for (int i = 0; i < b.size(); ++i) {
//                numbersB[i] = (int)b.get(i);
//            }
            for (int i = 0; i < a.size(); i++) {
                for (int j = 0; j < b.size(); j++) {

                    //Integer.valueOf(a.get(i).getValue())
                    aNum = Integer.valueOf(String.valueOf(a.get(i)));
                    bNum = Integer.valueOf(String.valueOf(b.get(j)));
                    if(aNum == bNum){
                    //if(Integer.valueOf((Integer) a.get(i)) == Integer.valueOf((Integer) b.get(j))){
                    //if (a.get(i) == b.get(j)) {
                    //if (((Long) a.get(i)).intValue() == ((Long) b.get(j)).intValue()) {

                        common = common + 1;
                        System.out.format("found %d %d %d  %n",aNum,bNum, common);

                    }
                }
            }
            if(len1 + len2 - common != 0) {
                similarity = 1.0 * common / (len1 + len2 - common);
            }
            else{
                return 0.0;
            }

            System.out.println(len1);
            System.out.println(len2);
            System.out.println(common);
            System.out.println(similarity);
            System.out.println("++++++++++++++++++++++");
            return similarity;
        }
    }

    public static String showSmile(String smile) throws InvalidSmilesException, CDKException, IOException {
        //String smiles = "CCCCC1C(=O)N(N(C1=O)C1=CC=CC=C1)C1=CC=CC=C1";
        String smiles = smile;
        String translatedBack = translateSmileBackForEncoding(smiles);
        System.out.println("In showSmile");
        IChemObjectBuilder bldr   = SilentChemObjectBuilder.getInstance();
        SmilesParser       smipar = new SmilesParser(bldr);

        //IAtomContainer mol = smipar.parseSmiles("CN1C=NC2=C1C(=O)N(C(=O)N2C)C");
        IAtomContainer mol = smipar.parseSmiles(translatedBack);
        mol.setProperty(CDKConstants.TITLE, smile);

        DepictionGenerator dptgen = new DepictionGenerator();
        // size in px (raster) or mm (vector)
        // annotations are red by default
        dptgen.withSize(300, 200)
                .withMolTitle()
                .withTitleColor(Color.DARK_GRAY);
//        dptgen.depict(mol)
//                .writeTo("~/caffeine.png");
        System.out.println(dptgen.depict(mol).toSvgStr());
//
//        Class cls = dptgen.depict(mol).getClass();
//        System.out.println("The type of the object is: " + cls.getName());


        return dptgen.depict(mol).toSvgStr();
    }

}
