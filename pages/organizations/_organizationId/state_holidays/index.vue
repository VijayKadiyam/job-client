<template>
  <section>
    <span class="title">Select Holidays Applicable</span>
    <v-layout row wrap>
      <v-flex md3>
        <v-select
          v-model="state_id"
          :items="states"
          label="Select State"
          @input="fetchHolidays"
        ></v-select>
      </v-flex>
    </v-layout>
    <br>
    <v-data-table
      v-if="state_id"
      :headers="headers"
      :items="holidays"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <v-checkbox :color="baseColor" hide-details 
            v-model="selected"
            :value="props.item.id"
            @change="saveHoliday(props.item.id)"
          ></v-checkbox>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageHolidays',
  async asyncData({$axios}) { 
    let holidays = await $axios.get('/holidays');
    let states = await $axios.get(`/company_states`);
    states = states.data.data.map(state => ({
      'text': state.name,
      'value': state.id
    }))
    return {
      holidays: holidays.data.data,
      states: states
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Holiday Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Action', value: '' }
    ],
    form: {
      holiday_id: ''
    },
    state_id: '',
    state_holidays: [],
    selected: [],
    loading: true
  }),
  mounted() {
    this.loading = false
  },
  methods: {
    async fetchHolidays() {
      this.state_holidays = await this.$axios.get(`/company_states/${this.state_id}/company_state_holidays`)
      this.selected = []
      if(this.state_holidays.data.data.length) {
        this.selected = this.state_holidays.data.data.map(state_holiday => parseInt(state_holiday.holiday_id))
      }
    },

    async saveHoliday(holidayId) {
      this.form.holiday_id = holidayId
      let index = this.selected.indexOf(holidayId);
      if(index == -1) {
        // console.log('Removed ' + holidayId);
        let state_holiday = this.state_holidays.data.data.find(holiday => holiday.holiday_id == holidayId)
        await this.$axios.delete(`/company_states/${this.state_id}/company_state_holidays/${state_holiday.id}`, this.form)
      }
      else {
        // console.log('Added ' + holidayId);
        await this.$axios.post(`/company_states/${this.state_id}/company_state_holidays`, this.form)
      }
    }
  }
}
</script>