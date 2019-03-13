<template>
  <section>
    <span class="title">Manage Holidays</span>
    <v-btn
      small
      fab
      to='/holidays/create'
      :color="baseColor"
      title="Add New Batch"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="holidays"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.date }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/holidays/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
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
    return {
      holidays: holidays.data.data
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
      { text: 'Date', value: 'date' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>