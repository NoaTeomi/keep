import requests
import json
import uuid

# Replace these with your actual values
KEEP_API_URL = "http://localhost:8080"  # Default Keep API URL when running locally
API_KEY = "your-api-key"  # Replace with your actual API key

# Create the alert payload
alert_payload = {
    "keep_source_type": "grafana",
    "event": {
        "alerts": [{
            "condition": "B",
            "labels": {
                "severity": "warning",
                "monitor": "memory"
            },
            "annotations": {
                "summary": "Memory Usage High on srv1-us1-prod"
            },
            "state": "firing",
            "evalMatches": [{
                "value": 85,
                "metric": "memory_usage",
                "tags": {
                    "severity": "warning",
                    "monitor": "memory"
                }
            }],
            "fingerprint": f"test-fingerprint-{uuid.uuid4()}"  # Generate a unique fingerprint
        }],
        "severity": "warning",
        "title": "High Memory Usage"
    }
}

# Set up the request headers
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

# Send the POST request
try:
    response = requests.post(
        f"{KEEP_API_URL}/alerts/event",
        headers=headers,
        json=alert_payload
    )
    
    # Check if the request was successful
    response.raise_for_status()
    print("Alert sent successfully!")
    print("Response:", response.json())
    
except requests.exceptions.RequestException as e:
    print("Failed to send alert:")
    print(e)
    if hasattr(e, 'response') and e.response is not None:
        print("Response:", e.response.text) 