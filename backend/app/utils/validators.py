import re
from typing import List, Tuple


def validate_institutional_email(email: str) -> bool:
    """
    Validate that an email address is from the institutional domain.
    
    Args:
        email: Email address to validate
        
    Returns:
        True if email ends with @correo.itm.edu.co, False otherwise
    """
    return email.lower().endswith("@correo.itm.edu.co")


def validate_csv_emails(csv_content: str) -> Tuple[List[str], List[Tuple[int, str]]]:
    """
    Validate emails from CSV content.
    
    Args:
        csv_content: CSV file content as string
        
    Returns:
        Tuple of (valid_emails, errors)
        - valid_emails: List of valid institutional emails
        - errors: List of tuples (line_number, error_message)
    """
    valid_emails = []
    errors = []
    
    lines = csv_content.strip().split('\n')
    
    for line_num, line in enumerate(lines, start=1):
        email = line.strip()
        
        # Skip empty lines
        if not email:
            continue
        
        # Basic email format validation
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
            errors.append((line_num, f"Invalid email format: {email}"))
            continue
        
        # Institutional domain validation
        if not validate_institutional_email(email):
            errors.append((line_num, f"Email must be from @correo.itm.edu.co domain: {email}"))
            continue
        
        # Check for duplicates in the current list
        if email.lower() in [e.lower() for e in valid_emails]:
            errors.append((line_num, f"Duplicate email: {email}"))
            continue
        
        valid_emails.append(email.lower())
    
    return valid_emails, errors


def validate_password_strength(password: str) -> Tuple[bool, str]:
    """
    Validate password strength.
    
    Args:
        password: Password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit"
    
    return True, ""
