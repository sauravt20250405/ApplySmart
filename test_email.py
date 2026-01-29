import requests

# URL should match your backend route
BASE_URL = "http://localhost:5000/api/auth"

def test_email_flow():
    print("1. Testing Send OTP (Email)...")
    try:
        # Request OTP for an email
        resp = requests.post(f"{BASE_URL}/send-otp", json={"email": "test@example.com"})
        
        if resp.status_code == 200:
            print(f"✅ OTP Sent! Server response: {resp.json()}")
        else:
            print(f"❌ Failed: {resp.status_code} - {resp.text}")
            return

        # 2. Test Login with Master Key
        print("\n2. Testing Login with 123456...")
        login_resp = requests.post(f"{BASE_URL}/login", json={
            "email": "test@example.com",
            "otp": "123456"
        })
        
        if login_resp.status_code == 200:
            print(f"✅ Login Success! Token: {login_resp.json().get('access_token')[:20]}...")
        else:
            print(f"❌ Login Failed: {login_resp.status_code} - {login_resp.text}")

    except Exception as e:
        print(f"❌ Connection Error: {e}")
        print("   (Is the backend_server.py running?)")

if __name__ == "__main__":
    test_email_flow()