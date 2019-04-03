<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-toolbar :dark="darkStatus" :height="baseHeight" :color="baseColor">
            <v-toolbar-title>My Profile [{{ user.roles[0].name }}]</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-avatar
                size="120px"
                v-if="form.image_path || imageBase64"
              >
                <img
                  :src="imageBase64 ? imageBase64 :  (mediaUrl + form.image_path)"
                  alt="Profile Image"
                >
              </v-avatar>
              <v-text-field 
                label="Select Image" 
                @click='pickFile' 
                v-model='imageName' 
                prepend-icon='attach_file'
              ></v-text-field>
              <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="onFilePicked"
              >
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
                type="number"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :dark="darkStatus" to="/reset-password" :color="baseColor">Reset Password</v-btn>
            <v-btn :dark="darkStatus" @click="store" :color="baseColor">Update Profile</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script type="text/javascript">
import BackButton from '@/components/back-button.vue'

export default {
  name: 'MyProfile',
  async asyncData({$axios, store}) {
    let user = await $axios.get(`/users/${store.getters['auth/user'].id}`);
    return {
      form: user.data.data
    }
  },
  data: () => ({
    imageBase64: '',
    imageName: '',
    imageFile: ''
  }),
  components: {
    BackButton
  },
  mounted() {
    this.form.role_id = this.form.roles[0].id
  },
  methods: {
    async store() {
      await this.$axios.patch(`/users/${this.user.id}`, this.form)

      // To upload a file
      if(this.imageFile) {
        let formImage = new FormData()
        formImage.append('user_id', this.form.id)
        formImage.append('profile_image', this.imageFile)

        let response = await this.$axios.post(`/upload_profile_image`, formImage)
      }

      alert("Updated")
    },
    forgotPassword() {
      alert("Create functionality of forgot password")
    },
    pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (e) {
      const files = e.target.files
      if(files[0] !== undefined) {
        this.imageName = files[0].name
        if(this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader ()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageBase64 = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
        })
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageBase64 = ''
      }
    }
  }
}
</script> 