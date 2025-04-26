<template>
    <div>
      <video ref="video" autoplay></video>
      <button @click="startVideo">Start Camera</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      startVideo() {
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          this.$refs.video.srcObject = stream;
        });
      },
    },
  };
  </script>
  