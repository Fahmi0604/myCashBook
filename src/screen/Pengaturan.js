import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Button,
  Alert,
} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';

var db = openDatabase(
  { name: 'mycashbook.db', createFromLocation: 1 },
  () => {
    // Alert.alert('Info', 'Sukses loading database SQLite');
  },
  err => {
    console.log(err);
  },
);

export default function Pengaturan() {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const updatePassword = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE user SET password=? WHERE id_user=?',
        [newPassword, 1],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            Alert.alert('Info', 'Password berhasil diubah');
            setPassword('');
            setNewPassword('');
          } else {
            Alert.alert('Info', 'Password gagal diubah');
          }
        }
      );
    });
  }

  const checkPassword = () => {
    if (password !== '' && newPassword !== '') {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM user WHERE id_user=?',
          [1],
          (txn, res) => {
            if (res.rows.length > 0) {
              if (res.rows.item(0).password === password) {
                updatePassword()
              } else {
                Alert.alert('Info', 'Password lama salah');
              }
            }
          },
          err => {
            console.log(err);
          },
        );
      });
    } else {
      Alert.alert('Info', 'Form tidak boleh kosong');
    }
  }

  return (
    <View
      style={{
        // height: (height / 10) * 8.5,
        height: height,
        paddingHorizontal: '7.5%',
        paddingVertical: '10%',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
      <View>
        <Text style={{ color: '#282828', fontSize: 25, fontWeight: '500' }}>
          Pengaturan
        </Text>

        <Text style={{ color: 'gray', fontSize: 18, marginVertical: 10 }}>Ganti Password</Text>

        <View style={{ marginBottom: 10, marginTop: 20 }}>
          <Text style={{ color: '#282828', marginBottom: 10 }}>
            Password Saat ini
          </Text>
          <TextInput
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              color: '#282828',
              paddingLeft: 10,
            }}
            placeholder="Masukan password saat ini"
            placeholderTextColor={'gray'}
          />
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ color: '#282828', marginBottom: 10 }}>
            Password Baru
          </Text>
          <TextInput
            value={newPassword}
            onChangeText={text => setNewPassword(text)}
            secureTextEntry={true}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              color: '#282828',
              paddingLeft: 10,
            }}
            placeholder="Masukan password terbaru"
            placeholderTextColor={'gray'}
          />
        </View>

        <TouchableOpacity
          onPress={() => checkPassword()}
          style={{
            backgroundColor: '#28CB7D',
            paddingVertical: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}>
          <Text style={{ textAlign: 'center', color: 'white' }}>Simpan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{
            backgroundColor: '#282828',
            paddingVertical: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}>
          <Text style={{ textAlign: 'center', color: 'white' }}>Kembali</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row' }}>
        <Image
          style={{ width: width / 3, height: width / 2, borderRadius: 10 }}
          source={require('../assets/FAHMI.jpg')}
        />
        <View
          style={{
            flexDirection: 'column',
            paddingHorizontal: 20,
          }}>
          <Text style={{ color: 'gray', fontSize: 22, fontWeight: '500', marginBottom: 15 }}>
            About This App
          </Text>
          <Text style={{ color: 'gray' }}>Aplikasi ini dibuat oleh</Text>
          <Text style={{ color: 'gray' }}>Nama: Fahmi Firmansyah</Text>
          <Text style={{ color: 'gray' }}>Nim: 1841720212</Text>
          <Text style={{ color: 'gray' }}>Tanggal: 13 September 2022</Text>

          <TouchableOpacity style={{ backgroundColor: 'gray', marginTop: 30, paddingHorizontal: 10, paddingVertical: 10, borderRadius: 10 }}>
            <Text onPress={() => navigation.navigate('Login')} style={{ color: 'white', textAlign: 'center' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
