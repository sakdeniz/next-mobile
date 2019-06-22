<template>
  <v-ons-page modifier="white">
    <v-ons-list>
      <v-ons-list-item v-for="(item, index) in access" :key="item.title" :modifier="md ? 'nodivider' : ''" @click="loadView(index)">
        <div class="left">
          <v-ons-icon fixed-width class="list-item__icon" :icon="item.icon"></v-ons-icon>
        </div>
        <div class="center">
          {{ item.title }}
        </div>
      </v-ons-list-item>
    </v-ons-list>

    <v-ons-list-title>Links</v-ons-list-title>
    <v-ons-list>
      <v-ons-list-item v-for="item in links" :key="item.title" :modifier="md ? 'nodivider' : ''" @click="loadLink(item.url)">
        <div class="left">
          <v-ons-icon fixed-width class="list-item__icon" :icon="item.icon"></v-ons-icon>
        </div>
        <div class="center">
          {{ item.title }}
        </div>
        <div class="right">
          <v-ons-icon icon="fa-external-link"></v-ons-icon>
        </div>
      </v-ons-list-item>
    </v-ons-list>
  </v-ons-page>
</template>

<script>
export default {
  methods: {
    loadView(index) {
      this.$store.commit('tabbar/set', index + 1);
      this.$store.commit('splitter/toggle');
    },
    loadLink(url) {
      window.open(url, '_blank');
    }
  },
  data() {
    return {
      links: [
        {
          title: vm.$t('message.navcoinWebsite'),
          icon: 'ion-document-text',
          url: 'https://www.navcoin.org'
        },
        {
          title: 'Github',
          icon: 'ion-social-github',
          url: 'https://github.com/sakdeniz/next'
        },
        {
          title: 'Twitter',
          icon: 'ion-social-twitter',
          url: 'https://twitter.com/nextwallet'
        }
      ],
      access: [
        {
          title: vm.$t('message.receive'),
          icon: 'ion-archive,ion-archive'
        },
        {
          title: vm.$t('message.send'),
          icon: 'ion-paper-airplane,ion-paper-airplane'
        },
        {
          title: vm.$t('message.communityFund'),
          icon: 'ion-chatbubbles, ion-chatbubbles'
        },
        {
          title: vm.$t('message.settings'),
          icon: 'ion-gear-a, ion-gear-a'
        }
      ]
    };
  }
};
</script>

<style scoped>
.profile-pic {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #DDD;
  color: rgba(0, 0, 0, .56);
  padding-bottom: 8px;
}
.page--material .profile-pic {
  background-color: #f6f6f6;
}

.profile-pic > img {
  display: block;
  max-width: 100%;
}
</style>

<style>
.page--material__background.page--white__background {
  background-color: #fff;
}
</style>
