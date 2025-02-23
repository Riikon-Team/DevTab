import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
  name: 'Clock',
  setup() {
    const time = ref(new Date());
    let timerInterval: ReturnType<typeof setInterval>;

    const weekDays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const currentDay = time.value.getDay();

    const updateTime = () => {
      time.value = new Date();
    };

    onMounted(() => {
      updateTime();
      timerInterval = setInterval(updateTime, 400);
    });

    onUnmounted(() => {
      clearInterval(timerInterval);
    });

    return () => (
      <div class="clock-container text-center">
        <div class="digital-clock">
          {time.value.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
        <div class="date">
          {time.value.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })}
        </div>
        <div class="weekdays">
          {weekDays.map((day, index) => (
            <span 
              key={day} 
              class={`weekday ${index === currentDay ? 'active' : ''}`}
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    );
  }
});