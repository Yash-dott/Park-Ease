import React from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyledView } from "@nexara/nativeflow";

const App = () => {
    return (<>
        <GestureHandlerRootView>
            <AppNavigation />
        </GestureHandlerRootView>
    </>);
}
export default App;