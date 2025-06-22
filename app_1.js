// Sample data from the application
const sampleData = {
    sample_stocks: [
        {"symbol": "AAPL", "name": "Apple Inc.", "price": 175.43, "change": 2.15, "change_percent": 1.24},
        {"symbol": "GOOGL", "name": "Alphabet Inc.", "price": 2847.63, "change": -15.22, "change_percent": -0.53},
        {"symbol": "MSFT", "name": "Microsoft Corp.", "price": 378.85, "change": 5.67, "change_percent": 1.52},
        {"symbol": "TSLA", "name": "Tesla Inc.", "price": 248.42, "change": -8.33, "change_percent": -3.24},
        {"symbol": "AMZN", "name": "Amazon.com Inc.", "price": 3342.88, "change": 12.45, "change_percent": 0.37}
    ],
    prediction_models: [
        {"name": "LSTM", "accuracy": 87.3, "prediction": 182.45, "confidence": 0.85},
        {"name": "ARIMA", "accuracy": 73.1, "prediction": 179.22, "confidence": 0.72},
        {"name": "Linear Regression", "accuracy": 65.8, "prediction": 176.88, "confidence": 0.68}
    ],
    sentiment_data: {
        "overall_sentiment": "Positive",
        "sentiment_score": 0.65,
        "news_count": 45,
        "positive_news": 28,
        "negative_news": 12,
        "neutral_news": 5
    },
    news_articles: [
        {"title": "Apple Reports Strong Q4 Earnings", "sentiment": "Positive", "score": 0.8, "source": "Financial Times"},
        {"title": "iPhone Sales Exceed Expectations", "sentiment": "Positive", "score": 0.75, "source": "Reuters"},
        {"title": "Supply Chain Concerns for Tech Sector", "sentiment": "Negative", "score": -0.6, "source": "Bloomberg"},
        {"title": "Tech Stocks Rally Amid AI Optimism", "sentiment": "Positive", "score": 0.7, "source": "Wall Street Journal"},
        {"title": "Market Volatility Continues", "sentiment": "Negative", "score": -0.4, "source": "CNBC"}
    ],
    portfolio_data: [
        {"symbol": "AAPL", "shares": 10, "avg_cost": 165.00, "current_value": 1754.30, "gain_loss": 254.30},
        {"symbol": "MSFT", "shares": 5, "avg_cost": 350.00, "current_value": 1894.25, "gain_loss": 144.25}
    ]
};

// Global variables
let currentSelectedStock = null;
let priceChart = null;
let portfolioChart = null;

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
    
    // Add event listeners
    setupEventListeners();
});

function initializeApp() {
    try {
        // Detect and set initial theme
        initializeTheme();
        
        // Populate stock data
        populateStockGrid();
        
        // Populate portfolio data
        populatePortfolioHoldings();
        
        // Populate news items
        populateNewsItems();
        
        // Populate prediction models
        populatePredictionModels();
        
        // Initialize charts
        setTimeout(() => {
            initializeCharts();
        }, 100);
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showError('Failed to initialize application. Please refresh the page.');
    }
}

function setupEventListeners() {
    // Search stock on Enter key
    const searchInput = document.getElementById('stock-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchStock();
            }
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('add-stock-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideAddStockModal();
            }
        });
    }
}

// Theme management
function initializeTheme() {
    try {
        // Check for stored theme preference or use system preference
        const storedTheme = localStorage.getItem('theme') || getPreferredTheme();
        
        if (storedTheme) {
            document.documentElement.setAttribute('data-color-scheme', storedTheme);
            updateThemeToggleButton(storedTheme);
            
            // Update theme selector in settings
            const themeSelect = document.getElementById('theme-select');
            if (themeSelect) {
                themeSelect.value = storedTheme;
            }
        }
    } catch (error) {
        console.error('Error initializing theme:', error);
    }
}

function getPreferredTheme() {
    // Check if system preference is dark
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
}

function toggleTheme() {
    try {
        // Get current theme
        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || getPreferredTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Set new theme
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        
        // Store theme preference
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
        
        // Update theme toggle button
        updateThemeToggleButton(newTheme);
        
        // Update theme selector in settings
        const themeSelect = document.getElementById('theme-select');
        if (themeSelect) {
            themeSelect.value = newTheme;
        }
        
        // Update charts if they exist
        setTimeout(() => {
            if (priceChart) priceChart.update();
            if (portfolioChart) portfolioChart.update();
        }, 100);
        
    } catch (error) {
        console.error('Error toggling theme:', error);
        showError('Failed to change theme');
    }
}

