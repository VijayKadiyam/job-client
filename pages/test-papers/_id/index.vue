<template>
  <section>
    <v-layout justify-center align-center row wrap>
      <v-flex md10 sm12 xs12>
          <v-btn>Subjects will come here</v-btn>
      </v-flex>
      <v-flex md2 sm12 xs12 px-2>
        <v-btn block color="red" :dark="darkStatus">Finish Test</v-btn>
      </v-flex>
    </v-layout>

    <br>
    
    <v-layout row wrap>
      <v-flex md10 sm12 xs12 px-2>
        <v-container
          id="scroll-target"
          style="height: 450px; background: white; border: 1px solid #D8D8D8"
          class="scroll-y"
        >
          <v-layout row wrap
            v-scroll:#scroll-target="onScroll"
            column
          >
            <v-flex xs12>
              <b>Question 1:</b>
              <br><br>
              <!-- Question -->
              <div v-html="question_meta.questions[0].detail"></div>
              <br>
              <!-- Options -->
              <v-radio-group v-model="current_question.options">
                <v-layout row wrap>
                  <v-flex xs6
                    v-for="(option, i) in question_meta.questions[0].question_options"
                    :key="`o${i}`"
                  >
                    <v-radio
                      :color="baseColor"
                      :label="`${option.position}.`"
                      :value="option.position"
                    ></v-radio>
                    <div v-html="option.option"></div>
                    <br>
                  </v-flex>
                </v-layout>
              </v-radio-group>
            </v-flex>
          </v-layout>
        </v-container>
        <!-- Action Buttons -->
        <v-layout justify-center row wrap>
          <v-flex md2 sm6 xs6 pr-1>
            <v-btn block color="blue-grey darken-1" :dark="darkStatus">Previous</v-btn>
          </v-flex>
          <v-flex md2 sm6 xs6 pr-1>
            <v-btn block color="grey" :dark="darkStatus">Clear Selection</v-btn>
          </v-flex>
          <v-flex md2 sm6 xs6 px-1>
            <v-btn block color="blue" :dark="darkStatus">Skip</v-btn>
          </v-flex>
          <v-flex md2 sm6 xs6 px-1>
            <v-btn block color="orange" :dark="darkStatus">Review Later</v-btn>
          </v-flex>
          <v-flex md2 sm6 xs6 px-1>
            <v-btn block color="green" :dark="darkStatus">Save</v-btn>
          </v-flex>
          <v-flex md2 sm6 xs6 pl-1>
            <v-btn block color="blue-grey darken-1" :dark="darkStatus">Next</v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <!-- Side bar -->
      <v-flex md2 sm12 xs12 px-2 px-2>
        <v-container
          id="scroll-target"
          style="height: 450px; background: white; border: 1px solid #D8D8D8"
          class="scroll-y"
        >
          <v-layout row wrap
            v-scroll:#scroll-target="onScroll"
            column
          >
            <v-flex xs12>
              <span v-html="test_paper.test.instructions"></span>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'TestPaper',
  async asyncData({$axios, params}) {
    let test_papers = await $axios.get(`/scheduled_tests`);
    let test_paper = test_papers.data.data.filter(t => t.id == params.id)
    return {
      test_paper: test_paper[0],
      question_meta: test_paper[0].test.question_metas[0]
    }
  },
  data: () => ({
    // student_questionMetaTest_scheduledTests: []
    current_question: {
      student_id: '',
      question_meta_test_id: '',
      scheduled_test_id: '',
      options: []
    },
  }),
  mounted() {
    // To get all the question of a test paper and form an array
    // this.test_paper.test.question_metas.forEach(question_meta => {
    //   this.student_questionMetaTest_scheduledTests.push({
    //     student_id: this.user.id,
    //     question_meta_test_id: question_meta.pivot.id,
    //     scheduled_test_id: this.test_paper.id
    //   })
    // })
    // Assign the first question to dashboard
    // let first_question = this.student_questionMetaTest_scheduledTests[0]
    // this.question = this.test_paper.test.question_metas.filter(qm => first_question.question_meta_test_id == qm.pivot.id)
  },
  methods: {
    onScroll() {
      
    }
  }
}
</script>