import requests
import os

API_KEY = os.getenv("NEWS_API_KEY")  # put this in .env file later

def query_news(claim):
    url = f"https://newsapi.org/v2/everything?q={claim}&language=en&apiKey={API_KEY}"
    response = requests.get(url)
    data = response.json()

    articles = []
    for article in data.get("articles", []):
        articles.append({
            "title": article["title"],
            "url": article["url"],
            "source": article["source"]["name"],
            "description": article["description"]
        })
    return articles
