import resend
from typing import List
from app.config import settings


class EmailService:
    def __init__(self):
        resend.api_key = settings.RESEND_API_KEY
    
    async def send_invitation_email(
        self,
        email: str,
        token: str,
        semester_name: str
    ) -> bool:
        """
        Send invitation email to a student.
        
        Args:
            email: Recipient email address
            token: Invitation token
            semester_name: Name of the semester
            
        Returns:
            True if email sent successfully, False otherwise
        """
        try:
            # Construct invitation URL (will be updated with actual frontend URL)
            invitation_url = f"http://localhost:3000/register?token={token}"
            
            params = {
                "from": settings.EMAIL_FROM,
                "to": [email],
                "subject": f"Invitación a Plataforma Educativa - {semester_name}",
                "html": f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #2563eb;">Invitación a Plataforma Educativa de Python</h2>
                            
                            <p>Hola,</p>
                            
                            <p>Has sido invitado a registrarte en la Plataforma Educativa de Python para Análisis Financiero para el semestre <strong>{semester_name}</strong>.</p>
                            
                            <p>Para completar tu registro, haz clic en el siguiente enlace:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{invitation_url}" 
                                   style="background-color: #2563eb; color: white; padding: 12px 30px; 
                                          text-decoration: none; border-radius: 5px; display: inline-block;">
                                    Registrarse Ahora
                                </a>
                            </div>
                            
                            <p>O copia y pega este enlace en tu navegador:</p>
                            <p style="background-color: #f3f4f6; padding: 10px; border-radius: 5px; word-break: break-all;">
                                {invitation_url}
                            </p>
                            
                            <p><strong>Nota:</strong> Esta invitación expirará en 30 días.</p>
                            
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            
                            <p style="font-size: 12px; color: #6b7280;">
                                Este es un correo automático. Por favor no respondas a este mensaje.
                            </p>
                        </div>
                    </body>
                </html>
                """
            }
            
            resend.Emails.send(params)
            return True
        except Exception as e:
            print(f"Error sending invitation email: {e}")
            return False
    
    async def send_welcome_email(
        self,
        email: str,
        full_name: str
    ) -> bool:
        """
        Send welcome email to a newly registered user.
        
        Args:
            email: User's email address
            full_name: User's full name
            
        Returns:
            True if email sent successfully, False otherwise
        """
        try:
            params = {
                "from": settings.EMAIL_FROM,
                "to": [email],
                "subject": "Bienvenido a Plataforma Educativa de Python",
                "html": f"""
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h2 style="color: #2563eb;">¡Bienvenido a la Plataforma Educativa!</h2>
                            
                            <p>Hola {full_name},</p>
                            
                            <p>Tu registro ha sido completado exitosamente. Ya puedes acceder a la plataforma y comenzar tu aprendizaje de Python para análisis financiero.</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="http://localhost:3000/login" 
                                   style="background-color: #2563eb; color: white; padding: 12px 30px; 
                                          text-decoration: none; border-radius: 5px; display: inline-block;">
                                    Iniciar Sesión
                                </a>
                            </div>
                            
                            <h3 style="color: #2563eb;">¿Qué puedes hacer en la plataforma?</h3>
                            <ul>
                                <li>Aprender Python desde cero con tutoriales interactivos</li>
                                <li>Practicar con ejercicios de análisis financiero</li>
                                <li>Ejecutar código Python directamente en tu navegador</li>
                                <li>Trabajar en proyectos en equipo</li>
                                <li>Ganar insignias y puntos de experiencia</li>
                            </ul>
                            
                            <p>¡Esperamos que disfrutes tu experiencia de aprendizaje!</p>
                            
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            
                            <p style="font-size: 12px; color: #6b7280;">
                                Este es un correo automático. Por favor no respondas a este mensaje.
                            </p>
                        </div>
                    </body>
                </html>
                """
            }
            
            resend.Emails.send(params)
            return True
        except Exception as e:
            print(f"Error sending welcome email: {e}")
            return False
    
    async def send_bulk_invitations(
        self,
        invitations: List[tuple]
    ) -> dict:
        """
        Send multiple invitation emails.
        
        Args:
            invitations: List of tuples (email, token, semester_name)
            
        Returns:
            Dictionary with success and failure counts
        """
        success_count = 0
        failure_count = 0
        
        for email, token, semester_name in invitations:
            result = await self.send_invitation_email(email, token, semester_name)
            if result:
                success_count += 1
            else:
                failure_count += 1
        
        return {
            "success": success_count,
            "failed": failure_count,
            "total": len(invitations)
        }
