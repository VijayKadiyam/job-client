<template>
  <section>
    <span class="title">Manage Leave Policies</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/leave_policies/create`"
      :color="baseColor"
      title="Add New Leave Policy"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="leave_policies"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.exam }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/leave_policies/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageLeavePolicies',
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'exam',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Action', value: '' }
    ],
    loading: true,
    leave_policies: []
  }),
  async mounted() {
    this.loading = false
//when pass to url
    let leave_policies = await  this.$axios.get(`/users/${this.user.id}/leave_policies`)
    this.leave_policies = leave_policies.data.data
    return {
     leave_policies: leave_policies.data.data
     }
  }
}
</script>