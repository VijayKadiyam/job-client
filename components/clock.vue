<template>
  <section>
    {{ display }} {{ timer }}
  </section>
</template>

<script type="text/javascript">

import moment from 'moment'

export default {
  data: () => ({
    timer: ''
  }),
  props: ['time'],
  watch: {
    time: 'updateTimer'
  },
  computed: {
    display() {
      return this.timer
    }
  },
  mounted() {
    this.timer = this.time
    let t = moment(this.timer, 'HH:mm:ss')
    t.add(1, 'seconds')
    this.timer = moment(t).format('HH:mm:ss');

    setInterval(() => {
      t.add(1, 'seconds')
      this.timer = moment(t).format('HH:mm:ss');
    }, 1000)
  },
  methods: {
    updateTimer(newValue) {
      console.log(this.timer)
      this.timer = newValue
    }
  }
}  
</script>