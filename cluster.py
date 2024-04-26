from flask import Flask, request, jsonify
from sklearn.cluster import KMeans
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app = Flask(__name__)

@app.route('/cluster_data', methods=['POST'])
def cluster_data():
    # Receive data from the client
    data = request.get_json()
    n_clusters = data.get('n_clusters', 3)
    dataset = np.array(data['dataset'])

    # Perform KMeans Clustering
    kmeans = KMeans(n_clusters=n_clusters)
    kmeans.fit(dataset)

    # Prepare and send the response
    centers = kmeans.cluster_centers_.tolist()
    labels = kmeans.labels_.tolist()

    return jsonify({'centers': centers, 'labels': labels})

if __name__ == '__main__':
    app.run(debug=True, port=5501)
