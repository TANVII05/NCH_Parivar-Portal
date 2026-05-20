import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Colors, BorderRadius, Typography, Spacing, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';

export default function FacePunchScreen() {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [locPermission, setLocPermission] = useState(false);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [punchType, setPunchType] = useState('');
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocPermission(true);
        const loc = await Location.getCurrentPositionAsync({});
        setLatitude(loc.coords.latitude.toFixed(6));
        setLongitude(loc.coords.longitude.toFixed(6));
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const p = await cameraRef.current.takePictureAsync({ quality: 0.5 });
        setPhoto(p.uri);
      } catch (e) {
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const handleSubmit = () => {
    if (!latitude || !longitude) { Alert.alert('Error', 'Location is required'); return; }
    if (!photo) { Alert.alert('Error', 'Photo is required'); return; }
    if (!punchType) { Alert.alert('Error', 'Select punch type'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', `Face Punch ${punchType} recorded successfully!`);
      setPhoto(null);
      setPunchType('');
    }, 1500);
  };

  if (!permission?.granted) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="camera-outline" size={48} color={colors.textTertiary} />
        <Text style={[styles.permText, { color: colors.text }]}>Camera permission required</Text>
        <Button title="Grant Permission" onPress={requestPermission} style={{ marginTop: Spacing.lg }} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Face Punch</Text>

      <Card style={styles.locationCard}>
        <View style={styles.locRow}>
          <Ionicons name="location" size={20} color={Colors.primary} />
          <Text style={[styles.locLabel, { color: colors.textSecondary }]}>Location</Text>
        </View>
        {latitude ? (
          <Text style={[styles.locValue, { color: colors.text }]}>
            {latitude}, {longitude}
          </Text>
        ) : (
          <Text style={[styles.locValue, { color: colors.textTertiary }]}>Fetching location...</Text>
        )}
      </Card>

      <Card style={styles.cameraCard}>
        {photo ? (
          <View>
            <Image source={{ uri: photo }} style={styles.preview} />
            <Button title="Retake Photo" onPress={() => setPhoto(null)} variant="outlined"
              style={{ marginTop: Spacing.md }} />
          </View>
        ) : (
          <View>
            <CameraView ref={cameraRef} style={styles.camera} facing="front" />
            <Button title="Capture Photo" onPress={takePhoto}
              icon={<Ionicons name="camera" size={18} color="#FFF" />}
              style={{ marginTop: Spacing.md }} />
          </View>
        )}
      </Card>

      <Select label="Punch Type" value={punchType} options={['IN', 'OUT']}
        onSelect={setPunchType} searchable={false} />

      <Button title="Submit Face Punch" onPress={handleSubmit} loading={loading}
        style={{ marginTop: Spacing.md }}
        disabled={!latitude || !photo || !punchType} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.huge },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xxl },
  permText: { fontFamily: Typography.fontFamily.medium, fontSize: Typography.sizes.bodyLarge, marginTop: Spacing.lg },
  title: { fontFamily: Typography.fontFamily.bold, fontSize: Typography.sizes.heading, marginBottom: Spacing.xl },
  locationCard: { marginBottom: Spacing.lg },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  locLabel: { fontFamily: Typography.fontFamily.medium, fontSize: Typography.sizes.body },
  locValue: { fontFamily: Typography.fontFamily.regular, fontSize: Typography.sizes.small },
  cameraCard: { marginBottom: Spacing.lg, padding: Spacing.md },
  camera: { height: 300, borderRadius: BorderRadius.md, overflow: 'hidden' },
  preview: { height: 300, borderRadius: BorderRadius.md },
});
