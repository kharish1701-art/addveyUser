// screens/ReportedPostQueryScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MainHomeCard from "../Components/Home/MainHomeCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainReportCard from "../Components/Home/MainReportCard";

interface Report {
  id: number;
  userId: number;
  productId: number;
  issue: string;
  type: string;
  reason: string;
  description: string;
  status: string;
  attachments: string[];
  audioMessage: string;
  language: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  userProfile: {
    id: number;
    name: string;
    image: string;
  };
  product: {
    id: number;
    name: string;
    price: number;
    images: string[];
    likes: number;
    views: number;
    createdAt: string;
    updatedAt: string;
    supersubcategory: {
      id: number;
      name: string;
      description: string;
      image: string;
      parent: {
        id: number;
        name: string;
        description: string;
        image: string;
        parentCategory: {
          id: number;
          name: string;
          description: string;
          image: string;
        };
      };
    };
    creator: {
      id: number;
      roleId: number;
      email: string;
      phone: string;
      profile: {
        name: string;
        image: string;
        gender: string;
        partnerId: number;
        socialLinks: Array<{
          platform: string;
          url: string;
        }>;
      };
    };
  };
}

interface CategoryTab {
  id: string;
  name: string;
  count: number;
  displayName: string;
}

const ReportedPostQueryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryTab[]>([]);

  // Fetch reports from API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");

      const response = await fetch(
        "https://api.addvey.com/api/reports/view-all-my-reports",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        const reportsData = result.data?.data || [];
        setReports(reportsData);
        setFilteredReports(reportsData);

        // Extract only parent categories (main categories)
        const categoryMap = new Map();

        reportsData.forEach((report: Report) => {
          const parentCategory =
            report.product?.supersubcategory?.parent?.parentCategory;

          if (parentCategory) {
            const categoryName = parentCategory.name;
            if (categoryMap.has(categoryName)) {
              categoryMap.set(categoryName, categoryMap.get(categoryName) + 1);
            } else {
              categoryMap.set(categoryName, 1);
            }
          } else {
            // Handle cases where category structure is missing
            const otherCategory = "Other";
            if (categoryMap.has(otherCategory)) {
              categoryMap.set(
                otherCategory,
                categoryMap.get(otherCategory) + 1
              );
            } else {
              categoryMap.set(otherCategory, 1);
            }
          }
        });

        // Convert map to array for categories
        const categoryArray: CategoryTab[] = Array.from(
          categoryMap,
          ([name, count]) => ({
            id: name, // Use the actual category name as ID for easier filtering
            name: name,
            count: count,
            displayName: name,
          })
        );

        // Add "All" tab at the beginning
        categoryArray.unshift({
          id: "all",
          name: "All",
          count: reportsData.length,
          displayName: "All",
        });

        setCategories(categoryArray);

        // Debug: Log categories and sample data
        console.log("Categories:", categoryArray);
        if (reportsData.length > 0) {
          console.log(
            "Sample report category:",
            reportsData[0].product?.supersubcategory?.parent?.parentCategory
              ?.name
          );
        }
      } else {
        Alert.alert("Error", result.message || "Failed to fetch reports");
      }
    } catch (error) {
      console.error("Fetch reports error:", error);
      Alert.alert("Error", "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  // Filter reports based on active filter and search query
  const filterReports = () => {
    let filtered = [...reports];

    // Apply category filter (only parent categories)
    if (activeFilter !== "all") {
      console.log("Filtering by category:", activeFilter);
      filtered = filtered.filter((report) => {
        const parentCategoryName =
          report.product?.supersubcategory?.parent?.parentCategory?.name;
        console.log(
          "Report category:",
          parentCategoryName,
          "Matches:",
          parentCategoryName === activeFilter
        );
        return parentCategoryName === activeFilter;
      });
      console.log("Filtered results count:", filtered.length);
    }

    // Apply search filter
    if (String(searchQuery || "").trim()) {
      const query = String(searchQuery).toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.product?.name?.toLowerCase().includes(query) ||
          report.issue?.toLowerCase().includes(query) ||
          report.description?.toLowerCase().includes(query) ||
          report.product?.supersubcategory?.parent?.parentCategory?.name
            ?.toLowerCase()
            .includes(query)
      );
    }

    setFilteredReports(filtered);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [activeFilter, searchQuery, reports]);

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  /** Filter Components */
  const AllComponent = () => (
    <View style={styles.componentContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5AE0" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      ) : filteredReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? "No reports found for your search"
              : "No reports found"}
          </Text>
        </View>
      ) : (
        <View style={styles.cardWrapper}>
          {filteredReports.map((report) => (
            <View key={report.id} style={styles.cardContainer}>
              <MainReportCard item={report.product} reportData={report} />
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const CategoryComponent = ({ categoryName }: { categoryName: string }) => (
    <View style={styles.componentContainer}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5AE0" />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      ) : filteredReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? `No ${categoryName} reports found for your search`
              : `No ${categoryName} reports found`}
          </Text>
        </View>
      ) : (
        <View style={styles.cardWrapper}>
          {filteredReports.map((report) => (
            <View key={report.id} style={styles.cardContainer}>
              <MainReportCard item={report.product} reportData={report} />
              <View style={styles.reportInfo}>
                <Text style={styles.reportIssue}>
                  <Text style={styles.bold}>Issue:</Text> {report.issue}
                </Text>
                <Text style={styles.reportStatus}>
                  <Text style={styles.bold}>Status:</Text>
                  <Text
                    style={[
                      styles.statusText,
                      report.status === "resolved"
                        ? styles.resolved
                        : report.status === "pending"
                          ? styles.pending
                          : styles.inProgress,
                    ]}
                  >
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </Text>
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderFilterContent = () => {
    switch (activeFilter) {
      case "all":
        return <AllComponent />;
      default:
        const activeCategory = categories.find(
          (cat) => cat.id === activeFilter
        );
        return (
          <CategoryComponent
            categoryName={activeCategory?.name || activeFilter}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={wp("4.4%")} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact us</Text>
        </View>
      </View>

      <Text style={styles.topText}>What do you need help with?</Text>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search reports..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: wp(4),
          paddingBottom: hp(10),
        }}
      >
        {/* Category Tabs - Only Parent Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterBtn,
                activeFilter === category.id && styles.activeFilterBtn,
              ]}
              onPress={() => setActiveFilter(category.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === category.id && styles.activeFilterText,
                ]}
              >
                {category.displayName} ({category.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results Count */}
        {!loading && (
          <Text style={styles.resultsCount}>
            Showing {filteredReports.length} of {reports.length} reports
            {searchQuery && ` for "${searchQuery}"`}
            {activeFilter !== "all" &&
              ` in ${categories.find((cat) => cat.id === activeFilter)?.name}`}
          </Text>
        )}

        {/* Filter Content */}
        {renderFilterContent()}
      </ScrollView>
    </View>
  );
};

export default ReportedPostQueryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topText: {
    fontSize: hp(2),
    color: "#000",
    marginBottom: hp(0),
    paddingHorizontal: wp(4),
    marginTop: hp(2),
    fontFamily: "Poppins-Medium",
  },
  /** Header */
  header: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
    marginTop: hp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
    marginLeft: wp(2),
    color: "black",
  },

  /** Search bar */
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    marginBottom: hp(0.5),
    marginTop: hp(2),
    marginHorizontal: wp(3.9),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.8),
    color: "#000",
    paddingVertical: hp(1),
  },

  /** Filters */
  filtersRow: {
    flexDirection: "row",
    marginBottom: hp(2),
    paddingRight: wp(3),
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(3),
    marginRight: wp(2),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
    marginTop: hp(1),
  },
  activeFilterBtn: {
    borderColor: "#6A5AE0",
    backgroundColor: "#fff",
  },
  filterText: {
    marginLeft: 0,
    fontSize: hp(1.5),
    color: "#00000099",
    fontFamily: "Poppins-Medium",
  },
  activeFilterText: {
    color: "#6A5AE0",
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },
  squareBox: {
    width: wp(5),
    height: wp(5),
    backgroundColor: "#D9D9D980",
    marginRight: wp(1.5),
    borderRadius: 4,
  },

  /** Results Count */
  resultsCount: {
    fontSize: hp(1.6),
    color: "#666",
    marginBottom: hp(1),
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },

  /** Component Styles */
  componentContainer: {
    marginTop: hp(2),
    borderRadius: wp(2),
    alignItems: "center",
    justifyContent: "center",
  },
  cardWrapper: {
    width: "100%",
    marginHorizontal: wp(4),
    alignSelf: "center",
  },
  cardContainer: {
    // Your existing card container styles
  },
  reportInfo: {
    marginTop: hp(1),
    paddingTop: hp(1),
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  reportIssue: {
    fontSize: hp(1.6),
    color: "#333",
    marginBottom: hp(0.5),
    fontFamily: "Poppins-Regular",
  },
  reportStatus: {
    fontSize: hp(1.6),
    color: "#333",
    marginBottom: hp(0.5),
    fontFamily: "Poppins-Regular",
  },
  reportDate: {
    fontSize: hp(1.4),
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
  statusText: {
    fontFamily: "Poppins-SemiBold",
    marginLeft: wp(1),
  },
  resolved: {
    color: "#4CAF50",
  },
  pending: {
    color: "#FF9800",
  },
  inProgress: {
    color: "#2196F3",
  },
  bold: {
    fontFamily: "Poppins-SemiBold",
    color: "#000",
  },

  /** Loading and Empty States */
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(5),
  },
  loadingText: {
    marginTop: hp(1),
    fontSize: hp(1.8),
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(5),
  },
  emptyText: {
    fontSize: hp(1.8),
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});
