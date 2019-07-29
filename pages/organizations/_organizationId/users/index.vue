<template>
  <section>
    <span class="title">Manage Users</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/users/create`"
      :color="baseColor"
      title="Add New Employee"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
    <v-checkbox :color="baseColor" hide-details 
      v-model="checkDeleted"
      value="checkedDeleted"
      label="Add deleted employees data"
      @change="updateList"
    ></v-checkbox>
    <v-data-table
      :headers="headers"
      :items="employees"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.email }}<br>{{ props.item.phone }}</td>
        <td>{{ props.item.can_send_email == 1 ? 'Yes' : 'No' }}</td>
        <td>{{ props.item.active == 1 ? 'ACTIVE' : 'IN ACTIVE' }}</td>
        <td class="text-xs-left">
          <v-layout row wrap>
            <v-flex xs12 sm3>
              <nuxt-link :to="`/organizations/${organization.value}/users/${props.item.id}`">
                <v-btn flat icon 
                  :color="baseColor"
                  :dark="darkStatus">
                  <v-icon>edit</v-icon>
                </v-btn>
              </nuxt-link>
            </v-flex>
            <v-flex xs12 sm3 pl-2>
              <v-btn flat icon color="pink" @click.stop="props.item.dialogDelete = true">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>

          <v-dialog
            v-model="props.item.dialogDelete"
            max-width="290"
          >
            <v-card>
              <v-card-title class="headline">Delete User?</v-card-title>

              <v-card-text>
                Are you sure you want to delete the user.
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="props.item.dialogDelete = false"
                >
                  Cancel
                </v-btn>

                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="deleteUser(props.item.id)"
                >
                  Yes
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageEmployees',
  async asyncData({$axios, params}) { 
    let employees = await $axios.get(`/users?role_id=3`);
    employees = employees.data.data
    employees = employees.filter(employee => employee.active == 1)
    let emp = [];
    employees.forEach(employee => {
      employee.dialogDelete = false
      emp.push(employee)
    })
    return {
      employees: emp,
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Email/Phone', value: 'phone' },
      { text: 'Can Send Email', value: 'can_send_email' },
      { text: 'Status', value: 'active' },
      { text: 'Action', value: '' }
    ],
    loading: true,
    dialogDelete: false,
    checkDeleted: null
  }),
  mounted() {
    this.loading = false
  },
  methods: {
    async deleteUser(userId) {
      let employee = await this.$axios.get(`users/${userId}`)
      employee = employee.data.data
      employee.active = "0"
      employee = await this.$axios.patch(`/users/${userId}`, employee)
      this.dialogDelete = false
      this.updateList()
    },
    async updateList(){
      this.loading = true
      if(this.checkDeleted == "checkedDeleted") {
        let employees = await this.$axios.get(`/users?role_id=3`);
        this.employees = employees.data.data
      } else {
        let employees = await this.$axios.get(`/users?role_id=3`);
        employees = employees.data.data
        this.employees = employees.filter(employee => employee.active == 1)
      }
      this.loading = false
    }
  }
}
</script>