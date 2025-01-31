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
  withDecay,
} from "react-native-reanimated";
import { cards } from "../../../assets/data";

const { width, height } = Dimensions.get("window");

const CardScroll = () => {
  const activeCard = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const flingUp = Gesture.Fling()
    .direction(Directions.LEFT)
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
    .direction(Directions.RIGHT)
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
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <Text style={styles.header}>Card Scroll V3</Text>
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
      </SafeAreaView>
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
            translateX: interpolate(
              activeCard.value,
              [index - 1, index, index + 1],
              [-8, 0, 320]
            ),
          },
          {
            scale: interpolate(
              activeCard.value,
              [index - 1, index, index + 1],
              [1, 1, 0.8]
            ),
          },
        ],
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
  header: {
    fontSize: 22,
    marginBottom: 20,
    fontFamily: "rubikBold",
    textAlign: "center",
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
