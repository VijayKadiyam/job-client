<template>
  <section>
    <span class="title">Manage Branches</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/branches/create`"
      :color="baseColor"
      title="Add New Branch"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="branches"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/branches/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageBranches',
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Branch Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Action', value: '' }
    ],
    loading: true,
    branches: []
  }),
  async mounted() {
    this.loading = false
//when pass to url
    let branches = await  this.$axios.get(`/users/${this.user.id}/branches`)
    this.branches = branches.data.data
    return {
     branches: branches.data.data
     }
  }
}
</script>