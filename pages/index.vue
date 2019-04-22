<template>
  <section>
    <div
      id="e3"
      style="margin: auto;"
      class="grey lighten-3"
    >
    
      <v-card>
        <v-container
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
          :data="pieChartData"
          :options="pieChartInOptions"
        />
      </v-flex>
      <v-flex xs6>
        <GChart
          type="PieChart"
          :data="pieChartData"
          :options="pieChartOutOptions"
        />
      </v-flex>
      <v-flex xs12>
        <GChart
          type="ColumnChart"
          :data="chartData"
          :options="chartOptions"
        />
      </v-flex>
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
    pieChartData: [
      ['Task', 'Hours per Day'],
      ['Work',     11],
      ['Eat',      2],
      ['Commute',  2],
      ['Watch TV', 2],
      ['Sleep',    7]
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
    count: []
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
    console.log(count.data.count);
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
  },
  methods: {
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
