import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  PinchGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useConstats } from '../styles/constats';
import { useUser } from '../context/UserContext';
import PdfViewer from '../components/PdfViewer';
import AlertModal from '../components/modals/AlertModal';
import ChangeFileNameModal from '../components/modals/ChangeFileNameModal';
import { initDB, resetDatabaseState } from '../services/database';

const FileScreen = ({ route }) => {
  const constats = useConstats();
  const { file, folderName } = route.params || {};
  const { updateLastViewedToFile } = useUser();
  const { markAsFavorite, user } = useUser();
  const navigation = useNavigation();
  const [base64, setBase64] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [changeFileNameModalVisible, setChangeFileNameModalVisible] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(null);

  const scale = useRef(new Animated.Value(1)).current;
  const currentScale = useRef(1);
  const doubleTapRef = useRef();

  const checkIsFavorite = () => {
    if (file.id) {
      return (
        user?.favorites?.some(
          (fav) => fav.fileId === file.id && fav.folderName === file.folderName
        ) || file.isFavorite === 1
      );
    }
    return file.isFavorite === 1;
  };

  useEffect(() => {
    if (localFavorite === null) {
      setLocalFavorite(checkIsFavorite());
    }
  }, [file, user.favorites, localFavorite]);

  const handleFavorite = async (event) => {
    event.stopPropagation();
    const newFavoriteState = !localFavorite;
    setLocalFavorite(newFavoriteState);

    try {
      await markAsFavorite(newFavoriteState, file.id, folderName);
    } catch (error) {
      console.log('שגיאה בהוספת המועדף', error);
      setLocalFavorite(localFavorite);
    }
  };

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: 'none' },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: { backgroundColor: '#fff', height: 75 },
      });
    };
  }, [navigation]);

  useEffect(() => {
    if (file) {
      updateLastViewedToFile(file.id);

      if (file.type === 'application/pdf') {
        FileSystem.readAsStringAsync(file.path, {
          encoding: FileSystem.EncodingType.Base64,
        })
          .then((data) => {
            setBase64(data);
            setLoading(false);
          })
          .catch((err) => {
            console.log('error with open file', err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [file]);

  const handleShare = async () => {
    if (isSharing) return;

    setIsSharing(true);

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        setAlertTitle('שגיאה');
        setAlertMessage('שיתוף לא זמין במכשיר הזה');
        setAlertVisible(true);
        return;
      }

      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/tiff'
      ) {
        const extension =
          file.type === 'image/jpeg' || file.type === 'image/jpg'
            ? 'jpg'
            : file.type === 'image/png'
              ? 'png'
              : 'tiff';

        const tempFileUri =
          FileSystem.documentDirectory + file.name + '.' + extension;

        await FileSystem.copyAsync({
          from: file.path,
          to: tempFileUri,
        });

        const shareResult = await Sharing.shareAsync(tempFileUri, {
          mimeType: file.type,
        });

        if (shareResult) {
          await FileSystem.deleteAsync(tempFileUri);
        }
      } else {
        await Sharing.shareAsync(file.path);
      }
    } catch (error) {
      console.log('שגיאה בשיתוף הקובץ:', error);
      setAlertTitle('שגיאה');
      setAlertMessage('שגיאה בשיתוף הקובץ');
      setAlertVisible(true);
    } finally {
      setIsSharing(false);
      await resetDatabaseState();
      await initDB();
    }
  };

  const onPinchGestureEvent = (event) => {
    const newScale = currentScale.current * event.nativeEvent.scale;
    scale.setValue(Math.max(0.5, Math.min(newScale, 3)));
  };

  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      currentScale.current = currentScale.current * event.nativeEvent.scale;
      currentScale.current = Math.max(0.5, Math.min(currentScale.current, 3));
    }
  };

  const onDoubleTap = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      currentScale.current = 1;

      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    errorText: {
      fontSize: constats.sizes.font.medium,
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
    },
    bottomBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderColor: '#ddd',
      backgroundColor: '#f9f9f9',
    },
    iconButton: {
      alignItems: 'center',
    },
    iconLabel: {
      marginTop: 4,
      fontSize: constats.sizes.font.small,
      color: '#333',
    },
    imageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });

  if (!file) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>לא סופק קובץ</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (file.type === 'application/pdf') {
    return (
      <View style={styles.container}>
        <PdfViewer base64={base64} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TapGestureHandler
        ref={doubleTapRef}
        onHandlerStateChange={onDoubleTap}
        numberOfTaps={2}
      >
        <PinchGestureHandler
          onGestureEvent={onPinchGestureEvent}
          onHandlerStateChange={onPinchHandlerStateChange}
        >
          <Animated.View style={styles.imageContainer}>
            <Animated.Image
              source={{ uri: file.path }}
              style={[
                styles.image,
                {
                  transform: [{ scale }],
                },
              ]}
              resizeMode="contain"
            />
          </Animated.View>
        </PinchGestureHandler>
      </TapGestureHandler>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton} onPress={handleFavorite}>
          <Ionicons
            name={localFavorite ? 'star' : 'star-outline'}
            size={28}
            color="#333"
          />
          <Text style={styles.iconLabel}>מועדפים</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setChangeFileNameModalVisible(true)}
        >
          <Ionicons name="pencil-outline" size={28} color="#333" />
          <Text style={styles.iconLabel}>שנה שם</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={28} color="#333" />
          <Text style={styles.iconLabel}>שתף</Text>
        </TouchableOpacity>
      </View>
      <AlertModal
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        title={alertTitle || 'שגיאה'}
        message={alertMessage}
        buttons={[{ text: 'סגור', onPress: () => setAlertVisible(false) }]}
      />
      <ChangeFileNameModal
        visible={changeFileNameModalVisible}
        onClose={() => setChangeFileNameModalVisible(false)}
        fileId={file.id}
        folderName={folderName}
      />
    </View>
  );
};

export default FileScreen;