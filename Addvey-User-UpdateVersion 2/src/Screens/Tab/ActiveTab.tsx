import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import EmptyCard from "../../Components/Home/EmptyCard";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";
import MainHomeCard from "../../Components/Home/MainHomeCard";
import { Ionicons } from "@expo/vector-icons";


const ActiveTab = ({ data = [], navigation, handleDelete, type }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  // ✅ Extract unique categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(data?.map((item) => item.supersubcategory?.parent?.parentCategory?.name)));
    return ["All", ...unique];
  }, [data]);

  // ✅ Filtered data based on search and active category
  const filteredData = useMemo(() => {
    return data?.filter((item) => {
      const matchesCategory =
        activeFilter === "All" || item?.supersubcategory?.parent?.parentCategory?.name === activeFilter;
      const matchesSearch =
        item?.name?.includes(searchQuery) ||
        item?.supersubcategory?.parent?.parentCategory?.name?.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });

  }, [data, activeFilter, searchQuery]);

  return (
    <View>
      
        <View>
          {/* 🔍 Search Bar */}
           <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={{ marginRight: 6 }}
            />
            <TextInput
              placeholder="Search ads..."
              placeholderTextColor="#999"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* 🧩 Filters */}
          <View style={styles.filtersRow}>
            {/* Filter Icon */}
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => navigation.navigate("Filter")}
            >
              <Image
                source={require("../../../assets/images/filter.png")}
                style={{
                  width: widthPercentageToDP(3.5),
                  height: heightPercentageToDP(2),
                  resizeMode: "contain",
                }}
              />
            </TouchableOpacity>

            {/* Dynamic Filter Buttons */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => {
              const isActive = activeFilter === category;
              const categoryCount =
                category === "All"
                  ? data?.length
                  : data?.filter((d) => d?.supersubcategory?.parent?.parentCategory?.name === category).length;

              return (
                <TouchableOpacity
                  key={category}
                  style={[styles.filterBtn, isActive && styles.activeFilterBtn]}
                  onPress={() => setActiveFilter(category)}
                >
                  {/* {category !== "All" && <View style={styles.squareBox} />} */}
                  <Text
                    style={[
                      styles.filterText,
                      isActive && styles.activeFilterText,
                    ]}
                  >
                    {category === "All"
                      ? "All"
                      : `${categoryCount} ${category}`}
                  </Text>
                  { category != "All" && isActive && <Text style={[styles.activeFilterText, {paddingLeft:7, paddingRight:0}]} onPress={()=>{setActiveFilter('All')}}>X</Text>}
                </TouchableOpacity>
              );
            })}
            </ScrollView>
          </View>

          {/* 📆 Section */}
          {/* <View style={styles.monthsSection}>
            <Text style={styles.monthsText}>Past three months</Text>
          </View> */}

          {/* 🪧 Filtered List */}
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MainHomeCard
                item={item}
                onDelete={() => handleDelete(item.id)}
                type={type}
              />
            )}
            ListEmptyComponent={ <EmptyCard title={type} />}
          />
        </View>
      
    </View>
  );
};

export default ActiveTab;

// 🧱 Styles
const styles = StyleSheet.create({
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    marginBottom: hp(2.5),
    marginTop: hp(2.5),
  },
  searchInput: { flex: 1, fontSize: hp(1.8), color: "#000" },

  /** Filters */
  filtersRow: { flexDirection: "row", marginBottom: hp(2) },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(0.6),
    paddingHorizontal: wp(3),
    marginRight: wp(3),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp(2),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  activeFilterBtn: {
    borderColor: "#6A5AE0",
    backgroundColor: "#fff",
  },
  filterText: { marginLeft: 0, fontSize: hp(1.5), color: "#00000099" },
  activeFilterText: { color: "#6A5AE0", fontWeight: "600" },
  squareBox: {
    width: wp(3.5),
    height: wp(3.5),
    backgroundColor: "#D9D9D980",
    marginRight: wp(1.5),
    borderRadius: 4,
  },

  /** Months Section */
  monthsSection: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D9D9D9",
    paddingVertical: hp(1),
    marginBottom: hp(2),
    alignItems: "center",
  },
  monthsText: {
    fontSize: hp(1.6),
    color: "#00000099",
    fontFamily: "Poppins-Medium",
  },

 
});
