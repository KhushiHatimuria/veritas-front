import os
from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import google.generativeai as genai
from services.textv import load_text_keys


# Load environment variables
load_dotenv()

# -----------------------------
# LOAD NEWS API KEYS
# -----------------------------
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
GNEWS_API_KEY = os.getenv("GNEWS_API_KEY")
MEDIASTACK_API_KEY = os.getenv("MEDIASTACK_API_KEY")
MGOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# PASS KEYS INTO textv.py  🔥🔥🔥  (THIS WAS MISSING)
load_text_keys(
    NEWS_API_KEY,
    GNEWS_API_KEY,
    MEDIASTACK_API_KEY
)

# -----------------------------
# GOOGLE GEMINI CONFIG
# -----------------------------
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
else:
    print("WARNING: Missing GOOGLE_API_KEY in .env")


app = Flask(__name__)

# ======================================================================================
# 1) GOOGLE GEMINI SUMMARIZER
# ======================================================================================
def summarize_with_gemini(text):
    """Summarize text using Google Gemini."""
    try:
        if not GOOGLE_API_KEY:
            return "Gemini key missing. Summary unavailable."

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            f"Summarize this clearly and objectively:\n\n{text}"
        )

        return response.text.strip()

    except Exception as e:
        return f"Summary unavailable: {str(e)}"


# ======================================================================================
# 2) INDIVIDUAL NEWS FETCHERS
# ======================================================================================
def fetch_newsapi(query):
  
    if not NEWS_API_KEY:
        return []

    key_terms = " ".join(query.split()[:3])
    url = f"https://newsapi.org/v2/everything?q={key_terms}&apiKey={NEWS_API_KEY}"
    print("Calling NewsAPI with:", key_terms)
    print("NEWSAPI QUERY SENT:", key_terms, url)
    print("NEWSAPI RAW:", res)

    try:
        res = requests.get(url).json()
        if "articles" in res:
            return [
                {
                    "source": "NewsAPI",
                    "title": item.get("title"),
                    "description": item.get("description"),
                    "url": item.get("url")
                }
                for item in res["articles"]
            ]
    except:
        pass
    return []


def fetch_gnews(query):
    if not GNEWS_API_KEY:
        return []

    url = f"https://gnews.io/api/v4/search?q={query}&lang=en&token={GNEWS_API_KEY}"
    print("Calling GNews with:", query)
    print("GNEWS QUERY SENT:", url)
    print("GNEWS RAW:", res)

    try:
        res = requests.get(url).json()
        if "articles" in res:
            return [
                {
                    "source": "GNews",
                    "title": item.get("title"),
                    "description": item.get("description"),
                    "url": item.get("url")
                }
                for item in res["articles"]
            ]
    except:
        pass
    return []


def fetch_mediastack(query):
    
    if not MEDIASTACK_API_KEY:
        return []

    url = f"http://api.mediastack.com/v1/news?access_key={MEDIASTACK_API_KEY}&languages=en&keywords={query}"
    print("Calling Mediastack with:", query)
    print("MEDIASTACK QUERY SENT:", url)
    print("MEDIASTACK RAW:", res)

    try:
        res = requests.get(url).json()
        if "data" in res:
            return [
                {
                    "source": "Mediastack",
                    "title": item.get("title"),
                    "description": item.get("description"),
                    "url": item.get("url")
                }
                for item in res["data"]
            ]
    except:
        pass
    return []


# ======================================================================================
# 3) AGGREGATED NEWS FETCHER
# ======================================================================================
def fetch_all_news(query):
    print("DEBUG QUERY RECEIVED:", query)

    results = []
    results.extend(fetch_newsapi(query))
    results.extend(fetch_gnews(query))
    results.extend(fetch_mediastack(query))
    return results


# ======================================================================================
# 4) CLAIM VERIFICATION LOGIC
# ======================================================================================
def verify_claim_logic(claim):
    articles = fetch_all_news(claim)

    if not articles:
        return {
            "claim": claim,
            "truth_score": 0,
            "category": "False",
            "summary": "No matching news found on verified sources.",
            "sources": []
        }

    score = min(100, len(articles) * 10)

    if score >= 80:
        category = "True"
    elif score >= 60:
        category = "Likely True"
    elif score >= 40:
        category = "Mixed Evidence"
    elif score >= 20:
        category = "Unlikely True"
    else:
        category = "False"

    combined_text = " ".join([
        (a.get("title") or "") + ". " + (a.get("description") or "")
        for a in articles[:5]
    ])

    summary_text = summarize_with_gemini(combined_text)

    return {
        "claim": claim,
        "truth_score": score,
        "category": category,
        "summary": summary_text,
        "sources": articles[:10]
    }


# ======================================================================================
# 5) API ENDPOINT
# ======================================================================================
@app.route("/verify", methods=["POST"])
def verify():
    # Support both form-data and json
    claim = ""
    image = None

    # If JSON request
    if request.is_json:
        data = request.get_json()
        claim = data.get("claim", "")

    # If form-data request
    if "claim" in request.form:
        claim = request.form.get("claim", "")

    if "image" in request.files:
        image = request.files["image"]
        # You can later send this to your image fact-checker

    if not claim and not image:
        return jsonify({"error": "No claim or image provided"}), 400

    # If only image is provided (optional logic)
    if image and not claim:
        claim = "Image uploaded for fact checking."

    result = verify_claim_logic(claim)
    return jsonify(result)


# ======================================================================================
# 6) ENTRYPOINT
# ======================================================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7000)
