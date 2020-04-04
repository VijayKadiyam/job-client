<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Job"
      :link="`/organizations/${organization.value}/jobs`"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Update Job</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
              <v-form>
               <v-select
                :error-messages="errors.user_id"
                prepend-icon="person"
                v-model="form.user_id"
                :items="users"
                attach
                label="User"
                :color="baseColor"
              ></v-select>
               <v-select
                :error-messages="errors.qualification_id"
                prepend-icon="school"
                v-model="form.qualification_id"
                :items="qualifications"
                attach
                label="Qualification"
                :color="baseColor"
              ></v-select>
              <v-select
                :error-messages="errors.practice_ids"
                prepend-icon="low_priority"
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
                prepend-icon="short_text" 
                name="title" 
                label="Title"
                v-model="form.title" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.highlight"
                prepend-icon="star" 
                name="highlight" 
                label="Highlight"
                v-model="form.highlight" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.no_of_openings"
                prepend-icon="add" 
                name="no_of_openings" 
                label="No Of Openings"
                v-model="form.no_of_openings" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.experience"
                prepend-icon="create" 
                name="experience" 
                label="Experience"
                v-model="form.experience" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.address"
                prepend-icon="room" 
                name="address" 
                label="Address"
                v-model="form.address" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.stipend_start"
                prepend-icon="rotate_right" 
                name="stipend_start" 
                label="Stipend Start"
                v-model="form.stipend_start" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.stipend_end"
                prepend-icon="rotate_left" 
                name="stipend_end" 
                label="Stipend End"
                v-model="form.stipend_end" 
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.department"
                prepend-icon="view_compact" 
                name="department" 
                label="Department"
                v-model="form.department" 
                type="text"
              ></v-text-field>
              <v-text-field 
                :error-messages="errors.max_attempts_in_ca_exam"
                prepend-icon="assignment" 
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
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Job</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'UpdateJob',
  async asyncData({$axios, params}) {
    let job = await $axios.get(`/jobs/${params.id}`)
    job = job.data.data

     job.practice_ids = []
     job.practices.forEach(practice => {
      job.practice_ids.push(practice.id)
    })
     let practices = await $axios.get('/practices');
     practices = practices.data.data.map(practice => ({
      'text': practice.name,
      'value': practice.id 
    }));
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

    return {
      form: job,
      users:users,
      qualifications:qualifications,
      practices: practices
    }
  },
  components: {
    BackButton
  },
  
  mounted() {
    this.form.user_id = parseInt(this.form.user_id)
    this.form.qualification_id = parseInt(this.form.qualification_id)
  },

  methods: {
     async store() {
      this.form.active = 1
      let job = await this.$axios.patch(`/jobs/${this.form.id}`, this.form)
      //skill
       let practice_payload = {
        job_id: job.data.data.id,
        practice_ids: this.form.practice_ids
      }
      //console.log(practice_payload)
      await this.$axios.post('/job_practice', practice_payload)
      this.$router.push(`/organizations/${this.organization.value}/jobs`);
    }
  }
}
</script> 