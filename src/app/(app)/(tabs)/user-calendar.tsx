import { View } from "react-native";
import { Text} from "react-native-paper";
import {Calendar, CalendarList, Agenda, ExpandableCalendar,CalendarProvider, AgendaList, AgendaSchedule} from 'react-native-calendars';
import AgendaScreen from "@/components/ProfileCalendar";

interface State {
  items?: AgendaSchedule;
}


const UserCalendar = () => {
  let today = new Date().toISOString().substring(0,10);
    // return (<CalendarProvider date={today} >
    //         <AgendaList
    //     sections={[]}
    //     renderItem={(item)=>{
    //       return <></>
    //     }}
    //     // scrollToNextEvent
    //     // sectionStyle={styles.section}
    //     // dayFormat={'yyyy-MM-d'}
    //   />
    // </CalendarProvider>)
    return<AgendaScreen/>
}

export default UserCalendar;