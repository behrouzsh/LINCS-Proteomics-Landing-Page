#!/usr/bin/env python
#
# Author: Behrouz Shamsaei <behrouz.shamsaei@uc.edu>
# Date: Sep 2016
#
import requests
#import csv
#from requests.exceptions import Timeout

class HarmonizomeClient(object):
    """Client class is to connect the prosite server and psi-mod csv file to search2 for motifs.
    :param motifs: List of motifs to be searched.
    :param timeout: API request timeout
    :param retries: Number of times to retry request if timeout received
    """

    # API URLs for searching for motifs
    HARMONIZOME_URL_BASE = 'http://amp.pharm.mssm.edu/Harmonizome//api/1.0/protein/'
    TIMEOUT = 120
    RETRIES = 3


    def __init__(self,
                 timeout=TIMEOUT,
                 retries=RETRIES):

        assert(timeout >= 0)
        self.timeout = timeout or self.TIMEOUT

        assert(isinstance(retries, int) and retries >= 0)
        self.retries = retries or self.RETRIES

    def search_harmonizome(self, params):
        """Prosite search2 for motif API request

        :param params: motif search2 string
        """

        url = self.HARMONIZOME_URL_BASE + params

        response = self._request(url)
        #search_result = self._extract_response(response)
        #print response['gene']['symbol']
        # print response
        #return search_result
        if 'gene' in response:
            gene = response['gene']['symbol']
        else:
            gene = ""
        print gene
        return gene


    def _request(self, url, params=None):
        """Generic prosite request which attaches meta info (e.g. auth)

        :param url: URL of endpoint
        :param params: GET params of request
        """

        response = requests.get(url).json()

        # response = requests.get(url,
        #                         timeout=self.timeout)

        return response


    def _extract_response(self, response):
        """Extract data from api resposne"""
        return response.json()