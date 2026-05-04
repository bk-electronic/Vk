from flask import Flask, render_template, request, jsonify
import requests
import json
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    messages = data.get('messages', [])
    api_key = os.environ.get('OPENROUTER_API_KEY')
    if not api_key:
        return jsonify({'error': 'API key not set'}), 400
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": "openai/gpt-4o-mini",
                "messages": messages
            })
        )
        if response.status_code == 200:
            result = response.json()
            return jsonify(result)
        else:
            return jsonify({'error': f'API error: {response.status_code}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate_text', methods=['POST'])
def generate_text():
    data = request.json
    prompt = data.get('prompt', '')
    tone = data.get('tone', 'formal')
    api_key = os.environ.get('OPENROUTER_API_KEY')
    if not api_key:
        return jsonify({'error': 'API key not set'}), 400
    messages = [
        {"role": "system", "content": f"Generate high-quality content in {tone} tone."},
        {"role": "user", "content": prompt}
    ]
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": "openai/gpt-4o-mini",
                "messages": messages
            })
        )
        if response.status_code == 200:
            result = response.json()
            return jsonify(result)
        else:
            return jsonify({'error': f'API error: {response.status_code}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate_hashtags', methods=['POST'])
def generate_hashtags():
    data = request.json
    keyword = data.get('keyword', '')
    api_key = os.environ.get('OPENROUTER_API_KEY')
    if not api_key:
        return jsonify({'error': 'API key not set'}), 400
    messages = [
        {"role": "user", "content": f"Generate relevant trending hashtags for: {keyword}"}
    ]
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": "openai/gpt-4o-mini",
                "messages": messages
            })
        )
        if response.status_code == 200:
            result = response.json()
            return jsonify(result)
        else:
            return jsonify({'error': f'API error: {response.status_code}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate_image_prompt', methods=['POST'])
def generate_image_prompt():
    data = request.json
    idea = data.get('idea', '')
    api_key = os.environ.get('OPENROUTER_API_KEY')
    if not api_key:
        return jsonify({'error': 'API key not set'}), 400
    messages = [
        {"role": "user", "content": f"Generate a detailed professional prompt for AI image tools based on this idea: {idea}"}
    ]
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            data=json.dumps({
                "model": "openai/gpt-4o-mini",
                "messages": messages
            })
        )
        if response.status_code == 200:
            result = response.json()
            return jsonify(result)
        else:
            return jsonify({'error': f'API error: {response.status_code}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)