import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Camera } from 'expo-camera';

import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as ImagePicker from 'expo-image-picker';
import { AddScheduleResultNavProps } from '../../../navigator/AddScheduleResult/AddScheduleResultParamList';
import { Feather, SimpleLineIcons } from '../../../../styles/vectorIcons';
import appTheme from '../../../../styles/constants';
import styled from 'styled-components/native';
import { CenterTouchableOpacity } from '../../../../styles/styled';
const { STYLED_FONTS, COLORS } = appTheme;

interface CameraScreenProps extends AddScheduleResultNavProps<'Camera'> {}

const CameraScreen: React.FC<CameraScreenProps> = ({
  navigation,
  route: {
    params: { pushNewImage },
  },
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<Boolean | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<Boolean | null>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState<null | Camera>(null);
  const [image, setImage] = useState<null | string>(null);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(undefined);
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === null || hasGalleryPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <StatusBar />

      <Container>
        {image ? (
          <CameraContainer>
            <ImageView source={{ uri: image }} style={{ flex: 1 }} />

            <ImageOptions>
              <OptionBtn onPress={() => setImage(null)}>
                <Text>취소</Text>
              </OptionBtn>

              <OptionBtn
                onPress={() => {
                  pushNewImage(image);
                  navigation.goBack();
                }}
              >
                <Text>선택</Text>
              </OptionBtn>
            </ImageOptions>
          </CameraContainer>
        ) : (
          <>
            <CameraContainer onPress={takePicture}>
              <CameraView ref={(ref) => setCamera(ref)} type={type} ratio="1:1" />
            </CameraContainer>

            <BottomTab>
              <GalleryBtn onPress={pickImage}>
                <SimpleLineIcons name="picture" size={24} />
              </GalleryBtn>

              <TakeBtn onPress={takePicture}>
                <Feather name="circle" size={58} />
              </TakeBtn>

              <FlipBtn
                onPress={() =>
                  setType(
                    type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
                  )
                }
              >
                <SimpleLineIcons name="refresh" size={24} />
              </FlipBtn>
            </BottomTab>
          </>
        )}
      </Container>
    </>
  );
};

export default CameraScreen;

const StatusBar = styled.View`
  height: ${getStatusBarHeight()}px;
`;
const Container = styled.View`
  flex: 1;
  background-color: ${COLORS.black};
  padding-top: ${(Dimensions.get('window').height - Dimensions.get('window').width - getStatusBarHeight()) / 2}px;
`;

const CameraContainer = styled.TouchableOpacity`
  width: ${Dimensions.get('window').width}px;
  height: undefined;
  aspect-ratio: 1;
`;

const CameraView = styled(Camera)`
  flex: 1;
`;

const BottomTab = styled.View`
  align-items: center;
  width: ${Dimensions.get('window').width - 40}px;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  margin-horizontal: 20px;
  bottom: 20px;
`;
const GalleryBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.white};
  width: 40px;
  height: 40px;
  border-radius: 4px;
`;
const TakeBtn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: ${COLORS.white};
  border-radius: 30px;
`;
const FlipBtn = styled.TouchableOpacity`
  background-color: ${COLORS.white};
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;
const ImageView = styled.Image`
  width: ${Dimensions.get('window').height - Dimensions.get('window').width}px;
  height: undefined;
  aspect-ratio: 1;
`;
const ImageOptions = styled.View`
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  bottom: 10px;
  padding-horizontal: 10px;
  width: 100%;
`;

const OptionBtn = styled(CenterTouchableOpacity)`
  border-width: 1px;
  border-color: ${COLORS.lightGray3};
  background-color: ${COLORS.white};
  width: 48px;
  height: 32px;
  border-radius: 4px;
`;
