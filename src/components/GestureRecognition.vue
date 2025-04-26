<template>
    <div>
      <Camera />
      <button @click="recognizeGesture">Detect Sign</button>
      <p>Recognized Gesture: {{ detectedGesture }}</p>
    </div>
  </template>
  
  <script>
  import * as tf from "@tensorflow/tfjs";
  import Camera from "./Camera.vue";
  
  export default {
    components: { Camera },
    data() {
      return {
        model: null,
        detectedGesture: "",
      };
    },
    async mounted() {
      this.model = await tf.loadGraphModel("/web_model/model.json");
    },
    methods: {
      async recognizeGesture() {
        const video = document.querySelector("video");
        const tensor = tf.browser.fromPixels(video).expandDims(0);
        const prediction = this.model.predict(tensor);
        const classId = prediction.argMax(-1).dataSync()[0];
        this.detectedGesture = `Gesture: ${classId}`;
      },
    },
  };
  </script>
  