// components/ItemCheck.js
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Checkbox from 'expo-checkbox';
import { colors } from '../constants/color';

const ItemCheck = ({ item, itemIndex, questionStatus, updateQuestionStatus, areAllQuestionsChecked, toggleAllQuestions }) => {
    const allChecked = areAllQuestionsChecked(itemIndex);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Checkbox
                    value={allChecked}
                    onValueChange={(status) => toggleAllQuestions(itemIndex, status)}
                    color={allChecked ? colors.success : '#FFFFFF'}
                    style={styles.headerCheckbox}
                />
                <Text  >
                    All Safe
                </Text>
                <Text style={styles.headerText}>
                    {item.label}
                </Text>
            </View>
            {item.questions.map((question, questionIndex) => (
                <View key={questionIndex} style={styles.checkboxContainer}>
                    <Checkbox
                        value={questionStatus[`item_${itemIndex}_question_${questionIndex}`] || false}
                        onValueChange={(status) => updateQuestionStatus(itemIndex, questionIndex, status)}
                        color={questionStatus[`item_${itemIndex}_question_${questionIndex}`] ? colors.primary : undefined}
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
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#E0E0E0',
    },
    label: {
        marginLeft: 12,
        fontSize: 16,
        flex: 1,
        color: '#333',
    },
    header: {
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCheckbox: {
        marginRight: 12,
    },
    headerText: {
        fontSize: 18,
        color: colors.headerTitle || '#fff',
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    }
});

export default ItemCheck;
