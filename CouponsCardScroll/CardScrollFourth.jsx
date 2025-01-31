import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  withTiming,
} from "react-native-reanimated";
import { cards } from "../../../assets/data";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const CardScroll = () => {
  const activeCard = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      if (isAnimating.value || activeCard.value === 0) {
        return;
      }
      isAnimating.value = true;
      activeCard.value = withTiming(
        activeCard.value - 1,
        {
          duration: 300,
        },
        () => {
          isAnimating.value = false;
        }
      );
      console.log("FLING UP");
    });

  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      if (isAnimating.value || activeCard.value === cards.length - 1) {
        return;
      }
      isAnimating.value = true;
      activeCard.value = withTiming(
        activeCard.value + 1,
        { duration: 300 },
        () => {
          isAnimating.value = false;
        }
      );
      console.log("FLING DOWN");
    });

  console.log(activeCard.value);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 1)",
          "rgba(255, 255, 255, 1)",
          "rgba(255, 255, 255, 0.5)",
          "rgba(255, 255, 255, 0)",
        ]}
        style={styles.headerContainer}
      >
        <Text style={styles.header}>Card Scroll V4</Text>
      </LinearGradient>
      <View style={styles.container}>
        <GestureDetector gesture={Gesture.Exclusive(flingUp, flingDown)}>
          <View style={styles.cardsContainer}>
            {cards.map((card, index) => (
              <CARD
                key={card.id}
                card={card}
                data={cards}
                activeCard={activeCard}
                index={index}
              />
            ))}
          </View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );

  function CARD({ card, activeCard, index, data }) {
    const rnAnimatedStyle = useAnimatedStyle(() => {
      return {
        position: "absolute",
        bottom: 20,
        zIndex: (data.length - index) * 20,
        transform: [
          {
            translateY: interpolate(
              activeCard.value,
              [index - 1, index, index + 1],
              [-44, 0, 300]
            ),
          },
          {
            scale: interpolate(
              activeCard.value,
              [index - 1, index, index + 1],
              [0.98, 1, 1.2]
            ),
          },
        ],
        // opacity: interpolate(
        //   activeCard.value,
        //   [index - 1, index, index + 1],
        //   [1 - 1 / 6, 1, 1]
        // ),
      };
    });
    return (
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: `${card.color}` },
          rnAnimatedStyle,
        ]}
        key={card.id}
      >
        <View style={styles.cardInner}>
          <View>
            <Text style={styles.cardName}>{card.name}</Text>
            <Text style={styles.subtext}>{card.subtext}</Text>
          </View>
          <Text style={styles.amount}>{card.amount}</Text>
        </View>
      </Animated.View>
    );
  }
};

export default CardScroll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "white",
  },
  headerContainer: {
    position: "absolute",
    height: 300,
    zIndex: 100,
    width: width,

    alignItems: "center",
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
    fontFamily: "rubikBold",
    textAlign: "center",
    marginTop: 60,
  },
  cardsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    width: width - 40,
    //backgroundColor: "green",
    position: "relative",
    height: "70%",
  },
  card: {
    width: "94%",
    height: 220,
    backgroundColor: "red",
    borderRadius: 14,
    position: "absolute",
  },
  cardInner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 14,
  },
  cardName: {
    fontFamily: "rubikBlack",
    color: "white",
    fontSize: 30,
    lineHeight: 30,
  },
  subtext: {
    fontFamily: "rubikRegular",
    color: "white",
    fontSize: 16,
    lineHeight: 16,
  },
  amount: {
    fontFamily: "rubikBlack",
    color: "white",
    fontSize: 140,
    lineHeight: 140,
    position: "absolute",
    left: 5,
    bottom: -30,
  },
});
