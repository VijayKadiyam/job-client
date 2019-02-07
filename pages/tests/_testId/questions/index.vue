<template>
  <v-container fluid fill-height px-0>
    <v-layout justify-center row wrap>
      <v-flex xs12 md12 sm12>
        <back-button 
          title="Go Back To Tests"
          link="/tests"
        ></back-button>
        <nuxt-link 
          class="links"
          :to="`/tests/${$route.params.testId}`"
        >
          [edit]
        </nuxt-link>&nbsp;
        <!-- Test Details -->
        <span class="subheading"><b><u>Test Details:</u></b></span>
        <v-layout row wrap>
          <v-flex xs4 md4 sm4>
            Name: {{ test.name }}
          </v-flex>
          <v-flex xs4 md4 sm4>
            Test Pattern: {{ test.test_pattern.name }}
          </v-flex>
          <v-flex xs4 md4 sm4>
            Duration: {{ test.duration }} minutes
          </v-flex>
        </v-layout>
        <!-- End test details -->
        <br>
        <v-divider></v-divider>
        <br>
      </v-flex>
      <v-flex xs12 sm7 md7>
        <!-- searches Elements -->
        <span class="subheading">Search Questions:</span>
        <v-layout row wrap>
          <v-flex xs12 sm3 px-1>
            <v-text-field
              v-model="searches.question_id"
              label="Question ID"
            ></v-text-field>
          </v-flex>
          <v-flex xs4 md3 sm3 px-1>
            <v-select
              :error-messages="errors.subject_id"
              v-model="searches.subject_id"
              :items="subjects"
              label="Subject"
            ></v-select>
          </v-flex>
          <v-flex xs4 md3 sm3 px-1>
            <v-select
              :error-messages="errors.subject_chapter_id"
              v-model="searches.subject_chapter_id"
              :items="subject_chapters"
              label="Chapter"
            ></v-select>
          </v-flex>
          <v-flex xs4 md3 sm3 px-1>
            <v-select
              :error-messages="errors.subject_chapter_topic_id"
              v-model="searches.subject_chapter_topic_id"
              :items="subject_chapters"
              label="Topic"
            ></v-select>
          </v-flex>
          <v-flex xs4 md3 sm3 px-1>
            <v-select
              :error-messages="errors.difficulty_level_id"
              v-model="searches.difficulty_level_id"
              :items="difficulty_levels"
              label="Difficulty Level"
            ></v-select>
          </v-flex>
          <v-flex xs4 md3 sm3 px-1>
            <v-select
              :error-messages="errors.question_type_id"
              v-model="searches.question_type_id"
              :items="question_types"
              label="Question Type"
            ></v-select>
          </v-flex>
          <v-flex xs12 sm6 px-1>
            <v-btn
              block
              :color="baseColor"
              :dark="darkStatus"
              @click="searchQuestions"
            >
              Search Questions
            </v-btn>
          </v-flex>
        </v-layout>
        <!-- End searches Elements -->
        <v-divider></v-divider>
        <!-- Question Set -->
        <br>
        <v-data-table
          :headers="headers"
          :items="items"
          :loading="loading"
          class="elevation-1"
        >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props" class="scroll-y">
            <td>{{ props.item.unique_id }}</td>
            <td class="text-xs-left">{{ props.item.question_type }}</td>
            <td class="text-xs-left">{{ props.item.subject }} {{ props.item.chapter }}</td>
            <td class="text-xs-left">{{ props.item.difficulty_level }}</td>
            <td class="text-xs-left">
              <question-history></question-history>
            </td>
            <td class="text-xs-center">
              <span :id="`text${props.item.id}`" style="color: green; visibility: hidden;" class="caption">Added</span>
              <v-btn
                small
                fab
                :color="baseColor"
                title="Add question to test"
                @click="addQuestionToTest(props.item.id)"
                :dark="darkStatus"
                >
                <v-icon>
                  arrow_forward
                </v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>
        <!-- End Question Set -->
      </v-flex>
      <v-flex xs12 sm5 md5 px-2>
        <v-card>
          <v-card-title primary-title>
            <div class="subheading">Question Paper</div>
          </v-card-title>
          <v-card-text>
            <!-- Questions in the test -->
            <v-data-table
              :headers="test_headers"
              :items="test_questions"
              :loading="loading"
              class="elevation-1"
            >
              <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
              <template slot="items" slot-scope="props">
                <td>{{ props.item.id }}</td>
                <td>
                  {{ props.item.question_type.name }}
                  <br>
                  {{ props.item.subject.name }} | {{ props.item.subject_chapter.name }}
                </td>
                <td class="text-xs-left">
                  <v-btn small flat icon @click="removeQuestion(props.item.id)">
                    <v-icon small>close</v-icon>
                  </v-btn>
                </td>
              </template>
            </v-data-table>
            <!-- End Questions in the test -->
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import QuestionHistory from '@/components/question-history.vue'
import BackButton from '@/components/back-button.vue'

