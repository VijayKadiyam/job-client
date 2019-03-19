<template>
  <section>
    <span class="title">Manage Transport Modes</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/transport-modes/create`"
      :color="baseColor"
      title="Add New Transport Mode"
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
          <nuxt-link :to="`/organizations/${organization.value}/transport-modes/${props.item.id}`">
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
    let transport_modes = await $axios.get(`transport_modes`);
    console.log(transport_modes)
    return {
      modes: transport_modes.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Transport Mode',
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