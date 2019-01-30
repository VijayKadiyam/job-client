<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Staffs"
      link="/staffs"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Add a new staff</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.name"
                prepend-icon="person" 
                name="name" 
                label="Name"
                v-model="form.name" 
                type="text"></v-text-field>
              <v-text-field 
                :error-messages="errors.email"
                prepend-icon="email" 
                name="email" 
                label="Email" 
                v-model="form.email"
                type="text"></v-text-field>
              <v-text-field 
                :error-messages="errors.phone"
                prepend-icon="phone" 
                name="phone" 
                label="Phone" 
                v-model="form.phone"
                type="number"></v-text-field>
              <v-select
                :error-messages="errors.role_id"
                v-model="form.role_id"
                :items="roles"
                label="Role"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create Staff</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'EditStaff',
  async asyncData({$axios, params}) {
    let roles = await $axios.get('/roles');
    roles = roles.data.data.map(batch => ({
      'text': batch.name,
      'value': batch.id 
    }));
    return {
      roles: roles
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      phone: '',
      role_id: '',
      organization_id: ''
    }
  }),
  components: {
    BackButton
  },
  mounted() {
    this.form.organization_id = this.organization.value
  },
  methods: {
    async store() {
      let staff = await this.$axios.post(`/users`, this.form)
      // Assign Role
      let role_payload = {
        user_id: staff.data.data.id,
        role_id: this.form.role_id
      }
      await this.$axios.post('/assign_roles', role_payload)
      // Assign Organization
      let organization_payload = {
        user_id: staff.data.data.id,
        organization_id: this.form.organization_id
      }
      await this.$axios.post('/assign_organizations', organization_payload)
      this.$router.push('/staffs')
    }
  }
}
</script>