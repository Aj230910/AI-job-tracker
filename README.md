# AI Job Tracker 

An AI-powered Job Tracking Dashboard built using React + Vite + n8n Automation.
This project automatically fetches jobs from multiple locations, analyzes them using AI,
stores them in Google Sheets, and displays them in a modern dashboard.

#  Features

 AI-powered Job Analysis
 Real-time Job Dashboard
 Role-based Job Filtering
 Save Jobs Feature
 Applied Jobs Tracker
 Auto Email Notifications
 Google Sheets Integration
 Cloud Automation using n8n
 Responsive Modern UI
 Multi-location Job Search

#  Tech Stack

## Frontend
- React.js
- Vite
- Tailwind CSS
- Axios

## Automation & Backend
- n8n
- OpenRouter AI API
- Adzuna Jobs API
- Google Sheets API
- Gmail API

## Deployment
- Vercel (Frontend)
- Railway (n8n Automation)

#  Supported Job Locations

- Chennai
- Bangalore
- Hyderabad
- Pune
- Remote Jobs

#  How It Works

n8n Automation
        ↓
Fetch Jobs from Adzuna API
        ↓
AI Analysis using OpenRouter
        ↓
Store Data in Google Sheets
        ↓
React Dashboard reads Google Sheets
        ↓
Users view jobs in dashboard

# Dashboard Features

##  Role Based Filter
Users can filter jobs by:
- Python Developer
- Java Developer
- Data Analyst
- React Developer
- Full Stack Developer

##  Save Jobs
Users can save interesting jobs locally.

##  Applied Job Tracker
Track applied jobs directly from dashboard.

##  Email Alerts
Automated email notifications for new jobs.


#  Environment Variables

Create a .env file:

VITE_GOOGLE_SHEET_API=YOUR_GOOGLE_SHEET_API
VITE_OPENSHEET_URL=YOUR_OPENSHEET_URL

#  n8n Automation Setup

## Required APIs

- Adzuna API
- OpenRouter API
- Google Sheets API
- Gmail OAuth API

## n8n Workflow Features

 Scheduled Job Fetching
 AI Match Percentage
 Missing Skills Analysis
 Automated Email Sending
 Google Sheets Database Update

#  Deployment

## Frontend Deployment
- Vercel

## n8n Deployment
- Railway + Docker

#  Project Structure

ai-job-tracker/
│
├── src/
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│
├── public/
│
├── n8n-workflows/
│   └── ai-job-tracker-workflow.json
│
├── package.json
├── vite.config.js
└── README.md

#  Future Enhancements

- Resume Upload + AI Match
- Telegram Alerts
- WhatsApp Notifications
- Firebase Authentication
- Admin Dashboard
- Auto Apply Feature
- AI Resume Builder

#  Author

Ambrish Jeyan


#  Support

If you like this project:

 Star the repository
 Fork the project
 Build your own AI automation projects

