const debounce = (callback: Function, wait: number) => {
  let timeout: number;
  return (...args: any) => {
    const next = () => callback(...args)
    window.clearTimeout(timeout)
    timeout = window.setTimeout(next, wait)
  }
}

export default debounce;
