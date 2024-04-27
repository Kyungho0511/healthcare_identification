from flask import Flask, request, render_template, jsonify
from sklearn.cluster import KMeans
import numpy as np
import pandas as pd
import geopandas as gpd
from flask_cors import CORS

app = Flask(__name__,
            static_folder='.',  # Set static folder to root
            template_folder='.')  # Set template folder to roo
CORS(app)

@app.route('/')
def main():
   return render_template('index.html')

@app.route('/cluster_data', methods=['POST'])
def cluster_data():
    # Receive data from the client
    data = request.get_json()
    n_clusters = data.get('n_clusters', 4)
    dataset = data.get('dataset')
    features = data.get('features')

    
    cluster_df = dataset[features]
    print(dataset)
    print(cluster_df)





    # # Perform KMeans Clustering
    # kmeans = KMeans(n_clusters=n_clusters)
    # kmeans.fit(dataset)

    # # Prepare and send the response
    # centers = kmeans.cluster_centers_.tolist()
    # labels = kmeans.labels_.tolist()

    # return jsonify({'centers': centers, 'labels': labels})

if __name__ == '__main__':
    app.run(debug=True)
