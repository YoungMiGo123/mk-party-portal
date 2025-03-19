
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  textClassName?: string;
  once?: boolean;
  delay?: number;
  speed?: 'slow' | 'normal' | 'fast';
  children?: React.ReactNode;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  textClassName,
  once = false,
  delay = 0,
  speed = 'normal',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    setWords(text.split(' '));
  }, [text]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  const getAnimationDelay = (index: number) => {
    const baseDelay = {
      slow: 0.2,
      normal: 0.1,
      fast: 0.05,
    }[speed];
    
    return `${(index * baseDelay) + (delay / 1000)}s`;
  };

  return (
    <div className={cn('inline-block', className)}>
      <span aria-label={text} className={cn('inline', textClassName)}>
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <span 
              className={cn(
                'inline-block opacity-0 translate-y-3',
                isVisible && 'animate-fade-up opacity-100 translate-y-0'
              )}
              style={{ 
                animationDuration: '0.6s',  
                animationDelay: getAnimationDelay(i),
                animationFillMode: 'forwards'
              }}
            >
              {word}
            </span>
            {i !== words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </span>
      {children && (
        <div 
          className={cn(
            'opacity-0 translate-y-3',
            isVisible && 'animate-fade-up opacity-100 translate-y-0'
          )}
          style={{ 
            animationDuration: '0.6s',  
            animationDelay: getAnimationDelay(words.length),
            animationFillMode: 'forwards'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default AnimatedText;
