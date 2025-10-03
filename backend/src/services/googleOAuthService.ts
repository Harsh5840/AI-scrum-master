import { google } from 'googleapis'

export class GoogleOAuthService {
  private oauth2Client

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
  }

  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      state: 'some-random-state' // Add CSRF protection
    })
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code)
    return tokens
  }

  async getUserInfo(accessToken: string) {
    const oauth2 = google.oauth2({
      version: 'v2',
      auth: this.oauth2Client
    })

    this.oauth2Client.setCredentials({ access_token: accessToken })
    const { data } = await oauth2.userinfo.get()
    
    return {
      googleId: data.id!,
      email: data.email!,
      name: data.name!,
      avatar: data.picture
    }
  }
}