import os
import cv2
import numpy as np
from inference_sdk import InferenceHTTPClient
from matplotlib import pyplot as plt

# Initialize client
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="UkIWTxUzXiyIaSaGNmj5"
)

# Load image
your_image = os.path.join(os.path.dirname(os.path.abspath(__file__)), "wall2.jpg")
image = cv2.imread(your_image)
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Run inference
result = CLIENT.infer(your_image, model_id="hold-detector-rnvkl/2")

# Draw polygons
for prediction in result['predictions']:
    if 'points' in prediction:
        points = prediction['points']
        polygon = np.array([[int(p['x']), int(p['y'])] for p in points], np.int32)
        polygon = polygon.reshape((-1, 1, 2))
        cv2.polylines(image, [polygon], isClosed=True, color=(255, 0, 0), thickness=2)
        cv2.fillPoly(image, [polygon], color=(255, 0, 0, 50))  # Optional fill

# Display the image
plt.figure(figsize=(12, 12))
plt.imshow(image)
plt.axis('off')
plt.title("Detected Holds")
plt.show()
print(result)