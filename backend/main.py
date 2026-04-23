import re
import statistics
import urllib.parse
from typing import Optional

import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CHROME_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

PRICE_MIN = 100_000       # 10万円 – sanity lower bound
PRICE_MAX = 100_000_000   # 1億円 – sanity upper bound


class EstimateRequest(BaseModel):
    maker: str
    model: str
    year: int
    mileage: int
    grade: Optional[str] = None


class EstimateResponse(BaseModel):
    min_price: int
    max_price: int
    median_price: int
    advice: str


def _parse_prices_from_text(texts: list[str]) -> list[int]:
    prices: list[int] = []
    for text in texts:
        # "128万円" form
        m = re.search(r"([\d,]+)\s*万円", text)
        if m:
            val = int(m.group(1).replace(",", "")) * 10_000
            if PRICE_MIN <= val <= PRICE_MAX:
                prices.append(val)
            continue
        # "1,280,000円" form
        m = re.search(r"([\d,]+)\s*円", text)
        if m:
            val = int(m.group(1).replace(",", ""))
            if PRICE_MIN <= val <= PRICE_MAX:
                prices.append(val)
    return prices


def scrape_carsensor_prices(req: EstimateRequest) -> list[int]:
    params = urllib.parse.urlencode({
        "FREE_WORD": f"{req.maker} {req.model}",
        "YEAR_FROM": req.year,
        "YEAR_TO": req.year,
    })
    url = f"https://www.carsensor.net/usedcar/search.php?{params}"

    print(f"スクレイピングURL: {url}")
    try:
        resp = requests.get(
            url,
            headers={"User-Agent": CHROME_UA},
            timeout=30,
        )
        resp.raise_for_status()
        resp.encoding = "utf-8"

        html = resp.text
        soup_title = BeautifulSoup(html, "html.parser")
        title_tag = soup_title.find("title")
        print(f"ページタイトル: {title_tag.get_text(strip=True) if title_tag else '(titleタグなし)'}")

        soup = BeautifulSoup(html, "html.parser")

        price_elements = soup.find_all(class_=re.compile(r"price", re.I))
        print(f"price要素一覧({len(price_elements)}件):")
        for el in price_elements:
            print(f"  [{el.get('class')}] {el.get_text(strip=True)}")

        # Try candidate selectors in order
        candidate_selectors = [
            ("cs-price", "class"),
            ("price", "class"),
            ("carPrice", "class"),
        ]
        texts: list[str] = []
        for attr_val, attr_name in candidate_selectors:
            if attr_name == "class":
                elements = soup.find_all(class_=re.compile(attr_val, re.I))
            else:
                elements = soup.find_all(attrs={attr_name: re.compile(attr_val, re.I)})
            texts = [el.get_text() for el in elements]
            prices = _parse_prices_from_text(texts)
            if prices:
                print(f"取得件数: {len(prices)}")
                return prices

        prices = _parse_prices_from_text(texts)
        print(f"取得件数: {len(prices)}")
        return prices

    except Exception as e:
        print(f"スクレイピングエラー: {e}")

    print("取得件数: 0")
    return []


def calculate_mock_price(req: EstimateRequest) -> tuple[int, int, int]:
    base = 2_000_000
    age = 2026 - req.year
    base -= age * 150_000

    if req.mileage > 100_000:
        base -= 400_000
    elif req.mileage > 50_000:
        base -= 200_000
    elif req.mileage < 20_000:
        base += 200_000

    base = max(base, 300_000)
    spread = int(base * 0.15)
    return base - spread, base + spread, base


def build_advice(req: EstimateRequest, median: int, source: str) -> str:
    parts = []

    if source == "scraped":
        parts.append("カーセンサーの実際の掲載データをもとに算出しました。")

    age = 2026 - req.year
    if age >= 10:
        parts.append("年式が古めのため、消耗品の交換履歴を確認することをお勧めします。")
    elif age <= 3:
        parts.append("比較的新しい車両で状態が良い可能性が高いです。")

    if req.mileage > 100_000:
        parts.append("走行距離が10万kmを超えているため、エンジンや足回りの点検を推奨します。")
    elif req.mileage < 20_000:
        parts.append("走行距離が少なく、良好なコンディションが期待できます。")

    if req.grade:
        parts.append(f"グレード「{req.grade}」は装備面でのアピールポイントになります。")

    parts.append(f"市場相場の中央値は約{median // 10_000}万円と推定されます。")
    return "".join(parts)


@app.post("/api/estimate", response_model=EstimateResponse)
def estimate(req: EstimateRequest) -> EstimateResponse:
    prices = scrape_carsensor_prices(req)

    if len(prices) >= 5:
        min_price = min(prices)
        max_price = max(prices)
        median_price = int(statistics.median(prices))
        source = "scraped"
    else:
        min_price, max_price, median_price = calculate_mock_price(req)
        source = "mock"

    advice = build_advice(req, median_price, source)
    return EstimateResponse(
        min_price=min_price,
        max_price=max_price,
        median_price=median_price,
        advice=advice,
    )
