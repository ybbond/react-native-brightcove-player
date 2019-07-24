//https://facebook.github.io/react-native/docs/debugging.html
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Remote debugger']);

import {AppRegistry} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Overlay from './components/Overlay';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('overlay', () => Overlay);
