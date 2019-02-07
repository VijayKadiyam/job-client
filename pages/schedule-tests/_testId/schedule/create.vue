<template>
  <v-container fluid fill-height>
    <back-button 
      title="Go Back To Tests"
      link="/schedule-tests"
    ></back-button>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>Schedule a test</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              Test Reference: <b>{{ test.name }}</b>
              <v-text-field 
                :error-messages="errors.name"
                prepend-icon="card_membership" 
                name="name" 
                label="Test Name"
                v-model="form.name" 
                type="text"
              ></v-text-field>
              <!-- Start Date -->
              <v-menu
                ref="startDateMenu"
                :close-on-content-click="false"
                v-model="startDateMenu"
                :nudge-right="40"
                :return-value.sync="form.start_date"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  :error-messages="errors.start_date"
                  slot="activator"
                  v-model="form.start_date"
                  label="Start Date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="form.start_date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.startDateMenu.save(form.start_date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <!-- Start time -->
              <v-menu
                ref="startTimeMenu"
                :close-on-content-click="false"
                v-model="startTimeMenu"
                :nudge-right="40"
                :return-value.sync="form.start_time"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  :error-messages="errors.start_time"
                  slot="activator"
                  v-model="form.start_time"
                  label="Start Time"
                  prepend-icon="access_time"
                  readonly
                ></v-text-field>
                <v-time-picker
                  v-if="startTimeMenu"
                  v-model="form.start_time"
                  full-width
                  :color="baseColor" 
                  :header-color="baseColor"
                >
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="startTimeMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.startTimeMenu.save(form.start_time)">OK</v-btn>
                </v-time-picker>
              </v-menu>
              <!-- End Date -->
              <v-menu
                ref="endDateMenu"
                :close-on-content-click="false"
                v-model="endDateMenu"
                :nudge-right="40"
                :return-value.sync="form.end_date"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <v-text-field
                  :error-messages="errors.end_date"
                  slot="activator"
                  v-model="form.end_date"
                  label="End Date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="form.end_date" no-title scrollable
                  :min="form.start_date"
                >
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="endDateMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.endDateMenu.save(form.end_date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <!-- End time -->
              <v-menu
                ref="endTimeMenu"
                :close-on-content-click="false"
                v-model="endTimeMenu"
                :nudge-right="40"
                :return-value.sync="form.end_time"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  :error-messages="errors.end_time"
                  slot="activator"
                  v-model="form.end_time"
                  label="End Time"
                  prepend-icon="access_time"
                  readonly
                ></v-text-field>
                <v-time-picker
                  v-if="endTimeMenu"
                  v-model="form.end_time"
                  full-width
                  :color="baseColor" 
                  :header-color="baseColor"
                >
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="endTimeMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.endTimeMenu.save(form.end_time)">OK</v-btn>
                </v-time-picker>
              </v-menu>
              <v-select
                :error-messages="errors.batch_ids"
                v-model="form.batch_ids"
                :items="batches"
                attach
                chips
                label="Batch"
                multiple
                :color="baseColor"
              ></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Schedule Test</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'ScheduleTest',
  async asyncData({$axios, params}) {
    let test = await $axios.get(`/tests/${params.testId}`);
    let batches = await $axios.get('/batches')
    batches = batches.data.data.map(batch => ({
      'text': batch.name,
      'value': batch.id 
    }));
    return {
      test: test.data.data,
      batches: batches
    }
  },
  data: () => ({
    form: {
      name: '',
      start_date: new Date().toISOString().substr(0, 10),
      start_time: '',
      end_date: '',
      end_time: '',
      batch_ids: []
    },
    startDateMenu: false,
    startTimeMenu: false,
    endDateMenu: false,
    endTimeMenu: false
  }),
  components: {
    BackButton
  },
  mounted() {
  },
  methods: {
    async store() {
      let test = await this.$axios.post(`/tests/${this.$route.params.testId}/scheduled_tests`, this.form);
      test = test.data.data
      // Assign Batch
      let batch_payload = {
        scheduled_test_id: test.id,
        batch_ids: this.form.batch_ids
      }
      await this.$axios.post('/assign_batch_to_scheduled_tests', batch_payload)
      this.$router.push('/scheduled-tests');
    }
  }
}
</script>