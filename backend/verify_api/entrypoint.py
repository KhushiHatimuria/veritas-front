from flask import Flask, jsonify, request
import requests
from difflib import SequenceMatcher
from sentence_transformers import SentenceTransformer, util
from transformers import pipeline

# Initialize summarizer model
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def generate_ai_summary(claim, articles):
    """
    Uses Hugging Face summarizer to generate a meaningful explanation of the claim
    based on the top articles or context.
    """
    if articles:
        combined_text = " ".join([a["title"] + ". " + (a.get("description") or "") for a in articles[:3]])
        summary = summarizer(combined_text, max_length=120, min_length=30, do_sample=False)[0]['summary_text']
        return f"AI Summary: {summary}"
    else:
        ai_commentary = summarizer(
            f"Explain briefly why this claim might lack evidence: {claim}",
            max_length=80,
            min_length=20,
            do_sample=False
        )[0]['summary_text']
        return f"No supporting sources found. {ai_commentary}"


# ------------------------
# 🔑 API KEYS (Free APIs only)
# ------------------------
NEWSAPI_KEY = "f4a6fa53aece46e68b7f91eea9a4d205"
GNEWS_KEY = "f2fc361505e5cc369f51db4763cf9487"
MEDIASTACK_KEY = "cb41be60ecde86326dfe8e02e841ca41"

# ------------------------
# Initialize Flask + model
# ------------------------
app = Flask(__name__)
model = SentenceTransformer('all-MiniLM-L6-v2')

# ------------------------
# 📰 API Integrations (Free)
# ------------------------
def fetch_news_newsapi(query):
    url = "https://newsapi.org/v2/everything"
    params = {"q": query, "language": "en", "apiKey": NEWSAPI_KEY}
    try:
        resp = requests.get(url, params=params, timeout=10).json()
        articles = resp.get("articles", [])
        return [
            {"source": "NewsAPI", "title": a["title"], "description": a.get("description"), "url": a.get("url")}
            for a in articles
        ]
    except Exception as e:
        print("NewsAPI error:", e)
        return []


def fetch_news_gnews(query):
    url = "https://gnews.io/api/v4/search"
    params = {"q": query, "lang": "en", "token": GNEWS_KEY}
    try:
        resp = requests.get(url, params=params, timeout=10).json()
        articles = resp.get("articles", [])
        return [
            {"source": "GNews", "title": a["title"], "description": a.get("description"), "url": a.get("url")}
            for a in articles
        ]
    except Exception as e:
        print("GNews error:", e)
        return []


def fetch_news_mediastack(query):
    url = "http://api.mediastack.com/v1/news"
    params = {"access_key": MEDIASTACK_KEY, "keywords": query, "languages": "en"}
    try:
        resp = requests.get(url, params=params, timeout=10).json()
        articles = resp.get("data", [])
        return [
            {"source": "Mediastack", "title": a["title"], "description": a.get("description"), "url": a.get("url")}
            for a in articles
        ]
    except Exception as e:
        print("Mediastack error:", e)
        return []


def fetch_news_from_all(query):
    articles = []
    for func in [fetch_news_newsapi, fetch_news_gnews, fetch_news_mediastack]:
        try:
            data = func(query)
            if data:
                articles.extend(data)
        except Exception as e:
            print(f"Error fetching from {func.__name__}: {e}")

    # Remove duplicates
    seen = set()
    unique_articles = []
    for art in articles:
        url = art.get("url")
        if url and url not in seen:
            seen.add(url)
            unique_articles.append(art)

    if not unique_articles:
        return [
            {"title": "No articles found", "description": "No reliable sources found.", "url": "#", "source": "System"}
        ]

    return unique_articles

# ------------------------
# 🧠 Helper functions
# ------------------------
def extract_entities(text):
    words = [w for w in text.split() if len(w) > 3]
    return words[:5]


def classify_truth_level(truth_score):
    if truth_score >= 80:
        return "True"
    elif truth_score >= 60:
        return "Likely True"
    elif truth_score >= 40:
        return "Mixed Evidence"
    elif truth_score >= 20:
        return "Unlikely True"
    else:
        return "False"


def generate_truth_summary(claim, truth_score, sources, category):
    if not sources:
        return f"No reliable sources found for '{claim}'."
    elif category == "True":
        return f"'{claim}' is well supported by multiple trusted sources."
    elif category == "Likely True":
        return f"'{claim}' has supporting evidence, though not fully confirmed."
    elif category == "Mixed Evidence":
        return f"Sources show mixed or unclear evidence for '{claim}'."
    elif category == "Unlikely True":
        return f"Few sources support '{claim}'; reliability is questionable."
    else:
        return f"'{claim}' appears false based on current reliable news data."

# ------------------------
# ✅ Verify Claim
# ------------------------
def verify_claim(claim):
    entities = extract_entities(claim)
    query = " ".join(entities)
    articles = fetch_news_from_all(query)

    if not articles:
        return {
            "claim": claim,
            "truth_score": 0,
            "message": "No reliable sources found.",
            "sources": []
        }

    scores = []
    claim_embedding = model.encode(claim, convert_to_tensor=True)

    for a in articles:
        title = a["title"] or ""
        if not title:
            continue
        semantic_sim = util.cos_sim(claim_embedding, model.encode(title, convert_to_tensor=True)).item()
        lexical_sim = SequenceMatcher(None, claim.lower(), title.lower()).ratio()
        combined_sim = (semantic_sim * 0.7) + (lexical_sim * 0.3)
        a["relevance_score"] = round(combined_sim * 100, 2)
        scores.append(combined_sim)

    if not scores:
        return {
            "claim": claim,
            "truth_score": 0,
            "message": "No comparable news found.",
            "sources": []
        }

    avg_score = sum(scores) / len(scores)
    truth_score = round(avg_score * 100, 2)
    category = classify_truth_level(truth_score)
    summary = generate_truth_summary(claim, truth_score, articles[:5], category)

    articles = sorted(articles, key=lambda x: x.get("relevance_score", 0), reverse=True)[:5]
    explanation = (
        f"'{claim}' is classified as '{category}'. "
        f"Average similarity across {len(scores)} sources: {truth_score}%. "
        f"Top sources show relevance between {articles[0]['relevance_score']}% and {articles[-1]['relevance_score']}%."
    )

    return {
        "claim": claim,
        "truth_score": truth_score,
        "category": category,
        "summary": summary,
        "explanation": explanation,
        "sources": articles
    }

# ------------------------
# 🌐 Flask Routes
# ------------------------
@app.route("/verify/news", methods=["GET"])
def get_news():
    query = request.args.get("query")
    articles = fetch_news_from_all(query)
    return jsonify({"articles": articles})


@app.route("/verify/claim", methods=["POST"])
def verify_claim_route():
    data = request.get_json()
    claim = data.get("claim", "")
    if not claim:
        return jsonify({"error": "No claim provided"}), 400

    result = verify_claim(claim)
    return jsonify(result)


if __name__ == "__main__":
    print("✅ Aegis Verify (Free API version) running...")
    print("Available routes:")
    print(" - GET  /verify/news")
    print(" - POST /verify/claim")
    app.run(debug=True)
