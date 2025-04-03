import { navigationStrings } from '@constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Splash, Home, Login, Signup } from '../screens';
import { RootStackParamList } from '@types';


const StackNavigation = () => {

    const Stack = createNativeStackNavigator<RootStackParamList>();

    return (<>
        <Stack.Navigator
            initialRouteName={navigationStrings.LOGIN}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                component={Splash}
                name={navigationStrings.SPLASH}
            />
            <Stack.Screen
                component={Login}
                name={navigationStrings.LOGIN}
            />
            <Stack.Screen
                component={Signup}
                name={navigationStrings.SIGNUP}
            />
            <Stack.Screen
                component={Home}
                name={navigationStrings.HOME}
            />
        </Stack.Navigator>
    </>);
}
export default StackNavigation;