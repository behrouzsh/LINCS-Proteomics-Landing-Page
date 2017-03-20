#!/usr/bin/env python
#
# Author: Behrouz Shamsaei <behrouz.shamsaei@uc.edu>
# Date: Sep 2016
#

import requests
import xml.etree.ElementTree as ET

class UniprotClient(object):

    # API URLs for searching for proteins
    UNIPROT_URL_BASE = 'http://www.uniprot.org/uniprot/'
    UNIPROT_URL_LINEAGE = '9606'
    UNIPROT_URL_FORMAT = '.xml'
    TIMEOUT = 120
    RETRIES = 3

    def __init__(self,
                 timeout=TIMEOUT,
                 retries=RETRIES):

        assert(timeout >= 0)
        self.timeout = timeout or self.TIMEOUT

        assert(isinstance(retries, int) and retries >= 0)
        self.retries = retries or self.RETRIES

    def extract_protein(self, params):
        #protein =
        return params

    def search_uniprot(self, params):

        url = self.UNIPROT_URL_BASE + params + self.UNIPROT_URL_FORMAT + '?query=reviewed:yes+AND+organism:' + self.UNIPROT_URL_LINEAGE
        response = self._request(url)
        tree = ET.fromstring(response.content)
        uniprot_list = []
        modification_list = []
        for child in tree[0]:
            if child.tag == "{http://uniprot.org/uniprot}sequence":
                uniprot_list.append(params)
                uniprot_list.append(child.attrib["length"])
                uniprot_list.append(str(child.text).replace('\n', ''))
                #print child, child.tag, " ++++++++ ",child.attrib["length"], " ----- ", str(child.text).replace('\n', '')
            #if child.tag == "{http://uniprot.org/uniprot}feature":
                #print child, child.tag, " ++++++++ ", child.attrib["type"], " ----- ", str(child.text)

        #search_result = self._extract_response(response)
        #print response.text
        return uniprot_list



    def _request(self, url, params=None):
        """Generic uniprot request which attaches meta info (e.g. auth)

        :param url: URL of endpoint
        :param params: GET params of request
        """

        response = requests.get(url,
                                timeout=self.timeout)

        return response
    #
    #
    # def _extract_response(self, response):
    #     """Extract data from api resposne"""
    #     return response.json()