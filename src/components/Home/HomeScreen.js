import React, {useEffect, useState} from 'react';
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
  StatusBar,
  Pressable,
} from 'react-native';
import {Hoshi,Sae} from 'react-native-textinput-effects';
import {v4 as uuid} from 'uuid';

import DatePicker from 'react-native-date-picker';
import moment from 'moment';
export default function HomeScreen() {
  const Mode = {
    type: 'day',
    type2: 'month',
    type3: 'week',
    backgroundColor: 'red',
  };
  const BORDER_COLOR = '#cedde7';
  const BACKGROUND_COLOR = '#088ad9';
  const CELL_COLOR = '#fafafa';
  const HEADER_COLOR = '#088ad9';
  const TEXT_COLOR = 'black';
  const INDICATOR_COLOR = 'white';
  const WEEKTEXT_COLOR = '#fff';
  const HOUR_COLOR = 'black';
  const BORDERBOTTOMHEADER_COLOR = '#22a199';
  const EVENTCELL_COLOR = '#088ad9';
  const EVENTTEXT_COLOR = '#fff';
  const [events, setEvents] = useState([]);
  const [changeTime, setChangeTime] = useState('week');
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [startsTime, setStartTimes] = useState(
    moment().set({minute: 0, second: 0, millisecond: 0}),
  );
  const [endTime, setEndTime] = useState(
    moment().add(1, 'hours').set({minute: 0, second: 0, millisecond: 0}),
  );
  const minDate = new Date(); // Today
  const maxDate = new Date(2100, 12, 25, 10, 10);
  const [theme, setTheme] = useState({});

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
    if (!note) {
      Alert.alert('Note seçmelisiniz', null, [
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
      hour: startsTime.hours(),
      minute: startsTime.minutes(),
    });

    const end = selectedDate.clone();
    end.set({
      hour: endTime.hours(),
      minute: endTime.minutes(),
    });

    console.log(start.toDate(), 'start');
    console.log(end.toDate(), 'end');

    if (!selectedEventId) {
      // new event
      setEvents([
        ...events,
        {
          id: uuid(),
          title: name,
          detail: note,
          start: start.toDate(),
          end: end.toDate(),
        },
      ]);
    } else {
      let selectedEventIndex = events.findIndex(
        event => event.id === selectedEventId,
      );

      if (selectedEventIndex !== -1) {
        let tempArrEvents = [...events];
        tempArrEvents[selectedEventIndex] = {
          id: tempArrEvents[selectedEventIndex].id,
          title: name,
          detail: note,
          start: start.toDate(),
          end: end.toDate(),
        };

        setEvents([...tempArrEvents]);
      }
      setSelectedEventId(null);
    }

    setName('');
    setNote('');
    setStartTimes(moment().set({minute: 0, second: 0, millisecond: 0}));
    setEndTime(
      moment().add(1, 'hours').set({minute: 0, second: 0, millisecond: 0}),
    );
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
    setNote(currentEvent.detail);
    setSelectedEventId(currentEvent.id);
  };

  const handleCreateNewEvent = selectedDate => {
    const currentDate = moment(selectedDate).set({
      minute: 0,
      second: 0,
      millisecond: 0,
      hour: 0,
    });
    setSelectedDate(currentDate);
    setModalVisible(!modalVisible);
    // console.log('SELECTED DATE',selectedDate);
  };

  useEffect(() => {
    const darkTheme = {
      palette: {
        primary: {
          main: changeTime === Mode.type2 ? 'red' : INDICATOR_COLOR,
          contrastText: 'black',
        },
        gray: {
          100: 'black',
          200: 'black',
          300: 'black',
          500: 'black',
          800: 'black',
        },
      },
    };

    setTheme(() => {
      return {...darkTheme};
    });
    console.log('RRRR', theme);
  }, [changeTime]);

  /* const formats = {
    weekdayFormat: (date, culture, localizer) =>
      localizer.format(date, 'dddd', culture),
  };*/
  const FONT_SIZE = 28;

  /* const darkTheme = {
    palette: {
      primary: {
        main: INDICATOR_COLOR,
        contrastText: 'black',
      },
      gray: {
        100: 'black',
        200: 'black',
        300: 'black',
        500: WEEKTEXT_COLOR,
        800: 'black',
      },
    },
  };*/
  const renderEvent = (event, touchableOpacityProps) => (
    <TouchableOpacity {...touchableOpacityProps}>
      <Text style={{color: EVENTTEXT_COLOR}}>{event.title}</Text>
      <Text style={{color: EVENTTEXT_COLOR}}>{`${moment(event.start).format(
        'HH:mm',
      )} - ${moment(event.end).format('HH:mm')}`}</Text>
      <Text numberOfLines={3} style={{color: EVENTTEXT_COLOR}}>
        {event.detail}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View>
        <StatusBar hidden />
        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: BORDERBOTTOMHEADER_COLOR,
            borderBottomWidth: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              setChangeTime(Mode.type);
            }}
            style={[
              styles.touchStyle,
              {
                backgroundColor:
                  changeTime === Mode.type ? BACKGROUND_COLOR : null,
              },
            ]}>
            <Text
              style={[
                styles.texti,
                {color: changeTime === Mode.type ? '#fff' : '#111'},
              ]}>
              GÜN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setChangeTime(Mode.type3);
            }}
            style={[
              styles.touchWStyle,
              {
                borderColor: BORDER_COLOR,
                backgroundColor:
                  changeTime === Mode.type3 ? BACKGROUND_COLOR : null,
              },
            ]}>
            <Text
              style={[
                styles.texti,
                {color: changeTime === Mode.type3 ? '#fff' : '#111'},
              ]}>
              HAFTA
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setChangeTime(Mode.type2);
            }}
            style={[
              styles.touchStyle,
              {
                backgroundColor:
                  changeTime === Mode.type2 ? BACKGROUND_COLOR : null,
              },
            ]}>
            <Text
              style={[
                styles.texti,
                {color: changeTime === Mode.type2 ? '#fff' : '#111'},
              ]}>
              AY
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{width: '100%', borderColor: 'orange', borderWidth: 1}}/>*/}
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
              style={{
                marginRight: 'auto',
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
              }}
              onPress={() => {
                setModalVisible(!modalVisible);
                setStartTimes(
                  moment().set({minute: 0, second: 0, millisecond: 0}),
                );
                setEndTime(
                  moment()
                    .add(1, 'hours')
                    .set({minute: 0, second: 0, millisecond: 0}),
                );
                setSelectedDate(null);
                setName('');
                setNote('');
              }}>
              <Image
                style={{
                  width: 30,
                  height: 10,
                  padding: 10,
                  marginTop: '3%',
                  position: 'absolute',
                  left: 10,
                }}
                source={require('../images/arrow.png')}
              />
              <Text style={styles.modalText}>RANDEVU EKLE</Text>
            </TouchableOpacity>
            <View
              style={{
                width: '90%',
                marginRight: 'auto',
                marginLeft: 'auto',
                marginTop: '2%',
              }}>
              <Hoshi
                label={'Lütfen İsminizi giriniz'}
                borderColor={'#55C1C3'}
                autoCapitalize={'words'}
                animationDuration={15}
                returnKeyType="done"
                borderHeight={3}
                editable={true}
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
            <View
              style={{
                width: '90%',
                marginRight: 'auto',
                marginLeft: 'auto',
                marginTop: '2%',
              }}>
              <Hoshi
                label={'Lütfen Notunuzu giriniz'}
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
                value={note}
                onChangeText={notes => setNote(notes)}
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
              is24hourSource={'locale'}
              mode={'time'}
              minDate={minDate}
              maxDate={maxDate}
              locale={'fr'}
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
              is24hourSource={'locale'}
              minDate={minDate}
              maxDate={maxDate}
              open={openEnd}
              locale={'fr'}
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

            <View
              style={{
                flexDirection: 'row',
                marginTop: '8%',
                position: 'relative',
                width: '100%',
                justifyContent: 'center',
              }}>
              <Pressable
                style={{marginRight: 15, width: '45%', height: 80}}
                onPress={() => setOpen(true)}>
                <Text style={styles.modalText1}>Başlangıç</Text>
                {startsTime && (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: FONT_SIZE,
                      color: '#333',
                    }}>
                    {startsTime.format('HH:mm')}
                  </Text>
                )}
              </Pressable>
              <Text
                style={{
                  position: 'absolute',
                  borderStyle: 'dashed',
                  bottom: -20,
                  fontSize: 35,
                }}>
                ------
              </Text>
              <Pressable
                style={{marginLeft: 15, marginTop: 2, width: '45%', height: 80}}
                onPress={() => setOpenEnd(true)}>
                <Text style={styles.modalText1}>Bitiş</Text>
                {endTime && (
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: FONT_SIZE,
                      color: '#333',
                    }}>
                    {endTime.format('HH:mm')}
                  </Text>
                )}
              </Pressable>
            </View>
            <TouchableOpacity
              onPress={() => saveEvent()}
              style={styles.nexButton}>
              <Text style={styles.textStyle1}>Oluştur</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Calendar
        //bodyContainerStyle={{backgroundColor: 'gray'}}
        headerContentStyle={{
          height: 70,
          alingItems: 'center',
          borderWidth: 1,
          backgroundColor: HEADER_COLOR,
          borderColor: BORDER_COLOR,
          marginTop: -2,
        }}
        calendarCellStyle={{
          backgroundColor: CELL_COLOR,
          borderColor: BORDER_COLOR,
        }}
        hourStyle={{color: HOUR_COLOR, fontSize: 13, flexWrap: 'nowrap'}}
        eventCellStyle={{backgroundColor: EVENTCELL_COLOR}}
        showAllDayEventCell={false}
        moreLabel={true}
        sortedMonthView={{backgroundColor: EVENTCELL_COLOR}}
        showAdjacentMonths={true}
        weekStartsOn={true}
        showTime={true}
        hideNowIndicator={true}
        weekDayHeaderHighlightColor={{color: WEEKTEXT_COLOR}}
        theme={theme}
        dayHeaderHighlightColor={{color: TEXT_COLOR}}
        locale={'tr'}
        swipeEnabled={true}
        mode={changeTime}
        renderEvent={renderEvent}
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
    height: 'auto',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    height: 'auto',
    width: '65%',
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
    fontSize: 16,
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
    marginTop: '5%',
    borderRadius: 15,
    height: 50,
    backgroundColor: '#088ad9',
    marginBottom: '5%',
  },
  modalText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: '3%',
  },
  modalText1: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: '5%',
    marginBottom: '5%',
    color: '#868686',
  },
  touchStyle: {
    //backgroundColor: 'gray',
    height: 50,
    width: '34%',
  },
  touchWStyle: {
    //backgroundColor: 'gray',
    height: 50,
    width: '33%',
    // borderRadius: 25,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    // borderColor: BORDER_COLOR
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
