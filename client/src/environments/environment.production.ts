export const environment = {
  production: true,

  apiBaseUrl: 'https://portfolio-frontend-api-fyesb9cxf5aaceer.ukwest-01.azurewebsites.net',
  chessApiBase: 'https://chessengine-e2hhe2gcajgpgahs.westeurope-01.azurewebsites.net',

  msal: {
    clientId: '0102eacb-f1a0-490a-8e0b-aa7a502ffcc3',
    tenantId: 'c0a3f854-2c8a-49a6-b4e1-85024d4e84cf',
    authority: 'https://login.microsoftonline.com/c0a3f854-2c8a-49a6-b4e1-85024d4e84cf',
    redirectUri: 'https://victorious-bay-0a79a331e.6.azurestaticapps.net'
  },

  apiScopes: [
    'api://873456a7-8262-4068-9a98-0321696f46f3/access_as_user'
  ]
};