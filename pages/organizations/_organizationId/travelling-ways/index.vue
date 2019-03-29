<template>
  <section>
    <span class="title">Manage Travelling Ways</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/travelling-ways/create`"
      :color="baseColor"
      title="Add New Travelling Way"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="modes"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/travelling-ways/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageTransportModes',
  async asyncData({$axios, params}) { 
    let travelling_ways = await $axios.get(`travelling_ways`);
    return {
      modes: travelling_ways.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Travelling Ways',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Action', value: '' },
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>