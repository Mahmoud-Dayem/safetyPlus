import React, { useState, useLayoutEffect } from "react";
import Slider from "@react-native-community/slider"; // make sure installed
import { SafeAreaView } from "react-native-safe-area-context";
import Checkbox from 'expo-checkbox';

import {
  StyleSheet,
  Switch,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/color";
import { useNavigation } from "@react-navigation/native";
import ItemCheck from "../components/ItemCheck";


const StopCard = () => {
  const navigation = useNavigation();
  const [accept, setAccept] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "STOP Card",
      headerStyle: {
        backgroundColor: colors.primary || "#34C759",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: "600",
      },
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="clipboard-outline" size={24} color="#fff" />
          </View>
        </View>
      ),
    });
  }, [navigation]);

  const items = [
    {
      label: "Tools and Equipment",
      questions: [
        { q: "Right for the job", status: false },
        { q: "Is Safe Condition", status: false }
      ]
    },
    {
      label: "Task and Procedure",
      questions: [
        { q: "Do I know what to do", status: false },
        { q: "Do I have the right skills", status: false },
        { q: "Is the procedure clear", status: false }
      ]
    },
    {
      label: "People and Communication",
      questions: [
        { q: "Am I communicating clearly", status: false },
        { q: "Is everyone aware of the task", status: false }
      ]
    },
    {
      label: "People and Communication",
      questions: [
        { q: "Am I communicating clearly", status: false },
        { q: "Is everyone aware of the task", status: false }
      ]
    },
    {
      label: "People and Communication",
      questions: [
        { q: "Am I communicating clearly", status: false },
        { q: "Is everyone aware of the task", status: false }
      ]
    },
    {
      label: "People and Communication",
      questions: [
        { q: "Am I communicating clearly", status: false },
        { q: "Is everyone aware of the task", status: false }
      ]
    },
    {
      label: "People and Communication",
      questions: [
        { q: "Am I communicating clearly", status: false },
        { q: "Is everyone aware of the task", status: false }
      ]
    },
  ];

  // State to track status of all questions across all items
  const [questionStatus, setQuestionStatus] = useState(() => {
    const initialStatus = {};
    items.forEach((item, itemIndex) => {
      item.questions.forEach((question, questionIndex) => {
        initialStatus[`item_${itemIndex}_question_${questionIndex}`] = question.status;
      });
    });
    return initialStatus;
  });

  // Function to update status for a specific question in a specific item
  const updateQuestionStatus = (itemIndex, questionIndex, status) => {
    setQuestionStatus(prevStatus => ({
      ...prevStatus,
      [`item_${itemIndex}_question_${questionIndex}`]: status
    }));
  };

  // Function to check if all questions in an item are checked
  const areAllQuestionsChecked = (itemIndex) => {
    const item = items[itemIndex];
    return item.questions.every((_, questionIndex) => 
      questionStatus[`item_${itemIndex}_question_${questionIndex}`]
    );
  };

  // Function to toggle all questions in an item
  const toggleAllQuestions = (itemIndex, status) => {
    const updatedStatus = { ...questionStatus };
    items[itemIndex].questions.forEach((_, questionIndex) => {
      updatedStatus[`item_${itemIndex}_question_${questionIndex}`] = status;
    });
    setQuestionStatus(updatedStatus);
  };

  // Function to log all status
  const logStatus = () => {
    const statusReport = {
      timestamp: new Date().toISOString(),
      categories: items.map((item, itemIndex) => ({
        category: item.label,
        questions: item.questions.map((question, questionIndex) => ({
          question: question.q,
          status: questionStatus[`item_${itemIndex}_question_${questionIndex}`]
        }))
      }))
    };
    console.log('Complete Status Report:', statusReport);
  };



  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary || "#FF3B30"}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        // showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        <Text style={styles.conditionsTitle}>
          Conditions
        </Text>
        {items.map((item, itemIndex) => (
          <ItemCheck 
            key={itemIndex}
            item={item}
            itemIndex={itemIndex}
            questionStatus={questionStatus}
            updateQuestionStatus={updateQuestionStatus}
            areAllQuestionsChecked={areAllQuestionsChecked}
            toggleAllQuestions={toggleAllQuestions}
          />
        ))}

        <TouchableOpacity style={styles.logButton} onPress={logStatus}>
          <Text style={styles.logButtonText}>Log Status</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default StopCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary || "#FF9500",
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 40,
    backgroundColor: colors.background || "#F8F9FA",
    marginTop: 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  headerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  logButton: {
    backgroundColor: colors.primary || "#34C759",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  conditionsTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary || '#FF9500',
    textAlign: 'center',
    letterSpacing: 1.2,
    marginTop: 5,
    marginBottom: 20,
    textShadowColor: 'rgba(255, 149, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textTransform: 'uppercase',
  },

});
