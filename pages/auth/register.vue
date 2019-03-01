<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Register</v-toolbar-title>
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
              <v-text-field 
                :error-messages="errors.password"
                id="password" 
                prepend-icon="lock" 
                name="password" 
                label="Password" 
                v-model="form.password"
                type="password"></v-text-field>
              <v-text-field
                id="password_confirmation" 
                prepend-icon="lock_open" 
                name="password_confirmation" 
                label="Confirm Password" 
                v-model="form.password_confirmation"
                type="password"></v-text-field>
              <v-select
                :error-messages="errors.role_id"
                v-model="form.role_id"
                :items="roles"
                label="Role"
              ></v-select>
              <v-select
                :error-messages="errors.organization_id"
                v-model="form.organization_id"
                :items="organizations"
                label="Organization"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="register" :color="baseColor">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
export default {
  middleware: 'guest',
  auth: false,
  name: 'Register',
  async asyncData({$axios}) {
    let organizations = await $axios.get('/companies');
    organizations = organizations.data.data.map(organization => ({
      'text': organization.name,
      'value': organization.id 
    }));
    let roles = await $axios.get('/roles');
    roles = roles.data.data.map(role => ({
      'text': role.name,
      'value': role.id 
    }));
    return {
      organizations: organizations,
      roles: roles
    }
  },
  data: () => ({
    form: {
      name: '',
      email: '',
      password: '',
      role_id: '',
      organization_id: ''
    }
  }),
  methods: {
    async register() {
      let user  = await this.$axios.post('/register', this.form)
      user = user.data.data
      // await this.$auth.login({data: this.form})
      // Assign Role
      let role_payload = {
        user_id: user.id,
        role_id: this.form.role_id
      }
      await this.$axios.post('/assign_roles', role_payload)
      // Assign Organization
      let organization_payload = {
        user_id: user.id,
        organization_id: this.form.organization_id
      }
      await this.$axios.post('/assign_organizations', organization_payload)
      // Logged in again to get role and organization in the user json
      // await this.$auth.login({data: this.form})
      this.$router.push('/auth/login')
    }
  }
}
</script>