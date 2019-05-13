# author : faruq
# first, pliss check folder static on your server, when isn available, make static folder first to save our model
''' controller and routes for label '''
import os
from flask import request, jsonify
from app import app, mongo
import logger
from app.schemas.label import validate_label
from app.services.response import response
from werkzeug.utils import secure_filename
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier # Import Decision Tree Classifier
from sklearn.model_selection import train_test_split # Import train_test_split function
from sklearn import metrics #Import scikit-learn metrics module for accuracy calculation
from sklearn.tree import export_graphviz
from sklearn.externals.six import StringIO   
from sklearn.tree import _tree 
import pydotplus
import pickle
from datetime import datetime
from bson.objectid import ObjectId

ALLOWED_EXTENSIONS = set(['csv'])

ROOT_PATH = os.environ.get('ROOT_PATH')
LOG = logger.get_root_logger(
    __name__, filename=os.path.join(ROOT_PATH, 'output.log'))
    
# =======SECTION LABEL=======
@app.route('/api/intelligent/all_label', methods=['GET'])
def get_all_diseases():
  try:
    responses = response()
    label = mongo.db.labels
    output = []
    for s in label.find():
      output.append(
        {
          'namaLabel' : s['namaLabel'], 
          'labelIdentity': s['labelIdentity']
        })
    responses.setData(output)
    return jsonify(responses.getResponse())
  except :
    responses = response()
    responses.setStatus(False)
    responses.setMessage("Something wrong :(")
    return jsonify(responses.getResponse())

def get_label():
  try:
    label = mongo.db.labels
    output = []
    for s in label.find():
      output.append(s['namaLabel'])
    return output
  except :
    return False

# =======SECTION DECISION TREE=======
def allowed_file(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_header(data):
  # GET HEADER
  colls_name = []
  for i in data:
    colls_name.append(data[i][0])

  return colls_name

def save_features(colls_name):
  # GET ATTRIBUTE / FEATURES
  feature_cols = colls_name[0:len(colls_name)-1]
  iteration = 0
  mongo.db.attributes.drop()
  for i in range(len(feature_cols)):
    data = {
      "namaAttribute" : feature_cols[i],
      "attributeIdentitiy" : iteration
    }
    iteration+=1
    mongo.db.attributes.insert_one(data)

  return feature_cols

def get_features():
  try:
    attributes = mongo.db.attributes
    output = []
    for s in attributes.find():
      output.append(s['namaAttribute'])
    return output
  except :
    return False 

def save_labels(data):
  labels_unique = data.Label.unique()
  iteration=0
  mongo.db.labels.drop()
  for i in range(len(labels_unique)):
    d = {
      "namaLabel" : labels_unique[i],
      "labelIdentity" : iteration
    }
    iteration+=1
    mongo.db.labels.insert_one(d)
  data['Label'] = pd.factorize(data.Label)[0]
  return data

def pre_processing(data,colls_name):
  # PREPROCESSING DATA
  # - drop header by index
  # - convert to array to normalize index after dropping
  # - convert to dataframe and add coloumns name
  data_after_drop_label = data.drop([0])
  data_array = data_after_drop_label.values
  data_training = pd.DataFrame(data=data_array)
  data_training.columns = colls_name
  data_ready = save_labels(data_training)
  return data_ready

def training(data_training,feature_cols):
  X = data_training[feature_cols]
  y = data_training.Label
  clf = DecisionTreeClassifier()
  clf = clf.fit(X,y)
  return clf

def save_model(model):
  # SAVING TO PICKLE
  pkl_filename = "pickle_model.pkl"
  with open(pkl_filename, 'wb') as file:
    pickle.dump(model, file)


@app.route('/api/intelligent/upload_training_data', methods=['POST'])
def upload_file():
  try:
   file = request.files['file']
   if file and allowed_file(file.filename):
     filename = secure_filename(file.filename)
     file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
     data = pd.read_csv("././static/data-coba-coba.csv",header=None)
     # GET HEADER
     colls_name = get_header(data)
     # GET ATTRIBUTE
     feature_cols = save_features(colls_name)
     # PRE PROCESSING
     data_training = pre_processing(data,colls_name)
     # TRAINING
     model = training(data_training,feature_cols)
     # SAVE MODEL
     save_model(model)
     responses = response()
     responses.setStatus(True)
     responses.setMessage("Succesfully save model")
     return jsonify(responses.getResponse())

  except:
    responses = response()
    responses.setStatus(False)
    responses.setMessage("Something wrong :(")
    return jsonify(responses.getResponse())

@app.route('/api/intelligent/testing_data', methods=['POST'])
def testing_data():
  try:
    model_testing = {}
    model_for_saving = {}
    attributes = get_features()
    labels = get_label()
    d = request.get_json()
    headers = request.args
    sapi_id = headers['sapi']

    for i in range(len(attributes)):
      model_testing.update({attributes[i]:[d.get(attributes[i])]})
      model_for_saving.update({attributes[i]:d.get(attributes[i])})
    
    Z_test = pd.DataFrame(data=model_testing)
    with open("pickle_model.pkl", 'rb') as file:
      pickle_model = pickle.load(file)
    
    result = pickle_model.predict(Z_test)
    responses = response()
    responses.setStatus(True)
    # responses.setData(labels[result[0]])
    # Save
    attributes2 = []
    for i in model_for_saving:
      attributes2.append({
        "namaAttributes" : i,
        "nilai" : model_for_saving[i]
      })
    res = labels[result[0]]
    diagnose_insert = {
      "sapiId" : ObjectId(sapi_id),
      "diagnose" : res,
      "gejala" : attributes2, 
      "tanggal" : datetime.now()
    }
    mongo.db.diagnoses.insert_one(diagnose_insert)
    responses.setData(diagnose_insert)
    return jsonify(responses.getResponse())

  except:
    responses = response()
    responses.setStatus(False)
    responses.setMessage("Something wrong :(")
    return jsonify(responses.getResponse())

@app.route('/api/intelligent/all_attributes', methods=['GET'])
def get_all_attributes():
  try:
    responses = response()
    attribut = mongo.db.attributes
    output = []
    for s in attribut.find():
      output.append(
        {
          'namaAttribute' : s['namaAttribute'], 
          'attributeIdentitiy': s['attributeIdentitiy']
        })
    responses.setData(output)
    return jsonify(responses.getResponse())
  except :
    responses = response()
    responses.setStatus(False)
    responses.setMessage("Something wrong :(")
    return jsonify(responses.getResponse())

@app.route('/api/intelligent/all_diagnoses', methods=['GET'])
def get_all_diagnoses():
  try:
    responses = response()
    diagnoses = mongo.db.diagnoses.aggregate([
      {
          '$group': {
              '_id': '$diagnose', 
              'total': {
                  '$sum': 1
              }
          }
      }
    ])
    output = []
    for s in diagnoses:
      output.append(
        {
          'diagnose' : s['_id'], 
          'total': s['total']
        })
    responses.setData(output)
    return jsonify(responses.getResponse())
  except :
    responses = response()
    responses.setStatus(False)
    responses.setMessage("Something wrong :(")
    return jsonify(responses.getResponse())
