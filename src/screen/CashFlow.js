import React, {useState} from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
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

export default function CashFlow() {
  const navigation = useNavigation();
  const {width, height} = Dimensions.get('window');
  const [dataTransaksi, setDataTransaksi] = useState([]);

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM transaksi;',
        [],
        (txn, res) => {
          if (res.rows.length > 0) {
            let count = res.rows.length;
            let newListData = [];

            for (let index = 0; index < count; index++) {
              const element = res.rows.item(index);
              newListData.push({
                id_transaksi: element.id_transaksi, //memanfaatkan value dari database, column id_user
                date: element.date, //memanfaatkan value dari database, column username
                nominal: element.nominal,
                keterangan: element.keterangan,
                tipe: element.tipe,
              });
            }

            // Alert.alert('Info', JSON.stringify(newListData));
            setDataTransaksi(newListData);
          } else {
            // Alert.alert('Info', 'Tidak ada data');
          }
        },
        err => {
          console.log(err);
        },
      );
    });
  }, []);

  return (
    <ScrollView
      style={{
        paddingHorizontal: '7.5%',
        paddingVertical: '10%',
      }}>
      <Text style={{color: '#282828', fontSize: 25, fontWeight: '500'}}>
        Detail CashFlow
      </Text>

      <View style={{marginVertical: 20, height: (height / 10) * 8.3}}>
        {dataTransaksi.map((element, index) => (
          <View
            key={index}
            style={{
              backgroundColor: '#005264',
              flexDirection: 'row',
              paddingHorizontal: '5%',
              paddingVertical: '5%',
              borderRadius: 15,
              marginBottom: 20,
            }}>
            <View style={{width: '70%'}}>
              <Text style={{color: 'white', fontSize: 16, fontWeight: '600'}}>
                [ {element.tipe === 'pemasukan' ? '+' : '-'} ] Rp.
                {element.nominal}
              </Text>
              <Text style={{color: 'white', marginVertical: 10}}>
                {element.keterangan}
              </Text>
              <Text>{new Date(element.date).toLocaleDateString()}</Text>
            </View>
            <View
              style={{
                width: '25%',
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              {element.tipe === 'pemasukan' ? (
                <Icon name="arrow-right" size={50} color="#19BE64" />
              ) : (
                <Icon name="arrow-left" size={50} color="#EC415E" />
              )}
            </View>
          </View>
        )).reverse()}
      </View>

      <View style={{position: 'absolute', bottom: 0}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={{
            backgroundColor: '#282828',
            width: (width / 10) * 8.5,
            paddingVertical: 15,
            borderRadius: 10,
          }}>
          <Text style={{textAlign: 'center', color: 'white'}}>Kembali</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
