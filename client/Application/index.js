import { registerRootComponent } from 'expo';

import App from './App';

(function () {
    const originalLog = console.log;

    console.log = (...args) => {
        const timestamp = new Date().toISOString();
        originalLog(`[${timestamp}]`, ...args);
    };
})();


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
