<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  data() {
    return {
      currentDate: new Date()
    };
  },
  computed: {
    formattedDate(): string {
      const locale = localStorage.getItem('user-locale') ?? 'en';
      const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      };

      if (locale === 'es') {
        return this.currentDate.toLocaleDateString('es-ES', dateOptions);
      } else if (locale === 'uk') {
        return this.currentDate.toLocaleDateString('uk-UA', dateOptions);
      } else {
        return this.currentDate.toLocaleDateString('en-US', dateOptions);
      }
    }
  },
  components: {},
})
export default class CurrentDate extends Vue {
}
</script>

<template>
  <div class="data">
    <h2>{{ formattedDate }}</h2>
  </div>
</template>

<style lang="scss" scoped>
.data {
  display: inline-flex;
  flex-direction: column;

  h2 {
    font-size: 1.5rem;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
    padding: 0.5rem;
    margin: 0.5rem;
    background-color: white;
    color: darkmagenta;
  }
  h2:first-letter {text-transform: capitalize;}

  @media (max-width: 768px) {
    h2 {
      font-size: 1rem;
      margin: 0.3rem 0.2rem;
      padding: 0.3rem;
    }
  }
}
</style>