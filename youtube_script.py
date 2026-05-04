import requests
import os

url = "https://openrouter.ai/api/v1/chat/completions"

api_key = os.getenv("OPENROUTER_API_KEY")

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "mistralai/mistral-7b-instruct",
    "messages": [
        {
            "role": "system",
            "content": "You are a professional AI assistant."
        },
        {
            "role": "user",
            "content": "Write a YouTube script about success"
        }
    ]
}

response = requests.post(url, headers=headers, json=payload)

print(response.json())