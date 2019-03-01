<template>
  <section>
    <v-card>
      <v-card-title primary-title>
        <v-btn round :color="sessionTextColor"
          dark
        >{{sessionText}}</v-btn>
        <br><br>
        <v-layout>
          <v-flex xs4 px-3>
            <v-switch
              :color="baseColor"
              v-model="switchSessionStart"
              label="Start Session"
              :disabled="switchSessionStart==true"
              @change="saveStart"
            ></v-switch>
          </v-flex>
          <!-- <v-flex xs4 px-3>
            <v-switch
              :color="baseColor"
              v-model="switchSessionBreak"
              label="Take Break"
              @change="saveBreak"
              :disabled="switchSessionBreak==true || switchSessionStart==false || switchSessionEnd==true"
            ></v-switch>
          </v-flex>
          <v-flex xs4 px-3>
            <v-switch
              :color="baseColor"
              v-model="switchSessionResume"
              label="Resume Session"
              @change="saveResume"
              :disabled="switchSessionBreak==false || switchSessionResume==true || switchSessionStart==false || switchSessionEnd==true"
            ></v-switch>
          </v-flex> -->
          <v-flex xs4 px-3>
            <v-switch
              :color="'red'"
              v-model="switchSessionEnd"
              label="End Session"
              @change="saveEnd"
              :disabled="switchSessionStart==false"
            ></v-switch>
          </v-flex>
        </v-layout>
      </v-card-title>

      <v-card-text>
        <h3 class="headline mb-0">
          <u>Today's Session Details</u>
          <br>
          <v-container
            px-0
            id="scroll-target"
            style="max-height: 400px"
            class="scroll-y"
          >
            <v-data-table
              :headers="headers"
              :items="actions"
              :loading="loading"
              class="elevation-1"
              hide-actions
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.index + 1 }}</td>
                <td>{{ props.item.action }}</td>
                <td>{{ props.item.time }}</td>
              </template>
            </v-data-table>
          </v-container>
        </h3>
      </v-card-text>
    </v-card>
  </section>
</template>

<script type="text/javascript">
import moment from 'moment'

export default {
  name: 'ManageSession',
  data: () => ({
    switch1: false,
    switchSessionStart: false,
    switchSessionBreak: false,
    switchSessionResume: false,
    switchSessionEnd: false,
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Action',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Time', value: 'time' }
    ],
    loading: true,
    form: {
      date: '',
      login_time: '',
      logout_time: ''
    },
    user_attendances: []
  }),
  computed: {
    sessionText() {
      if(this.switchSessionEnd)
        return 'Thank you. That was worth your time. Be on time tomorrow'
      if(this.switchSessionResume)
        return 'Great!!! You resumed the session'
      if(this.switchSessionBreak)
        return 'You are on break. Come fast. Too much Work!!!'
      if(this.switchSessionStart)
        return 'Session Started';
      return 'Start your day by clicking "start session"';
    },
    sessionTextColor() {
      if(this.switchSessionEnd)
        return 'light-blue'
      if(this.switchSessionResume)
        return 'green'
      if(this.switchSessionBreak)
        return 'orange'
      if(this.switchSessionStart)
        return 'green'
      return 'blue';
    },
    actions() {
      let actions = []
      this.user_attendances.forEach((att, i) => {
        if(i == 0) {
          actions.push({
            'action': 'Started the session',
            'time': att.login_time
          })
          actions.push({
            'action': 'Ended the session',
            'time': att.logout_time
          })
        }
      })
      return actions
    }
  },
  async mounted() {
    this.form.date = moment(new Date()).format("DD-MM-YYYY")
    this.user_attendances = await this.$axios.get(`user_attendances?date=${this.form.date}`)
    this.user_attendances = this.user_attendances.data.data
    if(this.user_attendances.length) {
      this.form = this.user_attendances[0]
      this.switchSessionStart = true
      if(this.user_attendances[0].logout_time)
        this.switchSessionEnd = true
    }

    this.loading = false
  },
  methods: {
    async saveStart() {
      console.log('Session Started');
      this.form.date = moment(new Date()).format("DD-MM-YYYY")
      this.form.login_time = moment(new Date()).format("HH:mm:ss")
      if(this.user_attendances.length)
      {
      }
      else  
        this.$axios.post('/user_attendances', this.form)
    },
    saveBreak() {
      this.switchSessionResume = false
      console.log('Save Break')
    },
    saveResume() {
      this.switchSessionBreak = false
      console.log('Save Resume')
    },
    saveEnd() {
      if(this.switchSessionEnd)
        this.form.logout_time = moment(new Date()).format("HH:mm:ss")
      else
        this.form.logout_time = ''
      if(this.user_attendances.length)
      {
        this.$axios.patch(`/user_attendances/${this.form.id}`, this.form)
      }
    },
  }
}
</script>