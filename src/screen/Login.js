import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase(
  {name: 'mycashbook.db', createFromLocation: 1},
  () => {
    // Alert.alert('Info', 'Sukses loading database SQLite');
  },
  err => {
    console.log(err);
  },
);

export default function Login() {
  const {width, height} = Dimensions.get('window');
  const navigation = useNavigation();

  const [dataUser, setdataUser] = useState([]);
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');

  // useEffect(() => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'SELECT * FROM user;',
  //       [],
  //       (txn, res) => {
  //         if (res.rows.length > 0) {
  //           let count = res.rows.length;
  //           let newListData = [];

  //           for (let index = 0; index < count; index++) {
  //             const element = res.rows.item(index);
  //             newListData.push({
  //               id_user: element.id_user, //memanfaatkan value dari database, column id_user
  //               username: element.username, //memanfaatkan value dari database, column username
  //               password: element.password,
  //             });
  //           }

  //           Alert.alert(JSON.stringify(newListData));
  //           setdataUser(newListData);
  //         } else {
  //           handleAddInitialData();
  //         }
  //       },
  //       err => {
  //         console.log(err);
  //       },
  //     );
  //   });
  // }, []);

  const handleAddInitialData = () => {
    console.log('add Data');
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO user (username,password) VALUES (?,?);',
        ['user', 'user123'],
        (txn, res) => {
          if (res.rowsAffected > 0) {
            let newListData = listData;
            let insertID = res.insertId;
            // newListData.push({
            //   user_id: insertID, //memanfaatkan ID unique dari column user_id
            //   username: 'admin',
            //   password: 'admin123',
            // });

            // setdataUser(newListData);
          }
        },
        err => {
          console.log(err);
        },
      );
    });
  };

  const handleLogin = () => {
    if (username !== '' && password !== '') {
      checkLogin();
    } else {
      Alert.alert('Info', 'Username atau Password tidak boleh kosong');
    }
  };

  const checkLogin = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM user WHERE username=? AND password=?;',
        [username, password],
        (txn, res) => {
          if (res.rows.length > 0) {
            Alert.alert('Info', 'Berhasil Login');
            navigation.navigate('Home');
            setusername('');
            setpassword('');
          } else {
            Alert.alert('Info', 'Username atau Password salah');
          }
        },
        err => {
          console.log(err);
        },
      );
    });
  }

  return (
    <ScrollView
      style={{
        paddingHorizontal: '7.5%',
        paddingVertical: '20%',
      }}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          style={{width: width / 2, height: width / 2}}
          source={require('../assets/logo.png')}
        />
        <Text
          style={{
            color: '#28CB7D',
            fontWeight: '600',
            fontSize: 30,
            marginTop: 10,
          }}>
          MyCashBook
        </Text>
      </View>

      <View style={{marginTop: 50}}>
        <Text style={{color: '#005264', fontSize: 18, marginBottom: 15}}>
          Username
        </Text>
        <TextInput
          style={{
            color: '#005264',
            paddingLeft: 20,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: '#005264',
          }}
          placeholder="Masukan username"
          placeholderTextColor={'gray'}
          onChangeText={username => setusername(username)}
        />
      </View>

      <View style={{marginTop: 15}}>
        <Text style={{color: '#005264', fontSize: 18, marginBottom: 15}}>
          Password
        </Text>
        <TextInput
          style={{
            color: '#005264',
            paddingLeft: 20,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: '#005264',
          }}
          placeholder="Masukan password"
          placeholderTextColor={'gray'}
          secureTextEntry={true}
          onChangeText={password => setpassword(password)}
        />
      </View>

      <TouchableOpacity
        style={{
          marginVertical: 25,
          height: 50,
          backgroundColor: '#28CB7D',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => handleLogin()}>
        <Text style={{color: '#fff'}}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
