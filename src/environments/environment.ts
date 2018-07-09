// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCzBkcRfLmpDIAbIbO_UQh2ZtMiQWK2xe0',
    authDomain: 'myevents-unir.firebaseapp.com',
    databaseURL: 'https://myevents-unir.firebaseio.com',
    projectId: 'myevents-unir',
    storageBucket: 'myevents-unir.appspot.com',
    messagingSenderId: '1097348190401'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