function changeTheme(theme) {
    try {
        // Set new theme from select dropdown
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        // Store theme preference
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
        
        // Update theme toggle button
        updateThemeToggleButton(theme);
    } catch (error) {
        console.error('Error changing theme:', error);
    }
}

function updateThemeToggleButton(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    }
}

// Navigation
function showLanding() {
    try {
        document.getElementById('dashboard').classList.remove('active');
        document.getElementById('landing-page').classList.add('active');
    } catch (error) {
        console.error('Error showing landing page:', error);
    }
}

function showDashboard() {
    try {
        document.getElementById('landing-page').classList.remove('active');
        document.getElementById('dashboard').classList.add('active');
        
        // Show overview section by default
        showSection('overview');
    } catch (error) {
        console.error('Error showing dashboard:', error);
    }
}

function showSection(sectionId) {
    try {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the selected section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`.nav-item[onclick="showSection('${sectionId}')"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
    } catch (error) {
        console.error('Error showing section:', error);
    }
}

// Stock Grid
function populateStockGrid() {
    try {
        const stockGrid = document.getElementById('stock-grid');
        if (!stockGrid) return;
        
        stockGrid.innerHTML = '';
        
        sampleData.sample_stocks.forEach(stock => {
            const card = document.createElement('div');
            card.className = 'card stock-card';
            card.setAttribute('data-symbol', stock.symbol);
            card.onclick = () => selectStock(stock.symbol);
            
            const isPositive = stock.change >= 0;
            const changeClass = isPositive ? 'positive' : 'negative';
            const changePrefix = isPositive ? '+' : '';
            
            card.innerHTML = `
                <div class="card__body">
                    <div class="stock-card-header">
                        <div class="stock-card-info">
                            <h4>${stock.symbol}</h4>
                            <p>${stock.name}</p>
                        </div>
                        <div class="stock-card-price">
                            <span class="price">$${stock.price.toFixed(2)}</span>
                            <span class="stock-change ${changeClass}">${changePrefix}${stock.change.toFixed(2)} (${changePrefix}${stock.change_percent.toFixed(2)}%)</span>
                        </div>
                    </div>
                </div>
            `;
            
            stockGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error populating stock grid:', error);
        showError('Failed to load stock data');
    }
}

// Stock selection
function selectStock(symbol) {
    try {
        // Find the stock data
        const stock = sampleData.sample_stocks.find(s => s.symbol === symbol);
        if (!stock) {
            showError(`Stock ${symbol} not found`);
            return;
        }
        
        currentSelectedStock = symbol;
        
        // Update the selected stock info
        const stockInfo = document.getElementById('selected-stock-info');
        if (stockInfo) {
            const isPositive = stock.change >= 0;
            const changeClass = isPositive ? 'positive' : 'negative';
            const changePrefix = isPositive ? '+' : '';
            
            stockInfo.innerHTML = `
                <span class="stock-symbol">${stock.symbol}</span>
                <span class="stock-name">${stock.name}</span>
                <span class="stock-price">$${stock.price.toFixed(2)}</span>
                <span class="stock-change ${changeClass}">${changePrefix}${stock.change.toFixed(2)} (${changePrefix}${stock.change_percent.toFixed(2)}%)</span>
            `;
        }
        
        // Show the analysis section
        showSection('analysis');
        
        // Update charts
        updateChartForStock(symbol);
        
        // Update prediction models for this stock
        updatePredictionModelsForStock(symbol);
        
    } catch (error) {
        console.error('Error selecting stock:', error);
        showError('Failed to load stock analysis');
    }
}

// Search stock
function searchStock() {
    try {
        const searchInput = document.getElementById('stock-search');
        if (!searchInput) return;
        
        const symbol = searchInput.value.trim().toUpperCase();
        
        if (!symbol) {
            showError('Please enter a stock symbol');
            return;
        }
        
        // Check if the stock exists in our sample data
        const stockExists = sampleData.sample_stocks.some(s => s.symbol === symbol);
        
        if (stockExists) {
            selectStock(symbol);
            showSuccess(`Stock ${symbol} loaded successfully`);
        } else {
            showError(`Stock symbol "${symbol}" not found. Available symbols: ${sampleData.sample_stocks.map(s => s.symbol).join(', ')}`);
        }
        
        // Clear the search input
        searchInput.value = '';
        
    } catch (error) {
        console.error('Error searching stock:', error);
        showError('Search failed. Please try again.');
    }
}

// Prediction Models
function populatePredictionModels() {
    try {
        const modelResults = document.getElementById('model-results');
        if (!modelResults) return;
        
        modelResults.innerHTML = '';
        
        // Sort models by accuracy (highest first)
        const sortedModels = [...sampleData.prediction_models].sort((a, b) => b.accuracy - a.accuracy);
        
        sortedModels.forEach((model, index) => {
            const modelDiv = document.createElement('div');
            modelDiv.className = `model-result ${index === 0 ? 'best' : ''}`;
            
            modelDiv.innerHTML = `
                <div class="model-info">
                    <h4>${model.name}</h4>
                    <span class="model-accuracy">Accuracy: ${model.accuracy.toFixed(1)}%</span>
                </div>
                <div class="model-prediction">
                    <span class="prediction-value">$${model.prediction.toFixed(2)}</span>
                    <div class="confidence-score">Confidence: ${(model.confidence * 100).toFixed(0)}%</div>
                </div>
            `;
            
            modelResults.appendChild(modelDiv);
        });
    } catch (error) {
        console.error('Error populating prediction models:', error);
    }
}

function updatePredictionModelsForStock(symbol) {
    try {
        const stock = sampleData.sample_stocks.find(s => s.symbol === symbol);
        if (!stock) return;
        
        // Generate predictions based on current stock price
        const updatedModels = sampleData.prediction_models.map(model => ({
            ...model,
            prediction: stock.price * (1 + (model.confidence * 0.1 * (Math.random() * 0.2 + 0.9)))
        }));
        
        const modelResults = document.getElementById('model-results');
        if (!modelResults) return;
        
        modelResults.innerHTML = '';
        
        const sortedModels = [...updatedModels].sort((a, b) => b.accuracy - a.accuracy);
        
        sortedModels.forEach((model, index) => {
            const modelDiv = document.createElement('div');
            modelDiv.className = `model-result ${index === 0 ? 'best' : ''}`;
            
            modelDiv.innerHTML = `
                <div class="model-info">
                    <h4>${model.name}</h4>
                    <span class="model-accuracy">Accuracy: ${model.accuracy.toFixed(1)}%</span>
                </div>
                <div class="model-prediction">
                    <span class="prediction-value">$${model.prediction.toFixed(2)}</span>
                    <div class="confidence-score">Confidence: ${(model.confidence * 100).toFixed(0)}%</div>
                </div>
            `;
            
            modelResults.appendChild(modelDiv);
        });
    } catch (error) {
        console.error('Error updating prediction models:', error);
    }
}

// Portfolio Holdings
function populatePortfolioHoldings() {
    try {
        const holdingsTable = document.getElementById('holdings-table');
        if (!holdingsTable) return;
        
        // Clear existing content
        holdingsTable.innerHTML = '';
        
        // Add header
        const header = document.createElement('div');
        header.className = 'holdings-header';
        header.innerHTML = `
            <div>Stock</div>
            <div>Shares</div>
            <div>Avg Cost</div>
            <div>Current Value</div>
            <div>Current Price</div>
            <div>Gain/Loss</div>
        `;
        holdingsTable.appendChild(header);
        
        // Add portfolio items
        sampleData.portfolio_data.forEach(item => {
            // Find the current price from sample stocks
            const stockInfo = sampleData.sample_stocks.find(s => s.symbol === item.symbol);
            const currentPrice = stockInfo ? stockInfo.price : item.current_value / item.shares;
            
            const row = document.createElement('div');
            row.className = 'holdings-row';
            
            const isPositive = item.gain_loss >= 0;
            const changeClass = isPositive ? 'positive' : 'negative';
            const changePrefix = isPositive ? '+' : '';
            
            row.innerHTML = `
                <div>
                    <div class="holding-symbol">${item.symbol}</div>
                    <div class="holding-name">${stockInfo ? stockInfo.name : 'Unknown Company'}</div>
                </div>
                <div>${item.shares}</div>
                <div>$${item.avg_cost.toFixed(2)}</div>
                <div>$${item.current_value.toFixed(2)}</div>
                <div>$${currentPrice.toFixed(2)}</div>
                <div class="${changeClass}">
                    ${changePrefix}$${Math.abs(item.gain_loss).toFixed(2)}
                    (${changePrefix}${((item.gain_loss / (item.avg_cost * item.shares)) * 100).toFixed(2)}%)
                </div>
            `;
            
            holdingsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error populating portfolio holdings:', error);
        showError('Failed to load portfolio data');
    }
}

// News Items
function populateNewsItems() {
    try {
        const newsList = document.getElementById('news-list');
        if (!newsList) return;
        
        newsList.innerHTML = '';
        
        sampleData.news_articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            
            const sentimentClass = article.sentiment.toLowerCase();
            
            newsItem.innerHTML = `
                <div class="news-header">
                    <h4 class="news-title">${article.title}</h4>
                    <span class="news-sentiment ${sentimentClass}">${article.sentiment}</span>
                </div>
                <div class="news-source">Source: ${article.source}</div>
            `;
            
            newsList.appendChild(newsItem);
        });
    } catch (error) {
        console.error('Error populating news items:', error);
    }
}

// Chart initialization
function initializeCharts() {
    try {
        // Price chart
        initializePriceChart();
        
        // Portfolio chart
        initializePortfolioChart();
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function initializePriceChart() {
    try {
        const ctx = document.getElementById('price-chart');
        if (!ctx) return;
        
        // Generate sample historical data for AAPL
        const historicalDates = generateDates(30);
        const historicalPrices = generateHistoricalPrices(165, 175.43, 30);
        
        // Generate prediction data
        const predictionDates = generateDates(15, historicalDates[historicalDates.length - 1]);
        
        // LSTM prediction line
        const lstmPrediction = generatePredictionPrices(175.43, sampleData.prediction_models[0].prediction, 15);
        
        // Create the chart
        priceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [...historicalDates, ...predictionDates],
                datasets: [
                    {
                        label: 'Historical Prices',
                        data: [...historicalPrices, null, ...Array(14).fill(null)],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 2,
                        borderWidth: 2
                    },
                    {
                        label: 'LSTM Prediction',
                        data: [...Array(30).fill(null), ...lstmPrediction],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        borderDash: [5, 5],
                        tension: 0.4,
                        pointRadius: 2,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Price ($)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing price chart:', error);
    }
}

function initializePortfolioChart() {
    try {
        const ctx = document.getElementById('portfolio-chart');
        if (!ctx) return;
        
        // Generate sample portfolio performance data
        const dates = generateDates(30);
        const portfolioValues = generateHistoricalPrices(3200, 3648.55, 30);
        
        // Create the chart
        portfolioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Portfolio Value',
                        data: portfolioValues,
                        borderColor: '#5D878F',
                        backgroundColor: 'rgba(93, 135, 143, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 2,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value ($)'
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error initializing portfolio chart:', error);
    }
}

function updateChartForStock(symbol) {
    try {
        // Find the stock data
        const stock = sampleData.sample_stocks.find(s => s.symbol === symbol);
        if (!stock || !priceChart) return;
        
        // Generate new historical data based on current stock price
        const historicalDates = generateDates(30);
        const historicalPrices = generateHistoricalPrices(stock.price * 0.9, stock.price, 30);
        
        // Generate prediction data for selected stock
        const predictionDates = generateDates(15, historicalDates[historicalDates.length - 1]);
        
        // Use prediction model data to generate prediction lines
        const lstmPrediction = generatePredictionPrices(
            stock.price,
            stock.price * (1 + (sampleData.prediction_models[0].confidence * 0.05)),
            15
        );
        
        // Update chart data
        priceChart.data.labels = [...historicalDates, ...predictionDates];
        priceChart.data.datasets[0].data = [...historicalPrices, null, ...Array(14).fill(null)];
        priceChart.data.datasets[1].data = [...Array(30).fill(null), ...lstmPrediction];
        
        // Update chart title
        priceChart.options.plugins.title = {
            display: true,
            text: `${stock.symbol} - Historical Prices & Predictions`
        };
        
        // Update the chart
        priceChart.update();
    } catch (error) {
        console.error('Error updating chart for stock:', error);
    }
}

// Helper functions for chart data
function generateDates(days, startDate = null) {
    const dates = [];
    const start = startDate ? new Date(startDate) : new Date();
    start.setDate(start.getDate() - days);
    
    for (let i = 0; i < days; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return dates;
}

function generateHistoricalPrices(startPrice, endPrice, days) {
    const prices = [];
    const volatility = 0.01; // 1% daily volatility
    let currentPrice = startPrice;
    
    for (let i = 0; i < days - 1; i++) {
        // Random walk with slight upward bias towards the end price
        const bias = (endPrice - currentPrice) / (days - i) * 0.1;
        const change = currentPrice * (Math.random() * volatility * 2 - volatility + bias);
        currentPrice += change;
        prices.push(currentPrice);
    }
    
    // Ensure the last price is the end price
    prices.push(endPrice);
    
    return prices;
}

function generatePredictionPrices(startPrice, endPrice, days) {
    const prices = [];
    let currentPrice = startPrice;
    const step = (endPrice - startPrice) / days;
    
    for (let i = 0; i < days; i++) {
        // Add some noise to the prediction for realism
        const noise = currentPrice * 0.002 * (Math.random() * 2 - 1); // ±0.2% noise
        currentPrice += step + noise;
        prices.push(currentPrice);
    }
    
    return prices;
}

// Modal functionality
function showAddStockModal() {
    try {
        const modal = document.getElementById('add-stock-modal');
        if (modal) {
            modal.classList.add('active');
            
            // Focus on the first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    } catch (error) {
        console.error('Error showing add stock modal:', error);
        showError('Failed to open add stock dialog');
    }
}

function hideAddStockModal() {
    try {
        const modal = document.getElementById('add-stock-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    } catch (error) {
        console.error('Error hiding add stock modal:', error);
    }
}

function addStockToPortfolio() {
    try {
        const symbolInput = document.getElementById('modal-stock-symbol');
        const sharesInput = document.getElementById('modal-shares');
        const costInput = document.getElementById('modal-cost');
        
        if (!symbolInput || !sharesInput || !costInput) {
            showError('Form inputs not found');
            return;
        }
        
        const symbol = symbolInput.value.trim().toUpperCase();
        const shares = parseInt(sharesInput.value.trim());
        const cost = parseFloat(costInput.value.trim());
        
        if (!symbol || isNaN(shares) || isNaN(cost) || shares <= 0 || cost <= 0) {
            showError('Please enter valid values for all fields.');
            return;
        }
        
        // Check if the stock exists in our sample data
        const stockInfo = sampleData.sample_stocks.find(s => s.symbol === symbol);
        
        if (!stockInfo) {
            showError(`Stock symbol "${symbol}" not found. Available symbols: ${sampleData.sample_stocks.map(s => s.symbol).join(', ')}`);
            return;
        }
        
        // Check if stock already exists in portfolio
        const existingStock = sampleData.portfolio_data.find(p => p.symbol === symbol);
        if (existingStock) {
            // Update existing position
            const totalShares = existingStock.shares + shares;
            const totalCost = (existingStock.avg_cost * existingStock.shares) + (cost * shares);
            existingStock.avg_cost = totalCost / totalShares;
            existingStock.shares = totalShares;
            existingStock.current_value = stockInfo.price * totalShares;
            existingStock.gain_loss = existingStock.current_value - totalCost;
        } else {
            // Add new position
            const currentValue = stockInfo.price * shares;
            const gainLoss = currentValue - (cost * shares);
            
            sampleData.portfolio_data.push({
                symbol: symbol,
                shares: shares,
                avg_cost: cost,
                current_value: currentValue,
                gain_loss: gainLoss
            });
        }
        
        // Refresh portfolio display
        populatePortfolioHoldings();
        
        // Close the modal
        hideAddStockModal();
        
        // Reset form fields
        symbolInput.value = '';
        sharesInput.value = '';
        costInput.value = '';
        
        // Show success message
        showSuccess(`Successfully added ${shares} shares of ${symbol} to your portfolio`);
        
        // Show the portfolio section
        showSection('portfolio');
        
    } catch (error) {
        console.error('Error adding stock to portfolio:', error);
        showError('Failed to add stock to portfolio');
    }
}

// Notification functions
function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    try {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 3000;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    max-width: 400px;
                    animation: slideIn 0.3s ease-out;
                }
                .notification--error {
                    background-color: #c0152f;
                }
                .notification--success {
                    background-color: #21808d;
                }
                .notification--info {
                    background-color: #626c71;
                }
                .notification button {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    } catch (error) {
        console.error('Error showing notification:', error);
        // Fallback to alert
        alert(message);
    }
}