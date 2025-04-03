import { FC, useEffect, useRef, useState } from "react";
import MapView, { Marker } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, StyledView, Icon, UserInput, StyledText } from "@nexara/nativeflow";
import { MapPin, Mic } from 'lucide-react-native';
import Geolocation from '@react-native-community/geolocation';
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler';
import { WheelPicker } from 'react-native-infinite-wheel-picker';
import { hourArray, minutesArray } from "@constants";

const Home: FC = () => {


    const [coords, setCoords] = useState({
        latitude: 27.17506842024298,
        longitude: 78.04201344967333,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const bottomSheetRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        // @ts-ignore
        mapRef.current.animateToRegion(coords);
    }, [coords]);

    const onPressCurrentLocationBtn = async () => {
        try {
            await promptForEnableLocationIfNeeded();
            request();
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message)
            }
        }
    }

    const request = () => {
        Geolocation.requestAuthorization(() => {
            Geolocation.getCurrentPosition(({ coords }) => {
                setCoords((prev) => ({ ...prev, latitude: coords.latitude, longitude: coords.longitude }))
            }, (error) => {
                console.log(error)
            })
        })
    }

    return (<>

        <StyledView style={{ flex: 1 }}>
            <StyledView style={{ position: 'absolute', top: 10, right: 0, left: 0, zIndex: 9, paddingHorizontal: 10 }}>
                <UserInput
                    br={50}
                    variant='outlined'
                    placeholder="Enter Location..."
                    renderRightIcon={<Icon renderIcon={<Mic size={20} />} />}
                />
                {/* <GooglePlacesAutocomplete
                    placeholder='Search'
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                    }}
                    query={{
                        key: 'AIzaSyAWD3lIQVFCPg6eYxQeEG7fqqUoFbHXimo',
                        language: 'en',
                    }}
                /> */}
            </StyledView>
            <MapView
                initialRegion={coords}
                style={{ flex: 1 }}
                ref={mapRef}
            >
                <Marker coordinate={coords} />
            </MapView>

            <StyledView style={{ position: 'absolute', bottom: 50, right: 30 }}>
                <Button
                    type='round'
                    renderIcon={<Icon renderIcon={<MapPin size={20} />} />}
                    size={60}
                    onPress={onPressCurrentLocationBtn}
                />
            </StyledView>


        </StyledView>
        <BottomSheet
            ref={bottomSheetRef}
            enableContentPanningGesture={false}
        >
            <BottomSheetView style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
                <StyledView
                    f={1}
                    flexDirection='row'
                >
                    {
                        new Array(2).fill(null).map((_, index) =>
                            <StyledView
                                f={1}
                                flexDirection='row'
                                justify='center'
                                align='center'
                                gap={20}
                                key={index}
                            >
                                <StyledView align='center'>
                                    <StyledText variant='h5' primary>Hour:</StyledText>
                                    <WheelPicker
                                        restElements={2}
                                        data={hourArray}
                                        selectedIndex={0}
                                        onChangeValue={(index, value) => {
                                            console.log('Hours onChange: ', index, value);
                                        }}
                                        elementHeight={30}

                                    />
                                </StyledView>

                                <StyledView align='center'>
                                    <StyledText variant='h5' primary>Min:</StyledText>
                                    <WheelPicker
                                        restElements={2}
                                        data={minutesArray}
                                        selectedIndex={0}
                                        onChangeValue={(index, value) => {
                                            console.log('Hours onChange: ', index, value);
                                        }}
                                        elementHeight={30}

                                    />
                                </StyledView>
                            </StyledView>
                        )
                    }

                    {/* <StyledView
                        f={1}
                        flexDirection='row'
                        justify='center'
                        align='center'
                        gap={20}
                    >

                        <StyledView align='center'>
                            <StyledText variant='h5' primary>Hour:</StyledText>
                            <WheelPicker
                                restElements={2}
                                data={hourArray}
                                selectedIndex={0}
                                onChangeValue={(index, value) => {
                                    console.log('Hours onChange: ', index, value);
                                }}
                                elementHeight={30}

                            />
                        </StyledView>

                        <StyledView align='center'>
                            <StyledText variant='h5' primary>Min:</StyledText>
                            <WheelPicker
                                restElements={2}
                                data={minutesArray}
                                selectedIndex={0}
                                onChangeValue={(index, value) => {
                                    console.log('Hours onChange: ', index, value);
                                }}
                                elementHeight={30}

                            />
                        </StyledView>
                    </StyledView> */}
                </StyledView>
                <Button
                    fullWidth
                    title='Book Slot'
                />
            </BottomSheetView>
        </BottomSheet>

    </>)
}

export default Home;