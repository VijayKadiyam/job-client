<template>
  <section>
    <span class="title">Tests</span>
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
            :to="`test-papers/${props.item.id}/instructions`"
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
          <v-tooltip top>
            <v-btn small
              slot="activator"
              :color="baseColor"
              :dark="darkStatus"
              :to="`test-papers/${props.item.id}/instructions`"
              title="Best of Luck"
            >
              Take Test &nbsp;
              <v-icon>play_circle_outline</v-icon>
            </v-btn>
            <span>Best of Luck</span>
          </v-tooltip>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageTestPapers',
  async asyncData({$axios}) { 
    let test_papers = await $axios.get('/scheduled_tests');
    return {
      test_papers: test_papers.data.data
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
    this.test_papers.forEach(item => {
      this.items.push({
        id: item.id,
        testId: item.test.id,
        name: item.name,
        test_pattern: item.test.test_pattern.name,
        batches: item.batches.map(b => b.name),
        start_date_time: item.start_date + ' [' + item.start_time + ']',
        end_date_time: item.end_date + ' [' + item.end_time + ']'
      })
    })
    this.loading = false
  }
}
</script>