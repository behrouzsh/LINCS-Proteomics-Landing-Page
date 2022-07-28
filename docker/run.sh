#!/bin/bash

cd /lincsproteomics_python
. env/bin/activate
python3 app.py &

cd /LINCS-Proteomics-Landing-Page
java -jar build/libs/*.jar