import React, { useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get("window");

const API_URL = "https://api.business-model.buttnetworks.com/predict";

export default function AIModel() {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeScaleIndex, setActiveScaleIndex] = useState(0);

  const flatListRef = useRef(null);

  const predictBusiness = async () => {
    if (
      name.trim().length < 3 ||
      industry.trim().length < 3 ||
      description.trim().length < 3
    ) {
      setShowPopup(true);
      return;
    }

    if (!name || !industry || !description) return;

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          industry,
          description,
        }),
      });

      const data = await response.json();

      setResult(data);

      await fetch("https://api.opinion-nest-mobile.buttnetworks.com/api/chat-history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          industry,
          description,
          result: data,
        }),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const futureRevenue = useMemo(() => {
    if (!result?.yearly_analysis) return [];

    return result.yearly_analysis.map((item) =>
      Math.floor(item.revenue / 1000),
    );
  }, [result]);

  const pastRevenue = useMemo(() => {
    if (!result?.past_yearly_analysis?.data) return [];

    return result.past_yearly_analysis.data.map((item) =>
      Math.floor(item.revenue / 1000),
    );
  }, [result]);

  const riskChart = useMemo(() => {
    if (!result) return [];

    const risk =
      result.risk === "high" ? 85 : result.risk === "medium" ? 55 : 25;

    return [
      {
        name: "Risk",
        population: risk,
        color: "#2563eb",
        legendFontColor: "#0f172a",
        legendFontSize: 12,
      },
      {
        name: "Safe",
        population: 100 - risk,
        color: "#dbeafe",
        legendFontColor: "#0f172a",
        legendFontSize: 12,
      },
    ];
  }, [result]);

  const formatCurrency = (value) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const scaleItems = useMemo(() => {
    if (!result?.scale) return [];
    return [
      {
        key: "small",
        label: "Small",
        icon: "store-outline",
        data: result.scale.small,
      },
      {
        key: "medium",
        label: "Medium",
        icon: "office-building-outline",
        data: result.scale.medium,
      },
      {
        key: "large",
        label: "Large",
        icon: "city-variant-outline",
        data: result.scale.large,
      },
    ];
  }, [result]);

  const onScaleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
    setActiveScaleIndex(index);
  };

  const renderScaleCard = ({ item, index }) => {
    const isActive = index === activeScaleIndex;

    if (isActive) {
      return (
        <LinearGradient
          colors={["#2563eb", "#1d4ed8"]}
          style={styles.swipeCard}
        >
          <View style={styles.scaleCardHeader}>
            <MaterialCommunityIcons name={item.icon} size={22} color="#fff" />
            <Text style={[styles.scaleCardLabel, styles.scaleCardLabelActive]}>
              {item.label} Scale
            </Text>
          </View>
          <View style={styles.scaleStatGrid}>
            <View style={styles.scaleStatItem}>
              <Text
                style={[
                  styles.scaleCardStatLabel,
                  styles.scaleCardStatLabelActive,
                ]}
              >
                Workers
              </Text>
              <Text
                style={[
                  styles.scaleCardStatValue,
                  styles.scaleCardStatValueActive,
                ]}
              >
                {item.data.workers}
              </Text>
            </View>
            <View style={styles.scaleStatItem}>
              <Text
                style={[
                  styles.scaleCardStatLabel,
                  styles.scaleCardStatLabelActive,
                ]}
              >
                Investment
              </Text>
              <Text
                style={[
                  styles.scaleCardStatValue,
                  styles.scaleCardStatValueActive,
                ]}
              >
                {formatCurrency(item.data.investment)}
              </Text>
            </View>
            <View style={styles.scaleStatItem}>
              <Text
                style={[
                  styles.scaleCardStatLabel,
                  styles.scaleCardStatLabelActive,
                ]}
              >
                Revenue
              </Text>
              <Text
                style={[
                  styles.scaleCardStatValue,
                  styles.scaleCardStatValueActive,
                ]}
              >
                {formatCurrency(item.data.revenue)}
              </Text>
            </View>
            <View style={styles.scaleStatItem}>
              <Text
                style={[
                  styles.scaleCardStatLabel,
                  styles.scaleCardStatLabelActive,
                ]}
              >
                Profit
              </Text>
              <Text
                style={[
                  styles.scaleCardStatValue,
                  styles.scaleCardStatValueActive,
                ]}
              >
                {formatCurrency(item.data.profit)}
              </Text>
            </View>
          </View>
        </LinearGradient>
      );
    }

    return (
      <View style={[styles.swipeCard, styles.swipeCardInactive]}>
        <View style={styles.scaleCardHeader}>
          <MaterialCommunityIcons name={item.icon} size={22} color="#2563eb" />
          <Text style={styles.scaleCardLabel}>{item.label} Scale</Text>
        </View>
        <View style={styles.scaleStatGrid}>
          <View style={styles.scaleStatItem}>
            <Text style={styles.scaleCardStatLabel}>Workers</Text>
            <Text style={styles.scaleCardStatValue}>{item.data.workers}</Text>
          </View>
          <View style={styles.scaleStatItem}>
            <Text style={styles.scaleCardStatLabel}>Investment</Text>
            <Text style={styles.scaleCardStatValue}>
              {formatCurrency(item.data.investment)}
            </Text>
          </View>
          <View style={styles.scaleStatItem}>
            <Text style={styles.scaleCardStatLabel}>Revenue</Text>
            <Text style={styles.scaleCardStatValue}>
              {formatCurrency(item.data.revenue)}
            </Text>
          </View>
          <View style={styles.scaleStatItem}>
            <Text style={styles.scaleCardStatLabel}>Profit</Text>
            <Text style={styles.scaleCardStatValue}>
              {formatCurrency(item.data.profit)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalIconBox}>
              <Ionicons name="alert-circle-outline" size={40} color="#2563eb" />
            </View>
            <Text style={styles.modalTitle}>Input Too Low</Text>
            <Text style={styles.modalDesc}>
              Please provide at least 3 characters for Business Name, Industry,
              and Description to get an accurate prediction.
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              activeOpacity={0.9}
              onPress={() => setShowPopup(false)}
            >
              <Text style={styles.modalBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LinearGradient colors={["#2563eb", "#1e40af"]} style={styles.hero}>
        <Text style={styles.heroTitle}>AI Business Prediction</Text>

        <Text style={styles.heroDesc}>
          Analyze startups, SaaS, agencies, factories, stores, restaurants, and
          digital businesses with futuristic AI prediction systems.
        </Text>

        <View style={styles.heroStats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statText}>Prediction AI</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statText}>Smart Analysis</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>AI</Text>
            <Text style={styles.statText}>Business Engine</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Analyze Your Business</Text>

        <View style={styles.inputBox}>
          <Ionicons name="business-outline" size={20} color="#2563eb" />

          <TextInput
            placeholder="Business Name"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputBox}>
          <MaterialCommunityIcons name="domain" size={20} color="#2563eb" />

          <TextInput
            placeholder="Industry"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={industry}
            onChangeText={setIndustry}
          />
        </View>

        <View style={[styles.inputBox, styles.textAreaBox]}>
          <Ionicons name="document-text-outline" size={20} color="#2563eb" />

          <TextInput
            placeholder="Describe your business idea..."
            placeholderTextColor="#94a3b8"
            style={styles.textArea}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity
          style={styles.predictBtn}
          activeOpacity={0.9}
          onPress={predictBusiness}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles-outline" size={18} color="#fff" />

              <Text style={styles.predictText}>Predict Business</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {result && (
        <View style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>AI Prediction Result</Text>

            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI Powered</Text>
            </View>
          </View>

          <Text style={styles.resultDesc}>{result.description}</Text>

          <View style={styles.grid}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Investment</Text>

              <Text style={styles.cardValue}>{result.investment}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Profit</Text>

              <Text style={styles.cardValue}>{result.profit.level}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Workers</Text>

              <Text style={styles.cardValue}>{result.workers}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Risk</Text>

              <Text style={styles.cardValue}>{result.risk}</Text>
            </View>
          </View>

          <View style={styles.scaleBox}>
            <Text style={styles.scaleTitle}>Scale Detection</Text>

            <Text style={styles.scaleValue}>{result.scale_detected}</Text>
          </View>

          {result.scale && (
            <View style={styles.scaleBreakdownContainer}>
              <Text style={styles.scaleBreakdownTitle}>Scale Breakdown</Text>

              <FlatList
                ref={flatListRef}
                data={scaleItems}
                keyExtractor={(item) => item.key}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={width - 32}
                decelerationRate="fast"
                onScroll={onScaleScroll}
                scrollEventThrottle={16}
                renderItem={renderScaleCard}
                contentContainerStyle={styles.swipeList}
              />

              <View style={styles.dotRow}>
                {scaleItems.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === activeScaleIndex && styles.dotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Future Revenue Forecast</Text>

            <LineChart
              data={{
                labels: ["Y1", "Y2", "Y3", "Y4", "Y5", "Y6"],
                datasets: [
                  {
                    data: futureRevenue,
                  },
                ],
              }}
              width={width - 40}
              height={240}
              yAxisSuffix="k"
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(37,99,235,${opacity})`,
                labelColor: (opacity = 1) => `rgba(15,23,42,${opacity})`,
                propsForDots: {
                  r: "5",
                  strokeWidth: "2",
                  stroke: "#2563eb",
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Past Industry Analysis</Text>

            <BarChart
              data={{
                labels: ["Y1", "Y2", "Y3", "Y4", "Y5", "Y6"],
                datasets: [
                  {
                    data: pastRevenue,
                  },
                ],
              }}
              width={width - 40}
              height={250}
              yAxisSuffix="k"
              fromZero
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(37,99,235,${opacity})`,
                labelColor: (opacity = 1) => `rgba(15,23,42,${opacity})`,
              }}
              style={styles.chart}
            />
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Risk Analysis</Text>

            <PieChart
              data={riskChart}
              width={width - 40}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(37,99,235,${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Industry Summary</Text>

            <Text style={styles.summaryText}>
              {result.past_yearly_analysis.summary}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginTop: 30,
  },

  hero: {
    marginHorizontal: 16,
    borderRadius: 28,
    padding: 24,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  heroDesc: {
    color: "rgba(255,255,255,0.85)",
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
  },

  heroStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
  },

  statCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    width: "31%",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  statNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  statText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    marginTop: 5,
  },

  formContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 18,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 60,
  },

  textAreaBox: {
    height: 140,
    alignItems: "flex-start",
    paddingTop: 18,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    color: "#0f172a",
    fontSize: 15,
  },

  textArea: {
    flex: 1,
    marginLeft: 12,
    color: "#0f172a",
    fontSize: 15,
    textAlignVertical: "top",
    width: "100%",
  },

  predictBtn: {
    backgroundColor: "#2563eb",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  predictText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },

  modalIconBox: {
    backgroundColor: "#dbeafe",
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
  },

  modalDesc: {
    fontSize: 14,
    color: "#475569",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  modalBtn: {
    backgroundColor: "#2563eb",
    width: "100%",
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  modalBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  resultContainer: {
    marginTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  resultTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },

  aiBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 30,
  },

  aiBadgeText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 12,
  },

  resultDesc: {
    marginTop: 14,
    color: "#475569",
    lineHeight: 22,
    fontSize: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 22,
  },

  card: {
    width: "48%",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  cardLabel: {
    color: "#64748b",
    fontSize: 13,
    marginBottom: 8,
  },

  cardValue: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  scaleBox: {
    backgroundColor: "#2563eb",
    padding: 22,
    borderRadius: 24,
    marginTop: 12,
  },

  scaleTitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },

  scaleValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 6,
    textTransform: "capitalize",
  },

  scaleBreakdownContainer: {
    marginTop: 24,
  },

  scaleBreakdownTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 14,
  },

  swipeList: {
    paddingHorizontal: 0,
  },

  swipeCard: {
    width: width - 32,
    borderRadius: 24,
    padding: 22,
  },

  swipeCardInactive: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  scaleCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },

  scaleCardLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },

  scaleCardLabelActive: {
    color: "#fff",
  },

  scaleStatGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  scaleStatItem: {
    width: "45%",
  },

  scaleCardStatLabel: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 4,
  },

  scaleCardStatLabelActive: {
    color: "rgba(255,255,255,0.7)",
  },

  scaleCardStatValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },

  scaleCardStatValueActive: {
    color: "#fff",
  },

  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#dbeafe",
  },

  dotActive: {
    backgroundColor: "#2563eb",
    width: 22,
    borderRadius: 4,
  },

  chartContainer: {
    marginTop: 28,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 20,
  },

  chart: {
    borderRadius: 20,
  },

  summaryBox: {
    marginTop: 26,
    backgroundColor: "#f8fafc",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  summaryTitle: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },

  summaryText: {
    color: "#475569",
    lineHeight: 22,
    fontSize: 14,
  },
});
