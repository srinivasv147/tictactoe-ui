import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider
  } from 'angularx-social-login';
  
  export function getAuthServiceConfigs(): AuthServiceConfig {
    let config = new AuthServiceConfig([
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("")
      }
    ]);
  
    return config;
  }