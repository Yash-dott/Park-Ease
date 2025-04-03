import { PermissionsAndroid } from "react-native";


const locationPermission = async () => {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: 'This App wants to access your location',
            message: 'This App needs access to your location so it can provide better services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        },
    );
    return granted;
}

export {
    locationPermission

}