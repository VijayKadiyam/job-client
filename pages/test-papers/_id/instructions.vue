<template>
  <section>
    <v-container>
      <v-layout column justify-center>
        <div class="title" style="color: #772B30">Please Read The Following Instructions Carefully</div>
      </v-layout>
    </v-container>
    
    <v-container
      id="scroll-target"
      style="height: 400px; background: white"
      class="scroll-y"
    >
      <v-layout
        v-scroll:#scroll-target="onScroll"
        column
      >
        <v-flex xs12 class="pa-4">
          <span v-html="test_paper.test.instructions"></span>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container px-0>
      <v-layout column align-end justify-center>
        <v-flex xs12>
          <v-btn color="red" :dark="darkStatus"
            to="/test-papers"
          >Go Back</v-btn>
          <v-btn color="green" :dark="darkStatus"
            :to="`/test-papers/${test_paper.id}`"
          >Start Test</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'TestPaperInstructions',
  async asyncData({$axios, params}) {
    let test_papers = await $axios.get(`/scheduled_tests`);
    let test_paper = test_papers.data.data.filter(t => t.id == params.id)
    return {
      test_paper: test_paper[0]
    }
  },
  methods: {
    onScroll() {
      
    }
  }
}
</script>