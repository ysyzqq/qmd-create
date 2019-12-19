import React, {useEffect, useRef, useReducer, useCallback, useState} from 'react'

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
}
export function useForceUpdate() {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    return forceUpdate;
}
/**
 * 返回值在元素的ref上引用
 */
export function useMeasuredRef(measureFn: (node: HTMLElement) => void) {
    const measuredRef = useCallback((node) => {
        if (node !== null) {
            measureFn(node)
        }
    }, [])
    return measuredRef;
}
export function useClientRect() {
    const [rect, setRect] = useState(null);
    const ref = useCallback(node => {
      if (node !== null) {
        setRect(node.getBoundingClientRect());
      }
    }, []);
    return [rect, ref];
}