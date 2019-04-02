/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Image,
  Easing
} from "react-native";

const SCREENHEIGHT = Dimensions.get("window").height;
const SCREENWIDTH = Dimensions.get("window").width;

const images = [
  {
    id: 1,
    source: require("./Images/lotusflower.jpg")
  },
  {
    id: 2,
    source: require("./Images/mexicanflower.jpg")
  },
  {
    id: 3,
    source: require("./Images/sunflower.jpg")
  },
  {
    id: 4,
    source: require("./Images/tulipflower.jpg")
  }
];

export default class App extends Component {
  constructor() {
    super();
    this.allImages = {};
    this.oldPosition = {};
    this.position = new Animated.ValueXY();
    this.dimensions = new Animated.ValueXY();
    this.animation = new Animated.Value(0);
    this.borderRadius = new Animated.Value(20);
    this.state = {
      activeImage: null
    };
  }

  closeImage = () => {
    Animated.parallel([
      Animated.timing(this.position.x, {
        toValue: this.oldPosition.x,
        easing: Easing.back(1),
        duration: 300
      }),
      Animated.timing(this.position.y, {
        toValue: this.oldPosition.y,
        easing: Easing.back(1),
        duration: 300
      }),
      Animated.timing(this.dimensions.x, {
        toValue: this.oldPosition.width,
        easing: Easing.back(1),
        duration: 300
      }),
      Animated.timing(this.dimensions.y, {
        toValue: this.oldPosition.height,
        easing: Easing.back(1),
        duration: 300
      }),
      Animated.timing(this.borderRadius, {
        toValue: 20,
        easing: Easing.back(1),
        duration: 300
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        easing: Easing.back(1),
        duration: 300
      })
    ]).start(() => {
      this.setState({
        activeImage: null
      });
    });
  };

  openImage = index => {
    this.allImages[index].measure((x, y, width, height, pageX, pageY) => {
      this.oldPosition.x = pageX;
      this.oldPosition.y = pageY;
      this.oldPosition.width = width;
      this.oldPosition.height = height;

      this.position.setValue({
        x: pageX,
        y: pageY
      });
      this.dimensions.setValue({
        x: width,
        y: height
      });

      this.setState(
        {
          activeImage: images[index]
        },
        () => {
          this.viewImage.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {
            Animated.parallel([
              Animated.timing(this.position.x, {
                toValue: dPageX,
                easing: Easing.back(1),
                duration: 300
              }),
              Animated.timing(this.position.y, {
                toValue: dPageY,
                easing: Easing.back(1),
                duration: 300
              }),
              Animated.timing(this.dimensions.x, {
                toValue: dWidth,
                easing: Easing.back(1),
                duration: 300
              }),
              Animated.timing(this.dimensions.y, {
                toValue: dHeight,
                easing: Easing.back(1),
                duration: 300
              }),
              Animated.timing(this.animation, {
                toValue: 1,
                easing: Easing.back(1),
                duration: 300
              }),
              Animated.timing(this.borderRadius, {
                toValue: 0,
                easing: Easing.back(1),
                duration: 350
              })
            ]).start();
          });
        }
      );
    });
  };
  render() {
    const activeImgStyle = {
      width: this.dimensions.x,
      height: this.dimensions.y,
      left: this.position.x,
      top: this.position.y,
      borderRadius: this.borderRadius
    };
    const animatedContentY = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [150, 0]
    });
    const animatedContentOpacity = this.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 1]
    });
    const animatedContentStyle = {
      opacity: animatedContentOpacity,
      transform: [{ translateY: animatedContentY }]
    };
    const animatedCrossOpacity = {
      opacity: this.animation
    };
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {images.map((img, index) => {
            return (
              <TouchableWithoutFeedback
                key={img.id}
                onPress={() => this.openImage(index)}
              >
                <Animated.View style={styles.row}>
                  <Image
                    ref={image => (this.allImages[index] = image)}
                    source={img.source}
                    style={styles.imgStyle}
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
        </ScrollView>
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents={this.state.activeImage ? "auto" : "none"}
        >
          <View
            style={{
              flex: 0.6,
              borderWidth: 1,
              borderColor: "transparent",
              zIndex: 1001
            }}
            ref={view => (this.viewImage = view)}
          >
            <Animated.Image
              style={[
                {
                  resizeMode: "cover",
                  width: null,
                  height: null,
                  top: 0,
                  left: 0
                },
                activeImgStyle
              ]}
              source={
                this.state.activeImage ? this.state.activeImage.source : null
              }
            />
            <TouchableWithoutFeedback onPress={() => this.closeImage()}>
              <Animated.View
                style={[
                  { position: "absolute", padding: 10, top: 0, right: 0 },
                  animatedCrossOpacity
                ]}
              >
                <Text style={{ fontSize: 24, color: "#fff" }}>x</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
          <Animated.View
            style={[
              {
                flex: 0.4,
                backgroundColor: "#fff",
                padding: 20,
                zIndex: 1000
              },
              animatedContentStyle
            ]}
          >
            <Text style={{ paddingBottom: 10 }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  row: {
    width: SCREENWIDTH,
    height: SCREENHEIGHT - 200,
    padding: 15
  },
  imgStyle: {
    flex: 1,
    width: null,
    height: null,
    borderRadius: 20,
    resizeMode: "cover"
  },
  details: {}
});
