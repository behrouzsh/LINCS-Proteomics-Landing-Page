#!/usr/bin/env python
#
# Author: Behrouz Shamsaei <behrouz.shamsaei@uc.edu>
# Date: Sep 2016
#

import json
import re
import numpy as np
import pandas as pd
from scipy import stats
import math
#from pprint import pprint
import sys
import string
#import common.json

from plpSearch.prositeClient import PrositeClient
from plpSearch.uniprotClient import UniprotClient
from plpSearch.enrichrClient import EnrichrClient
from plpSearch.harmonizomeClient import HarmonizomeClient
from plpFlask.flaskClient import FlaskClient

import sys
# reload(sys)
import csv
# sys.setdefaultencoding('utf8')

class Plp(object):
    """Pln class is to read the input file and extract the motifs and modifications.
    :param motifs: List of motifs to be searched.
    """
    prosite_client = PrositeClient()
    uniprot_client = UniprotClient()
    harmonizome_client = HarmonizomeClient()
    #flask_client = FlaskClient()


    def __init__(self):
        self.motif_and_modification_list = []
        self.prosite_result = []
        self.uniprot_result = []
        self.psimod_result = []
        self.unique_protein = []
        self.unique_genes = []
        self.network = []
        self.pathway_list = []
        self.gene_to_pathway_list = []


    def read_config_json_file(self):

        with open('config/config.json', "r") as json_data_file:
            self._config_data = json.load(json_data_file)

            print self._config_data
        return self._config_data

    def read_input_file(self):
        with open('input/motif.txt', "r") as input_file:
            self.motifs_data = input_file.read().splitlines()
            #print self._motifs_data
        input_file.close()
        return self.motifs_data

    def extract_motifs(self, motifs_data):
        for motif in motifs_data:

            if self._config_data["input_format"] == 1:
                tmp_list = self.analyze_motif_first(motif)
            else:
                tmp_list = self.analyze_motif_second(motif)

            self.motif_and_modification_list.append(tmp_list)


        # print "----------motif_and_modification_list----------"
        # print self.motif_and_modification_list
        return self.motif_and_modification_list

    def analyze_motif_second(self, motif):
        """analyze_motif_second method is to read the input file and extract the motifs and modifications.
        :param motif: List of motifs to be searched.
        """

        modification_dict = {'a':42.0373, 'm':14.0269, 'p':79.9799}
        local_motif = ""
        modification_list = []
        mod_place = 0
        idx = 0


        while idx < len(motif):
            if motif[idx] == "[":
                local_motif = local_motif + motif[idx + 2]
                local_modification = motif[idx + 2]
                modification_type = motif[idx + 1]
                mod_place = mod_place + 1
                local_diff = modification_dict[modification_type]
                modification_list.append([mod_place, local_modification, local_diff])
                idx = idx + 4
                continue

            else:
                local_motif = local_motif + motif[idx]
                idx = idx + 1
                mod_place = mod_place + 1

        return [local_motif,modification_list]


    def analyze_motif_first(self, motif):
        mod_idx = False
        local_motif = ""
        local_modification = ""
        local_diff = ""
        modification_list = []
        mod_place = 0
        idx = 0
        motif_idx = 0
        while idx < len(motif):
            if motif[idx] == "[":
                local_modification = local_modification + motif[idx - 1]
                mod_place = motif_idx
                mod_idx = True

            if mod_idx == False:
                local_motif = local_motif + motif[idx]
                motif_idx = motif_idx + 1

            while mod_idx:
                local_diff = local_diff + motif[idx + 1]
                if motif[idx + 1] == "]":
                    local_diff = local_diff[:-1]
                    mod_idx = False
                    modification_list.append([mod_place,local_modification,local_diff])
                    local_modification = ""
                    local_diff = ""

                idx = idx + 1
            idx = idx + 1
        # print "local_motif =========================="
        # print local_motif
        # print "modification_list =========================="
        # print modification_list
        return [local_motif,modification_list]


    def call_prosite(self):

        for item in self.motif_and_modification_list:
            print item[0]
            if len(item[0]) > 0:
                self.prosite_result.append(self.prosite_client.search_prosite(item[0]))
                print len(self.prosite_result)
        print self.prosite_result
        return

    def call_uniprot(self, prosite_response):

        for item in prosite_response:
            prosite_dumps = json.dumps(item)
            prosite_json = json.loads(prosite_dumps)
            # pprint(prosite_json)
            for match in prosite_json["matchset"]:
                print match
                print match["sequence_ac"]
                print match["sequence_id"]
                gene = str(match["sequence_id"]).split("_")[0]
                if gene not in self.unique_genes:
                    self.unique_genes.append(gene)
                protein = match["sequence_ac"]
                self.uniprot_result.append(self.uniprot_client.search_uniprot(protein))

        for item in self.uniprot_result:
            if item[0] not in self.unique_protein:
                self.unique_protein.append(item[0])
            print "uniprot_result"
            print item
        print "unique_proteins"
        print len(self.unique_protein)
        print self.unique_protein
        print "unique_genes"
        print len(self.unique_genes)
        print self.unique_genes
        return

    def query_gene_sequence(self):
        f = open('resources/ZC3HC1.txt', "r")
        text = f.read()
        print text
        print text[80:90]
        print text[391:401]
        print text[390:400]
        # with open('resources/ZC3HC1.txt', 'a') as input_file:
        #     print str(input_file)

        return


    def call_harmonizome(self):
        with open('resources/SWATH_protein.csv') as csvfile:
            reader = csv.reader(csvfile, delimiter='\t')
            first_line = True
            self.harmonize_genes = []

            iter = 0
            for row in reader:
                if first_line:
                    first_line = False
                    continue
                #print iter
                #print row

                iter += 1
                gene = self.harmonizome_client.search_harmonizome(row[0])
                if gene not in self.harmonize_genes:
                    self.harmonize_genes.append(gene)
                else:
                    print iter
                    print row

        # for item in self.uniprot_result:
        #     if item[0] not in self.unique_protein:
        #         self.unique_protein.append(item[0])
        #     print "uniprot_result"
        #     print item
        # print "unique_proteins"
        # print len(self.unique_protein)
        # print self.unique_protein
        # print "unique_genes"
        # print len(self.unique_genes)
        # print self.unique_genes
        print "self.harmonize_genes"
        print self.harmonize_genes
        print len(self.harmonize_genes)
        with open('output/harmonizome_genes.txt', "w") as output_file:
            for x in range(0, len(self.harmonize_genes)):
                output_file.write(self.harmonize_genes[x])
                output_file.write("\n")
        return

    def call_enrichr(self, gene_list):
        self.enrichr_client = EnrichrClient(self._config_data["pathway_library"], "kinase_pertubation_info", "enrichment_results")
        gene_id_list = self.enrichr_client.obtain_client_id(gene_list)
        self.enrichr_client.print_gene_list(gene_id_list)
        self.network = self.enrichr_client.obtain_network(gene_id_list)
        self.enrichr_client.download_network(gene_id_list)
        print "Network"
        print self.network
        self.pathway_networks = self.network[self._config_data["pathway_library"]]
        print len(self.pathway_networks)
        for item in self.pathway_networks:
            if item[1] not in self.pathway_list:
                self.pathway_list.append(item[1])
            for gene in item[5]:
                self.gene_to_pathway_list.append([gene,item[1]])
        print self.pathway_list
        print len(self.pathway_list)
        print self.gene_to_pathway_list
        print len(self.gene_to_pathway_list)
        return

    def call_flask(self, gene_list, pathway_list, gene_to_pathway_list):
        self.flask_client = FlaskClient(gene_list, pathway_list, gene_to_pathway_list)
        self.flask_client.plp_app.run()
        return




    def call_psimod(self):

        item_num = -1
        for item in self.motif_and_modification_list:
            item_num = item_num + 1
            psimod_num = -1
            for psimod in item[1]:
                psimod_num = psimod_num + 1
                with open('plp/resources/psi-mod/mapping.csv') as csvfile:
                    reader = csv.reader(csvfile, delimiter='\t')
                    diff = 10000
                    first_line = True
                    # print "psimod"
                    # print psimod[1], '--', psimod[2]  # , '--',row[2], '--',row[3]
                    local_psimod = []
                    local_similar_psimod = []
                    similar = 0
                    for row in reader:
                        if first_line:
                            first_line = False
                            continue
                        #print "row"
                        #print row[0], '--',row[1], '--',row[2]

                        local_diff = self.extract_diff(row[2],psimod[2])
                        #print str(psimod[1]), str(row[1]), str(psimod[1]) == str(row[1])
                        if str(psimod[1]) == str(row[1]) and local_diff < diff:
                            diff = local_diff
                            local_psimod = []
                            local_similar_psimod = []
                            local_psimod.append(row)

                            similar = 0
                            continue
                        if psimod[1] == row[1] and local_diff == diff:
                            local_similar_psimod.append(row)
                            similar = similar + 1

                    if diff < 1:
                        self.motif_and_modification_list[item_num][1][psimod_num].append(local_psimod[0][0])
                        self.psimod_result.append([local_psimod,similar,local_similar_psimod, psimod[1], psimod[2]])
                    else:
                        self.motif_and_modification_list[item_num][1][psimod_num].append(" ")
                        self.psimod_result.append(["'Modification not found in database' ", 0 , " ", psimod[1], psimod[2]])

        # print "self.psimod_result"
        # print self.psimod_result
        return self.psimod_result

    def extract_diff(self, idx1,idx2):
        return abs(float(idx1) - float(idx2))

    def print_to_file(self, motif_list, prosite_response, psimod_response):
        with open('output/plp_format_output.txt', "w") as output_file:
            for x in range(0, len(prosite_response)):
                output_file.write(self.motifs_data[x])
                output_file.write(" -> ")
                # output_file.write(motif_list[x][0])
                # output_file.write(" : ")
                #output_file.write(str(prosite_response[x]))
                output_inchlike = "PLN=ver1:InChl-like/r="
                n_match = prosite_response[x].get('n_match')
                matches = prosite_response[x].get('matchset')

                # uniprot ++++++++++++++++++++++++++++++++++++++++++++
                flag = 0
                for match in range(0, n_match):
                    # print matches[match]
                    # print "+++++++++"
                    output_inchlike = output_inchlike + "uniprot:" + matches[match].get("sequence_ac")+ ";"
                    flag = 1
                if flag == 1:
                    output_inchlike = output_inchlike[:-1]

                # hugo +++++++++++++++++++++++++++++++++++++++++++++++
                flag = 0
                output_inchlike = output_inchlike + "/s="
                for match in range(0, n_match):
                    output_inchlike = output_inchlike + "hugo:" + matches[match].get("sequence_id") + ";"
                    flag = 1
                if flag == 1:
                    output_inchlike = output_inchlike[:-1]

                # MOD +++++++++++++++++++++++++++++++++++++++++++++++
                output_inchlike = output_inchlike + "/d=/v=/m="
                flag = 0
                for match in range(0, n_match):
                    for modification in range(0, len(self.motif_and_modification_list[x][1])):
                        flag = 1
                        # print modification
                        start = matches[match].get("start")
                        # print start
                        # print int(self.motif_and_modification_list[x][1][modification][0])
                        position = start -1 + int(self.motif_and_modification_list[x][1][modification][0])
                        # print position
                        # print self.motif_and_modification_list[x][1][modification][3]
                        output_inchlike = output_inchlike + self.motif_and_modification_list[x][1][modification][3] + \
                                          "@" +  str(position) + ";"
                if flag == 1:
                    output_inchlike = output_inchlike[:-1]

                output_inchlike = output_inchlike + "#"

                #output_file.write("\n------------------\n")
                output_file.write(output_inchlike)
                output_file.write("\n")
        output_file.close()

        with open('output/modification_output.txt', "w") as output_file:
            for y in range(0, len(psimod_response)):
                output_file.write("\nModification : %s[%s]\n" %(str(psimod_response[y][3]), str(psimod_response[y][4])))
                output_file.write(str(psimod_response[y][0]))
                output_file.write("\nNumber of similars : \n")
                output_file.write(str(psimod_response[y][1]))
                output_file.write("\nSimilar : \n")
                for similar in psimod_response[y][2]:
                    output_file.write(str(similar))
                    output_file.write("\n")
                output_file.write("\n-------------------\n")
        output_file.close()

        with open('output/amino_acid_output.txt', "w") as output_file:
            for item in self.uniprot_result:
                output_file.write("Protein : ")
                output_file.write(item[0])
                output_file.write("     Length : ")
                output_file.write(item[1])
                output_file.write("\n")
                output_file.write("Sequence : \n")
                for y in range(0, int(item[1])):
                    output_file.write("*")
                output_file.write("\n")
                output_file.write(item[2])
                output_file.write("\n-------------------\n")
        output_file.close()

        return




    def read_write_kinase_file(self):
        with open('resources/Kinase_Substrate_Dataset.csv') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')

            first_line = True
            geneName2KinaseName = {}
            gene2Kinase = {}
            kinase2Gene = {}
            for row in reader:
                if first_line:
                    first_line = False
                    continue
                if row[3] == "human" and row[8] == "human":
                    #kinase2Genes
                    gene = str(row[0]).upper()
                    kinase = str(row[1]).upper()
                    toGene = str(row[7]).upper()
                    if gene not in kinase2Gene.keys():
                        kinase2Gene[gene] = []
                        kinase2Gene.get(gene).append(toGene)
                    else:
                        if toGene not in kinase2Gene.get(gene):
                            kinase2Gene.get(gene).append(toGene)

                    #geneName2kinaseName
                    if gene not in geneName2KinaseName.keys():
                        geneName2KinaseName[gene] = kinase

                    #gene2Kinase
                    if toGene not in gene2Kinase.keys():
                        gene2Kinase[toGene] = []
                        if gene != toGene:
                            gene2Kinase.get(toGene).append(gene)
                    else:
                        if gene not in gene2Kinase.get(toGene):
                            # because this relation already exists in kinase2gene
                            if gene != toGene:
                                gene2Kinase.get(toGene).append(gene)

                    #print row[0], '--',row[1], '--',row[2]
                #print gene2Kinase
            json.dump(gene2Kinase, open("resources/gene2Kinase_human.json", 'w'))
            json.dump(kinase2Gene, open("resources/kinase2Gene_human.json", 'w'))
            json.dump(geneName2KinaseName, open("resources/geneName2KinaseName_human.json", 'w'))


    def find_nonhuman_kinase_file(self):
        with open('resources/Kinase_Substrate_Dataset.csv') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            first_line = True
            non_human_peptide = []
            for row in reader:
                if first_line:
                    first_line = False
                    continue
                if row[3] != "human" or row[8] != "human":
                    non_human_peptide.append(row[16])

            with open('resources/non_human_peptide.csv', 'wb') as f:
                writer = csv.writer(f)
                for val in non_human_peptide:
                    writer.writerow([val])

            # entries = non_human_peptide;
            # writer = csv.writer(open("resources/non_human_peptide.csv", 'w'))
            # writer.writerow(entries)
            # for row in non_human_peptide:
            #     writer.writerow(row)

        return



    def merge_kinase_files(self):
        """This method is for merging two csv files"""

        file2 = open('resources/Kinase_Substrate_Dataset_merged.csv', 'wb')

        writer = csv.writer(file2)

        with open('resources/non_human_peptide_edited.csv') as csvfile_flag:
            falg_reader = csv.reader(csvfile_flag, delimiter=',')


            with open('resources/Kinase_Substrate_Dataset.csv') as csvfile:
                reader = csv.reader(csvfile, delimiter=',')

                row0 = reader.next()
                row0.append('matched_peptide')
                row0.append('flag')
                writer.writerow(row0)
                for row in reader:
                    if (row[3] == "human" and row[8] == "human"):
                        row.append(row[16])
                        row.append(1)
                    else:
                        flag_row = falg_reader.next()
                        row.append(flag_row[2])
                        row.append(flag_row[3])
                    #
                    #     flag_row = falg_reader.next()

                    writer.writerow(row)

        #print row

















    def preprocess_read_write_kinase_file(self):
        """preprocess_read_write_kinase_file method is for preprocessing the phosphositeplus site table
        First the list of non-human peptides in the table is found and then this list is preprocessed in
        the eh3.uc.edu/plp then a file at "resources/non_human_peptide_edited.csv" is provided with flag "1"
        for human peptides and "0" for animal peptides. Then this csv file along with the "Kinase_Substrate_Dataset.csv"
        is used to generate a couple of files.

        1- json.dump(gene2Kinase, open("resources/gene2Kinase_human.json", 'w')):
        human gene to kinase


        2- json.dump(kinase2Gene, open("resources/kinase2Gene_human.json", 'w'))
        kinase to human gene


        3- json.dump(geneName2KinaseName, open("resources/geneName2KinaseName_human.json", 'w'))
        map between gene name and kinase name

        4- json.dump(gene_meta2Kinase, open("resources/gene2Kinase_human_info.json", 'w'))
        map between gene[p*@*] and kinase for human

        5- json.dump(phospho_amino_probability, open("resources/amino_probability.json", 'w'))
        a probability vector for each gene that might be a target of a kinase for example for each gene phosphorylated
        at * we find the probability of each +-7 site (meaning 20*15, 20 for site position and 15 for total sites) that
        each amino acid might appear.

        """

        geneName2KinaseName = {}
        gene2Kinase = {}
        kinase2Gene = {}
        # with open('resources/non_human_peptide_edited.csv') as csvfile_flag:
        #     falg_reader = csv.reader(csvfile_flag, delimiter=',')
        # flag_iter = 0

        with open('resources/Kinase_Substrate_Dataset_merged.csv') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')


            first_line = True
            gene_meta2Kinase = {}
            total_kinase = 0

            amino_total = []
            amino_probability = [[0.0] * 15*20 for i in range(20)]
            phospho_amino_probability = {}
            phospho_amino_2kinase = {}
            phospho_amino_2kinase_2sequence = {}
            amino_acids = ["A","R","N","D","C","Q","E","G","H","I","L","K","M","F","P","S","T","W","Y","V"]

            # initiate phodpho amino files
            for amino_iter in range(0, len(amino_acids)):
                phospho_amino_probability[amino_acids[amino_iter]] = {}
                phospho_amino_2kinase[amino_acids[amino_iter]] = {}
                phospho_amino_2kinase_2sequence[amino_acids[amino_iter]] = {}
                #amino_probability.append(initial)
                amino_total.append(0.0)



            print phospho_amino_probability
            print phospho_amino_2kinase

            # print amino_probability
            phospho_amino_acids = {"S","T","Y","K","D","H"}
            amino_acids_dic = {"A":0,"R":1,"N":2,"D":3,"C":4,"Q":5,"E":6,"G":7,"H":8,"I":9,"L":10,"K":11,"M":12,"F":13,"P":14,"S":15,"T":16,"W":17,"Y":18,"V":19,"_":-1}
            for row in reader:
                if first_line:
                    first_line = False
                    continue

                total_kinase += 1
                kinase = str(row[1])
                organism = str(row[19])
                kinaseGene = str(row[0]).upper()
                gene = str(row[7]).upper()
                sequence = str(row[11]).upper()
                site = re.findall(r'\d+', str(row[9]))[0]

                amino = re.findall(r'[^\W\d_]', str(row[9]))[0]
                toGene_meta = str(gene + "[P" + amino + "@" + site + "]")
                amino_total[amino_acids_dic[amino]] += 1

                # phospho_amino_2kinase shows how many kinases is attacking amino acids no matter human or animal
                if kinase not in phospho_amino_2kinase.get(amino).keys():
                    phospho_amino_2kinase.get(amino)[kinase] = 1
                else:
                    phospho_amino_2kinase.get(amino)[kinase] += 1

                # phospho_amino_2kinase_2sequence shows the kinases and the sequence of targeted genes no matter human or animal
                if kinase not in phospho_amino_2kinase_2sequence.get(amino).keys():
                    phospho_amino_2kinase_2sequence.get(amino)[kinase] = []
                    phospho_amino_2kinase_2sequence.get(amino)[kinase].append([organism,sequence])
                else:
                    phospho_amino_2kinase_2sequence.get(amino)[kinase].append([organism, sequence])

                # initial and then complete probability_vector for each line
                probability_vector = [0.0]*15*20

                for char_iter in range(0, len(sequence)):
                    char = sequence[char_iter]
                    #print char
                    if char != "_":
                        char_dic = amino_acids_dic[char]
                        probability_vector[char_iter*20 + char_dic] += 1

                # add the probability_vector to each amino acid/kinase map
                if kinase not in phospho_amino_probability.get(amino).keys():
                    phospho_amino_probability.get(amino)[kinase] = probability_vector
                else:
                    for item_iter in range(0, 20 * 15):
                        phospho_amino_probability.get(amino)[kinase][item_iter] += probability_vector[item_iter]
                    #for pr_iter in range(15*20):


                if (row[18] == "1"):

                    # Generate kinase2Gene and kinase2Gene files that maps gene to kinases or vice versa for human
                    if kinaseGene not in kinase2Gene.keys():
                        kinase2Gene[kinaseGene] = []
                        kinase2Gene.get(kinaseGene).append(gene)
                    else:
                        # There might be an existing gene in this list, thus ->
                        if gene not in kinase2Gene.get(kinaseGene):
                            kinase2Gene.get(kinaseGene).append(gene)

                    #geneName2kinaseName
                    if kinaseGene not in geneName2KinaseName.keys():
                        geneName2KinaseName[kinaseGene] = kinase

                    #gene2Kinase
                    if gene not in gene2Kinase.keys():
                        gene2Kinase[gene] = []
                        if kinaseGene != gene:
                            gene2Kinase.get(gene).append(kinaseGene)
                    else:
                        if kinaseGene not in gene2Kinase.get(gene):
                            # because this relation already exists in kinase2gene
                            if kinaseGene != gene:
                                gene2Kinase.get(gene).append(kinaseGene)




                    # Generate gene_meta2Kinase file that maps gene[p*@*] to kinases
                    if toGene_meta not in gene_meta2Kinase.keys():
                        gene_meta2Kinase[toGene_meta] = []
                        gene_meta2Kinase.get(toGene_meta).append(kinase)
                    else:
                        if kinase not in gene_meta2Kinase.get(toGene_meta):
                            gene_meta2Kinase.get(toGene_meta).append(kinase)

            # for site_key in amino_probability.keys():
            #     print site_key, amino_total[site_key]
            #print gene_meta2Kinase
            # print amino_probability[13]
            #
            # print amino_probability[14]
            #
            # print amino_probability[15]


            # for site_key in amino_probability.keys():
            #     print site_key, "-----------------------\n"
            #     for item_iter in range(0,20*15):
            #         print amino_probability[site_key][item_iter],





            # Devide the number of amino probability by the total number of repeatation of specific amino and kinase pairs
            print phospho_amino_probability.get("H")
            #print amino_probability
            print "total_kinase"
            print total_kinase
            #print phospho_amino_probability
            #print phospho_amino_2kinase


            # Devide the number of amino probability by the total number of repeatation of specific amino and kinase pairs
            for key in phospho_amino_2kinase.keys():
                num = 0
                #print key
                for kin in phospho_amino_2kinase[key]:
                    #print kin
                    for iter in range(15*20):
                        phospho_amino_probability[key][kin][iter] /= phospho_amino_2kinase[key][kin]
                    num += phospho_amino_2kinase[key][kin]
                #print key, num
            print amino_total
            #print phospho_amino_probability.get("H")
            print "phospho_amino_2kinase_2sequence"
            print phospho_amino_2kinase_2sequence

            json.dump(gene2Kinase, open("resources/gene2Kinase_human.json", 'w'))
            json.dump(kinase2Gene, open("resources/kinase2Gene_human.json", 'w'))
            json.dump(geneName2KinaseName, open("resources/geneName2KinaseName_human.json", 'w'))
            json.dump(gene_meta2Kinase, open("resources/gene2Kinase_human_info.json", 'w'))
            json.dump(phospho_amino_probability, open("resources/amino_probability.json", 'w'))
            json.dump(phospho_amino_2kinase_2sequence, open("resources/kinase_2gene_2sequence.json", 'w'))


    def preprocess_read_write_kinase_file(self):
        """preprocess_read_write_kinase_file method is for preprocessing the phosphositeplus site table
        First the list of non-human peptides in the table is found and then this list is preprocessed in
        the eh3.uc.edu/plp then a file at "resources/non_human_peptide_edited.csv" is provided with flag "1"
        for human peptides and "0" for animal peptides. Then this csv file along with the "Kinase_Substrate_Dataset.csv"
        is used to generate a couple of files.

        1- json.dump(gene2Kinase, open("resources/gene2Kinase_human.json", 'w')):
        human gene to kinase


        2- json.dump(kinase2Gene, open("resources/kinase2Gene_human.json", 'w'))
        kinase to human gene


        3- json.dump(geneName2KinaseName, open("resources/geneName2KinaseName_human.json", 'w'))
        map between gene name and kinase name

        4- json.dump(gene_meta2Kinase, open("resources/gene2Kinase_human_info.json", 'w'))
        map between gene[p*@*] and kinase for human

        5- json.dump(phospho_amino_probability, open("resources/amino_probability.json", 'w'))
        a probability vector for each gene that might be a target of a kinase for example for each gene phosphorylated
        at * we find the probability of each +-7 site (meaning 20*15, 20 for site position and 15 for total sites) that
        each amino acid might appear.

        """

        geneName2KinaseName = {}
        gene2Kinase = {}
        kinase2Gene = {}
        # with open('resources/non_human_peptide_edited.csv') as csvfile_flag:
        #     falg_reader = csv.reader(csvfile_flag, delimiter=',')
        # flag_iter = 0

        with open('resources/Kinase_Substrate_Dataset_merged.csv') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')


            first_line = True
            gene_meta2Kinase = {}
            total_kinase = 0

            amino_total = []
            amino_probability = [[0.0] * 15*20 for i in range(20)]
            phospho_amino_probability = {}
            phospho_amino_2kinase = {}
            phospho_amino_2kinase_2sequence = {}
            amino_acids = ["A","R","N","D","C","Q","E","G","H","I","L","K","M","F","P","S","T","W","Y","V"]

            # initiate phodpho amino files
            for amino_iter in range(0, len(amino_acids)):
                phospho_amino_probability[amino_acids[amino_iter]] = {}
                phospho_amino_2kinase[amino_acids[amino_iter]] = {}
                phospho_amino_2kinase_2sequence[amino_acids[amino_iter]] = {}
                #amino_probability.append(initial)
                amino_total.append(0.0)



            print phospho_amino_probability
            print phospho_amino_2kinase

            # print amino_probability
            phospho_amino_acids = {"S","T","Y","K","D","H"}
            amino_acids_dic = {"A":0,"R":1,"N":2,"D":3,"C":4,"Q":5,"E":6,"G":7,"H":8,"I":9,"L":10,"K":11,"M":12,"F":13,"P":14,"S":15,"T":16,"W":17,"Y":18,"V":19,"_":-1}
            for row in reader:
                if first_line:
                    first_line = False
                    continue

                total_kinase += 1
                kinase = str(row[1])
                organism = str(row[19])
                kinaseGene = str(row[0]).upper()
                gene = str(row[7]).upper()
                sequence = str(row[11]).upper()
                site = re.findall(r'\d+', str(row[9]))[0]

                amino = re.findall(r'[^\W\d_]', str(row[9]))[0]
                toGene_meta = str(gene + "[P" + amino + "@" + site + "]")
                amino_total[amino_acids_dic[amino]] += 1

                # phospho_amino_2kinase shows how many kinases is attacking amino acids no matter human or animal
                if kinase not in phospho_amino_2kinase.get(amino).keys():
                    phospho_amino_2kinase.get(amino)[kinase] = 1
                else:
                    phospho_amino_2kinase.get(amino)[kinase] += 1

                # phospho_amino_2kinase_2sequence shows the kinases and the sequence of targeted genes no matter human or animal
                if kinase not in phospho_amino_2kinase_2sequence.get(amino).keys():
                    phospho_amino_2kinase_2sequence.get(amino)[kinase] = []
                    phospho_amino_2kinase_2sequence.get(amino)[kinase].append([organism,sequence])
                else:
                    phospho_amino_2kinase_2sequence.get(amino)[kinase].append([organism, sequence])

                # initial and then complete probability_vector for each line
                probability_vector = [0.0]*15*20

                for char_iter in range(0, len(sequence)):
                    char = sequence[char_iter]
                    #print char
                    if char != "_":
                        char_dic = amino_acids_dic[char]
                        probability_vector[char_iter*20 + char_dic] += 1

                # add the probability_vector to each amino acid/kinase map
                if kinase not in phospho_amino_probability.get(amino).keys():
                    phospho_amino_probability.get(amino)[kinase] = probability_vector
                else:
                    for item_iter in range(0, 20 * 15):
                        phospho_amino_probability.get(amino)[kinase][item_iter] += probability_vector[item_iter]
                    #for pr_iter in range(15*20):


                if (row[18] == "1"):

                    # Generate kinase2Gene and kinase2Gene files that maps gene to kinases or vice versa for human
                    if kinaseGene not in kinase2Gene.keys():
                        kinase2Gene[kinaseGene] = []
                        kinase2Gene.get(kinaseGene).append(gene)
                    else:
                        # There might be an existing gene in this list, thus ->
                        if gene not in kinase2Gene.get(kinaseGene):
                            kinase2Gene.get(kinaseGene).append(gene)

                    #geneName2kinaseName
                    if kinaseGene not in geneName2KinaseName.keys():
                        geneName2KinaseName[kinaseGene] = kinase

                    #gene2Kinase
                    if gene not in gene2Kinase.keys():
                        gene2Kinase[gene] = []
                        if kinaseGene != gene:
                            gene2Kinase.get(gene).append(kinaseGene)
                    else:
                        if kinaseGene not in gene2Kinase.get(gene):
                            # because this relation already exists in kinase2gene
                            if kinaseGene != gene:
                                gene2Kinase.get(gene).append(kinaseGene)




                    # Generate gene_meta2Kinase file that maps gene[p*@*] to kinases
                    if toGene_meta not in gene_meta2Kinase.keys():
                        gene_meta2Kinase[toGene_meta] = []
                        gene_meta2Kinase.get(toGene_meta).append(kinase)
                    else:
                        if kinase not in gene_meta2Kinase.get(toGene_meta):
                            gene_meta2Kinase.get(toGene_meta).append(kinase)

            # for site_key in amino_probability.keys():
            #     print site_key, amino_total[site_key]
            #print gene_meta2Kinase
            # print amino_probability[13]
            #
            # print amino_probability[14]
            #
            # print amino_probability[15]


            # for site_key in amino_probability.keys():
            #     print site_key, "-----------------------\n"
            #     for item_iter in range(0,20*15):
            #         print amino_probability[site_key][item_iter],





            # Devide the number of amino probability by the total number of repeatation of specific amino and kinase pairs
            print phospho_amino_probability.get("H")
            #print amino_probability
            print "total_kinase"
            print total_kinase
            #print phospho_amino_probability
            #print phospho_amino_2kinase


            # Devide the number of amino probability by the total number of repeatation of specific amino and kinase pairs
            for key in phospho_amino_2kinase.keys():
                num = 0
                #print key
                for kin in phospho_amino_2kinase[key]:
                    #print kin
                    for iter in range(15*20):
                        phospho_amino_probability[key][kin][iter] /= phospho_amino_2kinase[key][kin]
                    num += phospho_amino_2kinase[key][kin]
                #print key, num
            print amino_total
            #print phospho_amino_probability.get("H")
            print "phospho_amino_2kinase_2sequence"
            print phospho_amino_2kinase_2sequence

            json.dump(gene2Kinase, open("resources/gene2Kinase_human.json", 'w'))
            json.dump(kinase2Gene, open("resources/kinase2Gene_human.json", 'w'))
            json.dump(geneName2KinaseName, open("resources/geneName2KinaseName_human.json", 'w'))
            json.dump(gene_meta2Kinase, open("resources/gene2Kinase_human_info.json", 'w'))
            json.dump(phospho_amino_probability, open("resources/amino_probability.json", 'w'))
            json.dump(phospho_amino_2kinase_2sequence, open("resources/kinase_2gene_2sequence.json", 'w'))




    def process_P100_GCT_file_for_signature_modified(self):
        """process_P100_GCT_file method is for concatenating and averaging duplicates in P100 GCT file
        """

        geneName2KinaseName = {}
        gene2Kinase = {}
        kinase2Gene = {}
        # with open('resources/non_human_peptide_edited.csv') as csvfile_flag:
        #     falg_reader = csv.reader(csvfile_flag, delimiter=',')
        # flag_iter = 0


        P100_data = pd.read_csv('resources/pilincs/P100.csv', sep=',', header=None)
        print P100_data.shape
        #print P100_data[0]
        print P100_data[0][5]
        print P100_data[10][5]
        colIter = 0
        unique = {}
        unique_complete = {}
        unique_complete_modified = {}
        #constituting the unique tuples
        for column in range (10,P100_data.shape[1]):
            #print (column)
            identifier = str(P100_data[column][10])  +"+"+str(P100_data[column][3])  +"+"+ str(P100_data[column][7]) +"+"+ str(P100_data[column][11])
            identifier_complete = str(P100_data[column][3]) +"+"+ str(P100_data[column][7]) +"+"+ \
                                  str(P100_data[column][9])+"+"+ str(P100_data[column][10])+"+"+ \
                                  str(P100_data[column][11])+"+"+ str(P100_data[column][13])+"+"\
                                  + str(P100_data[column][14])+"+"+\
                                  str(P100_data[column][15])+"+"+ str(P100_data[column][16])
            #print identifier

            if identifier_complete not in unique_complete:
                unique_complete[identifier_complete] = []
                unique_complete.get(identifier_complete).append(column)
            else:
                unique_complete.get(identifier_complete).append(column)


            if identifier not in unique:
                unique[identifier] = []
                unique.get(identifier).append(column)
            else:
                unique.get(identifier).append(column)

        for key in unique_complete:

            val = unique_complete.get(key)
            item = list(val)
            if len(item) > 1 :
                key_list = key.split('+')
                if "Disruption" not in key_list:
                    unique_complete_modified[key] = val


        #print unique_complete_modified

        total = 0
        total_complete = 0

        #print unique.
        print "size of unique"

        print len(unique)

        print "size of unique_complete"

        print len(unique_complete)

        print "size of unique_complete_modified"

        print len(unique_complete_modified)
        # for ite in range (0,len(unique)):
        #
        #     print unique.keys()[ite]
        #
        #     print unique_complete.keys()[ite]

        unique_sum = {}
        unique_sum_modified = {}
        unique_pvalue = {}

        # print unique_complete
        # for iterator in range(len(unique)):
        #     key1 =


        for key in unique:
            val = unique.get(key)
            #print key
            item = list(val)
            total += len(item)
            #print len(item)
        keyIter = 0

        for key in unique_complete:
            initial3 = [0.0]*96

            unique_sum[key] = initial3
            val = unique_complete.get(key)
            item = list(val)
            total_complete += len(item)
            keyIter += 1
        print "Total"
        print total
        print "total_complete"
        print total_complete
        keyIter = 0
        for key in unique_complete_modified:
            initial = [0.0]*96
            initial2 = [0.0] * 96
            unique_sum_modified[key] = initial
            unique_pvalue[key] = initial2
            val = unique_complete_modified.get(key)

            item = list(val)
            if len(item) == 1:
                print '111111   %d  =========== %s %s' % (keyIter, key, val)

            keyIter += 1
            print '%d , %s, %s' %(keyIter, key, val)

            for item_iter in range(0, 96):

                aux_list = []
                for col in item:
                    aux_list.append(float(P100_data[col][item_iter + 17]))
                    unique_sum_modified.get(key)[item_iter] += float(P100_data[col][item_iter + 17])
                unique_sum_modified.get(key)[item_iter] /= float(len(item))

                meanValue = np.mean(aux_list)
                average = sum(aux_list) / len(aux_list)
                if len(aux_list) > 1:
                    variance2 = sum((average - value) ** 2 for value in aux_list) / (len(aux_list)-1)

                #variance = np.var(aux_list)

                # print aux_list
                #t_stat = meanValue/np.sqrt(variance/float(len(item)))
                t_stat2 = meanValue / np.sqrt(variance2 / float(len(item)))
                #p_val = stats.t.sf(abs(t_stat), len(item)-1)*2
                p_val2 = stats.t.sf(abs(t_stat2), len(item) - 1) * 2
                if keyIter == 81:
                    print '--------------- %d' %len(item)
                    print aux_list
                    print '%d , %d , %s,  %s, %f, %f, %f, %f'%(item_iter, keyIter, key, val, meanValue, variance2, t_stat2, p_val2)


                unique_pvalue.get(key)[item_iter] = p_val2



        for key in unique_complete:

            val = unique_complete.get(key)
            item = list(val)
            for col in item:

                for item_iter in range(0, 96):
                    unique_sum.get(key)[item_iter] += float(P100_data[col][item_iter + 17])
                unique_sum.get(key)[item_iter] /= float(len(item))

        #print unique_sum
        #This is a test
        for key in unique_complete:
            # print "key"
            # print key
            val = unique_complete.get(key)
            # print "val"
            # print val
            value1 = 0.0
            value2 = 0.0
            items = list(val)
            for item in items:
                #print item
                value1 += float(P100_data[item][17])
                value2 += float(P100_data[item][17 + 95])
            length = len(items)
            value1 /= float(length)
            value2 /= float(length)


            # print "values"
            # print value1
            # print unique_sum.get(key)[0]
            # print value2
            # print unique_sum.get(key)[95]

        #Constitute columns
        #first col
        first_col = []
        first_col.append("")
        first_col.append("LINCS_UNIQUE_ID")
        first_col.append(str(P100_data[0][3]))
        first_col.append(str(P100_data[0][7]))
        first_col.append(str(P100_data[0][9]))
        first_col.append(str(P100_data[0][10]))
        first_col.append(str(P100_data[0][11]))
        first_col.append(str(P100_data[0][13]))
        first_col.append(str(P100_data[0][14]))
        first_col.append(str(P100_data[0][15]))
        first_col.append(str(P100_data[0][16]))
        for i in range(0,96):
            first_col.append(str(P100_data[0][17+i]))

        x1 = np.array(first_col)
        x2 = x1[:, np.newaxis]
        my_data_final = np.asarray(x2)


        print my_data_final.shape
        #second to 10th col
        for col in range(1,10):
            ith_col = []
            ith_col.append(str(P100_data[col][2]))
            ith_col.append(str(""))
            ith_col.append(str(""))
            ith_col.append(str(""))
            ith_col.append(str(""))
            ith_col.append(str(""))
            ith_col.append(str(""))
            ith_col.append(str(""))
            ith_col.append(str(""))
            ith_col.append(str(""))
            ith_col.append(str(""))
            for i in range(0,96):
                ith_col.append(str(P100_data[col][17+i]))

            x1 = np.array(ith_col)
            x2 = x1[:, np.newaxis]
            col_data_final = np.asarray(x2)
            my_data_final = np.hstack((my_data_final, col_data_final))


        # print my_data_final
        # print my_data_final.shape
        np.savetxt("resources/pilincs/processed_data.csv", my_data_final, delimiter=",", fmt="%s")

        my_data_con = my_data_final

        global_iter = 1

        # Add shorthand notation column to the table
        ith_col = []
        ith_col.append(str("ShortHand"))
        ith_col.append(str(""))
        ith_col.append(str(""))
        ith_col.append(str(""))
        ith_col.append(str(""))
        ith_col.append(str(""))
        ith_col.append(str(""))
        ith_col.append(str(""))
        ith_col.append(str(""))
        ith_col.append(str(""))
        ith_col.append(str(""))

        # This is for generating the shorthand notation
        for i in range(0, 96):
            site = re.findall(r'\d+', str(P100_data[7][17 + i]))[0]

            amino = re.findall(r'[^\W\d_]', str(P100_data[7][17 + i]))[0]
            # print("%d ========================  " % (i+12))
            # print("%s %s  " % (site, amino))

            filter1 = re.compile("\b[+80]\b")
            peptide = str(P100_data[8][17 + i])
            # phospho_place = re.search("[+80]", peptide).start()
            # print phospho_place
            # phospho_place = re.search(r"\b[+80]\b", peptide).pos
            phospho_sign = "p"
            match = re.search(r'80', peptide)
            #print match
            if match == None:
                phospho_sign = "x"
                match = re.search(r'122', peptide)
            phospho_place = match.start()


            # print phospho_place
            # phospho_place = re.search(r"\b[+80]\b", peptide).start()
            # print phospho_place
            mod_place1 = [(m.start(0), m.end(0)) for m in re.finditer("\[", peptide)]
            mod_place2 = [(m.start(0), m.end(0)) for m in re.finditer("\]", peptide)]
            # print mod_place1
            # print mod_place2
            # print phospho_place
            modification = ""
            place = int(site)
            site_list = []
            iterator = 0
            for mod_item in mod_place1:
                site_list.append(mod_item[1])

                if mod_item[1] == phospho_place - 1:
                    p_place = iterator
                iterator += 1
            # print "==============================================="
            # print site_list
            # print p_place
            offset = 0
            offset_list = [0]
            for j in range (1, len(mod_place1)):
                offset += (mod_place2[j-1][0] - mod_place1[j-1][0]) + 1
                offset_list.append(offset)
                site_list[j] -= offset


            site_list_before = []
            for item in  site_list:
                site_list_before.append(item)
            for j in range(0, len(mod_place1)):
                site_list[j] += int(site) - site_list_before[p_place]


            #print "==============================================="
            #print site_list
            item_iter = 0
            for mod_item in mod_place1:
                amino_mod = peptide[mod_item[0]-1]
                # print "---------------"
                # print phospho_place
                # print mod_item[0]
                # print mod_item[1]
                place = site_list[item_iter]
                item_iter += 1
                if mod_item[1] != phospho_place - 1:
                    modification += "[x" + amino_mod + "@" + str(place) + "]"
                else:
                    modification += "[" + phospho_sign + amino + "@" + str(place) + "]"

            gene = str(P100_data[2][17 + i])
            shortthand = gene + modification
            ith_col.append(shortthand)

        key_arr1 = np.array(ith_col)
        #This is for making data n by 1 instead of 1 by n
        col_data = key_arr1[:, np.newaxis]

        my_data_con = np.hstack((my_data_con, col_data))
        my_data_con2 = my_data_con
        my_data_con3 = my_data_con
        my_pvalue_con = my_data_con2
        my_data_modified_con = my_data_con3

        # this part is to convert values to n by 1 vector to be concatenated to the final csv file

        global_iter = 1
        for i in range(0,len(unique_sum)):

            key_list = unique_sum.keys()[i].split('+')

            # print key_list
            key_list1 = []
            key_list1.append("")
            key_list1.append("LINCSTP_" + str("%04d" % (global_iter,)) )
            global_iter += 1
            for list_member in key_list:
                key_list1.append(list_member)
            #change list to array
            key_arr1 = np.array(key_list1)
            # This is for making data n by 1 instead of 1 by n
            key_arr2 = key_arr1[:, np.newaxis]
            x1 = np.array(unique_sum.values()[i])
            x2 = x1[:, np.newaxis]

            my_data = np.asarray(x2)
            col_data = np.vstack((key_arr2, my_data))

            my_data_con = np.hstack((my_data_con, col_data))


        print "my_data.shape"
        print my_data_con.shape


        np.savetxt("resources/pilincs/P100_processed.csv", my_data_con, delimiter=",", fmt="%s")

        global_iter = 1
        for i in range(0,len(unique_sum_modified)):
            sum_key = unique_sum_modified.keys()[i]
            key_list = unique_sum_modified.keys()[i].split('+')

            # print key_list
            key_list1 = []
            key_list1.append("")
            key_list1.append("LINCSTP_" + str("%04d" % (global_iter,)) )
            global_iter += 1
            for list_member in key_list:
                key_list1.append(list_member)
            #change list to array
            key_arr1 = np.array(key_list1)
            # This is for making data n by 1 instead of 1 by n
            key_arr2 = key_arr1[:, np.newaxis]
            x1 = np.array(unique_sum_modified.values()[i])
            x2 = x1[:, np.newaxis]

            my_data = np.asarray(x2)
            col_data = np.vstack((key_arr2, my_data))

            # Repeating for p-values
            x3 = np.array(unique_pvalue.get(sum_key))
            x4 = x3[:, np.newaxis]

            my_data_pvalue = np.asarray(x4)
            col_data_pvalue = np.vstack((key_arr2, my_data_pvalue))


            my_data_modified_con = np.hstack((my_data_modified_con, col_data))
            my_pvalue_con = np.hstack((my_pvalue_con, col_data_pvalue))

        print "my_data_modified.shape"
        print my_data_modified_con.shape

        print "my_pvalue.shape"
        print my_data_modified_con.shape

        np.savetxt("resources/pilincs/P100_processed_modified.csv", my_data_modified_con, delimiter=",", fmt="%s")
        np.savetxt("resources/pilincs/P100_pvalues_modified.csv", my_pvalue_con, delimiter=",", fmt="%s")






    def process_P100_GCT_file_for_perturbagen(self):
        """process_P100_GCT_file_for_perturbagen method is for concatenating and averaging duplicates in P100 GCT file
           and identify unique perturbagens to be used in lincs-proteomics-landing page
           To generate this file you should first generate the P100_processed.csv file
        """

        P100_data = pd.read_csv('resources/pilincs/P100_processed.csv', sep=',', header=None)
        print P100_data.shape
        #print P100_data[0]
        print P100_data[0][5]
        print P100_data[11][5]
        colIter = 0
        unique = {}
        #unique_complete = {}
        #constituting the unique tuples
        for column in range (11,P100_data.shape[1]):

            #print (column)
            pertName = str(P100_data[column][5])



            if pertName not in unique:
                unique[pertName] = []
                unique.get(pertName).append(column)
            else:
                unique.get(pertName).append(column)




        total = 0
        total_complete = 0
        #print unique.
        print "size of unique"

        print len(unique)

        for key in unique:
            val = unique.get(key)

            print key
            item = list(val)
            print item
            total += len(item)
            #print len(item)

        print "total"

        print total

        pertJson = {}
        uniquePert = []
        for key in unique:
            id = 0

            uniquePert.append(key)
            pertData = []
            pertId = []
            pertAnnotation = []
            pertPeptide = []

            for pepIter in range(0,96):
                pertPeptide.append(P100_data[8][11+pepIter] + " / "+P100_data[9][11+pepIter] +" / "+P100_data[2][11+pepIter])
            val = unique.get(key)
            for item in val:
                #print item
                id += 1
                sId = "P"+str(id)
                pertId.append(sId)
                annotation = {}
                annotation["id"] = sId
                annotation["LINCS_UNIQUE"] = "NA" if str(P100_data[item][1]) == "nan" else P100_data[item][1]
                annotation["cellId"] = "NA" if str(P100_data[item][2]) == "nan" else P100_data[item][2]
                annotation["pertDose"] = "NA" if str(P100_data[item][3]) == "nan" else P100_data[item][3]
                annotation["pertId"] = "NA" if str(P100_data[item][4]) == "nan" else P100_data[item][4]
                annotation["pertName"] = "NA" if str(P100_data[item][5]) == "nan" else P100_data[item][5]
                annotation["pertTime"] = "NA" if str(P100_data[item][6]) == "nan" else P100_data[item][6]
                annotation["pertType"] = "NA" if str(P100_data[item][7]) == "nan" else P100_data[item][7]
                annotation["pertVehicle"] = "NA" if str(P100_data[item][8]) == "nan" else P100_data[item][8]
                annotation["pubchemCid"] = "NA" if str(P100_data[item][9]) == "nan" else P100_data[item][9]
                annotation["lsmId"] = "NA" if str(P100_data[item][10]) == "nan" else P100_data[item][10]
                pertAnnotation.append(annotation)
                col = P100_data[item]
                for pepIter in range(1, 97):
                    pertDataJson = {}
                    pertDataJson["pepId"] = pepIter
                    pertDataJson["pertId"] = id
                    pertDataJson["value"] = float(P100_data[item][10 + pepIter])
                    pertData.append(pertDataJson)

            aggPertJson = {}
            aggPertJson["pertData"] = pertData
            aggPertJson["pertId"] = pertId
            aggPertJson["pertAnnotation"] = pertAnnotation
            aggPertJson["pertPeptide"] = pertPeptide
            pertJson[key] = aggPertJson


        pertJson["uniquePert"] = uniquePert
        print len(pertJson)


        json.dump(pertJson, open("resources/pilincs/P100_processed_perturb.json", 'w'))










    def convert_csv_2_json_file(self):

        """
        Read TSV from stdin and output as JSON.
        """
        data = {}
        with open('resources/heatmap_data.json', 'w') as outfile, open("resources/heatmap_data.tsv", "r") as f:
            for line in f:
                sp = line.split()
                print sp
                data.setdefault("data", []).append({"value": sp[-1], "day": sp[0], "hour": sp[1]})
            json.dump(data, outfile)



    def read_write_gene_json_file(self):
        with open('resources/genes_complete_set.json', "r") as json_data_file:
            self._gene_data = json.load(json_data_file)
        json_data_file.close()
        data = []
        gene_list = []
        gene_symbol_list = []
        gene_symbol_position = []
        iterator = 0
        for item in self._gene_data["response"]["docs"]:
            #gene_dict = {}
            #gene_symbol_list = []
            gene_dict = {"name":item["name"], "symbol":item["symbol"], "locus_group":item["locus_group"], "hgnc_id":item["hgnc_id"]}
            gene_symbol_list.append(item["symbol"])
            gene_symbol_position.append(iterator)
            # ++++++++++++++++++++++++++++++++++++++
            if "prev_symbol" in item:
                gene_dict["prev_symbol"] = item["prev_symbol"]
                for symbol in item["prev_symbol"]:
                    gene_symbol_list.append(symbol)
                    gene_symbol_position.append(iterator)
            else:
                gene_dict["prev_symbol"] = ""
            # ++++++++++++++++++++++++++++++++++++++
            if "uniprot_ids" in item:
                gene_dict["uniprot_ids"] = item["uniprot_ids"]
            else:
                gene_dict["uniprot_ids"] = ""
            # ++++++++++++++++++++++++++++++++++++++
            if "gene_family" in item:
                gene_dict["gene_family"] = item["gene_family"]
            else:
                gene_dict["gene_family"] = ""
            data.append(gene_dict)
            #gene_list.append(gene_symbol_list)
            iterator += 1

        json.dump(data, open("resources/protein-coding-genes-info.json", 'w'))
        json.dump(gene_symbol_list, open("resources/protein-coding-genes-all.json", 'w'))
        json.dump(gene_symbol_position, open("resources/protein-coding-genes-index.json", 'w'))

        return



