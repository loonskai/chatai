<template>
  <section class="flex h-screen">
    <div class="m-auto px-20 py-10 bg-white h-full">
      <div class="flex">
        <input
          class="w-96 rounded-md py-1 px-3 m-1 outline outline-1 outline-slate-300 focus:outline-emerald-500" 
          :value="requestMessage" 
          @input="update"
        />
        <button 
          class="flex w-32 justify-center rounded-md py-1 px-3 m-1 bg-emerald-500 text-white disabled:opacity-50" 
          @click="submit(requestMessage)"
          :disabled="loading"
        >
          <template v-if="loading">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white" class="mr-2">
              <g class="spinner_auJJ"><circle class="spinner_EUy1" cx="12" cy="3" r="1"/><circle class="spinner_EUy1 spinner_f6oS" cx="16.50" cy="4.21" r="1"/><circle class="spinner_EUy1 spinner_NTs9" cx="7.50" cy="4.21" r="1"/><circle class="spinner_EUy1 spinner_g3nX" cx="19.79" cy="7.50" r="1"/><circle class="spinner_EUy1 spinner_4vv9" cx="4.21" cy="7.50" r="1"/><circle class="spinner_EUy1 spinner_nvEs" cx="21.00" cy="12.00" r="1"/><circle class="spinner_EUy1 spinner_GOx1" cx="3.00" cy="12.00" r="1"/><circle class="spinner_EUy1 spinner_MaNM" cx="19.79" cy="16.50" r="1"/><circle class="spinner_EUy1 spinner_YaQo" cx="4.21" cy="16.50" r="1"/><circle class="spinner_EUy1 spinner_4nle" cx="16.50" cy="19.79" r="1"/><circle class="spinner_EUy1 spinner_HXuO" cx="7.50" cy="19.79" r="1"/><circle class="spinner_EUy1 spinner_ZETM" cx="12" cy="21" r="1"/></g>
            </svg>
            <span>Loading...</span>
          </template>
          <span v-else>Get Answer</span>
        </button>
        <div>
          Response: {{responseMessage}}
        </div>
      </div>
      <ul class="grid gap-2 p-4 overflow-y-scroll h-full">
        <li v-for="message in messages" :key="message.date" class="mb-4 bg-white rounded-md outline outline-1 outline-slate-100 py-2 px-5 shadow-md w-1/2" :class="{'justify-self-start': message.author === 'me', 'justify-self-end': message.author === 'ai'}">
          <div>
            <div class="flex align-middle justify-between">
              <span class="font-semibold">{{ message.author === 'me' ? 'Me' : 'Friend' }}</span>
              <span class="text-xs text-slate-500">{{ `${new Date(message.date).toLocaleTimeString()} ${new Date(message.date).toLocaleDateString()}` }}</span>
            </div>
            <div>
              <span>{{message.text}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { debounce } from './util/debounce'
import { SSE } from 'sse'

const loading = ref(false);
const requestMessage = ref('')
const responseMessage = ref('')
const messages = ref([
  {
    author: 'me',
    text: "What is the meaning of life?",
    date: new Date().toISOString()
  },
  {
    author: 'ai',
    text: "I dunno",
    date: new Date().toISOString()
  },
  {
    author: 'me',
    text: "What is the meaning of life?",
    date: new Date().toISOString()
  },
  {
    author: 'ai',
    text: "I dunno",
    date: new Date().toISOString()
  },
  {
    author: 'ai',
    text: "I dunno",
    date: new Date().toISOString()
  },
  {
    author: 'me',
    text: "What is the meaning of life?",
    date: new Date().toISOString()
  },
  {
    author: 'ai',
    text: "I dunno",
    date: new Date().toISOString()
  },
  {
    author: 'ai',
    text: "I dunno",
    date: new Date().toISOString()
  },
  {
    author: 'me',
    text: "What is the meaning of life?",
    date: new Date().toISOString()
  },
]);

const key = process.env.VUE_APP_OPEN_API_KEY;

function submit() {
  if (requestMessage.value !== '') {
    loading.value = true;
    const url = 'https://api.openai.com/v1/completions'
    const data = {
      model: 'text-davinci-003',
      prompt: requestMessage.value,
      temperature: 0.75,
      top_p: 0.95,
      max_tokens: 100,
      stream: true,
      n: 1
    }
    const source = new SSE(url, {
      headers: {
        "Content-Type": 'application/json',
        Authorization: `Bearer ${key}`,
      },
      method: 'POST',
      payload: JSON.stringify(data)
    });
    source.addEventListener('message', e => {
      if (e.data !== '[DONE]') {
        const payload = JSON.parse(e.data)
        const text = payload.choices[0].text;
        if (text !== '\n') {
          console.log('Text: ' + text)
          responseMessage.value += text;
        }
      } else {
        source.close();
      }
    });
    source.addEventListener('readystatechange', e => {
      if (e.readyState >= 2) {
        loading.value = false;
      }
    })
    source.stream();
  }
}

function input(e) {
  requestMessage.value = e.target.value;
}

const update = debounce(input, 1000)

onMounted(() => {
  const historyData = localStorage.getItem('gpt-history')
  if (historyData) {
    messages.value = JSON.parse(historyData)
  }
})

onUnmounted(() => {
  update.cancel();
})
</script>

<style>
.crossIcon{width:1em;height:1em;vertical-align:middle;fill:currentColor;overflow:hidden;}.spinner_EUy1{animation:spinner_grm3 1.2s infinite}.spinner_f6oS{animation-delay:.1s}.spinner_g3nX{animation-delay:.2s}.spinner_nvEs{animation-delay:.3s}.spinner_MaNM{animation-delay:.4s}.spinner_4nle{animation-delay:.5s}.spinner_ZETM{animation-delay:.6s}.spinner_HXuO{animation-delay:.7s}.spinner_YaQo{animation-delay:.8s}.spinner_GOx1{animation-delay:.9s}.spinner_4vv9{animation-delay:1s}.spinner_NTs9{animation-delay:1.1s}.spinner_auJJ{transform-origin:center;animation:spinner_T3O6 6s linear infinite}@keyframes spinner_grm3{0%,50%{animation-timing-function:cubic-bezier(.27,.42,.37,.99);r:1px}25%{animation-timing-function:cubic-bezier(.53,0,.61,.73);r:2px}}@keyframes spinner_T3O6{0%{transform:rotate(360deg)}100%{transform:rotate(0deg)}}
</style>
