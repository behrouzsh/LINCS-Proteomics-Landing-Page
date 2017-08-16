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
    plp.read_config_json_file()
    # plp.read_input_file()
    # plp.extract_motifs(plp.motifs_data)
    # plp.call_psimod()
    # plp.call_prosite()
    # plp.call_uniprot(plp.prosite_result)
    # plp.call_enrichr(plp.unique_genes)
    # plp.print_to_file(plp.motif_and_modification_list, plp.prosite_result, plp.psimod_result)

    # for finding genes corresponding to proteins call harmonizome

    #plp.call_harmonizome()


    #genes = ['PKP2','PRKCG','MOBP','CORO7','SHISA6','GFAP','WDR1','YWHAG','YWHAZ','ALB','KALRN','CNKSR2','NAPB','NSF','FGA','TUBB4A',
    #'DOCK4',    'DLG4',    'VCAN',    'HSPA12A',    'AK5',    'CAMK2A',    'LANCL1',    'PRKCB',    'DLGAP3',    'CAMK2B',
    #'KIAA1045',    'TUBA1A',    'PLP1',    'LRRC7',    'SYNGAP1',    'CKB',    'CNP',    'RRBP1',    'AGAP3',
    #'MBP',    'TUFM',    'TUBB',    'ANKS1B',    'TUBB2A',    'MAPRE2',    'TUBB4B',    'ACTB',    'DLGAP1',
    #'TUBA1B',    'ACTA2',    'CAMK2D',    'FGG',    'APOE',    'SHANK3']
    #genes = ['DYR1A', 'DYR1B', 'KS6A3', 'HN1', 'NIPA', 'NCOR2', 'UH1BL', 'OCAD1', 'PDPK1', 'PDPK2', 'ABI1', 'WDR20', 'MAP4', 'SPF45', 'IQGA3', 'NIBL1', 'TYB4', 'CLCA', 'SYNRG', 'ZC3HE', 'PFKAP', 'LAR4B', 'HAT1', 'M3K7', 'SRRM1', 'BRD4', 'ULK1', 'KIF4A', 'K0930', 'DHX16', 'BRAF', 'FOSL2', 'JUND', 'JUN', 'RL12', 'NU214', 'IF4A3', 'LAP2B', 'PRC2A', 'FAS', 'FA76B', 'RS6', 'AHNK', 'PAK2', 'KS6A1', 'KS6A6', 'ZN672', 'NCBP3', 'ATAD2', 'NUFP2', 'RBBP6', 'CASC3', 'GPAM1', 'CCYL1', 'NF2IP', 'RN169', 'ZN740', 'DDX54', 'ATX2L', 'ATRIP', 'REQU', 'SMRC1', 'FUBP2', 'SH3K1', 'CHAP1', 'RBM14', 'ALS2', 'PP1RA', 'TPX2', 'RSF1', 'WAC', 'BAP1', 'UBE2O', 'WDR26', 'ANLN', 'SIAS', 'TE2IP', 'LRWD1', 'LIMA1', 'GPTC8', 'SRRT', 'M3K2', 'TR150', 'NOC2L', 'VPRBP', 'PRC2C', 'MARK2', 'S38A1', 'CDK1', 'LAP2A', 'NOLC1', 'PLEC', 'SRRM2']
    #print len(genes)
    #plp.call_enrichr(genes)
    ptm_genes = ["HIST3H3", "HIST1H3A", "HIST1H3B", "HIST1H3C", "HIST1H3D", "HIST1H3E", "HIST1H3F", "HIST1H3G", "HIST1H3H", "HIST1H3I", "HIST1H3J", "HIST2H3A", "HIST2H3C", "HIST2H3D", "H3F3A", "H3F3B", "H3F3C", "HIST3H3[aK@5]", "HIST1H3A[aK@5]", "HIST1H3B[aK@5]", "HIST1H3C[aK@5]", "HIST1H3D[aK@5]", "HIST1H3E[aK@5]", "HIST1H3F[aK@5]", "HIST1H3G[aK@5]", "HIST1H3H[aK@5]", "HIST1H3I[aK@5]", "HIST1H3J[aK@5]", "HIST2H3A[aK@5]", "HIST2H3C[aK@5]", "HIST2H3D[aK@5]", "H3F3A[aK@5]", "H3F3B[aK@5]", "H3F3C[aK@5]", "HIST3H3[aK@15]", "HIST1H3A[aK@15]", "HIST1H3B[aK@15]", "HIST1H3C[aK@15]", "HIST1H3D[aK@15]", "HIST1H3E[aK@15]", "HIST1H3F[aK@15]", "HIST1H3G[aK@15]", "HIST1H3H[aK@15]", "HIST1H3I[aK@15]", "HIST1H3J[aK@15]", "HIST2H3A[aK@15]", "HIST2H3C[aK@15]", "HIST2H3D[aK@15]", "H3F3A[aK@15]", "H3F3B[aK@15]", "H3F3C[aK@15]", "HIST3H3[pS@11]", "HIST1H3A[pS@11]", "HIST1H3B[pS@11]", "HIST1H3C[pS@11]", "HIST1H3D[pS@11]", "HIST1H3E[pS@11]", "HIST1H3F[pS@11]", "HIST1H3G[pS@11]", "HIST1H3H[pS@11]", "HIST1H3I[pS@11]", "HIST1H3J[pS@11]", "HIST2H3A[pS@11]", "HIST2H3C[pS@11]", "HIST2H3D[pS@11]", "H3F3A[pS@11]", "H3F3B[pS@11]", "H3F3C[pS@11]", "HIST3H3[aK@15][pS@11]", "HIST1H3A[aK@15][pS@11]", "HIST1H3B[aK@15][pS@11]", "HIST1H3C[aK@15][pS@11]", "HIST1H3D[aK@15][pS@11]", "HIST1H3E[aK@15][pS@11]", "HIST1H3F[aK@15][pS@11]", "HIST1H3G[aK@15][pS@11]", "HIST1H3H[aK@15][pS@11]", "HIST1H3I[aK@15][pS@11]", "HIST1H3J[aK@15][pS@11]", "HIST2H3A[aK@15][pS@11]", "HIST2H3C[aK@15][pS@11]", "HIST2H3D[aK@15][pS@11]", "H3F3A[aK@15][pS@11]", "H3F3B[aK@15][pS@11]", "H3F3C[aK@15][pS@11]", "HIST1H3A[aK@24]", "HIST1H3B[aK@24]", "HIST1H3C[aK@24]", "HIST1H3D[aK@24]", "HIST1H3E[aK@24]", "HIST1H3F[aK@24]", "HIST1H3G[aK@24]", "HIST1H3H[aK@24]", "HIST1H3I[aK@24]", "HIST1H3J[aK@24]", "HIST2H3A[aK@24]", "HIST2H3C[aK@24]", "HIST2H3D[aK@24]", "H3F3A[aK@24]", "H3F3B[aK@24]","H3F3C[aK@24]","HIST3H3[aK@37]","HIST1H3A[aK@37]","HIST1H3B[aK@37]","HIST1H3C[aK@37]","HIST1H3D[aK@37]","HIST1H3E[aK@37]","HIST1H3F[aK@37]","HIST1H3G[aK@37]","HIST1H3H[aK@37]","HIST1H3I[aK@37]","HIST1H3J[aK@37]","HIST2H3A[aK@37]","HIST2H3C[aK@37]","HIST2H3D[aK@37]"]
    print len(ptm_genes)
    plp.generate_network_for_gcp(ptm_genes)
    # plp.call_flask(genes, plp.pathway_list, plp.gene_to_pathway_list)

    # plp.read_write_gene_json_file()
    # plp.query_gene_sequence()
    # plp.read_write_kinase_file()
    # plp.find_nonhuman_kinase_file()
    # plp.merge_kinase_files()
    # This is for creating signatures for ilincs

    # In the modified version we do not include crispr and one sample signatures
    #plp.process_P100_GCT_file_for_signature_modified()
    # This is for uniquing perturbagens for lincsproteomics
    #plp.process_P100_GCT_file_for_perturbagen()
    # plp.convert_csv_2_json_file()





