import React, {useState} from 'react';
import {Calendar} from 'react-native-big-calendar';
import 'dayjs/locale/tr';
import 'dayjs';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {Hoshi} from 'react-native-textinput-effects';
import {RFPercentage} from 'react-native-responsive-fontsize';
import CalendarPicker from 'react-native-calendar-picker';
//import {v4 as uuidv4} from 'uuid';
import {v4 as uuid} from 'uuid';

import DatePicker from 'react-native-date-picker';
import moment from 'moment';
export default function HomeScreen() {
  const darkTheme = {
    palette: {
      primary: {
        main: '#6185d0',
        contrastText: '#000',
      },
      gray: {
        100: '#333',
        200: '#666',
        300: '#888',
        500: '#aaa',
        800: '#ccc',
      },
    },
  };
  const Mode = {
    type: 'day',
    type2: 'month',
    type3: 'week',
  };

  const [events, setEvents] = useState([]);
  const [changeTime, setChangeTime] = useState('custom');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');


  const [selectedEventId, setSelectedEventId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [startsTime, setStartTimes] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const minDate = new Date(); // Today
  const maxDate = new Date(2100, 12, 25, 10, 10);

  const [selectedDate, setSelectedDate] = useState(null);

  const onDateChange = (date, type, startTime, endTimes) => {
    if (type === 'START') {
      setStartTimes(moment(date));
    } else if (type === 'END') {
      if (startsTime && startsTime.valueOf() > moment(date).valueOf()) {
        Alert.alert(
          'Bitiş zamanı başlangıç zamanından büyük olamaz !!!',
          null,
          [
            {
              text: 'Kapat',
              onPress: () => console.log('Kapat'),
              style: 'cancel',
            },
          ],
        );
      } else if (
        startsTime &&
        moment(date).valueOf() - startsTime.valueOf() < 60000
      ) {
        Alert.alert(
          'Bitiş zamanı ile başlangıç zamanı arası en az 1dk olmalıdır !!!',
          null,
          [
            {
              text: 'Kapat',
              onPress: () => console.log('Kapat'),
              style: 'cancel',
            },
          ],
        );
      } else {
        setEndTime(moment(date));
      }
    }
  };

  const saveEvent = () => {
    if (!name) {
      Alert.alert('İsim seçmelisiniz', null, [
        {
          text: 'Tamam',
          onPress: () => console.log('Kapat'),
          style: 'cancel',
        },
      ]);
      return;
    }
    if (!startsTime) {
      Alert.alert('Başlangıç saati seçmelisiniz', null, [
        {
          text: 'Tamam',
          onPress: () => console.log('Kapat'),
          style: 'cancel',
        },
      ]);
      return;
    }
    if (!endTime) {
      Alert.alert('Bitiş saati seçmelisiniz', null, [
        {
          text: 'Tamam',
          onPress: () => console.log('Kapat'),
          style: 'cancel',
        },
      ]);
      return;
    }
    setModalVisible(!modalVisible);

    const start = selectedDate.clone();
    start.set({
      hour: startsTime.hour(),
      minute: startsTime.minutes(),
    });
    const end = selectedDate.clone();

    end.set({
      hour: endTime.hour(),
      minute: endTime.minutes(),
    });

    console.log(selectedEventId, 'asdasdasdasdasdasd');

    if (!selectedEventId) {
      // new event
      setEvents([
        ...events,
        {
          id: uuid(),
          title: name,
          start,
          end,
        },
      ]);
    } else {
      // edit event

      let selectedEventIndex = events.findIndex(
        event => event.id === selectedEventId,
      );

      if (selectedEventIndex !== -1) {
        let tempArrEvents = [...events];
        tempArrEvents[selectedEventIndex] = {
          id: tempArrEvents[selectedEventIndex].id,
          title: name,
          start,
          end,
        };

        setEvents([...tempArrEvents]);
      }
      //event => event.id === selectedEventId,
      setSelectedEventId(null);
    }

    setName('');
    setStartTimes(null);
    setEndTime(null);
    setSelectedDate(null);
    setOpenEnd(false);
    setOpen(false);
  };

  const handleEvent = currentEvent => {
    Alert.alert(
      'Event İşlemleri',
      'İşlemler',
      [
        {
          text: 'Düzenle',
          onPress: () => editHandleEvent(currentEvent),

          style: 'default',
        },
        {
          text: 'Sil',
          onPress: () => deleteHandleEvent(currentEvent),
          style: 'cancel',
        },
        {
          text: 'Kapat',
          onPress: () => console.log('Kapat'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const deleteHandleEvent = currentEvent => {
    setEvents([...events.filter(event => event.id !== currentEvent.id)]);
  };

  const editHandleEvent = currentEvent => {
    const currentSelectedDate = moment(currentEvent.start).set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    });

    setModalVisible(!modalVisible);
    setSelectedDate(currentSelectedDate);
    setStartTimes(moment(currentEvent.start));
    setEndTime(moment(currentEvent.end));
    setName(currentEvent.title);
    setSelectedEventId(currentEvent.id);
  };

  const handleCreateNewEvent = selectedDate => {
    const currentDate = moment(selectedDate).set({
      minute: 0,
      second: 0,
      millisecond: 0,
      hour: 0,
    });
    setModalVisible(!modalVisible);
    setSelectedDate(currentDate);
  };
  return (
    <>
      <View style={{height: 130, marginTop: 50}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              setChangeTime(Mode.type);
            }}
            style={styles.touchStyle}>
            <Text style={styles.texti}>GÜN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setChangeTime(Mode.type2);
            }}
            style={styles.touchStyle}>
            <Text style={styles.texti}>HAFTA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setChangeTime(Mode.type3);
            }}
            style={styles.touchStyle}>
            <Text style={styles.texti}>AY</Text>
          </TouchableOpacity>
        </View>
       {/* <TouchableOpacity
          onPress={() => {
            setSwipe(true);
          }}
          style={styles.desc}>
          <Text style={styles.texti}>İSİM EKLE</Text>
        </TouchableOpacity>*/}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={{marginLeft: 'auto'}}
              onPress={() => {
                setModalVisible(!modalVisible);
                setEndTime(null);
                setStartTimes(null);
                setSelectedDate(null);
                setName('');
              }}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  padding: 10,
                  marginLeft: 'auto',
                  marginTop: '3%',
                  marginRight: 15,
                }}
                source={require('../images/close.png')}
              />
            </TouchableOpacity>
            <Text style={styles.modalText}>İSİM EKLE</Text>
            <View
              style={{
                width: '90%',
                marginRight: 'auto',
                marginLeft: 'auto',
                marginTop: '2%',
              }}>
              <Hoshi
                label={'İsim giriniz'}
                borderColor={'#55C1C3'}
                autoCapitalize={'words'}
                returnKeyType="done"
                borderHeight={3}
                labelStyle={{color: '#B7B7B7'}}
                inputStyle={{
                  width: '95%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                autoCorrect={false}
                placeholderTextColor="#9A9A9A"
                inputPadding={16}
                style={{
                  color: 'red',
                  width: '95%',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                }}
                type={'custom'}
                value={name}
                onChangeText={names => setName(names)}
              />
            </View>
            {/* <Text style={styles.modalText1}>TARİH SEÇİNİZ</Text>*/}
            {/*<CalendarPicker
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              allowRangeSelection={false}
              minDate={minDate}
              maxDate={maxDate}
              todayBackgroundColor="#f2e6ff"
              selectedDayColor="#7300e6"
              selectedDayTextColor="#FFFFFF"
              startFromMonday={true}
              weekdays={['Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz']}
              months={[
                'Ocak',
                'Şubat',
                'Mart',
                'Nisan',
                'Mayıs',
                'Haziran',
                'Temmuz',
                'Ağustos',
                'Eylül',
                'Ekim',
                'Kasım',
                'Aralık',
              ]}
              nextTitle={'İleri'}
              previousTitle={'Geri'}
              onDateChange={onDateChange}
              handleOnPressDay={data => console.log('handleOnPressDay', data)}
            />*/}
            <DatePicker
              cancelText={'İptal'}
              title={'Başlangıç Saati Seçiniz'}
              confirmText={'Onayla'}
              modal
              mode={'time'}
              minDate={minDate}
              maxDate={maxDate}
              open={open}
              date={startsTime?.toDate() || minDate}
              theme={'auto'}
              onConfirm={time => {
                setOpen(false);
                onDateChange(time, 'START');
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
            <DatePicker
              cancelText={'İptal'}
              title={'Bitiş Saati Seçiniz'}
              confirmText={'Onayla'}
              modal
              minDate={minDate}
              maxDate={maxDate}
              open={openEnd}
              mode={'time'}
              //onDateChange={onDateChange}
              date={endTime?.toDate() || minDate}
              theme={'auto'}
              onConfirm={endTimes => {
                setOpenEnd(false);
                onDateChange(endTimes, 'END');
              }}
              onCancel={() => {
                setOpenEnd(false);
              }}
            />

            <View style={{flexDirection: 'row', marginTop: '8%'}}>
              <TouchableOpacity style={{marginRight: 15, width: '45%'}} onPress={() => setOpen(true)}>
                <Text style={styles.modalText1}>BAŞLANGIÇ SAATİ SEÇİNİZ</Text>
                {startsTime && <Text style={{textAlign: 'center', fontSize: RFPercentage(2.5), color: '#333', fontWeight: 'bold'}}>{startsTime.format('HH:mm')}</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={{marginLeft: 15, marginTop: 2, width: '45%'}} onPress={() => setOpenEnd(true)}>
                <Text style={styles.modalText1}>BİTİŞ SAATİ SEÇİNİZ</Text>
                {endTime && <Text style={{textAlign: 'center', fontSize: RFPercentage(2.5), color: '#333', fontWeight: 'bold'}}>{endTime.format('HH:mm')}</Text>}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => saveEvent()}
              style={styles.nexButton}>
              <Text style={styles.textStyle1}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Calendar
        moreLabel={true}
        showTime={true}
        theme={darkTheme}
        locale={'tr'}
        swipeEnabled={true}
        mode={changeTime}
        events={events}
        height={600}
        onPressCell={selectedDate => handleCreateNewEvent(selectedDate)}
        onPressEvent={event => handleEvent(event)}
      />
    </>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    height: 650,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 650,
    width: '98%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle1: {
    color: '#f5f5f5',
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: RFPercentage(2.1),
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 'auto',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nexButton: {
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    borderRadius: 15,
    height: 50,
    backgroundColor: '#24D4A4',
    marginBottom: '5%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
    marginTop: '5%',
  },
  modalText1: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: RFPercentage(2),
    marginTop: '5%',
    marginBottom: '5%',
  },
  touchStyle: {
    backgroundColor: 'gray',
    height: 50,
    width: '33%',
    borderRadius: 25,

  },
  desc: {
    backgroundColor: 'gray',
    height: 50,
    marginTop: 15,
    width: '50%',
    borderRadius: 25,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  texti: {
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
    color: '#fff',
    fontWeight: 'bold',
  },
});
