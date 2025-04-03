import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { commonContactAndLogList } from "./common";
import { navigationStrings } from '@constants';

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList { }
    }
}

type RootStackParamList = {
    [navigationStrings.SPLASH]: undefined;
    [navigationStrings.HOME]: undefined;
    [navigationStrings.LOGIN]: undefined;
    [navigationStrings.SIGNUP]: undefined;
};

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, typeof navigationStrings.SPLASH>;
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, typeof navigationStrings.LOGIN>;
type SignupScreenProps = NativeStackScreenProps<RootStackParamList, typeof navigationStrings.SIGNUP>;
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, typeof navigationStrings.HOME>;