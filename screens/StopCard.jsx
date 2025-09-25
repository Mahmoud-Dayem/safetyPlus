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
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../constants/color";
import { useNavigation } from "@react-navigation/native";
import ItemCheck from "../components/ItemCheck";


const StopCard = () => {
  const navigation = useNavigation();
  const [accept, setAccept] = useState(false);
  const [activeTab, setActiveTab] = useState('actions'); // 'actions', 'conditions', or 'report'

  // Report form state
  const [reportForm, setReportForm] = useState({
    safeActsObserved: [''],
    unsafeActsObserved: [''],
    date: new Date(), // Today's date as Date object
    site: '',
    area: '',
    shift: 'General', // Default shift
    duration: '', // Duration in minutes
    peopleConducted: '',
    peopleObserved: ''
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "STOP Card",
      headerStyle: {
        backgroundColor: colors.primary || "#FF9500",
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

  const actions = [
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
  const conditions = [
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

  // State to track status of all questions across actions and conditions
  const [actionStatus, setActionStatus] = useState(() => {
    const initialStatus = {};
    actions.forEach((item, itemIndex) => {
      item.questions.forEach((question, questionIndex) => {
        initialStatus[`action_${itemIndex}_question_${questionIndex}`] = question.status;
      });
    });
    return initialStatus;
  });

  const [conditionStatus, setConditionStatus] = useState(() => {
    const initialStatus = {};
    conditions.forEach((item, itemIndex) => {
      item.questions.forEach((question, questionIndex) => {
        initialStatus[`condition_${itemIndex}_question_${questionIndex}`] = question.status;
      });
    });
    return initialStatus;
  });

  // Functions for Actions
  const updateActionStatus = (itemIndex, questionIndex, status) => {
    setActionStatus(prevStatus => ({
      ...prevStatus,
      [`action_${itemIndex}_question_${questionIndex}`]: status
    }));
  };

  const areAllActionsChecked = (itemIndex) => {
    const item = actions[itemIndex];
    return item.questions.every((_, questionIndex) => 
      actionStatus[`action_${itemIndex}_question_${questionIndex}`]
    );
  };

  const toggleAllActions = (itemIndex, status) => {
    const updatedStatus = { ...actionStatus };
    actions[itemIndex].questions.forEach((_, questionIndex) => {
      updatedStatus[`action_${itemIndex}_question_${questionIndex}`] = status;
    });
    setActionStatus(updatedStatus);
  };

  // Functions for Conditions
  const updateConditionStatus = (itemIndex, questionIndex, status) => {
    setConditionStatus(prevStatus => ({
      ...prevStatus,
      [`condition_${itemIndex}_question_${questionIndex}`]: status
    }));
  };

  const areAllConditionsChecked = (itemIndex) => {
    const item = conditions[itemIndex];
    return item.questions.every((_, questionIndex) => 
      conditionStatus[`condition_${itemIndex}_question_${questionIndex}`]
    );
  };

  const toggleAllConditions = (itemIndex, status) => {
    const updatedStatus = { ...conditionStatus };
    conditions[itemIndex].questions.forEach((_, questionIndex) => {
      updatedStatus[`condition_${itemIndex}_question_${questionIndex}`] = status;
    });
    setConditionStatus(updatedStatus);
  };

  // Function to update report form
  const updateReportForm = (field, value) => {
    setReportForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to handle numeric input validation
  const handleNumericInput = (field, value) => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    updateReportForm(field, numericValue);
  };

  const addSafeAct = () => {
    setReportForm(prev => ({
      ...prev,
      safeActsObserved: [...prev.safeActsObserved, '']
    }));
  };

  const addUnsafeAct = () => {
    setReportForm(prev => ({
      ...prev,
      unsafeActsObserved: [...prev.unsafeActsObserved, '']
    }));
  };

  const updateSafeAct = (index, value) => {
    setReportForm(prev => {
      const newSafeActs = [...prev.safeActsObserved];
      newSafeActs[index] = value;
      return { ...prev, safeActsObserved: newSafeActs };
    });
  };

  const updateUnsafeAct = (index, value) => {
    setReportForm(prev => {
      const newUnsafeActs = [...prev.unsafeActsObserved];
      newUnsafeActs[index] = value;
      return { ...prev, unsafeActsObserved: newUnsafeActs };
    });
  };

  const removeSafeAct = (index) => {
    if (reportForm.safeActsObserved.length > 1) {
      setReportForm(prev => ({
        ...prev,
        safeActsObserved: prev.safeActsObserved.filter((_, i) => i !== index)
      }));
    }
  };

  const removeUnsafeAct = (index) => {
    if (reportForm.unsafeActsObserved.length > 1) {
      setReportForm(prev => ({
        ...prev,
        unsafeActsObserved: prev.unsafeActsObserved.filter((_, i) => i !== index)
      }));
    }
  };

  // Function to calculate summary statistics
  const calculateSummary = () => {
    // Calculate actions completion
    const totalActionQuestions = actions.reduce((total, item) => total + item.questions.length, 0);
    const completedActionQuestions = actions.reduce((total, item, itemIndex) => {
      return total + item.questions.filter((_, questionIndex) => 
        actionStatus[`action_${itemIndex}_question_${questionIndex}`]
      ).length;
    }, 0);

    // Calculate conditions completion
    const totalConditionQuestions = conditions.reduce((total, item) => total + item.questions.length, 0);
    const completedConditionQuestions = conditions.reduce((total, item, itemIndex) => {
      return total + item.questions.filter((_, questionIndex) => 
        conditionStatus[`condition_${itemIndex}_question_${questionIndex}`]
      ).length;
    }, 0);

    return {
      actions: {
        completed: completedActionQuestions,
        total: totalActionQuestions,
        percentage: totalActionQuestions > 0 ? Math.round((completedActionQuestions / totalActionQuestions) * 100) : 0
      },
      conditions: {
        completed: completedConditionQuestions,
        total: totalConditionQuestions,
        percentage: totalConditionQuestions > 0 ? Math.round((completedConditionQuestions / totalConditionQuestions) * 100) : 0
      },
      safeActs: reportForm.safeActsObserved.filter(act => act.trim().length > 0).length,
      unsafeActs: reportForm.unsafeActsObserved.filter(act => act.trim().length > 0).length,
      duration: parseInt(reportForm.duration) || 0,
      peopleConducted: parseInt(reportForm.peopleConducted) || 0,
      peopleObserved: parseInt(reportForm.peopleObserved) || 0
    };
  };

  // Function to log all status including report form
  const logStatus = () => {
    const completeReport = {
      timestamp: new Date().toISOString(),
      actions: actions.map((item, itemIndex) => ({
        category: item.label,
        questions: item.questions.map((question, questionIndex) => ({
          question: question.q,
          status: actionStatus[`action_${itemIndex}_question_${questionIndex}`]
        }))
      })),
      conditions: conditions.map((item, itemIndex) => ({
        category: item.label,
        questions: item.questions.map((question, questionIndex) => ({
          question: question.q,
          status: conditionStatus[`condition_${itemIndex}_question_${questionIndex}`]
        }))
      })),
      reportForm: reportForm,
      summary: calculateSummary()
    };
    console.log('Complete STOP Card Report:', completeReport);
    setShowSummaryModal(true);
  };



  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.primary || "#FF9500"}
        translucent={false}
        hidden={false}
      />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'actions' && styles.activeTab]}
          onPress={() => setActiveTab('actions')}
        >
          <Text style={[styles.tabText, activeTab === 'actions' && styles.activeTabText]}>
            Actions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'conditions' && styles.activeTab]}
          onPress={() => setActiveTab('conditions')}
        >
          <Text style={[styles.tabText, activeTab === 'conditions' && styles.activeTabText]}>
            Conditions
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'report' && styles.activeTab]}
          onPress={() => setActiveTab('report')}
        >
          <Text style={[styles.tabText, activeTab === 'report' && styles.activeTabText]}>
            Report
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        {activeTab === 'actions' && (
          <View style={styles.gridContainer}>
            {actions.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.gridItem}>
                <ItemCheck 
                  item={item}
                  itemIndex={itemIndex}
                  type="action"
                  questionStatus={actionStatus}
                  updateQuestionStatus={updateActionStatus}
                  areAllQuestionsChecked={areAllActionsChecked}
                  toggleAllQuestions={toggleAllActions}
                />
              </View>
            ))}
          </View>
        )}

        {activeTab === 'conditions' && (
          <View style={styles.gridContainer}>
            {conditions.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.gridItem}>
                <ItemCheck 
                  item={item}
                  itemIndex={itemIndex}
                  type="condition"
                  questionStatus={conditionStatus}
                  updateQuestionStatus={updateConditionStatus}
                  areAllQuestionsChecked={areAllConditionsChecked}
                  toggleAllQuestions={toggleAllConditions}
                />
              </View>
            ))}
          </View>
        )}

        {activeTab === 'report' && (
          <View style={styles.formContainer}>
            
            {/* Safe Acts Observed */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithButton}>
                <Text style={styles.inputLabel}>Safe acts observed</Text>
                <TouchableOpacity onPress={addSafeAct} style={styles.addButton}>
                  <Ionicons name="add" size={20} color={colors.primary || '#FF9500'} />
                </TouchableOpacity>
              </View>
              {reportForm.safeActsObserved.map((act, index) => (
                <View key={index} style={styles.inputWithRemove}>
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    value={act}
                    onChangeText={(text) => updateSafeAct(index, text)}
                    placeholder={`Safe act ${index + 1}`}
                  />
                  {reportForm.safeActsObserved.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeSafeAct(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="remove" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Unsafe Acts Observed */}
            <View style={styles.inputGroup}>
              <View style={styles.labelWithButton}>
                <Text style={styles.inputLabel}>Unsafe acts observed</Text>
                <TouchableOpacity onPress={addUnsafeAct} style={styles.addButton}>
                  <Ionicons name="add" size={20} color={colors.primary || '#FF9500'} />
                </TouchableOpacity>
              </View>
              {reportForm.unsafeActsObserved.map((act, index) => (
                <View key={index} style={styles.inputWithRemove}>
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    value={act}
                    onChangeText={(text) => updateUnsafeAct(index, text)}
                    placeholder={`Unsafe act ${index + 1}`}
                  />
                  {reportForm.unsafeActsObserved.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeUnsafeAct(index)}
                      style={styles.removeButton}
                    >
                      <Ionicons name="remove" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {reportForm.date.toDateString()}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
              
              {showDatePicker && (
                <View style={styles.datePickerContainer}>
                  <View style={styles.datePickerHeader}>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.cancelButton}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                      <Text style={styles.doneButton}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.datePickerContent}>
                    <View style={styles.datePickerRow}>
                      <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => {
                          const newDate = new Date(reportForm.date);
                          newDate.setDate(newDate.getDate() - 1);
                          updateReportForm('date', newDate);
                        }}
                      >
                        <Text style={styles.dateButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.currentDate}>
                        {reportForm.date.toLocaleDateString()}
                      </Text>
                      <TouchableOpacity 
                        style={styles.dateButton}
                        onPress={() => {
                          const newDate = new Date(reportForm.date);
                          newDate.setDate(newDate.getDate() + 1);
                          updateReportForm('date', newDate);
                        }}
                      >
                        <Text style={styles.dateButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.quickDateButtons}>
                      <TouchableOpacity 
                        style={styles.quickButton}
                        onPress={() => updateReportForm('date', new Date())}
                      >
                        <Text style={styles.quickButtonText}>Today</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.quickButton}
                        onPress={() => {
                          const yesterday = new Date();
                          yesterday.setDate(yesterday.getDate() - 1);
                          updateReportForm('date', yesterday);
                        }}
                      >
                        <Text style={styles.quickButtonText}>Yesterday</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Site */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Site</Text>
              <TextInput
                style={styles.textInput}
                value={reportForm.site}
                onChangeText={(text) => updateReportForm('site', text)}
                placeholder="Enter site"
              />
            </View>

            {/* Area */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Area</Text>
              <TextInput
                style={styles.textInput}
                value={reportForm.area}
                onChangeText={(text) => updateReportForm('area', text)}
                placeholder="Enter area"
              />
            </View>

            {/* Shift Dropdown */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Shift</Text>
              <View style={styles.dropdownContainer}>
                {['General', 'A', 'B', 'C'].map((shift) => (
                  <TouchableOpacity
                    key={shift}
                    style={[
                      styles.dropdownOption,
                      reportForm.shift === shift && styles.selectedOption
                    ]}
                    onPress={() => updateReportForm('shift', shift)}
                  >
                    <Text style={[
                      styles.dropdownText,
                      reportForm.shift === shift && styles.selectedText
                    ]}>
                      {shift}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duration */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Duration (minutes)</Text>
              <TextInput
                style={styles.textInput}
                value={reportForm.duration}
                onChangeText={(text) => handleNumericInput('duration', text)}
                placeholder="Enter duration in minutes"
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            {/* People Conducted */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of people conducted</Text>
              <TextInput
                style={styles.textInput}
                value={reportForm.peopleConducted}
                onChangeText={(text) => handleNumericInput('peopleConducted', text)}
                placeholder="Enter number"
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            {/* People Observed */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of people observed</Text>
              <TextInput
                style={styles.textInput}
                value={reportForm.peopleObserved}
                onChangeText={(text) => handleNumericInput('peopleObserved', text)}
                placeholder="Enter number"
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <TouchableOpacity style={styles.logButton} onPress={logStatus}>
              <Text style={styles.logButtonText}>Send Report</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* Summary Modal */}
      <Modal
        visible={showSummaryModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSummaryModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>STOP Card Summary</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowSummaryModal(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {(() => {
              const summary = calculateSummary();
              return (
                <View>
                  {/* Completion Overview */}
                  <View style={styles.summarySection}>
                    <Text style={styles.sectionTitle}>Completion Overview</Text>
                    <View style={styles.pieChartContainer}>
                      <View style={styles.pieChartWrapper}>
                        <Text style={styles.chartTitle}>Actions</Text>
                        <View style={styles.pieChart}>
                          <View style={[
                            styles.pieSlice,
                            { 
                              transform: [{ rotate: `${(summary.actions.percentage * 3.6)}deg` }],
                              backgroundColor: colors.success || '#30D158'
                            }
                          ]} />
                          <View style={styles.pieCenter}>
                            <Text style={styles.percentageText}>{summary.actions.percentage}%</Text>
                          </View>
                        </View>
                        <Text style={styles.chartSubtitle}>
                          {summary.actions.completed}/{summary.actions.total} Complete
                        </Text>
                      </View>
                      
                      <View style={styles.pieChartWrapper}>
                        <Text style={styles.chartTitle}>Conditions</Text>
                        <View style={styles.pieChart}>
                          <View style={[
                            styles.pieSlice,
                            { 
                              transform: [{ rotate: `${(summary.conditions.percentage * 3.6)}deg` }],
                              backgroundColor: colors.primary || '#FF9500'
                            }
                          ]} />
                          <View style={styles.pieCenter}>
                            <Text style={styles.percentageText}>{summary.conditions.percentage}%</Text>
                          </View>
                        </View>
                        <Text style={styles.chartSubtitle}>
                          {summary.conditions.completed}/{summary.conditions.total} Complete
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Safety Observations Bar Chart */}
                  <View style={styles.summarySection}>
                    <Text style={styles.sectionTitle}>Safety Observations</Text>
                    <View style={styles.barChartContainer}>
                      <View style={styles.barItem}>
                        <Text style={styles.barLabel}>Safe Acts</Text>
                        <View style={styles.barBackground}>
                          <View style={[
                            styles.barFill,
                            { 
                              width: `${Math.min((summary.safeActs / Math.max(summary.safeActs, summary.unsafeActs, 1)) * 100, 100)}%`,
                              backgroundColor: colors.success || '#30D158'
                            }
                          ]} />
                        </View>
                        <Text style={styles.barValue}>{summary.safeActs}</Text>
                      </View>
                      
                      <View style={styles.barItem}>
                        <Text style={styles.barLabel}>Unsafe Acts</Text>
                        <View style={styles.barBackground}>
                          <View style={[
                            styles.barFill,
                            { 
                              width: `${Math.min((summary.unsafeActs / Math.max(summary.safeActs, summary.unsafeActs, 1)) * 100, 100)}%`,
                              backgroundColor: colors.error || '#FF3B30'
                            }
                          ]} />
                        </View>
                        <Text style={styles.barValue}>{summary.unsafeActs}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Statistics */}
                  <View style={styles.summarySection}>
                    <Text style={styles.sectionTitle}>Report Statistics</Text>
                    <View style={styles.statsContainer}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{summary.duration}</Text>
                        <Text style={styles.statLabel}>Minutes</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{summary.peopleConducted}</Text>
                        <Text style={styles.statLabel}>Conducted</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{summary.peopleObserved}</Text>
                        <Text style={styles.statLabel}>Observed</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity 
                    style={styles.shareButton}
                    onPress={() => {
                      setShowSummaryModal(false);
                      // Here you could add share functionality
                    }}
                  >
                    <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.shareButtonText}>Share Report</Text>
                  </TouchableOpacity>
                </View>
              );
            })()}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default StopCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'||colors.primary || "#FF9500",
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -5,
  },
  gridItem: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor:'#fff'|| colors.primary || '#FF9500',
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary ||colors.background || '#F8F9FA',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500'||'rgba(255, 255, 255, 0.8)',
  },
  activeTabText: {
    color:'rgba(255, 255, 255, 0.8)'|| colors.primary || '#FF9500',
  },
  formContainer: {
    padding: 15,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary || '#FF9500',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text || '#1C1C1E',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border || '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 45,
  },
  dropdownContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: colors.border || '#D1D1D6',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    backgroundColor: colors.primary || '#FF9500',
    borderColor: colors.primary || '#FF9500',
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text || '#1C1C1E',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  multilineInput: {
    height: 80,
    paddingTop: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border || '#D1D1D6',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
    minHeight: 45,
  },
  dateText: {
    fontSize: 16,
    color: colors.text || '#1C1C1E',
  },
  datePickerContainer: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border || '#D1D1D6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#D1D1D6',
  },
  cancelButton: {
    fontSize: 16,
    color: colors.textSecondary || '#8E8E93',
  },
  doneButton: {
    fontSize: 16,
    color: colors.primary || '#FF9500',
    fontWeight: '600',
  },
  datePickerContent: {
    padding: 20,
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary || '#FF9500',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  dateButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  currentDate: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text || '#1C1C1E',
    minWidth: 120,
    textAlign: 'center',
  },
  quickDateButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryLight || '#ea6d1aff',
    borderRadius: 6,
  },
  quickButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background || '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#D1D1D6',
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary || '#FF9500',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text || '#1C1C1E',
    marginBottom: 15,
    textAlign: 'center',
  },
  pieChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  pieChartWrapper: {
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text || '#1C1C1E',
    marginBottom: 10,
  },
  pieChart: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5EA',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 8,
  },
  pieSlice: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    transformOrigin: '50% 50%',
  },
  pieCenter: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    top: 15,
    left: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text || '#1C1C1E',
  },
  chartSubtitle: {
    fontSize: 12,
    color: colors.textSecondary || '#8E8E93',
    textAlign: 'center',
  },
  barChartContainer: {
    gap: 15,
  },
  barItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text || '#1C1C1E',
    width: 80,
  },
  barBackground: {
    flex: 1,
    height: 20,
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 10,
  },
  barValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text || '#1C1C1E',
    width: 30,
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary || '#FF9500',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary || '#8E8E93',
    marginTop: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary || '#FF9500',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    gap: 8,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  labelWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWithRemove: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  removeButton: {
    backgroundColor: '#FFEBEE',
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
