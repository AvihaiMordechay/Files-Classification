import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import constats from '../styles/constats';
import { useUser } from '../context/UserContext';
import PdfViewer from '../components/PdfViewer';
import AlertModal from '../components/modals/AlertModal';
import ChangeFileNameModal from '../components/modals/ChangeFileNameModal';

const FileScreen = ({ route }) => {
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
  const [changeFileNameModalVisible, setChangeFileNameModalVisible] =
    useState(false);

  const [localFavorite, setLocalFavorite] = useState(null);

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
      console.error('שגיאה בהוספת המועדף', error);
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
            console.error('error with open file', err);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [file]);
  const handleRename = () => { };
  const handleShare = async () => {
    if (isSharing) return; // using locks for two time fast click

    setIsSharing(true); // only if isSharing is false then start share

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
      console.error('שגיאה בשיתוף הקובץ:', error);
      setAlertTitle('שגיאה');
      setAlertMessage('שגיאה בשיתוף הקובץ');
      setAlertVisible(true);
    } finally {
      setIsSharing(false); // after finishing sharing set the lock to false
    }
  };

  if (!file) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No file provided</Text>
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
      <Image
        source={{ uri: file.path }}
        style={styles.image}
        resizeMode="contain"
      />
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
    fontSize: 12,
    color: '#333',
  },
  image: {
    width: '100%',
    flex: 1,
  },
});

export default FileScreen;
