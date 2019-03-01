<template>
  <section>
    <span>{{ text }}</span>
    <v-tabs
      v-model="leavePattern"
      centered
      :color="baseColor"
      dark
      icons-and-text
      @change="changeLeavePattern"
    >
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab href="#pattern-1">
        Pattern 1 [Leave Types]
        <v-icon>beach_access</v-icon>
      </v-tab>

      <v-tab href="#pattern-2">
        Pattern 2 [Monthly]
        <v-icon>beach_access</v-icon>
      </v-tab>

      <!-- Pattern 1 -->
      <v-tab-item
        value="pattern-1"
      >
        <v-card flat>
          <v-card-text>
            <pattern1
              :form="form"
              heading="Manage Leave Types"
            ></pattern1>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <!-- Pattern 2 -->
      <v-tab-item
        value="pattern-2"
      >
        <v-card flat>
          <v-card-text>
            <pattern2
              :form="form"
              heading="Manage Leave Types"
            ></pattern2>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </section>
</template>

<script type="text/javascript">
import Pattern1 from '@/components/leave-patterns/pattern-1.vue'  
import Pattern2 from '@/components/leave-patterns/pattern-2.vue'  

export default {
  name: 'ManageLeavePatterns',
  async asyncData({$axios, params}) {
    let company = await $axios.get(`/companies/${params.organizationId}`)
    return {
      company: company.data.data
    }
  },
  data: () => ({
    leavePattern: '',
    form : {
      leave_pattern_id: '',
      company_id: ''
    }
  }),
  computed: {
    text() {
      if(this.form.leave_pattern_id == 1)
        return 'Pattern 1 Selected'
      else
        return 'Pattern 2 Selected'
    }
  },
  components: {
    Pattern1, Pattern2
  },
  created() {
    this.company.leave_patterns.length ? this.form.leave_pattern_id = this.company.leave_patterns[0].id : ''
    if(this.form.leave_pattern_id == 1)
      this.leavePattern = 'pattern-1'
    else
      this.leavePattern = 'pattern-2'

    this.form.company_id = this.organization.value
  },
  methods: {
    async changeLeavePattern() {
      if(this.leavePattern == 'pattern-1')
        this.form.leave_pattern_id = 1
      else
        this.form.leave_pattern_id = 2

      //Company Leave Pattern
      let company_leave_pattern = {
        leave_pattern_id: this.form.leave_pattern_id,
        company_id: this.form.company_id
      }
      await this.$axios.post('/company_leave_pattern', company_leave_pattern)
    }
  }
}
</script>