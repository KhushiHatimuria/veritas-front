from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from langdetect import detect, DetectorFactory
import os, requests, html, time

# make langdetect results consistent
DetectorFactory.seed = 0  

load_dotenv()

MYMEMORY_URL = "https://api.mymemory.translated.net/get"
MYMEMORY_EMAIL = os.getenv("MYMEMORY_EMAIL")  # optional
PORT = int(os.getenv("PORT", 8000))

app = FastAPI(title="MyMemory Translator (FastAPI)")

# Allow local React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# simple in-memory cache
_cache = {}
CACHE_TTL = 60 * 60  # 1 hour

class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    target_lang: str = Field(..., min_length=2)   # e.g., "hi", "fr"
    source_lang: str = Field("auto", min_length=2) # "auto" or "en"

class TranslateResponse(BaseModel):
    translated_text: str

def cache_get(key):
    item = _cache.get(key)
    if not item:
        return None
    ts, value = item
    if time.time() - ts > CACHE_TTL:
        _cache.pop(key, None)
        return None
    return value

def cache_set(key, value):
    _cache[key] = (time.time(), value)

@app.post("/translate", response_model=TranslateResponse)
def translate(req: TranslateRequest):
    # detect language if auto
    source_lang = req.source_lang
    if source_lang.lower() == "auto":
        try:
            source_lang = detect(req.text)
        except Exception:
            source_lang = "en"  # safe fallback

    # cache key
    key = (req.text.strip(), source_lang, req.target_lang)
    cached = cache_get(key)
    if cached:
        return {"translated_text": cached}

    params = {
        "q": req.text,
        "langpair": f"{source_lang}|{req.target_lang}",
        "mt": 1
    }
    if MYMEMORY_EMAIL:
        params["de"] = MYMEMORY_EMAIL

    try:
        r = requests.get(MYMEMORY_URL, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Upstream error: {e}")

    resp_data = data.get("responseData", {})
    translated = resp_data.get("translatedText", "") or ""
    if not translated:
        matches = data.get("matches", [])
        if matches:
            translated = matches[0].get("translation", "")
    if not translated:
        details = data.get("responseDetails") or data.get("error") or "No translation returned"
        raise HTTPException(status_code=429, detail=details)

    translated = html.unescape(translated).strip()

    cache_set(key, translated)
    return {"translated_text": translated}

# optional: batch translate
class BatchRequest(BaseModel):
    text: str
    target_langs: list[str]
    source_lang: str = "auto"

@app.post("/translate_batch")
def translate_batch(req: BatchRequest):
    out = {}
    source_lang = req.source_lang
    if source_lang.lower() == "auto":
        try:
            source_lang = detect(req.text)
        except Exception:
            source_lang = "en"

    for tgt in req.target_langs:
        payload = {"text": req.text, "target_lang": tgt, "source_lang": source_lang}
        res = translate(TranslateRequest(**payload))
        out[tgt] = res["translated_text"]
    return out

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=PORT, reload=True)
