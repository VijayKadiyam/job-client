<template>
  <section>
    <div
      id="e3"
      style="margin: auto;"
      class="grey lighten-3"
    >
    
      <v-card>
        <v-container
          v-if="fields.length == 0"
        >
          Loading...
        </v-container>
        <v-container
          v-else
          fluid
          grid-list-lg
        >
          <v-layout row wrap>
            <v-flex xs3
              v-for="field in fields"
            >
              <v-card :color="`${field.color} lighten-1`" class="white--text">
                <v-layout row>
                  <v-flex xs12>
                    <v-card-title primary-title>
                      <div>
                        <div class="headline">{{ field.value }}</div>
                        <div>{{ field.name }}</div>
                      </div>
                    </v-card-title>
                  </v-flex>
                </v-layout>
                <v-divider light class="white"></v-divider>
                <v-card-actions class="pa-3">
                  <router-link :to="field.to" style="color: white;">
                    More info
                  </router-link>
                  <v-icon style="color: white">label_important</v-icon>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </div>
    <br>
    <v-layout row wrap>
      <v-flex xs6>
        <GChart
          type="PieChart"
          :data="pieChartInData"
          :options="pieChartInOptions"
        />
      </v-flex>
      <v-flex xs6 pl-3>
        <GChart
          type="PieChart"
          :data="pieChartOutData"
          :options="pieChartOutOptions"
        />
        <br>
      </v-flex>
      <!-- <v-flex xs12>
        <GChart
          type="ColumnChart"
          :data="chartData"
          :options="chartOptions"
        />
      </v-flex> -->
    </v-layout>
  </section>
</template>

