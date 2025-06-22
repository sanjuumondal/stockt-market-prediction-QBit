# Create requirements.txt for the Flask backend
requirements_content = '''
Flask==2.3.3
Flask-SQLAlchemy==3.0.5
Flask-SocketIO==5.3.6
yfinance==0.2.22
tensorflow==2.13.0
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
statsmodels==0.14.0
requests==2.31.0
textblob==0.17.1
python-socketio==5.8.0
python-engineio==4.7.1
eventlet==0.33.3
gunicorn==21.2.0
psycopg2-binary==2.9.7
python-dotenv==1.0.0
'''

with open('requirements.txt', 'w') as f:
    f.write(requirements_content.strip())

# Create data processing utilities
data_utils_code = '''
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests
from textblob import TextBlob

class StockDataFetcher:
    def __init__(self):
        self.cache = {}
        
    def get_stock_data(self, symbol, period="1y"):
        """Fetch stock data from Yahoo Finance"""
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period=period)
            info = stock.info
            
            return {
                'historical_data': hist,
                'info': info,
                'symbol': symbol
            }
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}")
            return None
    
    def get_real_time_price(self, symbol):
        """Get current stock price"""
        try:
            stock = yf.Ticker(symbol)
            data = stock.history(period="1d")
            return data['Close'].iloc[-1]
        except Exception as e:
            print(f"Error getting real-time price for {symbol}: {e}")
            return None
    
    def get_technical_indicators(self, symbol, period="6mo"):
        """Calculate technical indicators"""
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(period=period)
            
            # Simple Moving Averages
            hist['SMA_20'] = hist['Close'].rolling(window=20).mean()
            hist['SMA_50'] = hist['Close'].rolling(window=50).mean()
            
            # Exponential Moving Average
            hist['EMA_12'] = hist['Close'].ewm(span=12).mean()
            hist['EMA_26'] = hist['Close'].ewm(span=26).mean()
            
            # RSI calculation
            delta = hist['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
            rs = gain / loss
            hist['RSI'] = 100 - (100 / (1 + rs))
            
            return hist
        except Exception as e:
            print(f"Error calculating technical indicators for {symbol}: {e}")
            return None

class SentimentAnalyzer:
    def __init__(self):
        self.news_sources = [
            'https://finnhub.io/api/v1/news',
            'https://newsapi.org/v2/everything'
        ]
    
    def get_news_sentiment(self, symbol):
        """Get sentiment analysis from news articles"""
        try:
            # Simulate news data (in production, you'd fetch from real APIs)
            sample_news = [
                f"{symbol} reports strong quarterly earnings, beating expectations",
                f"Analysts upgrade {symbol} stock rating amid growth prospects",
                f"Market volatility affects {symbol} performance in recent trading",
                f"{symbol} announces new product lineup for upcoming quarter",
                f"Supply chain concerns impact {symbol} production forecasts"
            ]
            
            sentiments = []
            for article in sample_news:
                blob = TextBlob(article)
                sentiment_score = blob.sentiment.polarity
                sentiments.append({
                    'title': article,
                    'sentiment': 'Positive' if sentiment_score > 0 else 'Negative' if sentiment_score < 0 else 'Neutral',
                    'score': round(sentiment_score, 2),
                    'source': 'Financial News API'
                })
            
            overall_sentiment = np.mean([s['score'] for s in sentiments])
            
            return {
                'overall_sentiment': 'Positive' if overall_sentiment > 0 else 'Negative',
                'sentiment_score': round(overall_sentiment, 2),
                'articles': sentiments,
                'article_count': len(sentiments)
            }
        except Exception as e:
            print(f"Error analyzing sentiment for {symbol}: {e}")
            return None

class PortfolioManager:
    def __init__(self):
        self.portfolio = {}
    
    def add_stock(self, symbol, shares, avg_cost):
        """Add stock to portfolio"""
        if symbol in self.portfolio:
            # Update existing position
            current_shares = self.portfolio[symbol]['shares']
            current_avg_cost = self.portfolio[symbol]['avg_cost']
            
            new_shares = current_shares + shares
            new_avg_cost = ((current_shares * current_avg_cost) + (shares * avg_cost)) / new_shares
            
            self.portfolio[symbol] = {
                'shares': new_shares,
                'avg_cost': round(new_avg_cost, 2)
            }
        else:
            self.portfolio[symbol] = {
                'shares': shares,
                'avg_cost': avg_cost
            }
    
    def remove_stock(self, symbol, shares=None):
        """Remove stock from portfolio"""
        if symbol in self.portfolio:
            if shares is None:
                del self.portfolio[symbol]
            else:
                current_shares = self.portfolio[symbol]['shares']
                if shares >= current_shares:
                    del self.portfolio[symbol]
                else:
                    self.portfolio[symbol]['shares'] -= shares
    
    def get_portfolio_value(self, fetcher):
        """Calculate total portfolio value"""
        total_value = 0
        total_cost = 0
        
        for symbol, position in self.portfolio.items():
            current_price = fetcher.get_real_time_price(symbol)
            if current_price:
                position_value = position['shares'] * current_price
                position_cost = position['shares'] * position['avg_cost']
                
                total_value += position_value
                total_cost += position_cost
        
        return {
            'total_value': round(total_value, 2),
            'total_cost': round(total_cost, 2),
            'total_gain_loss': round(total_value - total_cost, 2),
            'total_gain_loss_percent': round(((total_value - total_cost) / total_cost) * 100, 2) if total_cost > 0 else 0
        }
'''

with open('utils.py', 'w') as f:
    f.write(data_utils_code)

print("✅ Requirements and utilities created:")
print("   - requirements.txt")
print("   - utils.py")