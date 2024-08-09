import { BlurView } from "expo-blur";
import { StyleSheet, useColorScheme, View } from "react-native";
import { Chip, Text } from "react-native-paper";

interface DayChipProps {
  day: string;
}

const DayChip = ({ day }: DayChipProps) => {
  const styles = StyleSheet.create({
    chip: {
      backgroundColor: `${dayColors[day]}`,
      padding: "auto",
      margin: 3,
      width: "13%",
      alignItems: "stretch",
    },
    text: {
      alignItems: "stretch",
      padding: "auto",
      margin: "auto",
    },
  });

  return (
    <Chip style={styles.chip}>
      <Text style={styles.text}>{day}</Text>
    </Chip>
  );
};

const DayChipRibbon = () => {
  const colorScheme = useColorScheme();
  const tint =
    colorScheme === "dark" ? "systemMaterialDark" : "systemMaterialLight";

  return (

      <BlurView style={styles.blurStyle} intensity={38} tint={tint}>
        <DayChip day={"Mon"} />
        <DayChip day={"Tue"} />
        <DayChip day={"Wed"} />
        <DayChip day={"Thu"} />
        <DayChip day={"Fri"} />
        <DayChip day={"Sat"} />
        <DayChip day={"Sun"} />
      </BlurView>
  );
};

const dayColors = {
  Mon: "red",
  Tue: "orange",
  Wed: "yellow",
  Thu: "green",
  Fri: "blue",
  Sat: "indigo",
  Sun: "violet",
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
    marginBottom: 5,
  },
  blurStyle: {
    zIndex: 100,
    margin: 0,
    position: "absolute",
    left: 0,
    right: 0,
    paddingVertical: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
});

export default DayChipRibbon;
