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
  mounted() {
    this.fields = [
      { color: 'purple', name: 'Registered Employees', value: '20', to: `/organizations/${this.organizationId}/employees`},
      { color: 'green', name: 'Active Employees', value: '3', to: `/user-logins`},
      { color: 'red', name: 'Present Employees', value: '0', to: `/organizations/${this.organizationId}/application-approvals`},
      { color: 'indigo', name: 'Absent Employees', value: '0', to: `/organizations/${this.organizationId}/application-approvals`},
      { color: 'teal', name: 'Employees on Leave', value: '0', to: `/organizations/${this.organizationId}/application-approvals`},
      { color: 'cyan', name: 'Leave Applications', value: '0', to: `/organizations/${this.organizationId}/application-approvals`},
      { color: 'orange', name: 'Leave Approved', value: '0', to: `/organizations/${this.organizationId}/application-approvals`},
      { color: 'green', name: 'Leave Rejected', value: '0', to: `/organizations/${this.organizationId}/application-approvals`}
    ]
  }
}
</script>
