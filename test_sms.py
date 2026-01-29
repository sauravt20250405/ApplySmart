import requests

# Your Fast2SMS API Key
API_KEY = "4eiWCXVaxh3mPcLkwNASq8olpsT56O7JUyFrbn01Q2DjgEBYtGMUGRxA0WuYcEHdb4CeB3tNgFTmail8"

def test_sms():
    url = "https://www.fast2sms.com/dev/bulkV2"
    
    # REPLACE WITH YOUR REAL NUMBER (Keep the quotes!)
    my_number = "7807168250" 
    
    payload = {
        "route": "q",  # 'q' is the Quick/Transitional route (Best for OTP)
        "message": "ApplySmart Test OTP: 888999", 
        "flash": 0,
        "numbers": my_number
    }
    
    headers = {
        "authorization": API_KEY,
        "Content-Type": "application/json"
    }
    
    print(f"📡 Sending Test SMS to {my_number}...")
    try:
        response = requests.post(url, json=payload, headers=headers)
        print("\n👇 SERVER RESPONSE 👇")
        print(response.text)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_sms()