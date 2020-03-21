<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Jobs"
      :link="`/organizations/${organization.value}/jobs`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Create Job</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
               <v-select
                :error-messages="errors.user_id"
                v-model="form.user_id"
                :items="users"
                attach
                label="User"
                :color="baseColor"
              ></v-select>
               <v-select
                :error-messages="errors.qualification_id"
                v-model="form.qualification_id"
                :items="qualifications"
                attach
                label="Qualification"
                :color="baseColor"
              ></v-select>
              <v-select
                :error-messages="errors.practice_ids"
                v-model="form.practice_ids"
                :items="practices"
                attach
                chips
                label="Practice"
                multiple
                :color="baseColor"
              ></v-select>
              <v-text-field 
                :error-messages="errors.title"
                prepend-icon="public" 
                name="title" 
                label="Title"
                v-model="form.title" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.highlight"
                prepend-icon="public" 
                name="highlight" 
                label="Highlight"
                v-model="form.highlight" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.no_of_openings"
                prepend-icon="public" 
                name="no_of_openings" 
                label="No Of Openings"
                v-model="form.no_of_openings" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.experience"
                prepend-icon="public" 
                name="experience" 
                label="Experience"
                v-model="form.experience" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.address"
                prepend-icon="public" 
                name="address" 
                label="Address"
                v-model="form.address" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.stipend_start"
                prepend-icon="public" 
                name="stipend_start" 
                label="Stipend Start"
                v-model="form.stipend_start" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.stipend_end"
                prepend-icon="public" 
                name="stipend_end" 
                label="Stipend End"
                v-model="form.stipend_end" 
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.department"
                prepend-icon="public" 
                name="department" 
                label="Department"
                v-model="form.department" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.max_attempts_in_ca_exam"
                prepend-icon="public" 
                name="max_attempts_in_ca_exam" 
                label="Max Attempts In CA Exam"
                v-model="form.max_attempts_in_ca_exam" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.status"
                prepend-icon="public" 
                name="status" 
                label="Status"
                v-model="form.status" 
                type="text"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Create Job</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'CreateJob',
   async asyncData({$axios}) {
    let users = await $axios.get('/users?role_id=3');
    users = users.data.data.map(user => ({
      'text': user.name,
      'value': user.id 
    }));
    let qualifications = await $axios.get('/qualifications');
    qualifications = qualifications.data.data.map(qualification => ({
      'text': qualification.name,
      'value': qualification.id 
    }));
    let practices = await $axios.get('/practices');
    practices = practices.data.data.map(practice => ({
      'text': practice.name,
      'value': practice.id 
    }));
    return {
      users: users,
      qualifications: qualifications,
      practices:practices,
    } 
  },
  data: () => ({
     form: {
      title: '',
      highlight: '',
      no_of_openings: '',
      experience: '',
      address: '',
      stipend_start: '',
      stipend_end:'',
      department: '',
      max_attempts_in_ca_exam: '',
      status: '',
      user_id: '',
      qualification_id: '',
      practice_ids: []
    }
  }),
  components: {
    BackButton
  },
  methods: {
    async store() {
       let job = await this.$axios.post('/jobs', this.form)
      // Assign Job
      let practice_payload = {
        job_id: job.data.data.id,
        practice_ids: this.form.practice_ids
        
      }
      await this.$axios.post('/job_practice', practice_payload)

    
      this.$router.push(`/organizations/${this.organization.value}/jobs`);
  }
}
}
</script> 