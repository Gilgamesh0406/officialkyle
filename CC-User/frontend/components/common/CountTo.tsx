import { getFormatAmountString } from '@/lib/client/utils';
import React, { useEffect, useState } from 'react';

interface CountProps {
  targetValue: number;
  formatType: 'balance' | 'float' | 'int';
}

const CountTo: React.FC<CountProps> = ({ targetValue, formatType }) => {
  const [value, setValue] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let startValue = value;
    const delta = targetValue - startValue;
    const duration = 800; //Math.min(1000, Math.round(Math.abs(delta) / 500 * 1000));
    const startTime = performance.now();

    setIsAnimating(true);

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const newValue = startValue + delta * progress;

      setValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);

    return () => setIsAnimating(false);
  }, [targetValue]);

  useEffect(() => {
    if (!isAnimating) {
      setTimeout(() => {
        setValue((prev) => prev); // Reset any styles or additional logic here
      }, 2000);
    }
  }, [isAnimating]);

  const formattedValue = (() => {
    switch (formatType) {
      case 'balance':
      case 'float':
        return getFormatAmountString(value);
      case 'int':
        return Math.round(value).toString();
      default:
        return value.toString();
    }
  })();

  return (
    <span
      className={`count-value ${isAnimating ? (targetValue >= value ? 'text-success' : 'text-danger') : 'text-white'}`}
    >
      {formattedValue}
    </span>
  );
};

export default CountTo;
