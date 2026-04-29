# Vulnerable Web App Security Assessment

## Overview:
This project was completed as part of a Cybersecurity Internship.

The goal was to analyze a vulnerable web application, identify security issues, and document findings.

---

## Week 1 - Security Assessment

### Application Setup:
- Installed dependencies using `npm install`
- Ran application using `npm start`
- Accessed at: http://localhost:8080
- Explored login system

---

## Tools Used:
- Browser Developer Tools
- Manual Testing (XSS & SQL Injection)
- Online vulnerability scanner

---

## Vulnerabilities Found:

### 1. SQL Injection:
- Login bypass using:
  admin' OR '1'='1
- Impact: Unauthorized access

---

### 2. Missing Security Headers:
- No CSP, X-Frame-Options, X-Content-Type-Options
- Impact:
  - XSS attacks
  - Clickjacking
  - MIME sniffing

---

### 3. File Upload Vulnerability:
- Accepts any file type (e.g. .exe)
- Impact: Malicious file upload risk

---

### 4. Password Storage (Secure):
- Passwords are hashed
- Good security practice observed

---

## Recommendations:
- Validate and sanitize inputs
- Add security headers using Helmet.js
- Restrict file uploads
- Improve authentication

---

## Author:
Daniyal Ahmed
