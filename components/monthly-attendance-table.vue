<template>
  <section>
    <v-card>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">
            <u>Monthly Report</u>
          </h3>
          
        </div>
      </v-card-title>

      <v-card-actions>
        <v-btn flat color="orange">Share</v-btn>
        <v-btn flat color="orange">Explore</v-btn>
      </v-card-actions>
    </v-card>
  </section>
</template>

<script type="text/javascript">
import moment from 'moment'

export default {
  name: 'MonthlyAttendance',
  async asyncData({$axios, params}) {

  },
  async mounted() {
    let month = moment(new Date()).format("MM")
    console.log(month);
    
    // await let $user_attendances = this.$route.
  }
}  
</script>