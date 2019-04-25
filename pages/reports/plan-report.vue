<template>
  <section>
    <span class="title">Plan Report</span>
    <v-layout row wrap>
      <v-flex md3>
        <v-autocomplete
          v-model="user_id"
          :items="users"
          item-text="text"
          label="Select Employee"
          @input="fetchPlans"
        ></v-autocomplete>
      </v-flex>
      <v-flex md3 pl-3>
        <v-select
          v-model="month"
          :items="months"
          label="Select Month"
          @input="fetchPlans"
        ></v-select>
      </v-flex>
      Grand Total : {{ grand_total }}
    </v-layout>
    <no-ssr>
      <download-excel
        :title = "title"
        class   = "btn btn-default"
        :data   = "json_data"
        :fields = "json_fields"
        worksheet = "Territory Sales Incharge PJP and Expense Statement"
        name    = "PlanReport.xls"
      >
        <a href="#" class="download">export to excel</a>
      </download-excel>
    </no-ssr>
    <v-data-table
      :headers="headers"
      :items="json_data"
      :loading="loading"
      class="elevation-1"
      hide-actions
      disable-initial-sort
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.date }}</td>
        <td>{{ props.item.day }}</td>
        <td>{{ props.item.plan }}</td>
        <td>
          {{ props.item.status }}
          <v-btn
            v-if="props.item.date != null"
            flat
            small
            color="blue"
            @click.stop="props.item.receiptDialog = true"
          >
            Receipt
          </v-btn>

          <v-dialog
            v-model="props.item.receiptDialog"
            max-width="290"
          >
            <v-card>
              <v-card-text>
                <h3>Receipt Details</h3>
                <table>
                  <tbody>
                    
                  </tbody>
                </table>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="props.item.receiptDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
        <td>{{ props.item.details }}</td>
        <td>{{ props.item.from }}</td>
        <td>{{ props.item.to }}</td>
        <td>{{ props.item.km }}</td>
        <td>{{ props.item.way }}</td>
        <td>{{ props.item.fare }}</td>
        <td>{{ props.item.stay }}</td>
        <td>{{ props.item.allowance_amount }}</td>
        <td>{{ props.item.others_amount }}</td>
        <td>{{ props.item.others }}</td>
        <td>{{ props.item.total }}</td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">

