package eh3.uc.edu.utils;


import eh3.uc.edu.structure.CSV2ColBean;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;


/**
 * Created by chojnasm on 11/24/15.
 * Modified by Behrouzsh on 11/10/16.
 * IO Utils delivered as Singleton
 */
public class UtilsIO {

    private static final Logger log = LoggerFactory.getLogger(UtilsIO.class);
    private static UtilsIO instance;

    private UtilsIO()  {
    }

    static {

            instance = new UtilsIO();

    }

    public static UtilsIO getInstance() {
System.out.println(instance);
        return instance;
    }


    /**
     * Read resource file from absolute path, which is relative to src/main/resources.
     * Store data in a structure enabling quick search for identifiers of modifications
     *
     * @param fileName
     * @return JSONObject
     */
    public ArrayList readListFileConvertToLowerCase(String fileName) {
        Class<?> cl = getClass();
        InputStream is = cl.getResourceAsStream(fileName);
        ArrayList pcg = new ArrayList();
        StringBuilder sb = new StringBuilder();
        //Map<Character, List<DiffIdentifier>> map = new HashMap<>();

        try(BufferedReader br =
                    new BufferedReader(new InputStreamReader(is))) {

            String inputLine;

            while ((inputLine = br.readLine()) != null) {
                sb.append(inputLine);
                System.out.println(inputLine);
            }
            String[] geneListSplit = sb.toString().split(",");
            for (int i = 0;  i < geneListSplit.length; i++) {

                pcg.add(geneListSplit[i].replaceAll("[^a-zA-Z0-9-_\\s]", "").replaceAll("\\s", "").toLowerCase());
            }
            br.close();
        } catch (IOException e) {
            log.error("IOException: " + e);
        }

        return pcg;
    }

    public ArrayList readListFile(String fileName) {
        Class<?> cl = getClass();
        InputStream is = cl.getResourceAsStream(fileName);
        ArrayList pcg = new ArrayList();
        StringBuilder sb = new StringBuilder();
        //Map<Character, List<DiffIdentifier>> map = new HashMap<>();

        try (BufferedReader br =
                     new BufferedReader(new InputStreamReader(is))) {

            String inputLine;

            while ((inputLine = br.readLine()) != null) {
                sb.append(inputLine);
            }
            String[] geneListSplit = sb.toString().split(",");
            for (int i = 0; i < geneListSplit.length; i++) {

                pcg.add(geneListSplit[i].replaceAll("[^a-zA-Z0-9-_\\s]", "").replaceAll("\\s", ""));
            }

            br.close();
        } catch (IOException e) {
            log.error("IOException: " + e);
        }

        return pcg;
    }

    /**
     * Read resource file from absolute path, which is relative to src/main/resources.
     * Store data in a structure enabling quick search for identifiers of modifications
     *
     * @param fileName
     * @return JSONArray
     */
    public JSONArray readJsonArrayFile(String fileName) {
        Class<?> cl = getClass();
        InputStream is = cl.getResourceAsStream(fileName);
        JSONArray pcg = new JSONArray();
        StringBuilder sb = new StringBuilder();
        //Map<Character, List<DiffIdentifier>> map = new HashMap<>();

        try (BufferedReader br =
                     new BufferedReader(new InputStreamReader(is))) {

            String inputLine;

            while ((inputLine = br.readLine()) != null) {
                sb.append(inputLine);
            }

            JSONParser parser = new JSONParser();
            pcg = (JSONArray) parser.parse(sb.toString());
            //pcg = new JSONObject(sb.toString());
            //pcg = (JSONObject) sb.toString();
            br.close();
        } catch (IOException e) {
            log.error("IOException: " + e);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return pcg;
    }


    /**
     * Read resource file from absolute path, which is relative to src/main/resources.
     * Store data in a structure enabling quick search for identifiers of modifications
     *
     * @param fileName
     * @return JSONObject
     */
    public JSONObject readJsonFile(String fileName) {
        Class<?> cl = getClass();
        InputStream is = cl.getResourceAsStream(fileName);
        JSONObject pcg = new JSONObject();
        StringBuilder sb = new StringBuilder();
        //Map<Character, List<DiffIdentifier>> map = new HashMap<>();

        try (BufferedReader br =
                     new BufferedReader(new InputStreamReader(is))) {

            String inputLine;

            while ((inputLine = br.readLine()) != null) {
                sb.append(inputLine);
                //System.out.println(inputLine);
            }

            JSONParser parser = new JSONParser();
            pcg = (JSONObject) parser.parse(sb.toString());
            //pcg = new JSONObject(sb.toString());
            //pcg = (JSONObject) sb.toString();
            br.close();
        } catch (IOException e) {
            log.error("IOException: " + e);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return pcg;
    }





    /**
     * Read resource file from absolute path, which is relative to src/main/resources.
     * Store data in a structure enabling quick search for identifiers of modifications
     *
     * @param fileName
     * @return Map
     */



    public static List<CSV2ColBean> readCSV(String fileName)
    {
        log.info(fileName);
        log.info("here2");
        List<CSV2ColBean> Rows = readRowsFromCSV(fileName);
        log.info(fileName);
        log.info("here3");
        log.info(Rows.toString());

        // let's print all the person read from CSV file
        for (CSV2ColBean b : Rows) {
            System.out.println(b);
        }

        return Rows;

    }

    public static List<CSV2ColBean> readRowsFromCSV(String fileName) {


        Path pathToFile = Paths.get(fileName); // create an instance of BufferedReader // using try with resource, Java 7 feature to close resources try (BufferedReader br = Files.newBufferedReader(pathToFile, StandardCharsets.US_ASCII)) {


        List<CSV2ColBean> Rows = new ArrayList<>();
        try (BufferedReader br = Files.newBufferedReader(pathToFile,
                StandardCharsets.US_ASCII)) {
            // read the first line from the text file
            String line = br.readLine(); // loop until all lines are read
            System.out.println(line.toString());
            while (line != null) {
                // use string.split to load a string array with the values from
                // each line of // the file, using a comma as the delimiter
                String[] attributes = line.split(",");
                for(int item = 0; item < attributes.length; item++)
                {
                    System.out.println(attributes[item].toString());
                }

                CSV2ColBean book = createObject(attributes);
                // adding book into ArrayList
                Rows.add(book);
                // read next line before looping
                // if end of file reached, line would be null l
                line = br.readLine();
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }

        return Rows;
    }

    public  static CSV2ColBean createObject(String[] metadata) {
        String SM_Name = metadata[0];
        String SM_LINCS_ID = metadata[1];
        String SM_Alternative_Name = metadata[2];
        String SM_PubChem_CID = metadata[3];
        String SM_SMILES_Parent = metadata[4];

        // create and return book of this metadata
        return new CSV2ColBean(SM_Name,	SM_LINCS_ID,	SM_Alternative_Name,	SM_PubChem_CID,	SM_SMILES_Parent);
    }


}
