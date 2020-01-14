<template>
  <section>
    <span class="title">Manage Units</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/units/create`"
      :color="baseColor"
      title="Add New Unit"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="units"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.first_name }}</td>
        <td>{{ props.item.imei_number }}</td>
        <td>{{ props.item.device_id }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/units/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
          <nuxt-link :to="`/organizations/${organization.value}/units/${props.item.id}/data`">
            <v-btn 
              :color="baseColor"
              :dark="darkStatus"
            >
              View Data
            </v-btn>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageUnits',
  async asyncData({$axios, params}) { 
    let units = await $axios.get(`/units`);
    return {
      units: units.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      { text: 'Name', align: 'left', sortable: false, value: 'name' },
      { text: 'IMEI Number', value: 'imei_number' },
      { text: 'Device ID', value: 'device_id' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>