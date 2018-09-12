package eh3.uc.edu.utils;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by chojnasm on 11/25/15.
 * Utils related to regular expressions and text formatting
 */
public class UtilsFormat {

    private static final Logger log = LoggerFactory.getLogger(UtilsFormat.class);
    private static UtilsFormat instance;

    private UtilsFormat() {
    }

    static {
        instance = new UtilsFormat();
    }

    public static UtilsFormat getInstance(){return instance;}

    /**
     * Parse compound letter and modification.html mass from string e.g. K[+80]
     * @param input
     * @return
     */

}
