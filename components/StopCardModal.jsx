import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/color';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('StopCardModal render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>STOP Card Details</Text>
          </View>
          <View style={{ padding: 16 }}>
            <Text style={{ fontWeight: '600', marginBottom: 8 }}>Something went wrong.</Text>
            <Text style={{ color: '#666' }}>{String(this.state.error?.message || 'Unknown error')}</Text>
          </View>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

function humanize(s) {
  return (s || '')
    .toString()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderAssessmentSection(title, groups) {
  if (!Array.isArray(groups) || groups.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {groups.map((group, gi) => {
        const questions = Array.isArray(group?.questions) ? group.questions : [];
        if (!group && questions.length === 0) return null;
        return (
          <View key={`${title}-g-${gi}`} style={styles.group}>
            {!!group?.category && (
              <Text style={styles.groupTitle}>{group.category}</Text>
            )}
            {questions.map((q, qi) => {
              const ok = !!q?.status;
              return (
                <View key={`${title}-g-${gi}-q-${qi}`} style={styles.qaRow}>
                  <Ionicons
                    name={ok ? 'checkmark-circle' : 'close-circle'}
                    size={18}
                    color={ok ? '#28a745' : '#dc3545'}
                    style={styles.qaIcon}
                  />
                  <Text style={styles.qaText}>{q?.question || '—'}</Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

function renderLegacySection(title, obj) {
  if (!obj || typeof obj !== 'object') return null;
  const entries = Object.entries(obj);
  if (!entries.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.group}>
        {entries.map(([key, val]) => {
          const ok = !!val;
          return (
            <View key={`${title}-${key}`} style={styles.qaRow}>
              <Ionicons
                name={ok ? 'checkmark-circle' : 'close-circle'}
                size={18}
                color={ok ? '#28a745' : '#dc3545'}
                style={styles.qaIcon}
              />
              <Text style={styles.qaText}>{humanize(key)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const StopCardModal = ({ data, visible, setVisible }) => {
  const site = data?.siteInfo?.site || 'Unknown Site';
  const area = data?.siteInfo?.area || 'Unknown Area';
  const shift = data?.siteInfo?.shift || '—';
  const date = data?.siteInfo?.date || '—';
  const actionsCompletion = data?.completionRates?.actionsCompletion ?? null;
  const conditionsCompletion = data?.completionRates?.conditionsCompletion ?? null;
  const duration = data?.observationData?.durationMinutes ?? '—';
  const peopleConducted = data?.observationData?.peopleConducted ?? '—';
  const peopleObserved = data?.observationData?.peopleObserved ?? '—';
  const feedback = data?.feedback?.suggestions || 'No suggestions';

  return (
    <Modal
      visible={!!visible}
      animationType="slide"
      onRequestClose={() => setVisible(false)}
      transparent={false}
    >
      <ErrorBoundary>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>STOP Card Details</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
            <View style={styles.card}>
              <Text style={styles.title}>{site}</Text>
              <Text style={styles.subtitle}>Area: {area} {shift ? `| Shift: ${shift}` : ''}</Text>
              <Text>Date: {date}</Text>
              {actionsCompletion != null && (
                <Text>Actions Completion: {actionsCompletion}%</Text>
              )}
              {conditionsCompletion != null && (
                <Text>Conditions Completion: {conditionsCompletion}%</Text>
              )}
              <Text>Duration: {duration} mins</Text>
              <Text>People Conducted: {peopleConducted}</Text>
              <Text>People Observed: {peopleObserved}</Text>
              <Text style={styles.feedback}>Feedback: {feedback}</Text>
            </View>

            {data?.assessmentData ? (
              <>
                {renderAssessmentSection('Actions', data.assessmentData?.actions)}
                {renderAssessmentSection('Conditions', data.assessmentData?.conditions)}
              </>
            ) : (
              <>
                {renderLegacySection('Actions', data?.actions)}
                {renderLegacySection('Conditions', data?.conditions)}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </ErrorBoundary>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    backgroundColor: '#FF9500' ,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    backgroundColor: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: colors.primary,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    color: "#555",
    marginBottom: 4,
  },
  feedback: {
    marginTop: 5,
    fontStyle: "italic",
  },
  section: {
    marginTop: 12,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1C1C1E',
  },
  group: {
    marginBottom: 8,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  qaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  qaIcon: {
    marginRight: 8,
  },
  qaText: {
    fontSize: 14,
    color: '#222',
    flexShrink: 1,
  },
});

export default StopCardModal;
