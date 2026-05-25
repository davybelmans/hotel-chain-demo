import StoryblokClient from 'storyblok-js-client'

const client = new StoryblokClient({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
  cache: {
    clear: 'auto',
    type: 'memory',
  },
})

export default client