export default {
  name: 'ManageTestQuestions',
  async asyncData({$axios, params}) { 
    let test = await $axios.get(`/tests/${params.testId}`)
    let question_metas = await $axios.get('/question_metas');
    let question_types = await $axios.get('/question_types');
    question_types = question_types.data.data.map(type => ({
      'text': type.name,
      'value': type.id 
    }));
    let subjects = await $axios.get('/subjects');
    subjects = subjects.data.data.map(subject => ({
      'text': subject.name,
      'value': subject.id 
    }));
    let difficulty_levels = await $axios.get('/difficulty_levels');
    difficulty_levels = difficulty_levels.data.data.map(level => ({
      'text': level.name,
      'value': level.id 
    }));
    let all_chapters = await $axios.get(`/chapters`);
    all_chapters = all_chapters.data.data.map(chapter => ({
      'text':  chapter.name,
      'value':  chapter.id,
      'subject_id': chapter.subject_id
    }))
    return {
      test: test.data.data,
      test_questions  : test.data.data.question_metas, // To be supplied to question paper table
      question_metas: question_metas.data.data, // TO be supplied to questions table
      question_types: question_types,
      subjects: subjects,
      difficulty_levels: difficulty_levels,
      all_chapters: all_chapters
    }
  },
  data:() =>  ({
    searches: {
      question_id: '',
      subject_id: '',
      subject_chapter_id: '',
      subject_chapter_topic_id: '',
      difficulty_level_id: '',
      question_type_id: ''
    },
    items: [],
    headers: [
      {
        text: 'Id',
        align: 'left',
        sortable: false,
        value: 'unique_id'
      },
      { text: 'Question Type', value: 'question_type' },
      { text: 'Subject', value: 'subject' },
      { text: "Difficulty Level", value: 'difficulty_level' },
      { text: 'History', value: 'history' },
      { text: 'Action', value: '' }
    ],
    loading: true,
    questions: [], // Array of question_meta_id and test_id
    test_headers: [
      {
        text: 'Id',
        align: 'left',
        sortable: false,
        value: 'unique_id'
      },
      { text: 'Details', value: 'details' },
      { text: 'Action', value: '' }
    ],
  }),
  computed: {
    subject_chapters() {
      this.searches.subject_chapter_id = ""
      return this.all_chapters.filter(chapter => chapter.subject_id == this.searches.subject_id)
    }
  },
  components: {
    QuestionHistory, BackButton
  },
  mounted() {
    this.questionMetaItems();

    if(this.test_questions) {
      this.test_questions.forEach(item => {
        this.questions.push({
          test_id: this.$route.params.testId,
          question_meta_id: item.id
        })
      })
    } else {
      this.questions = [];
    }
    this.loading = false
  },
  methods: {
    questionMetaItems() {
      if(this.question_metas.length) {
        this.items = []
        this.question_metas.forEach(item => {
          this.items.push({
            id: item.id,
            unique_id: item.id,
            question_type: item.question_type.name,
            subject: item.subject.name,
            chapter: item.subject_chapter.name,
            difficulty_level: item.difficulty_level.name
          })
        })
      }
      else
        this.items = []
    },
    async searchQuestions() {
      let newQuestionMetas = await this.$axios.post('/question_metas/filter', this.searches)
      this.question_metas = newQuestionMetas.data.data
      this.questionMetaItems();
      console.log(newQuestionMetas);
    },
    async addQuestionToTest(questionMetaId) {
      let question = this.questions.filter(q => q.question_meta_id == questionMetaId)
      if(!question.length) {
        this.questions.push({
          test_id: this.$route.params.testId,
          question_meta_id: questionMetaId
        })
        question = this.questions.filter(q => q.question_meta_id == questionMetaId)
        await this.$axios.post('/assign_question_metas', question[0])
        let newQuestion = this.question_metas.filter(q => q.id == questionMetaId);
        this.test_questions.push(newQuestion[0]);
      }
      else
        alert('Question Already Added');
      
      // document.getElementById('text' + questionMetaId).style.visibility = "initial";
    },
    async removeQuestion(questionMetaId) {
      let question = this.questions.filter(q => q.question_meta_id == questionMetaId)
      if(question.length) {
        await this.$axios.post('/unassign_question_metas', question[0])
        this.questions = this.questions.filter(q => q.question_meta_id != questionMetaId)
        this.test_questions  = this.test_questions .filter(q => q.id != questionMetaId)
      }
    }
  }
}
</script>