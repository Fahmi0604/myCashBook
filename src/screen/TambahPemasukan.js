import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {openDatabase} from 'react-native-sqlite-storage';
import {useNavigation} from '@react-navigation/native';

var db = openDatabase(
  {name: 'mycashbook.db', createFromLocation: 1},
  () => {
    // Alert.alert('Info', 'Sukses loading database SQLite');
  },
  err => {
    console.log(err);
  },
);

export default function TambahPemasukan() {
  const navigation = useNavigation();

  const [date, setDate] = useState(new Date(Date.now()));
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('');
  //   const [listData, setListData] = useState([]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const handleAddData = () => {
    if (nominal == '' && keterangan != '') {
      Alert.alert('Info', 'Field tidak boleh kosong');
    } else {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO transaksi (date,nominal,keterangan,tipe) VALUES (?,?,?,?);',
          [date.toDateString(), nominal, keterangan, 'pemasukan'],
          (txn, res) => {
            if (res.rowsAffected > 0) {
              //   let newListData = listData;
              //   let insertID = res.insertId;
              //   newListData.push({
              //     id_transaksi: insertID, //memanfaatkan ID unique dari column user_id
              //     date: date,
              //     nominal: nominal,
              //     keterangan: keterangan,
              //     tipe: 'pemasukan',
              //   });

              //   setListData(newListData);
              //   Alert.alert('Info', `insert id : ${insertID}`);
              setDate(new Date(Date.now()));
              setNominal('');
              setKeterangan('');
              Alert.alert('Info', `Data Berhasil Ditambahkan`);
            }
          },
          err => {
            console.log(err);
          },
        );
      });
    }
  };

  return (
    <ScrollView>
      <View
        style={{
          paddingHorizontal: '7.5%',
          paddingVertical: '10%',
        }}>
        <Text style={{color: '#28CB7D', fontSize: 25, fontWeight: '500'}}>
          Tambah Pemasukan
        </Text>

        <View style={{marginVertical: 20}}>
          <Text style={{color: '#282828', marginBottom: 10}}>Tanggal:</Text>
          <TouchableOpacity
            onPress={showDatepicker}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInput
              value={date.toLocaleDateString()}
              editable={false}
              style={{
                width: '90%',
                borderWidth: 1,
                borderRadius: 10,
                color: '#282828',
                paddingLeft: 10,
              }}
            />
            <Icon name="calendar" size={25} color="#282828" />
          </TouchableOpacity>
        </View>

        <View style={{marginBottom: 10}}>
          <Text style={{color: '#282828', marginBottom: 10}}>Nominal:</Text>
          <TextInput
            value={'Rp.' + nominal}
            onChangeText={text => setNominal(text.replace(/\D+/g, ''))}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              color: '#282828',
              paddingLeft: 10,
            }}
            placeholder="Masukan Nominal"
            placeholderTextColor={'gray'}
          />
        </View>

        <View style={{marginBottom: 30}}>
          <Text style={{color: '#282828', marginBottom: 10}}>Keterangan:</Text>
          <TextInput
            value={keterangan}
            onChangeText={text => setKeterangan(text)}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              color: '#282828',
              paddingLeft: 10,
            }}
            placeholder="Masukan Keterangan"
            placeholderTextColor={'gray'}
          />
        </View>

        <TouchableOpacity
          onPress={() => handleAddData()}
          style={{
            backgroundColor: '#28CB7D',
            paddingVertical: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>Simpan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{
            backgroundColor: '#282828',
            paddingVertical: 15,
            borderRadius: 10,
            marginBottom: 20,
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
