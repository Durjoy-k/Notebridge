import sys
import os
import re
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password

client = TestClient(app)

def test_email_validation_cases():
    valid_emails = [
        "20242087010@nwu.ac.bd",
        "20242087011@nwu.ac.bd",
        "20253012345@nwu.ac.bd",
    ]

    invalid_emails = [
        "2024208701@nwu.ac.bd",
        "202420870100@nwu.ac.bd",
        "2024208701a@nwu.ac.bd",
        "a0242087010@nwu.ac.bd",
        "20242087010@gmail.com",
        "20242087010@edu.bd",
        "20242087010@du.ac.bd",
        "20242087010@nwu.com",
        "20242087010@nwu.ac.bd.bd",
        "20242087010 @nwu.ac.bd",
        "20242087010@nwu.ac.bd.extra"
    ]

    regex = r"^\d{11}@nwu\.ac\.bd$"

    print("\n--- Testing Email Regex Matching ---")
    for email in valid_emails:
        match = bool(re.match(regex, email))
        print(f"PASS TEST: '{email}' -> Match = {match}")
        assert match is True, f"Valid email {email} failed regex match!"

    for email in invalid_emails:
        match = bool(re.match(regex, email))
        print(f"FAIL TEST: '{email}' -> Match = {match}")
        assert match is False, f"Invalid email {email} passed regex match unexpectedly!"

def test_registration_and_auth_flow():
    db = SessionLocal()
    test_email = "20242087010@nwu.ac.bd"
    db.query(User).filter(User.email == test_email).delete()
    db.commit()

    print("\n--- Testing Direct API Registration (Valid Email) ---")
    reg_resp = client.post("/auth/register", json={
        "email": test_email,
        "password": "12345678",
        "full_name": "Test Student"
    })
    print(f"Status: {reg_resp.status_code}, Body: {reg_resp.json()}")
    assert reg_resp.status_code == 201
    data = reg_resp.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_email
    assert "password" not in data["user"]
    assert "hashed_password" not in data["user"]

    print("\n--- Testing Password Hashing in Database ---")
    user_in_db = db.query(User).filter(User.email == test_email).first()
    assert user_in_db is not None
    assert user_in_db.hashed_password != "12345678"
    assert verify_password("12345678", user_in_db.hashed_password) is True

    print("\n--- Testing Duplicate Registration ---")
    dup_resp = client.post("/auth/register", json={
        "email": test_email,
        "password": "12345678"
    })
    print(f"Status: {dup_resp.status_code}, Body: {dup_resp.json()}")
    assert dup_resp.status_code == 400
    assert "already exists" in dup_resp.json()["detail"]

    print("\n--- Testing Direct API Registration (Invalid Emails) ---")
    invalid_emails = [
        "2024208701@nwu.ac.bd",
        "202420870100@nwu.ac.bd",
        "2024208701a@nwu.ac.bd",
        "a0242087010@nwu.ac.bd",
        "20242087010@gmail.com",
        "20242087010@edu.bd",
        "20242087010@du.ac.bd",
        "20242087010@nwu.com",
        "20242087010@nwu.ac.bd.bd",
        "20242087010 @nwu.ac.bd"
    ]
    for inv_email in invalid_emails:
        inv_resp = client.post("/auth/register", json={
            "email": inv_email,
            "password": "12345678"
        })
        print(f"Invalid email '{inv_email}' -> Status: {inv_resp.status_code}, Detail: {inv_resp.json().get('detail')}")
        assert inv_resp.status_code in [400, 422]
        assert inv_resp.json()["detail"] == "Please enter a valid NWU student email (e.g., 20242087010@nwu.ac.bd)."

    print("\n--- Testing Login (Incorrect Password) ---")
    wrong_login = client.post("/auth/login", json={
        "email": test_email,
        "password": "WrongPassword!"
    })
    assert wrong_login.status_code == 401
    assert "Invalid email or password" in wrong_login.json()["detail"]

    print("\n--- Testing Login (Successful) ---")
    succ_login = client.post("/auth/login", json={
        "email": test_email,
        "password": "12345678",
        "department": "Computer Science & Engineering (CSE)"
    })
    assert succ_login.status_code == 200
    token = succ_login.json()["access_token"]
    assert token is not None
    assert succ_login.json()["user"]["department"] == "Computer Science & Engineering (CSE)"

    print("\n--- Testing GET /auth/me with Token ---")
    me_resp = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == test_email
    assert me_resp.json()["department"] == "Computer Science & Engineering (CSE)"

    db.close()
    print("\n==============================================")
    print("ALL BACKEND AUTH TESTS PASSED 100% SUCCESSFULLY!")
    print("==============================================\n")

if __name__ == "__main__":
    test_email_validation_cases()
    test_registration_and_auth_flow()
