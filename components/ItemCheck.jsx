// components/ItemCheck.js
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/color';

const ItemCheck = ({ item, itemIndex, type, questionStatus, updateQuestionStatus, areAllQuestionsChecked, toggleAllQuestions }) => {
    const allChecked = areAllQuestionsChecked(itemIndex);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    {item.icon && (
                        <Ionicons 
                            name={item.icon} 
                            size={20} 
                            color={colors.headerTitle || '#fff'} 
                            style={styles.headerIcon}
                        />
                    )}
                    <Text style={styles.headerText}>
                        {item.label}
                    </Text>
                </View>
                <View style={styles.allSafeRow}>
                    <Checkbox
                        value={allChecked}
                        onValueChange={(status) => toggleAllQuestions(itemIndex, status)}
                        color={allChecked ? colors.success : '#FFFFFF'}
                        style={styles.headerCheckbox}
                    />
                    <Text style={styles.allSafeText}>
                        All Safe
                    </Text>
                </View>
            </View>
            {item.questions.map((question, questionIndex) => (
                <View key={questionIndex} style={styles.checkboxContainer}>
                    <Checkbox
                        value={questionStatus[`${type}_${itemIndex}_question_${questionIndex}`] || false}
                        onValueChange={(status) => updateQuestionStatus(itemIndex, questionIndex, status)}
                        color={questionStatus[`${type}_${itemIndex}_question_${questionIndex}`] ? colors.primary : undefined}
                    />
                    <Text style={styles.label}>{question.q}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 6,
        overflow: 'hidden',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: '#FAFAFA',
    },
    label: {
        marginLeft: 14,
        fontSize: 16,
        flex: 1,
        color: '#2C2C2E',
        lineHeight: 22,
    },
    header: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    },
    allSafeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 6,
    },
    headerCheckbox: {
        marginRight: 10,
    },
    allSafeText: {
        fontSize: 13,
        color: colors.headerTitle || '#fff',
        fontWeight: '600',
    },
    headerText: {
        fontSize: 16,
        color: colors.headerTitle || '#fff',
        fontWeight: 'bold',
        textAlign: 'left',
        flex: 1,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    headerIcon: {
        marginRight: 8,
    }
});

export default ItemCheck;
