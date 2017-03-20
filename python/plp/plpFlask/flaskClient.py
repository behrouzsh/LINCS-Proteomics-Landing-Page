#!/usr/bin/env python
#
# Author: Behrouz Shamsaei <behrouz.shamsaei@uc.edu>
# Date: Oct 2016
#
from flask import Flask
from flask import render_template


class FlaskClient(object):

    def __init__(self, gene_list, pathway_list, gen_to_pathway_list):
        self.gene_list = gene_list
        self.pathway_list = pathway_list
        self.gen_to_pathway_list = gen_to_pathway_list

    pln_app = Flask(__name__)

    pln_app.vars = {}

    @pln_app.route('/plp', methods=['GET', 'POST'])
    def pln():
        return render_template('plp.html')

    @pln_app.route('/network', methods=['GET', 'POST'])
    def network():
        return render_template('network.html')


    # if __name__ == "__main__":
    #     pln_app.run()