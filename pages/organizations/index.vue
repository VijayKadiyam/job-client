<template>
  <section>
    <span class="title">Manage Organizations</span>
    <v-btn
      small
      fab
      to='/organizations/create'
      :color="baseColor"
      title="Add New Organization"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <v-btn small
            :dark="darkStatus"
            :color="baseColor"
            :to="`/organizations/${props.item.id}/admins/create`"
            v-if="props.item.users.length == 0"
            title="Add Admin's Details"
          >
            <v-icon>add</v-icon>Add Admin Details
          </v-btn>
          <span
            v-else
          >
            <v-btn fab small
              :dark="darkStatus"
              :color="baseColor"
              :to="`/organizations/${props.item.id}/admins/${props.item.users[0].id}`"
              title="Edit Admin's Details"
            >
              <v-icon>edit</v-icon>
            </v-btn>
            <b>Name: </b>{{ props.item.users[0].name }} | <b>Email: </b>Email: {{ props.item.users[0].email }} | <b>Phone: </b>{{ props.item.users[0].phone }}
          </span>
        </td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${props.item.organizationId}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageOrganizations',
  async asyncData({$axios}) { 
    let organizations = await $axios.get('/companies');
    return {
      organizations: organizations.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Organization Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Admin Details', value: 'admin_details' },
      { text: 'Action', value: '' }
    ],
    items: [],
    loading: true
  }),
  mounted() {
    this.organizations.forEach((org, i) => {
      org.users = org.users.filter(u => u.roles[0].name == 'Admin');
      this.items.push({
        id: i+1,
        organizationId: org.id,
        name: org.name,
        users: org.users
      })
    })
    this.loading = false
  }
}
</script>