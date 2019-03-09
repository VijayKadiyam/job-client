<template>
  <section>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">
            <u>Monthly Report</u> <v-btn flat color="orange">Export</v-btn>
          </h3>

          <v-container
            id="scroll-target"
            style="max-height: 600px"
            class="scroll-y"
          >
            <v-data-table
              :headers="headers"
              :items="monthly_user_attendances"
              :loading="loading"
              class="elevation-1"
              hide-actions
              style="height: 500px"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.date }}</td>
                <td>{{ props.item.login_time }}</td>
                <td></td>
                <td>{{ props.item.logout_time }}</td>
              </template>
            </v-data-table>
          </v-container>
          
        </div>
      </v-card-title>
    </v-card>
  </section>
</template>

<script type="text/javascript">
import moment from 'moment'

export default {
  name: 'MonthlyAttendance',
  data: () => ({
    headers: [
      {
        text: 'Date',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Start', value: 'phone' },
      { text: 'Break', value: 'phone' },
      { text: 'End', value: 'phone' }
    ],
    loading: true,
    monthly_user_attendances: []
  }),
  async created() {
    let month = moment(new Date()).format("MM")
    let attendances = await this.$axios.get(`user_attendances?month=${month}`)
    this.monthly_user_attendances = attendances.data.data

    this.loading = false
    // console.log(this.monthly_user_attendances);
  },
  methods: {
    onScroll (e) {}
  }
}  
</script>