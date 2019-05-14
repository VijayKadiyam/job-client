<template>
  <section>
    <span class="title">Users Report</span>
     <v-layout row wrap>
      <v-flex md3>
       <v-menu
          ref="fromDateMenu"
          :close-on-content-click="false"
          v-model="fromDateMenu"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <v-text-field
            :error-messages="errors.fromDate"
            slot="activator"
            v-model="fromDate"
            label="From Date"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="fromDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="fromDateMenu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="fetchMonthlyLogins(fromDate, toDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex md3>
       <v-menu
          ref="toDateMenu"
          :close-on-content-click="false"
          v-model="toDateMenu"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <v-text-field
            :error-messages="errors.toDate"
            slot="activator"
            v-model="toDate"
            label="To Date"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="toDate" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="toDateMenu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="fetchMonthlyLogins(fromDate, toDate)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex md3 pl-4>
        <v-autocomplete
          v-model="employee_id"
          :items="employees"
          item-text="text"
          label="Select Employee"
          @input="fetchSingleEmployeeLogins"
        ></v-autocomplete>
      </v-flex>
    </v-layout>
    <no-ssr>
      <download-excel
        title ="Attendance Report"
        class   = "btn btn-default"
        :data   = "json_data"
        :fields = "json_fields"
        worksheet = "User Monthly Report"
        name    = "UserReport.xls"
      >
        <a href="#" class="download">export to excel</a>
      </download-excel>
    </no-ssr>
    <v-data-table
      :headers="headers"
      :items="user_monthly_logins"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}.</td>
        <td v-html="props.item.name"></td>
        <td
          v-for="(login, i) in props.item.monthly_logins"
          :key="`login${i}`"
        >
          {{ login.total_hrs }}
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
import moment from 'moment'
import moment_timezone from 'moment-timezone'

export default {
  name: 'ManageUsersMonthlyLogins',
  data:() =>  ({
    employees: [],
    employee_id: '',
    users: [],
    headers: [],
    loading: true,
    user_monthly_logins: [],
    fetched_user_monthly_logins: [],
    time_zone: '',
    fromDateMenu: false,
    fromDate: '',
    toDateMenu: false,
    toDate: '',
    currentMoment: '',
    json_data: [],
    fetched_json_data: [],
    json_fields: []
  }),
  async mounted() {
    this.time_zone = this.organization.time_zone
    this.currentMoment = await this.getCurrentMoment()

    let employees = await this.$axios.get('/users?search=all');
    this.employees = employees.data.data.map(user => ({
      'text': user.name,
      'value': user.id
    }))
    this.loading = false
  },
  methods: {
    fetchSingleEmployeeLogins(employee_id)
    { 
      this.user_monthly_logins = this.fetched_user_monthly_logins.filter(l => l.id == employee_id)
      this.json_data = this.fetched_json_data.filter(l => l.id == employee_id)
    },
    async fetchMonthlyLogins(fromDate, toDate) {
      this.$refs.fromDateMenu.save(fromDate)
      this.$refs.toDateMenu.save(toDate)
      if(!fromDate | !toDate) {
        return        
      }

      // To get the headers
      this.headers = [
        { text: 'Sr No', value: 'sr_no' },
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
      ]

      // Json Fields
      this.json_fields = {
        'Sr No': 'sr_no',
        'Name': 'name',
      }

      let d = moment(fromDate)
      while(d.format('YYYY-MM-DD') <= toDate) {
        this.headers.push({text: d.format('DD'), value: d.format('DD')})
        this.json_fields['-' + (d.format('DD')).toString()] = (d.format('DD')).toString()
        d = d.add(1, 'days')
      }

      this.loading = true
      this.users = await this.$axios.get(`/user_attendances?fromDate=${this.fromDate}&toDate=${this.toDate}`);
      this.user_monthly_logins = []
      this.json_data = []
      this.users.data.data.forEach((user, i) => {
        this.user_monthly_logins.push({
          'id': user.id,
          'name': user.name,
          'monthly_logins': []
        })

        this.json_data.push({
          'sr_no': i + 1,
          'name': user.name,
          'id': user.id,
        })

        // To get total hours
        let countDate = moment(fromDate)
        user.user_attendances.forEach( (att) => {
          while(countDate.format('YYYY-MM-DD') < att.date) {
            this.user_monthly_logins[i].monthly_logins.push({
              'date': countDate.format('DD'),
              'total_hrs': '-'
            })
            this.json_data[i][(countDate.format('DD')).toString()] = '-'
            countDate = countDate.add(1, 'days')
          }

          let duration = this.getDuration(att.login_time, att.logout_time, att)

          this.user_monthly_logins[i].monthly_logins.push({
            'date': countDate.format('DD'),
            'total_hrs': duration
          })
          this.json_data[i][(countDate.format('DD')).toString()] = duration
          countDate = countDate.add(1, 'days')
        })
      })
      this.fetched_user_monthly_logins = this.user_monthly_logins
      this.fetched_json_data = this.json_data
      this.loading = false
    },
    getDuration(startTime,  endTime, att) {
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
      d.subtract(this.getBreakDuration(att))

      // format a string result
      return moment.utc(+d).format('HH:mm:ss')
    },
    getBreakDuration(att) {
      // this.currentMoment = await this.getCurrentMoment()
      let totalBreakTime = '';
      let d = '';
      att.user_attendance_breaks.forEach((br, i) => {
        let endTime = br.end_time
        if(!br.end_time) {
          endTime = this.currentMoment.format("HH:mm:ss")
        }
        d = this.getMomentDuration(br.start_time, endTime)
        if(i == 0) 
          totalBreakTime = d
        
        else 
          totalBreakTime.add(d)
      })

      this.breakDuration = moment.utc(+totalBreakTime).format('HH:mm:ss')

      return totalBreakTime
    },
    getMomentDuration(startTime, endTime) {
      var start = moment.utc(startTime, "HH:mm:ss")
      var end = moment.utc(endTime, 'HH:mm:ss')
      // calculate the duration
      return moment.duration(end.diff(start));
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