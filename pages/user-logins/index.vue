<template>
  <section>
    <span class="title">Login Status</span>
    <br><br>
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
  async asyncData({$axios}) {
    let timeStampJson = await $axios.get('http://worldclockapi.com/api/json/utc/now')
    return {
      currentTimeStamp: timeStampJson.data.currentDateTime
    }
  },
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
    }
  }),
  components: {
    clock
  },
  async mounted() {
    this.time_zone = this.organization.time_zone
    this.currentMoment = moment.utc(this.currentTimeStamp).tz(this.time_zone)
    this.fetchLogins()
  },
  methods: {
    async fetchLogins() {
      this.loading = true
      this.user_logins = []
      let date = this.currentMoment.format("YYYY-MM-DD")
      this.users = await this.$axios.get(`/user_attendances?searchDate=${date}`);
      this.users.data.data.forEach((user, i) => {
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
          duration: this.getDuration(user.user_attendances.length ? user.user_attendances[0].login_time : '', user.user_attendances.length ? user.user_attendances[0].logout_time : ''),
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
      })
      this.loading = false
    },
    getDuration(startTime,  endTime) {
      var start = '';
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
      let user_attendance = await this.$axios.get(`user_attendances/${attendanceId}`)
      user_attendance.data.data.logout_time = this.currentMoment.format("HH:mm:ss")
      console.log(user_attendance)
      await this.$axios.patch(`/user_attendances/${attendanceId}`, user_attendance.data.data)
      this.fetchLogins();
    }
  }
}
</script>