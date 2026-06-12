from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "https://stock-verse-nine.vercel.app",
            "https://stock-verse-git-main-lavansh1306s-projects.vercel.app",
            "https://stock-verse-6czw53am8-lavansh1306s-projects.vercel.app",
            "https://stock-verse-s177qxsp7-lavansh1306s-projects.vercel.app",
            "http://localhost:8080",
            "http://localhost:8081",
            "http://localhost:3000",
            "http://localhost:5173",
            "*"  # Temporarily allow all origins while testing
        ],
        "methods": ["GET", "POST", "OPTIONS", "HEAD"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["*"],
        "supports_credentials": True,
        "max_age": 3600
    }
})

# Configure Google Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

# Load CSV data
csv_path = os.path.join(os.path.dirname(__file__), 'data.csv')
df = pd.read_csv(csv_path)
current_index = 0  # Track current position in the data

@app.route('/')
def home():
    return render_template('index.html')  # Main page with Start Chat button

@app.route('/chat')
def chat():
    return render_template('chat.html')  # Chatbot UI

@app.route('/api/stock-data', methods=['GET'])
def get_stock_data():
    global current_index
    
    # Get the number of data points to return (default 50)
    limit = request.args.get('limit', 50, type=int)
    
    # Get data starting from current_index
    start_idx = current_index
    end_idx = min(start_idx + limit, len(df))
    
    # Extract the data
    data_slice = df.iloc[start_idx:end_idx]
    
    # Convert to the format expected by the frontend
    result = []
    for _, row in data_slice.iterrows():
        result.append({
            'time': row['date'],
            'open': float(row['open']),
            'high': float(row['high']),
            'low': float(row['low']),
            'close': float(row['close']),
            'volume': int(row['volume'])
        })
    
    # Move to next position for next request
    current_index = (current_index + 1) % len(df)
    
    return jsonify(result)

@app.route('/get_response', methods=['POST'])
def get_response():
    data = request.get_json()
    user_input = data.get("message", "").strip()
    if not user_input:
        return jsonify({"response": "Please enter a stock-related question."})

    # Fine-tuned prompt for stock-related queries
    prompt = f"""
You are StockBot, an AI-powered chatbot designed to assist users with stock trading and investment queries.
Your goal is to provide **quick, accurate, and actionable** answers related to stocks, investments, and portfolio management.
🔹 **Tone:** Professional, clear, and concise.
🔹 **Response Style:** Short (1-2 sentences), direct, and focused on stocks.
🔹 **What to Provide:** Stock market insights, trading strategies, portfolio advice, or explanations of stock-related terms.
🔹 **No Generic Replies:** Always provide **specific, actionable information** (e.g., market trends, stock analysis tips, or risk management strategies).
🔹 **Do Not Answer Non-Stock Questions:** If the query is unrelated to stocks or investments, politely redirect the user to ask a stock-related question.
🚨 **How to Respond Based on the User's Needs:**
1️⃣ **If the user asks about a specific stock (e.g., AAPL):**
   - Provide basic insights (e.g., recent performance, key metrics like P/E ratio, or news impact).
   - Suggest checking real-time data or consulting a financial advisor for detailed analysis.
2️⃣ **If the user asks about trading strategies:**
   - Offer beginner-friendly tips (e.g., diversification, stop-loss orders, or long-term investing).
   - Explain risks and benefits concisely.
3️⃣ **If the user asks about portfolio management:**
   - Suggest allocation strategies, rebalancing tips, or risk assessment methods.
   - Recommend tools or resources for tracking portfolios.
4️⃣ **If the query is vague or off-topic:**
   - Politely ask for clarification or redirect to stock-related topics (e.g., "Could you specify a stock or trading question?").
User: {user_input}
StockBot:
    """
    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return jsonify({"response": response.text.strip()})  # Clean response
    except Exception as e:
        return jsonify({"response": "Sorry, I couldn't process that. Please ask a stock-related question!"})

if __name__ == '__main__':
    # Get port from environment variable (for Render) or use default
    port = int(os.environ.get('PORT', 5000))
    # Bind to 0.0.0.0 for production
    app.run(host='0.0.0.0', port=port, debug=False)
