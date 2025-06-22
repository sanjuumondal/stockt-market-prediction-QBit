# Create deployment configuration files

# Procfile for Heroku deployment
procfile_content = '''web: gunicorn app:app
worker: python worker.py'''

with open('Procfile', 'w') as f:
    f.write(procfile_content)

# Environment configuration
env_example = '''# Database Configuration
DATABASE_URL=postgresql://username:password@localhost/stockprediction
SQLALCHEMY_DATABASE_URI=sqlite:///stock_prediction.db

# API Keys
FINNHUB_API_KEY=your_finnhub_api_key_here
NEWS_API_KEY=your_news_api_key_here
TWITTER_API_KEY=your_twitter_api_key_here

# Flask Configuration
SECRET_KEY=your-super-secret-key-here
FLASK_ENV=production
FLASK_DEBUG=False

# Socket.IO Configuration
SOCKETIO_ASYNC_MODE=eventlet

# Redis Configuration (for production)
REDIS_URL=redis://localhost:6379/0
'''

with open('.env.example', 'w') as f:
    f.write(env_example)

# Vercel configuration for frontend
vercel_config = '''{
  "builds": [
    {
      "src": "static/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-heroku-app.herokuapp.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/static/$1"
    }
  ]
}'''

with open('vercel.json', 'w') as f:
    f.write(vercel_config)

# Create runtime configuration for Heroku
runtime_content = '''python-3.11.5'''

with open('runtime.txt', 'w') as f:
    f.write(runtime_content)

print("✅ Deployment configuration files created:")
print("   - Procfile (Heroku)")
print("   - .env.example (Environment variables)")
print("   - vercel.json (Vercel configuration)")
print("   - runtime.txt (Python version)")