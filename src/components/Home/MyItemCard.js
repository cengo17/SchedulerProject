/**
 * Example item component
 * @param style Object with pre-calculated values, looks like {position: 'absolute', zIndex: 3, width: Number, height: Number, top: Number, left: Number}
 * @param item One of items supplied to Timetable through 'items' property
 * @param dayIndex For multiday items inicates current day index
 * @param daysTotal For multiday items indicates total amount of days
 */
import React from 'react';
import {Text, View} from 'react-native'
export default function MyItemCard({style, item, dayIndex, daysTotal}) {
  return (
    <View style={{
      ...style, // apply calculated styles, be careful not to override these accidentally (unless you know what you are doing)
      backgroundColor: 'red',
      borderRadius: 10,
      elevation: 5,
    }}>
      <Text>{item.title}</Text>
      <Text>{dayIndex} of {daysTotal}</Text>
    </View>
  );
}
