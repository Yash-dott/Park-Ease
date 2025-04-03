import { Button, StyledText, StyledView, UserInput } from "@nexara/nativeflow";
import { fontFamily, navigationStrings } from "@constants";
import { Image, Text, TouchableOpacity } from "react-native";
import type{ FC } from "react";
import { LoginScreenProps } from "src/types/navigation";




const Login: FC<LoginScreenProps> = ({ navigation }) => {

    const onUserPress = () => {
        console.log("press");
    };

    return (<>
        <StyledView f={1} paddingVertical={30} paddingHorizontal={10} bg="#fff">
            <StyledView f={1} align='center' justify='center'>
                <Image source={require('../../assets/images/logo.png')} style={{ height: 100, width: 100 }} />
            </StyledView>
            <StyledView f={3} gap={30}>

                <StyledView>
                    <StyledText variant="h2" ff={fontFamily['POPPINS-MEDIUM']} primary>Welcome back!</StyledText>
                    <StyledText variant="h5" ff={fontFamily['POPPINS-MEDIUM']}>Login to continue using the app</StyledText>
                </StyledView>
                <StyledView gap={30}>

                    <StyledView gap={20}>
                        <UserInput
                            stroke={0.7}
                            variant='standard'
                            placeholder="Enter email"
                        />
                        <UserInput
                            stroke={0.7}
                            variant='standard'
                            placeholder="Enter password"
                            secureTextEntry
                        />
                    </StyledView>

                    <StyledView
                        gap={15}
                    >
                        <Button
                            fullWidth
                            br={15}
                            title="Sign in"
                            textStyle={{ fontFamily: fontFamily['POPPINS-MEDIUM'] }}
                            paddingV={13}
                            bg='#ff7b00'
                        />
                        <TouchableOpacity
                            onPress={() => navigation.navigate(navigationStrings.SIGNUP)}
                        >
                            <StyledText variant="h5" ff={fontFamily['ROBOTO-REGULAR']} tas>
                                Don't have an account? <StyledText color='#ff7b00'>Sign up</StyledText>
                            </StyledText>
                        </TouchableOpacity>

                    </StyledView>

                </StyledView>


            </StyledView>
        </StyledView>
    </>);
}
export default Login;