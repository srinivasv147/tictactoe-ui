import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider
  } from 'angularx-social-login';
  
  export function getAuthServiceConfigs(): AuthServiceConfig {
    let config = new AuthServiceConfig([
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("280040738927-n65lh8fkni28gg73tofroeadrqadimun.apps.googleusercontent.com")
      }
    ]);
  
    return config;
  }