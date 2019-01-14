<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :height="baseHeight" :color="baseColor">
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
                type="password_confirmation"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="register" :color="baseColor">Register</v-btn>
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
  data: () => ({
    form: {
      name: '',
      email: '',
      password: ''
    }
  }),
  methods: {
    async register() {
      await this.$axios.post('/register', this.form)
      await this.$auth.login({data: this.form})
      this.$router.push({name: 'dashboard'})
    }
  }
}
</script>