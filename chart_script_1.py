import plotly.graph_objects as go
import numpy as np

# Create figure
fig = go.Figure()

# Define positions with better spacing
positions = {
    'frontend': (1.5, 5.5),
    'vercel': (3.5, 5.5),
    'api': (1.5, 4),
    'heroku': (3.5, 4),
    'ml': (1.5, 2.5),
    'data': (1.5, 1)
}

# Define detailed node information with all technologies
node_info = {
    'frontend': {
        'name': 'Frontend',
        'details': ['Bootstrap 5', 'Chart.js', 'JavaScript', 'WebSocket'],
        'color': '#1FB8CD'
    },
    'vercel': {
        'name': 'Vercel Deploy',
        'details': ['Frontend Host'],
        'color': '#D2BA4C'
    },
    'api': {
        'name': 'Flask API',
        'details': ['REST API', 'Flask-SocketIO', '/predict /sentiment'],
        'color': '#FFC185'
    },
    'heroku': {
        'name': 'Heroku Deploy',
        'details': ['Backend Host'],
        'color': '#D2BA4C'
    },
    'ml': {
        'name': 'ML Models',
        'details': ['LSTM (87.3%)', 'ARIMA (73.1%)', 'Linear (65.8%)'],
        'color': '#ECEBD5'
    },
    'data': {
        'name': 'Data Sources',
        'details': ['Yahoo Finance', 'News APIs', 'Twitter API', 'Database'],
        'color': '#5D878F'
    }
}

# Add larger rectangular nodes
for node_id, info in node_info.items():
    x, y = positions[node_id]
    
    # Create larger rectangle for better text fit
    width = 0.7
    height = 0.6
    
    fig.add_shape(
        type="rect",
        x0=x-width/2, y0=y-height/2, 
        x1=x+width/2, y1=y+height/2,
        line=dict(color="#333", width=2),
        fillcolor=info['color'],
        opacity=0.9
    )
    
    # Add node title with larger font
    fig.add_annotation(
        x=x, y=y+0.15,
        text=f"<b>{info['name']}</b>",
        showarrow=False,
        font=dict(size=14, color='#000'),
        bgcolor="rgba(255,255,255,0.9)",
        bordercolor="#333",
        borderwidth=1,
        borderpad=2
    )
    
    # Add node details with better spacing
    for i, detail in enumerate(info['details']):
        fig.add_annotation(
            x=x, y=y-0.05-i*0.08,
            text=detail,
            showarrow=False,
            font=dict(size=10, color='#000'),
            bgcolor="rgba(255,255,255,0.8)"
        )

# Define connections with clearer labels
connections = [
    ('frontend', 'api', 'HTTP Requests'),
    ('api', 'ml', 'Predictions'),
    ('ml', 'data', 'Training Data'),
    ('api', 'data', 'Live Data'),
    ('frontend', 'vercel', ''),
    ('api', 'heroku', '')
]

# Add arrows for connections with better positioning
for start, end, label in connections:
    x0, y0 = positions[start]
    x1, y1 = positions[end]
    
    # Adjust arrow start/end points to node edges
    if start == 'frontend' and end == 'api':
        y0 -= 0.3
        y1 += 0.3
    elif start == 'api' and end == 'ml':
        y0 -= 0.3
        y1 += 0.3
    elif start == 'ml' and end == 'data':
        y0 -= 0.3
        y1 += 0.3
    elif start == 'api' and end == 'data':
        x0 -= 0.2
        y0 -= 0.3
        x1 -= 0.2
        y1 += 0.3
    elif 'vercel' in end or 'heroku' in end:
        x0 += 0.35
        x1 -= 0.35
    
    # Add arrow
    fig.add_annotation(
        x=x1, y=y1,
        ax=x0, ay=y0,
        xref='x', yref='y',
        axref='x', ayref='y',
        showarrow=True,
        arrowhead=3,
        arrowsize=2,
        arrowwidth=3,
        arrowcolor='#444'
    )
    
    # Add connection label if not empty
    if label:
        mid_x = (x0 + x1) / 2
        mid_y = (y0 + y1) / 2
        fig.add_annotation(
            x=mid_x + 0.1, y=mid_y,
            text=label,
            showarrow=False,
            font=dict(size=10, color='#444'),
            bgcolor="rgba(255,255,255,0.9)",
            bordercolor="#444",
            borderwidth=1,
            borderpad=2
        )

# Add horizontal layer labels on the left
layer_info = [
    (0.2, 5.5, 'FRONTEND', '#1FB8CD'),
    (0.2, 4, 'API LAYER', '#FFC185'),
    (0.2, 2.5, 'ML LAYER', '#ECEBD5'),
    (0.2, 1, 'DATA LAYER', '#5D878F')
]

for x, y, label, color in layer_info:
    fig.add_annotation(
        x=x, y=y,
        text=f"<b>{label}</b>",
        showarrow=False,
        font=dict(size=12, color='#000'),
        bgcolor=color,
        bordercolor="#333",
        borderwidth=2,
        borderpad=4,
        opacity=0.8
    )

# Add deployment section label
fig.add_annotation(
    x=3.5, y=6.2,
    text="<b>DEPLOYMENT</b>",
    showarrow=False,
    font=dict(size=12, color='#000'),
    bgcolor='#D2BA4C',
    bordercolor="#333",
    borderwidth=2,
    borderpad=4,
    opacity=0.8
)

# Update layout with better margins
fig.update_layout(
    title='System Architecture Flow',
    showlegend=False,
    xaxis=dict(
        showgrid=False, 
        zeroline=False, 
        showticklabels=False,
        range=[-0.2, 4.5]
    ),
    yaxis=dict(
        showgrid=False, 
        zeroline=False, 
        showticklabels=False,
        range=[0.2, 6.5]
    ),
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='rgba(0,0,0,0)'
)

# Save the figure
fig.write_image("system_architecture.png")

fig.show()