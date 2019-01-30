<template>
  <section>
    <span class="title">Scheduled Tests</span>
    <br><br>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">
          <nuxt-link
            class="links"
            :to="`schedule-tests/${props.item.id}/schedule/${props.item.id}`"
          >
            {{ props.item.name }}
          </nuxt-link>
        </td>
        <td class="text-xs-left">
          {{ props.item.test_pattern }}
        </td>
        <td class="text-xs-left">{{ props.item.batches }}</td>
        <td class="text-xs-left">{{ props.item.start_date_time }}</td>
        <td class="text-xs-left">{{ props.item.end_date_time }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`schedule-tests/${props.item.id}/schedule/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageTests',
  async asyncData({$axios}) { 
    let scheduled_tests = await $axios.get('/scheduled_tests');
    return {
      scheduled_tests: scheduled_tests.data.data
    }
  },
  data:() =>  ({
    headers: [
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Test Pattern', value: 'test_pattern' },
      { text: 'Batches', value: 'batches' },
      { text: "Start Date and Time", value: 'start_date_time' },
      { text: "End Date and Time", value: 'end_date_time' },
      { text: 'Action', value: '' }
    ],
    loading: true,
    items: []
  }),
  mounted() {
    this.scheduled_tests.forEach(item => {
      this.items.push({
        id: item.id,
        name: item.name,
        test_pattern: item.test.test_pattern.name,
        start_date_time: item.start_date + ' [' + item.start_time + ']',
        end_date_time: item.end_date + ' [' + item.end_time + ']'
      })
    })
    this.loading = false
  }
}
</script>