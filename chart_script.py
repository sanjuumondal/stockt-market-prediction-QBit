import plotly.graph_objects as go
import plotly.io as pio

# Data
categories = ["UI/UX Design", "Prediction Mdl", "Real-time Feat", "User Management", "Mobile Support", "Data Visual", "Deployment", "Customization", "Performance", "Security"]
original_app = [3, 2, 1, 0, 2, 3, 2, 1, 3, 2]
new_website = [9, 8, 9, 8, 9, 9, 8, 9, 8, 9]

# Create horizontal bar chart
fig = go.Figure()

# Add bars for original app
fig.add_trace(go.Bar(
    y=categories,
    x=original_app,
    name='Original App',
    orientation='h',
    marker_color='#1FB8CD',
    cliponaxis=False
))

# Add bars for new website
fig.add_trace(go.Bar(
    y=categories,
    x=new_website,
    name='New Website',
    orientation='h',
    marker_color='#FFC185',
    cliponaxis=False
))

# Update layout
fig.update_layout(
    title='App vs Website Feature Comparison',
    xaxis_title='Capability Level',
    yaxis_title='Features',
    barmode='group',
    legend=dict(orientation='h', yanchor='bottom', y=1.05, xanchor='center', x=0.5)
)

# Update axes
fig.update_xaxes(range=[0, 10])
fig.update_yaxes(categoryorder='array', categoryarray=categories[::-1])

# Save the chart
fig.write_image('feature_comparison.png')