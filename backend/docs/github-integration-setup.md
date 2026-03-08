# GitHub Integration Setup Guide

This guide explains how to set up and test the GitHub OAuth integration for the Plataforma Educativa.

## Overview

The GitHub integration allows students to:
- Connect their GitHub accounts via OAuth
- Link team repositories for collaborative projects
- Validate repository access automatically

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

New dependencies added:
- `PyGithub==2.1.1` - GitHub API client
- `cryptography==41.0.7` - Token encryption

### 2. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Plataforma Educativa Python (Dev)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/team` (or your team page URL)
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 3. Configure Environment Variables

Update `backend/.env`:

```env
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

### 4. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload
```

The server will run on `http://localhost:8000`

## Frontend Setup

### 1. Configure Environment Variables

Create or update `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
```

**Important**: Use the same Client ID as in the backend.

### 2. Start Frontend Server

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

#### Connect GitHub Account
```http
POST /api/auth/github/connect
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "code": "github_oauth_code"
}
```

**Response:**
```json
{
  "success": true,
  "message": "GitHub account connected successfully",
  "github_username": "username",
  "github_name": "Full Name"
}
```

#### Get GitHub Status
```http
GET /api/auth/github/status
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "connected": true,
  "github_username": "username",
  "github_name": "Full Name",
  "github_avatar": "https://avatars.githubusercontent.com/..."
}
```

#### Disconnect GitHub Account
```http
POST /api/auth/github/disconnect
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "success": true,
  "message": "GitHub account disconnected successfully"
}
```

### Team Repository Endpoints

#### Link Repository to Team
```http
PUT /api/teams/{team_id}/repository
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "repository_url": "https://github.com/username/repo"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Repository linked successfully",
  "repository_url": "https://github.com/username/repo",
  "repository_info": {
    "name": "repo",
    "full_name": "username/repo",
    "description": "Repository description",
    "private": false,
    "url": "https://github.com/username/repo",
    "stars": 10,
    "forks": 5,
    "language": "Python"
  }
}
```

#### Get Team Repository Info
```http
GET /api/teams/{team_id}/repository
Authorization: Bearer {jwt_token}
```

#### Unlink Repository
```http
DELETE /api/teams/{team_id}/repository
Authorization: Bearer {jwt_token}
```

## Testing the Integration

### 1. Test GitHub Connection

1. Log in as a student
2. Navigate to the Team page (`/team`)
3. Click "Connect GitHub" button
4. You'll be redirected to GitHub OAuth authorization
5. Authorize the application
6. You'll be redirected back with your GitHub account connected

### 2. Test Repository Linking

**Prerequisites:**
- Student must be a team leader
- Student must have GitHub account connected
- Student must have access to a GitHub repository

**Steps:**
1. On the Team page, scroll to "Team Repository" section
2. Enter a GitHub repository URL (e.g., `https://github.com/username/repo`)
3. Click "Link Repository"
4. The system will validate your access and display repository information

### 3. Test Repository Validation

The system validates:
- ✅ Repository URL format
- ✅ Repository exists
- ✅ User has access to the repository
- ❌ Shows error if repository not found
- ❌ Shows error if user doesn't have access

### 4. Test as Team Member (Non-Leader)

1. Log in as a team member (not leader)
2. Navigate to Team page
3. You should see the linked repository (read-only)
4. You cannot link/unlink repositories

## Security Features

### Token Encryption

GitHub access tokens are encrypted before storage using Fernet encryption:
- Encryption key derived from `SECRET_KEY` in settings
- Tokens are never stored in plain text
- Tokens are decrypted only when needed for API calls

### Access Control

- Only authenticated users can connect GitHub accounts
- Only team leaders can link/unlink repositories
- Repository access is validated before linking
- Team members can view but not modify repository links

## Troubleshooting

### "Failed to exchange authorization code"

**Cause**: Invalid OAuth configuration or expired code

**Solution**:
1. Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are correct
2. Ensure callback URL in GitHub OAuth App matches your frontend URL
3. OAuth codes expire quickly - complete the flow without delays

### "Repository not found or you don't have access"

**Cause**: User doesn't have access to the repository

**Solution**:
1. Verify the repository URL is correct
2. Ensure the repository is public OR the user has been granted access
3. For private repos, user must be a collaborator

### "Invalid GitHub token"

**Cause**: Token encryption/decryption failed or token was revoked

**Solution**:
1. Disconnect and reconnect GitHub account
2. Verify `SECRET_KEY` hasn't changed (would invalidate encrypted tokens)

## Requirements Validated

This implementation validates the following requirements:

### Requisito 8: Integración con GitHub
- ✅ 8.1: Student can connect GitHub account via OAuth
- ✅ 8.2: Store access token securely (encrypted)
- ✅ 8.3: Student can link GitHub repository
- ✅ 8.4: Verify student has repository access
- ✅ 8.5: Show error if no access
- ✅ 8.6: Student can disconnect GitHub account

### Requisito 9: Gestión de Equipos
- ✅ 9.8: Team leader can link team repository
- ✅ 9.9: Show repository to all team members

## Next Steps

After testing the GitHub integration:

1. **Production Setup**: Create a production GitHub OAuth App with production URLs
2. **Error Handling**: Monitor and improve error messages based on user feedback
3. **Repository Features**: Consider adding features like:
   - List user's repositories for easy selection
   - Show recent commits
   - Display repository contributors
   - Webhook integration for submission notifications
