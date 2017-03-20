#!/usr/bin/env python
#
# Author: Behrouz Shamsaei <behrouz.shamsaei@uc.edu>
# Date: Sep 2016
#

import json
import requests

class EnrichrClient(object):

    def __init__(self, enrichr_library, listdesrciption, enrichr_results):
        self.ENRICHR_URL = str('http://amp.pharm.mssm.edu/Enrichr/addList')
        self.ENRICHR_URL_A = str('http://amp.pharm.mssm.edu/Enrichr/view?userListId=%s')
        self.ENRICHR_URL = str('http://amp.pharm.mssm.edu/Enrichr/enrich')
        self.query_string = str('?userListId=%s&backgroundType=%s')
        self.enrichr_library = enrichr_library
        self.listdesrciption = listdesrciption
        self.enrichr_results = enrichr_results


    def obtain_client_id(self, gene_list, ):
        print 'Input file is:', gene_list
        print 'Analysis name: ', self.listdesrciption
        print 'Enrichr Library: ', self.enrichr_library
        print 'Enrichr Results File: ', self.enrichr_results


        # stick gene list here
        genes_str = '\n'.join(str(e) for e in gene_list)
        genes_str = genes_str + '\n'
        #genes_str = str(gene_list)
        print "genes_str"
        print genes_str
        #print type(genes_str)
        # name of analysis or list
        # description = 'Example gene list'
        description = str(self.listdesrciption)
        #print description
        # payload
        payload = {
            'list': (None, genes_str),
            'description': (None, description)
        }
        #print type(payload)
        #print payload
        # response
        response = requests.post('http://amp.pharm.mssm.edu/Enrichr/addList',files=payload)

        if not response.ok:
            raise Exception('Error analyzing gene list')
        #print type(self.ENRICHR_URL)
        #print self.ENRICHR_URL
        #print response.text
        job_id = json.loads(response.text)
        #job_id = response.text.json()

        print(job_id)
        return job_id


    def print_gene_list(self, param):
        print 'Gene list file is:', param

        job_id = param
        user_list_id = job_id['userListId']
        print(user_list_id)

        response_gene_list = requests.get('http://amp.pharm.mssm.edu/Enrichr/view?userListId=%s' % str(user_list_id))
        if not response_gene_list.ok:
            raise Exception('Error getting gene list')

        added_gene_list = json.loads(response_gene_list.text)
        print(added_gene_list)

    def obtain_network(self, param):
        print 'Input file is:', param

        ## get id data
        job_id = param
        user_list_id = job_id['userListId']
        print(user_list_id)

        ## Libraray
        gene_set_library = str(self.enrichr_library)

        response = requests.get(
            self.ENRICHR_URL + self.query_string % (str(user_list_id), gene_set_library)
        )
        if not response.ok:
            raise Exception('Error fetching enrichment results')

        data = json.loads(response.text)
        print(data)
        return data




# get gene lits
# f = open(genelist)
# genes = f.read()

## enrichr url



################################################################################
# View added gene list
#
#import json
#import requests



################################################################################
# Get enrichment results
#
#import json
#import requests




################################################################################
##Download file of enrichment results

# ENRICHR_URL = 'http://amp.pharm.mssm.edu/Enrichr/export'
# query_string = '?userListId=%s&filename=%s&backgroundType=%s'
# user_list_id = str(job_id['userListId'])
# filename = enrichr_results
# gene_set_library = str(enrichr_library)
#
# url = ENRICHR_URL + query_string % (user_list_id, filename, gene_set_library)
# response = requests.get(url, stream=True)
#
# with open(filename + '.txt', 'wb') as f:
#     for chunk in response.iter_content(chunk_size=1024):
#         if chunk:
#             f.write(chunk)
# ################################################
# print("Done")
