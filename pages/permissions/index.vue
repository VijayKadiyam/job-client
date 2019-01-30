<template>
  <section>
    <span class="title">Manage Permissions</span>
    <br><br>
    <v-data-table
      :headers="headers"
      :items="items"
      item-key="id"
      :loading="loading"
      class="elevation-1"
      hide-actions
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td 
          v-for="(header, i) in headers.slice(1)"
          :key="i"
        >
          <v-checkbox :color="baseColor" hide-details 
            v-model="selected"
            :value="props.item.id + '' + header.value"
            @click="updatePermission(props.item.id, header.value)"
          ></v-checkbox>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManagePermissions',
  async asyncData({$axios}) { 
    let permissions = await $axios.get('/permissions');
    let roles = await $axios.get('/roles?search=all');
    return {
      permissions: permissions.data.data,
      roles: roles.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Permissions', value: 'permissions' }
    ],
    items: [],
    loading: true,
    selected: [] //This array will define the vmodel of checkbox
  }),
  mounted() {
    this.roles = this.restrictRolesList(this.roles)
    this.roles.forEach(role => {
      this.headers.push({
        text: role.name,
        value: role.id
      })
    });
    this.updateSelected(this.roles);
    // this.permissions = this.restrictPermissions(this.permissions)
    this.permissions.forEach(item => {
      this.items.push({
        id: item.id,
        name: item.name
      })
    });
    this.loading = false
  },
  methods: {
    async updatePermission(rowId, columnId) { // rowId is permission and columnId is role
      // Assign or unassign permission to role
      let permission_payload = {
        role_id: columnId,
        permission_id: rowId,
      }
      if(this.selected.indexOf(rowId + '' + columnId) == -1)
        await this.$axios.post('/assign_permissions', permission_payload)
      else
        await this.$axios.post('/unassign_permissions', permission_payload)
      this.updateSelected();
    },
    async updateSelected() {
      let roles = await this.$axios.get('/roles?search=all');
      this.roles = roles.data.data
      this.roles = this.restrictRolesList(this.roles)
      this.selected = [];
      roles.data.data.forEach(role => {
        role.permissions.forEach(per => {
          this.selected.push(per.id + '' + role.id)
        })
      })
    },
    restrictRolesList(roles) {
      roles = roles.filter(role => role.name != 'Super Admin')
      // roles = roles.filter(role => role.name != 'Admin')
      return roles;
    },
    restrictPermissions(permissions) {
      permissions = permissions.filter(permission => permission.name != 'Manage Organizations')
      permissions = permissions.filter(permission => permission.name != 'Super Admin Settings')
      return permissions;
    }
  }
}
</script>