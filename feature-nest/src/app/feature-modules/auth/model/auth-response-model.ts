export interface AuthResponseData {
  idToken: string; // idToken  A Firebase Auth ID token for the authenticated user.
  email: string; // email  The email for the authenticated user.
  refreshToken: string; // refreshToken A Firebase Auth refresh token for the authenticated user.
  expiresIn: string; // expiresIn  The number of seconds in which the ID token expires.
  localId: string; // localId  The uid of the authenticated user.
  registered?: boolean; // registered Whether the email is for an existing account.
  role?: string;
}
