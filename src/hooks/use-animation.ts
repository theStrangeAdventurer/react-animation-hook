import { MutableRefObject, useEffect } from 'react';


type AnimOptions = {
  color: string;
  duration: number;
  animationType: 'inner' | 'outer'
  scale: number;
};

const defaultOptions:AnimOptions = {
  color: 'rgba(255,255,255,.5)',
  duration: 300,
  animationType: 'outer',
  scale: 4
}

export default function useAnimation(
  ref?: MutableRefObject<HTMLElement | null>,
  options: Partial<AnimOptions> = {}
) {
  useEffect(() => {
    if (!ref?.current || !ref.current.animate) {
      return;
    }
    const parentRef = ref.current
    const styles = window.getComputedStyle(parentRef)
    const position = styles.getPropertyValue('position')
    
    if (!position || position === 'static') {
      parentRef.style.position = 'relative'
    }

    const handleAnimation = (e: MouseEvent) => {
      const animEl = document.createElement('span')

      if (options?.animationType !== 'inner') {
        parentRef.style.zIndex = '1'
        animEl.style.width = `${parentRef.clientWidth}px`
        animEl.style.height = `${parentRef.clientHeight}px`
        const color = options?.color ||
          styles.getPropertyValue('background') ||
          styles.getPropertyValue('background-color') ||
          defaultOptions.color
        animEl.style.background = color
        animEl.style.zIndex = '-1'
        animEl.style.position = 'absolute'
        animEl.style.top = '0'
        animEl.style.left = '0'
        animEl.style.transformOrigin = 'center'
        animEl.style.borderRadius = styles.getPropertyValue('border-radius')
      } else {
        parentRef.style.overflow = 'hidden'
        const diametr = Math.max(parentRef.clientHeight, parentRef.clientWidth)
        const radius = diametr / 2
        animEl.style.borderRadius = '50%'
        animEl.style.width = `${diametr}px`
        animEl.style.height = `${diametr}px`
        animEl.style.background = options?.color || defaultOptions.color
        animEl.style.position = 'absolute'
        animEl.style.top = `${e.clientY - parentRef.offsetTop - radius}px`
        animEl.style.left = `${e.clientX - parentRef.offsetLeft - radius}px`
      }
      const duration = options?.duration || defaultOptions.duration
      const scale = options?.scale || defaultOptions.scale
      parentRef.appendChild(animEl)
      animEl.animate([
        { transform: 'scale(1)', opacity: '1' },
        { transform: `scale(${scale})`, opacity: '0' },
      ], {
        duration,
        fill: 'forwards'
      })

      const t = setTimeout(() => {
        animEl.remove()
        clearTimeout(t)
      }, duration)
    }

    parentRef.addEventListener('click', handleAnimation)
    
    return () => {
      parentRef.removeEventListener('click', handleAnimation)
    }

  },[ref, options])
}