import requests

API_URL = "https://api-inference.huggingface.co/models/umm-maybe/AI-image-detector"
headers = {"Authorization": "Bearer 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"}  # paste your key

data = {"inputs": "https://upload.wikimedia.org/wikipedia/commons/7/7d/Dog_face.png"}

response = requests.post(API_URL, headers=headers, json=data)
print(response.json())
