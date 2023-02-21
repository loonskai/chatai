export function debounce(fn, delay) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(this, args);
    }, delay);
  };
  debounced.cancel = () => clearInterval(timer);
  return debounced;
}
