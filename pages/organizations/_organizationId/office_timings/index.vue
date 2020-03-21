<template>
  <section>
    <span class="title">Manage Office Timings</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/office_timings/create`"
      :color="baseColor"
      title="Add New Office Timing"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="office_timings"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.from }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/office_timings/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageOfficeTiming',
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Office Timing',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Action', value: '' }
    ],
    loading: true,
    office_timings: []
  }),
  async mounted() {
    this.loading = false
   //when pass to url
    let office_timings = await  this.$axios.get(`/users/${this.user.id}/office_timings`)
    this.office_timings = office_timings.data.data
    return {
     office_timings: office_timings.data.data
     }
  }
}
</script>