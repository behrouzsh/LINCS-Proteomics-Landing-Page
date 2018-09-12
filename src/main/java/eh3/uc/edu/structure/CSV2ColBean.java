package eh3.uc.edu.structure;

/**
 * Created by shamsabz on 8/28/17.
 */
public class CSV2ColBean {
    private String col1;
    private String col2;
    private String col3;
    private String col4;
    private String col5;



    public CSV2ColBean(String col1, String col2, String col3, String col4, String col5) {
        this.col1 = col1;
        this.col2 = col2;
        this.col3 = col3;
        this.col4 = col4;
        this.col5 = col5;

    }

    public String getcol1() {
        return col1;
    }

    public void setcol1(String col1) {
        this.col1 = col1;
    }

    public String getcol2() {
        return col2;
    }

    public void setcol2(String col2) {
        this.col2 = col2;
    }

    public String getcol3() {
        return col3;
    }

    public void setcol3(String col3) {
        this.col3 = col3;
    }

    public String getcol4() {
        return col4;
    }

    public void setcol4(String col4) {
        this.col4 = col4;
    }

    public String getcol5() {
        return col5;
    }

    public void setcol5(String col5) {
        this.col5 = col5;
    }

    @Override
    public String toString() {
        return "CSV [col1=" + col1 + ", col2=" + col2 + ", col3=" + col3 + ", col4=" + col4 + ", col5=" + col5 + "]";
    }

}

