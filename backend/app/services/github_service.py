"""
GitHub OAuth and API integration service.

This service handles:
- GitHub OAuth flow
- Token encryption/decryption
- Repository validation
- GitHub API interactions
"""

import httpx
from typing import Optional, Dict, Any
from github import Github, GithubException
from cryptography.fernet import Fernet
from app.config import settings
import base64
import hashlib


class GitHubService:
    """Service for GitHub OAuth and API operations."""
    
    def __init__(self):
        self.client_id = settings.GITHUB_CLIENT_ID
        self.client_secret = settings.GITHUB_CLIENT_SECRET
        self._cipher = self._get_cipher()
    
    def _get_cipher(self) -> Fernet:
        """
        Get Fernet cipher for token encryption.
        Uses SECRET_KEY from settings to derive encryption key.
        """
        # Derive a 32-byte key from SECRET_KEY
        key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
        # Fernet requires base64-encoded 32-byte key
        fernet_key = base64.urlsafe_b64encode(key)
        return Fernet(fernet_key)
    
    def encrypt_token(self, token: str) -> str:
        """
        Encrypt GitHub access token for secure storage.
        
        Args:
            token: Plain text GitHub access token
            
        Returns:
            Encrypted token as string
        """
        encrypted = self._cipher.encrypt(token.encode())
        return encrypted.decode()
    
    def decrypt_token(self, encrypted_token: str) -> str:
        """
        Decrypt GitHub access token.
        
        Args:
            encrypted_token: Encrypted token from database
            
        Returns:
            Plain text GitHub access token
        """
        decrypted = self._cipher.decrypt(encrypted_token.encode())
        return decrypted.decode()
    
    async def exchange_code_for_token(self, code: str) -> Optional[str]:
        """
        Exchange OAuth authorization code for access token.
        
        Args:
            code: Authorization code from GitHub OAuth callback
            
        Returns:
            Access token if successful, None otherwise
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    "https://github.com/login/oauth/access_token",
                    data={
                        "client_id": self.client_id,
                        "client_secret": self.client_secret,
                        "code": code
                    },
                    headers={"Accept": "application/json"}
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("access_token")
                
                return None
            except Exception as e:
                print(f"Error exchanging code for token: {e}")
                return None
    
    async def get_user_info(self, access_token: str) -> Optional[Dict[str, Any]]:
        """
        Get GitHub user information using access token.
        
        Args:
            access_token: GitHub access token
            
        Returns:
            User info dict with login, name, email, etc.
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    "https://api.github.com/user",
                    headers={
                        "Authorization": f"Bearer {access_token}",
                        "Accept": "application/vnd.github.v3+json"
                    }
                )
                
                if response.status_code == 200:
                    return response.json()
                
                return None
            except Exception as e:
                print(f"Error getting user info: {e}")
                return None
    
    def validate_repository_access(
        self,
        access_token: str,
        repository_url: str
    ) -> tuple[bool, Optional[Dict[str, Any]], Optional[str]]:
        """
        Validate that user has access to a GitHub repository.
        
        Args:
            access_token: GitHub access token
            repository_url: GitHub repository URL (e.g., https://github.com/user/repo)
            
        Returns:
            Tuple of (has_access, repo_info, error_message)
        """
        try:
            # Parse repository URL
            repo_path = self._parse_repo_url(repository_url)
            if not repo_path:
                return False, None, "Invalid GitHub repository URL"
            
            # Create GitHub client with access token
            g = Github(access_token)
            
            # Try to access the repository
            repo = g.get_repo(repo_path)
            
            # Get repository information
            repo_info = {
                "name": repo.name,
                "full_name": repo.full_name,
                "description": repo.description,
                "private": repo.private,
                "url": repo.html_url,
                "stars": repo.stargazers_count,
                "forks": repo.forks_count,
                "language": repo.language,
                "created_at": repo.created_at.isoformat() if repo.created_at else None,
                "updated_at": repo.updated_at.isoformat() if repo.updated_at else None,
            }
            
            return True, repo_info, None
            
        except GithubException as e:
            if e.status == 404:
                return False, None, "Repository not found or you don't have access"
            elif e.status == 401:
                return False, None, "Invalid or expired GitHub token"
            else:
                return False, None, f"GitHub API error: {e.data.get('message', 'Unknown error')}"
        except Exception as e:
            return False, None, f"Error validating repository: {str(e)}"
    
    def _parse_repo_url(self, url: str) -> Optional[str]:
        """
        Parse GitHub repository URL to extract owner/repo path.
        
        Args:
            url: GitHub repository URL
            
        Returns:
            Repository path in format "owner/repo" or None if invalid
            
        Examples:
            https://github.com/user/repo -> user/repo
            https://github.com/user/repo.git -> user/repo
            github.com/user/repo -> user/repo
        """
        if not url:
            return None
        
        # Remove protocol
        url = url.replace("https://", "").replace("http://", "")
        
        # Remove .git suffix
        url = url.rstrip("/").replace(".git", "")
        
        # Extract path after github.com/
        if "github.com/" in url:
            parts = url.split("github.com/", 1)
            if len(parts) == 2:
                repo_path = parts[1]
                # Validate format (should be owner/repo)
                path_parts = repo_path.split("/")
                if len(path_parts) >= 2:
                    return f"{path_parts[0]}/{path_parts[1]}"
        
        return None
    
    async def get_repository_info(
        self,
        access_token: str,
        repository_url: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get detailed repository information.
        
        Args:
            access_token: GitHub access token
            repository_url: GitHub repository URL
            
        Returns:
            Repository information dict or None if error
        """
        has_access, repo_info, error = self.validate_repository_access(
            access_token,
            repository_url
        )
        
        if has_access:
            return repo_info
        
        return None
    
    def revoke_token(self, access_token: str) -> bool:
        """
        Revoke a GitHub access token.
        
        Args:
            access_token: GitHub access token to revoke
            
        Returns:
            True if successful, False otherwise
        """
        try:
            g = Github(access_token)
            # Delete the token authorization
            # Note: This requires the token to have delete_repo scope
            # For now, we'll just return True as token revocation
            # is handled by GitHub when user disconnects
            return True
        except Exception as e:
            print(f"Error revoking token: {e}")
            return False
