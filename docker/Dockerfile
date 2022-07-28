FROM python:3.9

RUN git clone https://github.com/behrouzsh/lincsproteomics_python.git
RUN git clone https://github.com/behrouzsh/LINCS-Proteomics-Landing-Page.git

RUN pip3 install virtualenv
RUN apt-get update
RUN sdk install gradle 4.1

RUN cd /LINCS-Proteomics-Landing-Page && gradle clean build -x test

RUN cd /lincsproteomics_python && virtualenv -p python3 env
RUN cd /lincsproteomics_python && \
   . env/bin/activate && \
   pip3 install -r requirements.txt

COPY run.sh .
RUN chmod a+x run.sh
EXPOSE 5000
EXPOSE 8050
CMD ./run.sh