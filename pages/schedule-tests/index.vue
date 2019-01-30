<template>
  <section>
    <span class="title">Schedule Test</span>
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
            :to="`tests/${props.item.id}`"
          >
            {{ props.item.name }}
          </nuxt-link>
        </td>
        <td>{{ props.item.test_pattern }}</td>
        <td class="text-xs-left">{{ props.item.duration }}</td>
        <td class="text-xs-left">{{ props.item.description }}</td>
        <td class="text-xs-left">{{ props.item.instructions }}</td>
        <td class="text-xs-left">{{ props.item.created_at }}</td>
        <td class="text-xs-left">
          <v-btn small
            :color="baseColor"
            :dark="darkStatus"
            :to="`schedule-tests/${props.item.id}/schedule/create`"
          >
            <v-icon>add</v-icon>
            Schedule
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageTests',
  async asyncData({$axios}) { 
    let tests = await $axios.get('/tests');
    return {
      tests: tests.data.data
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
      { text: 'Duration', value: 'duration' },
      { text: "Test Description", value: 'description' },
      { text: "Test Instructions", value: 'instructions' },
      { text: 'Created Date', value: 'created_at' },
      { text: 'Action', value: '' }
    ],
    loading: true,
    items: []
  }),
  mounted() {
    this.tests.forEach(item => {
      this.items.push({
        id: item.id,
        name: item.name,
        test_pattern: item.test_pattern.name,
        duration: item.duration + ' minutes',
        description: item.description,
        instructions: item.instructions,
        created_at: item.created_at
      })
    })
    this.loading = false
  }
}
</script>