<script>
import moment from 'moment'
import moment_timezone from 'moment-timezone'
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  data: () => ({
    fields: [],
    chartData: [
      ['Year', 'Sales', 'Expenses', 'Profit'],
      ['2014', 1000, 400, 200],
      ['2015', 1170, 460, 250],
      ['2016', 660, 1120, 300],
      ['2017', 1030, 540, 350]
    ],
    chartOptions: {
      title: "Today's Working Hours Trends",
      subtitle: 'Sales, Expenses, and Profit: 2014-2017',
    },
    pieChartInData: [
      ['Time', 'Count'],
      ['Before 9.00 AM', 0],
      ['9.00 - 10.00 AM', 0],
      ['10.00 - 11.00 AM',  0],
      ['After 11.00 AM', 0],
    ],
    pieChartOutData: [
      ['Time', 'Count'],
      ['Before 9.00 AM', 0],
      ['9.00 - 10.00 AM', 0],
      ['10.00 - 11.00 AM',  0],
      ['After 11.00 AM', 0],
    ],
    pieChartInOptions: {
      title: 'Attendance In',
      is3D: true,
      width: 600,
      height: 400,
    },
    pieChartOutOptions: {
      title: 'Attendance Out',
      is3D: true,
      width: 600,
      height: 400,
    },
    count: [],
    users: [],
    user_logins: []
  }),
  computed: {
    organizationId() {
      return this.$auth.$state.user ? 
        (this.$auth.$state.user.companies.length ? 
          this.$auth.$state.user.companies[0].id
          : this.$store.getters['settings/organization'].value)
        : ''
    },
  },
  components: {
    Logo,
    VuetifyLogo
  },
  async mounted() {
    this.time_zone = this.organization.time_zone
    this.currentMoment = await this.getCurrentMoment()
    let date = this.currentMoment.format("YYYY-MM-DD")
    let count = await this.$axios.get(`/count?date=${date}`);
    this.count = count.data.count
    this.fields = [
      { 
        color: 'purple', 
        name: 'Registered Employees', 
        value: this.count.employees, 
        to: `/organizations/${this.organizationId}/employees`
      },
      { 
        color: 'green', 
        name: 'Active Employees', 
        value: this.count.activeEmployees, 
        to: `/user-logins`
      },
      { 
        color: 'red', 
        name: 'Present Employees', 
        value: this.count.presentEmployees, 
        to: `/organizations/${this.organizationId}/application-approvals`
      },
      { 
        color: 'indigo', 
        name: 'Absent Employees', 
        value: this.count.absentEmployees, 
        to: `/organizations/${this.organizationId}/application-approvals`
      },
      { 
        color: 'teal', 
        name: 'Employees on Leave', 
        value: this.count.employeesOnLeave, 
        to: `/organizations/${this.organizationId}/application-approvals`
      },
      { 
        color: 'cyan', 
        name: 'Leave Applications', 
        value: this.count.leaveApplication, 
        to: `/organizations/${this.organizationId}/application-approvals`
      },
      { 
        color: 'orange', 
        name: 'Leave Approved',
        value: this.count.leaveApproval, 
        to: `/organizations/${this.organizationId}/application-approvals`
      },
      { 
        color: 'green', 
        name: 'Leave Rejected', 
        value: this.count.leaveRejected, 
        to: `/organizations/${this.organizationId}/application-approvals`
      }
    ]
    this.fetchLogins()
  },
  methods: {
    async fetchLogins() {
      this.user_logins = []
      let date = this.currentMoment.format("YYYY-MM-DD")
      this.users = await this.$axios.get(`/user_attendances?searchDate=${date}`);

      this.users = this.users.data.data.filter(user => user.active == 1)
      await this.users.forEach(async (user, i) => {
        let duration = await this.getDuration(user.user_attendances.length ? user.user_attendances[0].login_time : '', user.user_attendances.length ? user.user_attendances[0].logout_time : '')
        this.user_logins.push({
          login_time: user.user_attendances.length ? user.user_attendances[0].login_time : '',
          logout_time: user.user_attendances.length ? user.user_attendances[0].logout_time : '',
          duration: duration
        })
      })

      this.getLoginChart()
      this.getLogoutChart()
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

      // format a string result
      return moment.utc(+d).format('HH:mm:ss')
    },
    async getCurrentMoment() {
      this.currentTimeStamp = await this.getCurrentTimeStamp()
      return moment.utc(this.currentTimeStamp).tz(this.time_zone)
    },
    async getCurrentTimeStamp() {
      let timeStampJson = await this.$axios.get('http://worldclockapi.com/api/json/utc/now')
      return timeStampJson.data.currentDateTime
    },
    getLoginChart() {
      let loginTimeCount = 0
      let compareTime1 = moment.utc("09:00:00", 'HH::mm:ss')
      let loginTime1Count = 0
      let compareTime2 = moment.utc("10:00:00", 'HH::mm:ss')
      let loginTime2Count = 0
      let compareTime3 = moment.utc("11:00:00", 'HH::mm:ss')
      let loginTime3Count = 0
      this.user_logins.forEach(user => {
        if(user.login_time) {
          let login_time = moment.utc(user.login_time, 'HH:mm:ss')
          if(login_time.isSameOrBefore(compareTime1))
            loginTimeCount++;
          if(login_time.isSameOrAfter(compareTime1) && login_time.isSameOrBefore(compareTime2))
            loginTime1Count++;
          if(login_time.isSameOrAfter(compareTime2) && login_time.isSameOrBefore(compareTime3))
            loginTime2Count++;
          if(login_time.isSameOrAfter(compareTime3))
            loginTime3Count++;
        }
      })
      this.pieChartInData = [
        ['Time', 'Count'],
        ['Before 9.00 AM', loginTimeCount],
        ['9.00 - 10.00 AM', loginTime1Count],
        ['10.00 - 11.00 AM',  loginTime2Count],
        ['After 11.00 AM', loginTime3Count],
      ]
    },
    getLogoutChart() {
      let logoutTimeCount = 0
      let compareTime1 = moment.utc("16:00:00", 'HH::mm:ss')
      let logoutTime1Count = 0
      let compareTime2 = moment.utc("17:00:00", 'HH::mm:ss')
      let logoutTime2Count = 0
      let compareTime3 = moment.utc("18:00:00", 'HH::mm:ss')
      let logoutTime3Count = 0
      this.user_logins.forEach(user => {
        if(user.logout_time) {
          let logout_time = moment.utc(user.logout_time, 'HH:mm:ss')
          if(logout_time.isSameOrBefore(compareTime1))
            logoutTimeCount++;
          if(logout_time.isSameOrAfter(compareTime1) && logout_time.isSameOrBefore(compareTime2))
            logoutTime1Count++;
          if(logout_time.isSameOrAfter(compareTime2) && logout_time.isSameOrBefore(compareTime3))
            logoutTime2Count++;
          if(logout_time.isSameOrAfter(compareTime3))
            logoutTime3Count++;
        }
      })
      this.pieChartOutData = [
        ['Time', 'Count'],
        ['Before 4.00 AM', logoutTimeCount],
        ['4.00 - 5.00 AM', logoutTime1Count],
        ['5.00 - 6.00 AM',  logoutTime2Count],
        ['After 6.00 AM', logoutTime3Count],
      ]
    }
  }
}
</script>
