import json
import sqlite3
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
import time

hostName = "localhost"
serverPort = 8081


class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        '''
        Query for summery_result table
        :return: the pipeline data to show on pipeline stacked bar chart on dashboard
        '''
        if self.path.endswith("chart"):
            conn = sqlite3.connect('CONP.db')
            cursor = conn.cursor()
            myDict = {}
            successDict = {}
            doneDic = {}

            cursor.execute(
                "SELECT pipeline_name,pipeline_DOI from summary_results")
            pips = cursor.fetchall()
            pipDicpair = {}
            for line in pips:
                pipName = line[0]
                pipDOI = line[1]
                if pipName not in pipDicpair.keys():
                    pipDicpair[pipName] = pipDOI

            cursor.execute(
                "SELECT pipeline_name,  COUNT(pipeline_name) from summary_results GROUP BY pipeline_name,"
                "exit_code HAVING exit_code != 0")
            res = cursor.fetchall()
            for l in res:
                myDict[l[0]] = l[1]

            cursor.execute(
                "SELECT pipeline_name, COUNT(pipeline_name) from summary_results GROUP BY pipeline_name,"
                "exit_code HAVING exit_code = 0")
            result = cursor.fetchall()
            for r in result:
                doneDic['success'] = r[1]
                successDict[r[0]] = doneDic

            for pip in myDict:
                for r in result:
                    successDict[r[0]] = r[1]

            resultDict = {}
            subList = []
            i = 0
            for pip in successDict:
                subDict = {}
                if pip in myDict.keys():
                    subDict["pip"] = pip
                    subDict["DOI"] = pipDicpair[pip]
                    subDict["fail"] = myDict[pip]
                    subDict["success"] = successDict[pip]

                    subList.append(subDict)
                    i = i + 1
                else:
                    subDict["pip"] = pip
                    subDict["DOI"] = pipDicpair[pip]
                    subDict["fail"] = 0
                    subDict["success"] = successDict[pip]
                    subList.append(subDict)
                    i = i + 1
            resultDict['pipinfo'] = subList
            r = json.dumps(resultDict)
            loaded_r = json.loads(r)
            print(loaded_r)
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(r, "utf-8"))

        '''
        Query for summery_result table
        :return: the pipeline and Dataset data to show on Dataset stacked bar chart on dashboard
        '''
        if self.path.endswith("dataset"):
            conn = sqlite3.connect('CONP.db')
            cursor = conn.cursor()
            resultDict = {}
            cursor.execute(
                "SELECT pipeline_name, pipeline_DOI, Dataset, COUNT(pipeline_name) from summary_results GROUP BY"
                " pipeline_name, Dataset")

            pips = cursor.fetchall()
            datasetList=[]
            pipelineList=[]
            result=[]

            for line in pips:
                if not line[2] == None:
                    if datasetList.count(line[2])==0:
                        datasetList.append(line[2])
                    if pipelineList.count(line[0]) == 0:
                        pipelineList.append(line[0]);
            for i in datasetList:
                resultD={}
                resultD['name']=i
                resultList=[]
                for j in pipelineList:
                    resultList.append(0)
                resultD['data']=resultList
                result.append(resultD)
            for line in pips:
                if not line[2] == None:
                    pipName = line[0]
                    pipDOI = line[1]
                    dataset = line[2]
                    runnum = line[3]
                    datasetIndex=datasetList.index(dataset)
                    pipelineIndex=pipelineList.index(pipName)
                    result[datasetIndex]['data'][pipelineIndex]=runnum

            resultDict['pipelines']=pipelineList
            resultDict['result'] =result

            a = json.dumps(resultDict)
            loaded_d = json.loads(a)
            print(loaded_d)
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(a, "utf-8"))

        '''
        Query for summery_result table
        :return: the pipeline data to show on pipeline table on dashboard
        '''
        if self.path.endswith("pipTable"):
            conn = sqlite3.connect('CONP.db')
            cursor = conn.cursor()
            tableDict = {}

            List = []

            cursor.execute("SELECT pipeline_name, pipeline_DOI, Dataset, exit_code from summary_results"
                           " GROUP BY Dataset, pipeline_DOI HAVING COUNT(*)>=1 ")

            list = cursor.fetchall()
            for r in list:
                if not r[2] == None:
                    pipDict = {}
                    pipDict['pipeline'] = r[0]
                    pipDict['pipelineDOI'] = r[1]
                    pipDict['Dataset'] = r[2]
                    pipDict['exitcode'] = r[3]
                    List.append(pipDict)

            tableDict['pipelineTable'] = List


            d = json.dumps(tableDict)
            loaded_d = json.loads(d)
            print(loaded_d)
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(d, "utf-8"))

        '''
        Get result of Provenance-based recommender from "recommendForPiplines.json"
        :return: the  Provenance-based recommender for pipeline and dataset data to show on Dataset 
        recommender table on dashboard
        '''
        if self.path.endswith("ProvRecDataset"):
            f = open('recommendForPiplines.json', )
            data = json.load(f)
            f.close()
            a = json.dumps(data)
            loaded_d = json.loads(a)
            print(loaded_d)

            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(a, "utf-8"))


        '''
        Get result of Provenance-based recommender from "recommendForDatasets.json"
        :return: the  Provenance-based recommender for pipeline and dataset data to show on Pipeline
         recommender table on dashboard
        '''
        if self.path.endswith("ProvRecPip"):
            f = open('recommendForDatasets.json', )
            data = json.load(f)
            f.close()
            n = json.dumps(data)
            loaded_d = json.loads(n)
            print(loaded_d)

            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(n, "utf-8"))


        '''
         Get result of Tag-based recommender from "pipelineresult.json"
        :return: the  Tag-based recommender for pipeline and dataset data to show on Dataset
         recommender table on dashboard
        '''
        if self.path.endswith("TagRecomDataset"):
            f = open('pipelineresult.json', )
            data = json.load(f)
            f.close()
            n = json.dumps(data)
            loaded_d = json.loads(n)
            print(loaded_d)

            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(n, "utf-8"))


        '''
         Get result of Tag-based recommender from "datasetresult.json"
        :return: the  Tag-based recommender for pipeline and dataset data to show on Pipeline
         recommender table on dashboard
        '''
        if self.path.endswith("TagRecPip"):
            f = open('datasetresult.json', )
            data = json.load(f)
            f.close()
            n = json.dumps(data)
            loaded_d = json.loads(n)
            print(loaded_d)

            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header('Access-Control-Allow-Methods', 'GET')
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(bytes(n, "utf-8"))




if __name__ == "__main__":
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print("Server started http://%s:%s" % (hostName, serverPort))

    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass

    webServer.server_close()
    print("Server stopped.")
