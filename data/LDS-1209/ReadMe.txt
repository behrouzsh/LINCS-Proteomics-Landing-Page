################################################################
Dataset Information
################################################################

Dataset Name:
Phosphorylation state and protein levels measured in BRAF(V600E/D) melanoma cell lines monitored by Reverse Phase Protein Arrays (RPPA)

Dataset Description:
This assay measures phosphorylation state and protein levels in BRAF(V600E/D) melanoma cell lines monitored by Reverse Phase Protein Arrays (RPPA). Cells were plated in 4 replicates at 20,000 (or 15,000) cells per well density in 96-well plates, treated with different doses of each compound for 1, 5, 10, 24 and 48 hr. Plates for RPPA assays were treated with drugs using previously prepared 384-well dilution plates and a Seiko pin transfer robot system. Lysates were collected at the designated time-points (1, 5, 10, 24, 48 hr) post drug treatment. To generate reverse phase arrays, lysates were printed on nitrocellulose coated glass slides on a 2470 Arrayer. The data from this dataset and from the related HMS dataset #20217 were used to generate the signatures presented in HMS datasets #20229-20231.

--Data in Package:
20218.txt

--Metadata in Package:
Small_Molecule_Metadata.txt
Cell_Line_Metadata.txt

################################################################
Center-specific Information
################################################################

Center-specific Name:
HMS_LINCS

Center-specific Dataset ID:
20218

Center-specific Dataset Link:
http://lincs.hms.harvard.edu/db/datasets/20218/

################################################################
Assay Information
################################################################

Assay Protocol:
1. For reverse-phase protein array (RPPA) assays, all cells were plated in 4 replicates at a density of 20,000 cells per well (for COLO858 and LOXIMVI cells) or 15000 cells per well (for other cell lines) in 96-well plates (Corning).<br />
2. After 24 hr of normal growth, using previously prepared 384-well dilution plates and a Seiko pin transfer robot system, cells were treated with different doses of each compound for 1, 5, 10, 24 and 48 hr.<br />
3. Lysates were collected at the designated time-points (1, 5, 10, 24, 48 hr) post drug treatment as follows: Plates were briefly washed with ice cold PBS and to each well was added 30 ¼l of lysis buffer composed of 50 mM Tris-HCl, 2% SDS, 5% glycerol, 5 mM EDTA, 1 mM NaF, 1X dilution of protease inhibitors (Complete Mini EDTA Free Protease Inhibitor Cocktail, Roche #11836170001), 1X dilution of phosphatase inhibitors (Phosphatase Inhibitor Cocktail 2, Sigma #P5726), 1 mM PMSF, 1 mM Na3VO4, 10 mM ²-glycerophosphate, and 1 mM DTT. After a brief incubation at room temperature cell lysates were transferred to 96 well filter plates (Pall #5042) and centrifuged to remove nucleic acids and cell debris.</br />
4. Following clarification, lysates were formatted in 384-well plates (Abgene) for printing.<br /> 
5. To generate reverse phase arrays, lysates were printed on nitrocellulose coated glass slides (Grace Biolabs #305177) on a 2470 Arrayer (Aushon Biosystems).<br /> 
6. Staining and analysis of RPPA data using validated antibodies were performed as described in Sevecka et al., 2011, PMID: 21296872.<br />
7. Primary antibodies used for RPPA are as follows: p-MEK(Ser217/221) (rabbit mAb; 9154), p-ERK(Thr202/Tyr204) (rabbit mAb; 4370), p-p90RSK(Ser380) (rabbit; 9341), p-p90RSK(Thr573) (rabbit; 9346), p-AKT(Thr308) (rabbit; 9275), p-AKT(Ser473) (rabbit; 9271), p-mTOR(Ser2448) (rabbit; 2971), p-p70S6K(Thr421/Ser424) (rabbit; 9204), p-p70S6K(Thr389) (rabbit; 9205), p-S6(Ser235/236) (rabbit mAb; 4858), p-AMPK(Thr172) (rabbit mAb; 2535), p-JNK(Thr183/Tyr185) (rabbit; 9251), c-Jun (rabbit mAb; 9165), p-P38(Thr180/Tyr182) (rabbit mAb; 4511), p-HSP27(Ser82) (rabbit mAb; 9709), p-NF-ºB p65(Ser536) (rabbit mAb; 3033), c-PARP (rabbit; 9541), p-H3(Ser10) (3377), p27 (rabbit mAb; 3686) all from Cell Signaling Technology and p-c-Jun(Ser63)  (rabbit mAb; 1527-1); Bim (rabbit mAb; 1036-1) from Epitomics; and beta-actin (mouse; A1978) from Sigma. Secondary antibodies are as follows: anti-mouse IgG conjugated to DyLight 680 (goat; 35518) and anti-rabbit IgG conjugated to DyLight 800 (goat; 35571) from Pierce.<br /> 
8. RPPA slides were imaged once on an Odyssey scanner (LI-COR) and subsequently on an InnoScan 710-IR scanner (Innopsys). The array images were analyzed using Microvigene software (VigeneTech) for slides scanned on the Odyssey and Mapix software (Innopsys) for scans on the InnoScan 710-IR.<br />
9. Specific antibody signals at 680 or 800 nm were first normalized to beta-actin signal from the same array. All data-points (including all replicates for each condition) were log2-normalized to the median of DMSO-treated controls (across all time-points). The median of normalized data-points were then used for further analysis..<br />
<br />
- Missing values:<br /> 
RPPA data-points that were beyond 1.5X the interquartile range for the 8 replicates were removed from the analysis. Antibodies with a Pearson correlation coefficient of < 0.5 between biological replicates for each cell line were removed from the analysis. Also, RPPA slides for the C32 cell line were scanned and analyzed only once and thus data are present only for the dataset using the InnoScan.

Date Updated:
2016-10-28

Date Retrieved from Center:
11/13/2015

################################################################
Metadata Information
################################################################

Metadata information regarding the entities used in the experiments is included in the accompanied metadata. A metadata file per entity category is included in the package. For example, the metadata for all the cell lines that were used in the dataset are included in the Cell_Lines_Metadata.txt file.
Descriptions for each metadata field can be found here: http://www.lincsproject.org/data/data-standards/
[/generic/datapointFile]
[/generic/reagents_studied]
