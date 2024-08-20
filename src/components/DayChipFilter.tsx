import { Colors } from "@/constants/colors";
import { DayFilter } from "@/types/types";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";

interface DayChipProps {
  day: string
  dayFilter : DayFilter
  setDayFilter : React.Dispatch<React.SetStateAction<DayFilter>>
}

const DayChip = ({ day, dayFilter,setDayFilter}: DayChipProps) => {
  const [inactive,setInactive]= useState<boolean>(false)
  const theme = useTheme()
  const styles = StyleSheet.create({
    chip: {
      backgroundColor: inactive ? "grey" :`${dayColors[day]}`,
      padding: "auto",
      marginVertical: 3,
      marginHorizontal:2,
      width: "14%",
      alignItems: "stretch",
      justifyContent:"center",
    },
    text: {
      color:theme.colors.onPrimary,
      alignItems: "center",
      justifyContent:"center",
      padding: "auto",
      marginLeft: "auto",
      marginRight:"auto",
    },
  });
  
  return (

    <Chip style={styles.chip} onPress={() => {
      setInactive(!inactive)
      setDayFilter((prevFilter)=>{
        const newFilter = {...prevFilter}
        newFilter[day] = inactive
        return newFilter
      })
    }} >
      <Text style={styles.text}>{day}</Text>
    </Chip>

  );
};

interface DayChipFilterProps {
  dayFilter : DayFilter
  setDayFilter : React.Dispatch<React.SetStateAction<DayFilter>>
}

const DayChipFilter = ({dayFilter,setDayFilter}:DayChipFilterProps) => {
  const colorScheme = useColorScheme();
  const tint =
    colorScheme === "dark" ? "systemMaterialDark" : "systemMaterialLight";

  return (

      <BlurView style={styles.blurStyle} intensity={38} tint={tint}>
        <DayChip day={"Mon"} dayFilter={dayFilter} setDayFilter={setDayFilter}/>
        <DayChip day={"Tue"} dayFilter={dayFilter} setDayFilter={setDayFilter}/>
        <DayChip day={"Wed"} dayFilter={dayFilter} setDayFilter={setDayFilter}/>
        <DayChip day={"Thu"} dayFilter={dayFilter} setDayFilter={setDayFilter}/>
        <DayChip day={"Fri"} dayFilter={dayFilter} setDayFilter={setDayFilter}/>
        <DayChip day={"Sat"} dayFilter={dayFilter} setDayFilter={setDayFilter}/>
        <DayChip day={"Sun"} dayFilter={dayFilter} setDayFilter={setDayFilter}/>
      </BlurView>
  );
};

const dayColors = {
  Mon: Colors.dark.red,
  Tue: Colors.dark.orange,
  Wed: Colors.dark.yellow,
  Thu: Colors.dark.green,
  Fri: Colors.dark.blue,
  Sat: Colors.dark.indigo,
  Sun: Colors.dark.violet,
};

const dayTextColors = {
  mon: "red",
  tue: "orange",
  wed: "yellow",
  thu: "green",
  fri: "blue",
  sat: "indigo",
  sun: "violet",
};

const styles = StyleSheet.create({
  textStyle: {
    marginLeft: 5,
    marginHorizontal: 2,
    fontSize: 12,
    marginBottom: 5,},
  blurStyle: {
    zIndex: 100,
    margin: 0,
    position: "absolute",
    left: 0,
    right: 0,
    paddingVertical: 3,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
  },
});

export default DayChipFilter;
