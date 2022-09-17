import React, {useEffect, useState} from 'react';
import {Text, View, Dimensions, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import {LineChart} from 'react-native-chart-kit';
import {useNavigation} from '@react-navigation/native';

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

export default function Home() {
  const {width, height} = Dimensions.get('window');
  const navigation = useNavigation();

  const [dataTransaksi, setDataTransaksi] = useState([]);
  const [dataChart, setDataChart] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            data: [830, 762, 810, 700, 723, 493, 677, 641, 509, 213, 335, 198, 29]
        },
    ],
  });

  useEffect(() => {
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

            // console.log(newListData);
            setDataTransaksi(newListData);

            // Alert.alert('Info', JSON.stringify(newListData));
            // setdataUser(newListData);
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

  useEffect(() => {
    // const log = dataTransaksi
    //   .map(m => {
    //     return Number(m.nominal.slice(0, -3));
    //   })
    // setDataChart({
    //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //   datasets: [
    //       {
    //           data: dataTransaksi.map(m => {return Number(m.nominal);})
    //       },
    //   ],
    // });
    // console.log(log);
  }, [dataTransaksi]);

  return (
    <View
      style={{
        paddingHorizontal: '7.5%',
        paddingVertical: '10%',
      }}>
      <View style={{alignItems: 'center', marginBottom: 20}}>
        <Text
          style={{
            color: '#282828',
            fontSize: 20,
            fontWeight: '500',
            marginBottom: 10,
          }}>
          Rangkuman Bulan ini
        </Text>
        <Text style={{color: '#EC415E', fontSize: 16, marginBottom: 3}}>
          Pengeluaran Rp.
          {dataTransaksi
            .filter(f => f.tipe === 'pengeluaran')
            .map(m => m.nominal)
            .reduce((acc, data) => acc + Number(data), 0)}
        </Text>
        <Text style={{color: '#28CB7D', fontSize: 16}}>
          Pemasukan Rp.
          {dataTransaksi
            .filter(f => f.tipe === 'pemasukan')
            .map(m => m.nominal)
            .reduce((acc, data) => acc + Number(data), 0)}
        </Text>
      </View>

      <View>
        <LineChart
          data={dataChart}
          // data={{
          //   labels: ['January', 'February', 'March', 'April', 'May', 'June'],
          //   datasets: [
          //     {
          //       data: dataTransaksi.map(m => {return Number(m.nominal.slice(0, -3))})
          //       // data: [
          //       //   Math.random() * 100,
          //       //   Math.random() * 100,
          //       //   Math.random() * 100,
          //       //   Math.random() * 100,
          //       //   Math.random() * 100,
          //       //   Math.random() * 100,
          //       // ],
          //     },
          //   ],
          // }}
          width={(width / 10) * 8.5} // from react-native
          height={220}
          yAxisLabel="Rp."
          //   yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            // backgroundColor: '#282828',
            backgroundGradientFrom: '#19BE64',
            backgroundGradientTo: '#28CB7D',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '5',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            // marginVertical: 8,
            borderRadius: 10,
          }}
        />
      </View>

      <View
        style={{marginVertical: 20, flexDirection: 'row', flexWrap: 'wrap'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TambahPemasukan')}
          style={{
            width: '48%',
            height: 150,
            backgroundColor: '#19BE64',
            marginHorizontal: '1%',
            marginBottom: '2%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="cash-plus" color={'white'} size={50} />
          <Text style={{color: 'white'}}>Tambah Pemasukan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('TambahPengeluaran')}
          style={{
            width: '48%',
            height: 150,
            backgroundColor: '#19BE64',
            marginHorizontal: '1%',
            marginBottom: '2%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="cash-minus" color={'white'} size={50} />
          <Text style={{color: 'white'}}>Tambah Pengeluaran</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CashFlow')}
          style={{
            width: '48%',
            height: 150,
            backgroundColor: '#19BE64',
            marginHorizontal: '1%',
            marginBottom: '2%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="form-select" color={'white'} size={50} />
          <Text style={{color: 'white'}}>Detail CashFlow</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Pengaturan')}
          style={{
            width: '48%',
            height: 150,
            backgroundColor: '#19BE64',
            marginHorizontal: '1%',
            marginBottom: '2%',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon2 name="gear" color={'white'} size={50} />
          <Text style={{color: 'white'}}>Pengaturan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
