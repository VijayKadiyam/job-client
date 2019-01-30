<template>
  <section>
    <span class="title">Manage Students</span>
    <v-btn
      small
      fab
      to='/students/create'
      :color="baseColor"
      title="Add New Student"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="students"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">{{ props.item.email }}</td>
        <td class="text-xs-left">{{ props.item.phone }}</td>
        <td class="text-xs-left">
          <v-btn small
            :dark="darkStatus"
            :color="baseColor"
            :to="`/students/${props.item.id}/parents/create`"
            v-if="props.item.parents.length == 0"
            title="Add Parent's Details"
          >
            <v-icon>add</v-icon>Add Details
          </v-btn>
          <span
            v-else
          >
            <v-btn fab small
              :dark="darkStatus"
              :color="baseColor"
              :to="`/students/${props.item.id}/parents/${props.item.parents[0].id}`"
              title="Edit Parent's Details"
            >
              <v-icon>edit</v-icon>
            </v-btn>
            {{ props.item.parents[0].name }}
          </span>
        </td>
        <td class="text-xs-left">
          <span v-if="props.item.parents.length != 0">
            {{ props.item.parents[0].phone }}
          </span>
        </td>
        <td class="text-xs-left">
          <span v-if="props.item.parents.length != 0">
            {{ props.item.parents[0].email }}
          </span>
        </td>
        <td class="text-xs-left">{{ !props.item.batches || props.item.batches[0].name  }}</td>
        <td class="text-xs-left">
          Student: 
          <span v-if="props.item.active == 0" style="color: red;">Inactive</span>
          <span v-else style="color: green">Active</span>
          <br>
          <span v-if="props.item.parents.length != 0">
            Parent: 
            <span v-if="props.item.parents[0].active == 0" style="color: red;">Inactive</span>
            <span v-else style="color: green">Active</span>
          </span>
        </td>
        <td class="text-xs-left">
          <nuxt-link :to="`/students/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageStudents',
  async asyncData({$axios}) { 
    let students = await $axios.get('/students');
    return {
      students: students.data.data
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
      { text: 'Email', value: 'email' },
      { text: 'Phone', value: 'phone' },
      { text: "Parent's Name", value: 'parent_name' },
      { text: "Parent's Email", value: 'parent_email' },
      { text: "Parent's Phone", value: 'parent_phone' },
      { text: 'Batch', value: 'batch' },
      { text: 'Status', value: 'status' },
      { text: 'Action', value: '' }
    ],
    loading: true
  }),
  mounted() {
    this.loading = false
  }
}
</script>