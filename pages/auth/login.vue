<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title >Login</v-toolbar-title>
          </v-toolbar>
          
          <v-card-text>
            <v-form>
              <v-text-field 
                :error-messages="errors.email"
                prepend-icon="email" 
                name="email" 
                label="Email" 
                v-model="form.email"
                type="text"></v-text-field>
              <v-text-field 
                :error-messages="errors.password"
                id="password" 
                prepend-icon="lock" 
                name="password" 
                label="Password" 
                v-model="form.password"
                type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="login" :color="baseColor">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
export default {
  name: 'Login',
  middleware: 'guest',
  auth: false,
  data: () => ({
    form: {
      email: '',
      password: ''
    }
  }),
  methods: {
    async login() {
      await this.$axios.post('/login', this.form)
      await this.$auth.login({data: this.form})
      this.$router.push({name: 'dashboard'})
    }
  }
}
</script>