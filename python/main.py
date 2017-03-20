#!/usr/bin/python
#!/usr/bin/env python
#
# Author: Behrouz Shamsaei <behrouz.shamsaei@uc.edu>
# Date: Sep 2016
#
#import math
#import numpy as np
from plp.plp import Plp

if __name__ == '__main__':
    plp = Plp()
    # plp.read_config_json_file()
    # plp.read_input_file()
    # plp.extract_motifs(plp.motifs_data)
    # plp.call_psimod()
    # plp.call_prosite()
    # plp.call_uniprot(plp.prosite_result)
    # plp.call_enrichr(plp.unique_genes)
    # plp.print_to_file(plp.motif_and_modification_list, plp.prosite_result, plp.psimod_result)

    # for finding genes corresponding to proteins call harmonizome

    #plp.call_harmonizome()



    # genes = ['DYR1A', 'DYR1B', 'KS6A3', 'HN1', 'NIPA', 'NCOR2', 'UH1BL', 'OCAD1', 'PDPK1', 'PDPK2', 'ABI1', 'WDR20', 'MAP4', 'SPF45', 'IQGA3', 'NIBL1', 'TYB4', 'CLCA', 'SYNRG', 'ZC3HE', 'PFKAP', 'LAR4B', 'HAT1', 'M3K7', 'SRRM1', 'BRD4', 'ULK1', 'KIF4A', 'K0930', 'DHX16', 'BRAF', 'FOSL2', 'JUND', 'JUN', 'RL12', 'NU214', 'IF4A3', 'LAP2B', 'PRC2A', 'FAS', 'FA76B', 'RS6', 'AHNK', 'PAK2', 'KS6A1', 'KS6A6', 'ZN672', 'NCBP3', 'ATAD2', 'NUFP2', 'RBBP6', 'CASC3', 'GPAM1', 'CCYL1', 'NF2IP', 'RN169', 'ZN740', 'DDX54', 'ATX2L', 'ATRIP', 'REQU', 'SMRC1', 'FUBP2', 'SH3K1', 'CHAP1', 'RBM14', 'ALS2', 'PP1RA', 'TPX2', 'RSF1', 'WAC', 'BAP1', 'UBE2O', 'WDR26', 'ANLN', 'SIAS', 'TE2IP', 'LRWD1', 'LIMA1', 'GPTC8', 'SRRT', 'M3K2', 'TR150', 'NOC2L', 'VPRBP', 'PRC2C', 'MARK2', 'S38A1', 'CDK1', 'LAP2A', 'NOLC1', 'PLEC', 'SRRM2']
    # print len(genes)
    # plp.call_enrichr(genes)
    # plp.call_flask(genes, plp.pathway_list, plp.gene_to_pathway_list)

    # plp.read_write_gene_json_file()
    # plp.query_gene_sequence()
    # plp.read_write_kinase_file()
    # plp.find_nonhuman_kinase_file()
    # plp.merge_kinase_files()
    # plp.process_P100_GCT_file_for_signature()
    plp.process_P100_GCT_file_for_perturbagen()
    # plp.convert_csv_2_json_file()