import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'PlanReports',
  async asyncData({$axios}) { 
    let users = await $axios.get('/users?search=all');
    let rawUsers = users.data.data
    users = users.data.data.map(user => ({
      'text': user.name,
      'value': user.id
    }))
    return {
      users: users,
      rawUsers: rawUsers
    }
  },
  data: () => ({
    user_id: '',
    loading: false,
    headers: [
      {
        text: 'Date',
        align: 'left',
        sortable: true,
        value: 'date'
      },
      { text: 'Day', value: 'day' },
      { text: 'Plan', value: 'plan' },
      { text: 'Actual Visited', value: 'status' },
      { text: 'Reason for not as per PJP', value: 'details' },
      { text: 'From', value: 'from' },
      { text: 'To', value: 'to' },
      { text: 'Kms Distance', value: 'km' },
      { text: 'One Way or Up/Down', value: 'way' },
      { text: 'Ticket Fare Rs.', value: 'fare' },
      { text: 'Night Stay Town Name', value: 'stay' },
      { text: 'Daily Allowance Rs.', value: 'allowance_amount' },
      { text: 'Others Amount', value: 'others_amount' },
      { text: 'Others Description', value: 'others' },
      { text: 'Total', value: 'total' },
    ],
    plans: [],
    vouchers: [],
    json_fields: {
      'Date': 'date',
      'Day': 'day',
      'Plan': 'plan',
      'Actual Visited': 'status',
      'Reason for not as per PJP': 'details',
      'From': 'from',
      'To': 'to',
      'Kms Distance': 'km',
      'One Way or Up/Down': 'way',
      'Ticket Fare Rs.': 'fare',
      'Night Stay Town Name': 'stay',
      'Daily Allowance Rs.': 'allowance_amount',
      'Others Amount': 'others_amount',
      'Others Description': 'others',
      'Total': 'total'
    },
    json_data: [],
    json_meta: [
      [
        {
          'key': 'charset',
          'value': 'utf-8'
        }
      ]
    ],
    months: [],
    month: '',
    grand_fare: 0,
    grand_allowance: 0,
    grand_others: 0,
    grand_total: 0,
    title: ''
  }),
  created() {
    let months = moment.months();
    for(let i = 0; i < months.length ; i++) {
      this.months.push({
        'text': months[i],
        'value': '0' + (i + 1)
      })
    }
  },
  methods: {
    async fetchPlans() {
      if(this.month == '' || this.user_id == '')
        return;

      this.plans = await this.$axios.get(`/plans?user_id=${this.user_id}&month=${this.month}`);
      this.plans = this.plans.data.data

      this.vouchers = await this.$axios.get(`/vouchers?user_id=${this.user_id}&month=${this.month}`);
      this.vouchers = this.vouchers.data.data

      this.grand_fare = 0
      this.grand_allowance = 0
      this.grand_others = 0
      this.grand_total = 0
      let fare = 0
      let allowance_amount = 0
      let total = 0

      this.json_data = []
      let user = this.rawUsers.find(user => user.id == this.user_id)
      let month = this.months.find(month => month.value == this.month)
      // this.title = 'Name:' + user.text + ' | Agency Name: PMS | Month: '
      this.title = [
        'Territory Sales Incharge PJP and Expense Statement',
        'TSI Name:- ' +  user.name + ' | Agency Name:- Pousse Management Services Pvt. Ltd. | ',
        'TSI UID:- ' + user.uid_no + ' | Month/Year:- ' + month.text + '2019',
        'HO Town Name:-',
        'SE Name:- ' + (user.supervisors.length ? user.supervisors[0].name : ''),
        'ASM Area:- ' + user.asm_area
      ]

      var j = 0;
      let dateCount = j + 1
      this.plans.forEach(plan => {
        fare = plan.plan_travelling_details.length ? plan.plan_travelling_details[0].fare : 0
        allowance_amount = plan.allowance_type ? plan.allowance_type.amount : 0
        total = parseInt(fare) + parseInt(allowance_amount)
        this.grand_fare += fare
        this.grand_allowance += allowance_amount
        this.grand_total += total

        let date = (moment.utc(plan.date, "YYYY-MM-DD")).format('D')
        let day = (moment.utc(plan.date, "YYYY-MM-DD")).format('dddd')

        // TO print emply serials
        if(date != j + 1) {
          while(date != dateCount) {
            this.json_data.push({
              date: dateCount
            })
            dateCount++
          }
        }

        this.json_data.push({
          sr_no: j + 1,
          user: plan.user.name,
          date: date,
          day: day,
          plan: plan.plan,
          status: plan.plan_actuals.length ? (plan.plan_actuals[0].status == 1) ? 'Visited' : 'Not Visited' : '',
          details: plan.plan_actuals.length ? plan.plan_actuals[0].details : '',
          from : plan.plan_travelling_details.length ? plan.plan_travelling_details[0].from : '',
          to : plan.plan_travelling_details.length ? plan.plan_travelling_details[0].to : '',
          km : '-',
          way: plan.plan_travelling_details.length ? plan.plan_travelling_details[0].travelling_way.name : '',
          fare: fare,
          allowance_amount: allowance_amount,
          total: total,
          receiptDialog: false
        })
        j++
        dateCount++
      })

      this.fetchVouchers(j)

      this.json_data.push({
        fare: this.grand_fare,
        allowance_amount: this.grand_allowance,
        others_amount: this.grand_others,
        others: 'Exp. Total',
        total: this.grand_total
      })
    },
    fetchVouchers(j) 
    {
      this.vouchers.forEach((voucher, i) => {
        this.grand_total += voucher.amount
        this.grand_others += voucher.amount
        this.json_data[i].others = voucher.voucher_type.name
        this.json_data[i].others_amount = voucher.amount
        this.json_data[i].total = this.json_data[i].total + voucher.amount
        // this.json_data.push({
        //   sr_no: j + 1,
        //   details: voucher.voucher_type.name,
        //   total: voucher.amount
        // })
        // j++
      })
    }
  }
}
</script>