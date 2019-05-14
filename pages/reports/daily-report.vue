<template>
  <section>
    <span class="title">Users Report</span>
     <v-layout row wrap>
      <v-flex md3>
       <v-menu
          ref="dateMenu"
          :close-on-content-click="false"
          v-model="dateMenu"
          :nudge-right="40"
          :return-value.sync="form.doj"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <v-text-field
            :error-messages="errors.date"
            slot="activator"
            v-model="date"
            label="Date"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="fetchLogins(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>
    </v-layout>
    <no-ssr>
      <download-excel
        class   = "btn btn-default"
        :data   = "json_data"
        :fields = "json_fields"
        worksheet = "My Worksheet"
        name    = "DailyReport.xls"
      >
        <a href="#" class="download">export to excel</a>
      </download-excel>
    </no-ssr>
    <v-data-table
      :headers="headers"
      :items="user_logins"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>
          {{ props.index + 1 }}.
          <v-avatar
            size="30px"
            v-if="props.item.image_path != null"
          >
            <img
              :src="(mediaUrl + props.item.image_path)"
              alt="Profile Image"
            >
          </v-avatar>
          <v-btn 
            v-if="props.item.login_time != null 
              && props.item.login_time != '-' 
              && (props.item.logout_time == null 
                  || 
                  props.item.logout_time == '-')" 
            flat color="red" small @click="forceLogout(props.item.user_attendance_id)"
          >Force logout</v-btn>
        </td>
        <td v-html="props.item.name"></td>
        <td>{{ props.item.login_time }}</td>
        <td>{{ props.item.logout_time }}</td>
        <td>
          <v-btn
            flat
            small
            color="blue"
            @click.stop="props.item.breakDialog = true"
          >
            break details
          </v-btn>

          <v-dialog
            v-model="props.item.breakDialog"
            max-width="290"
          >
            <v-card>
              <v-card-text>
                <h3>Break Details</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(user_break, b) in props.item.breaks"
                      :key="`user_break${b}`"
                    >
                      <td>{{ user_break.break_type.name }}</td>
                      <td>{{ user_break.start_time }} - {{ user_break.end_time }}</td>
                    </tr>
                  </tbody>
                </table>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="props.item.breakDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
        <td class="text-xs-left">
          <v-btn flat 
            v-if="props.item.status == 'LIVE'"
            class="green--text"
            small
          >
            LIVE 
          </v-btn>
          <v-btn flat 
            v-if="props.item.status == 'LOGGED OUT'"
            class="blue--text"
            small
          >
            LOGGED OUT
          </v-btn>
          <v-btn flat 
            v-if="props.item.status == 'ON BREAK'"
            class="yellow--text"
            small
          >
            ON BREAK
          </v-btn>
          <v-btn flat 
            v-if="props.item.status == 'NOT STARTED'"
            class="red--text"
            small
          >
            NOT STARTED
          </v-btn>
          <br>
          <template v-if="props.item.logout_time==null">
            <clock :content="'Live Hours: '"  :time="props.item.duration"></clock>
          </template>
          <template v-else>
            {{ props.item.duration == 'Invalid date' ? '' : 'Live Hours: ' + props.item.duration }}
          </template>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
import moment from 'moment'
import moment_timezone from 'moment-timezone'

import clock from '@/components/clock.vue'

