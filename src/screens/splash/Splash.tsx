import { FC } from "react";
import { StyleSheet, View, Image } from "react-native";


const Splash: FC = () => {
    return (<>
        <View style={STYLES.MAIN_CONT}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={{ height: 160, width: 100 }}
            />
        </View>
    </>);
};
export default Splash;

const STYLES = StyleSheet.create({
    MAIN_CONT: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    }
});