export default {
  name: 'ManageUsersLogins',
  data:() =>  ({
    users: [],
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'LogIn Time', value: 'login_time' },
      { text: 'LogOut Time', value: 'logout_time' },
      { text: 'Breaks', value: 'breaks', align: 'left', },
      { text: 'Status', value: 'status', align: 'left', },
    ],
    json_fields: {
      'Sr No': 'sr_no',
      'Name': 'name',
      'Login Time': 'login_time',
      'Logout Time': 'logout_time',
      'Breaks': 'breaks',
      'Status': 'status'
    },
    loading: true,
    user_logins: [],
    break_dialog: false,
    tests: ['hi', 'fi', 'si'],
    time_zone: '',
    form: {
      user_id: '',
      date: '',
      login_time: '',
      logout_time: ''
    },
    dateMenu: false,
    date: '',
    json_data: [],
  }),
  components: {
    clock
  },
  async mounted() {
    let timeStampJson = await this.$axios.get('http://worldclockapi.com/api/json/utc/now')
    this.currentTimeStamp = timeStampJson.data.currentDateTime

    this.time_zone = this.organization.time_zone
    // this.currentMoment = await this.getCurrentMoment()
    this.currentMoment = await this.getCurrentMoment()
    this.date = this.currentMoment.format("YYYY-MM-DD")
    this.fetchLogins(this.date)
  },
  methods: {
    async fetchLogins(date) {
      this.$refs.dateMenu.save(date)
      if(!date) {
        this.currentMoment = await this.getCurrentMoment()
        this.date = this.currentMoment.format("YYYY-MM-DD")
      }
      this.loading = true
      this.user_logins = []
      this.json_data = []
      this.users = await this.$axios.get(`/user_attendances?searchDate=${this.date}`);

      this.users = this.users.data.data.filter(user => user.active == 1)
      this.users.forEach(async (user, i) => {
        let duration = await this.getDuration(user.user_attendances.length ? user.user_attendances[0].login_time : '', user.user_attendances.length ? user.user_attendances[0].logout_time : '')

        this.user_logins.push({
          user_attendance_id: user.user_attendances.length ? user.user_attendances[0].id : '',
          name: `
            ${user.name} [ ${user.roles[0].name} ]
          `,
          image_path: user.image_path,
          login_time: user.user_attendances.length ? user.user_attendances[0].login_time : '-',
          logout_time: user.user_attendances.length ? user.user_attendances[0].logout_time : '-',
          breaks: 
            user.user_attendances.length ?
            (
              user.user_attendances[0].user_attendance_breaks
            )
            :
            [],
          breakDialog: false,
          duration: duration,
          status: 
            user.user_attendances.length ? 
            (
              user.user_attendances[0].logout_time ? 
              (
                'LOGGED OUT'
              )
              :
              user.user_attendances[0].user_attendance_breaks.length ? 
              (
                user.user_attendances[0].user_attendance_breaks.find(user_break => user_break.end_time == null) ?
                (
                  'ON BREAK'
                )
                :
                'LIVE'
              )
              :
              'LIVE'
            ) 
            : 
            'NOT STARTED'
        })

        this.json_data.push({
          'sr_no': i + 1,
          'name': this.user_logins[i].name,
          'login_time': this.user_logins[i].login_time,
          'logout_time': this.user_logins[i].logout_time,
          'breaks': (this.user_logins[i].breaks.length ? 
            this.user_logins[i].breaks.map((br) => {
              return '<br>' + br.break_type.name + '<br>' + br.start_time + '-' + br.end_time
            }) : ''),
          'status': this.user_logins[i].status
        })
      })

      
      this.loading = false
    },
    async getDuration(startTime,  endTime) {
      var start = '';
      // this.currentMoment = await this.getCurrentMoment()
      var end = moment.utc(this.currentMoment.format("HH:mm:ss"), 'HH:mm:ss')
      if(startTime != "") {
        start = moment.utc(startTime, "HH:mm:ss")
      }
      if(endTime != "" && endTime != null) {
        end = moment.utc(endTime, 'HH:mm:ss')
      }

      // calculate the duration
      var d = moment.duration(end.diff(start));

      // subtract the lunch break
      // d.subtract(30, 'minutes');

      // format a string result
      return moment.utc(+d).format('HH:mm:ss')
    },
    async forceLogout(attendanceId) {
      this.loading = true
      let user_attendance = await this.$axios.get(`user_attendances/${attendanceId}`)
      this.currentMoment = await this.getCurrentMoment()
      user_attendance.data.data.logout_time = this.currentMoment.format("HH:mm:ss")
      console.log(user_attendance)
      await this.$axios.patch(`/user_attendances/${attendanceId}`, user_attendance.data.data)
      this.fetchLogins();
    },
    async getCurrentMoment() {
      this.currentTimeStamp = await this.getCurrentTimeStamp()
      return moment.utc(this.currentTimeStamp).tz(this.time_zone)
    },
    async getCurrentTimeStamp() {
      let timeStampJson = await this.$axios.get('http://worldclockapi.com/api/json/utc/now')
      return timeStampJson.data.currentDateTime
    }
  }
}
</script>