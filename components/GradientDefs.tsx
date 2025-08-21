import React from 'react';

export function GradientDefs() {
  return (
    <svg width="0" height="0" className="absolute" style={{ stroke: 'none', fill: 'none' }}>
      <defs>
        <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--brand-secondary))" />
          <stop offset="50%" stopColor="hsl(var(--brand-accent))" />
          <stop offset="100%" stopColor="hsl(var(--brand-highlight))" />
        </linearGradient>
        
        <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--brand-primary))" />
          <stop offset="100%" stopColor="hsl(var(--brand-primary-dark))" />
        </linearGradient>
        
        <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--info))" />
          <stop offset="100%" stopColor="hsl(var(--info-secondary))" />
        </linearGradient>
        
        <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--success))" />
          <stop offset="100%" stopColor="hsl(var(--success-secondary))" />
        </linearGradient>
        
        <linearGradient id="pink-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--error))" />
          <stop offset="100%" stopColor="hsl(var(--error-secondary))" />
        </linearGradient>
        
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--warning))" />
          <stop offset="100%" stopColor="hsl(var(--warning-secondary))" />
        </linearGradient>
        
        <linearGradient id="rainbow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff0000" />
          <stop offset="16%" stopColor="#ff8000" />
          <stop offset="32%" stopColor="#ffff00" />
          <stop offset="48%" stopColor="#80ff00" />
          <stop offset="64%" stopColor="#00ff80" />
          <stop offset="80%" stopColor="#0080ff" />
          <stop offset="100%" stopColor="#8000ff" />
        </linearGradient>
        
        <linearGradient id="sunset-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="50%" stopColor="#ffa726" />
          <stop offset="100%" stopColor="#ffeb3b" />
        </linearGradient>
        
        <linearGradient id="ocean-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0077be" />
          <stop offset="50%" stopColor="#00a8cc" />
          <stop offset="100%" stopColor="#40e0d0" />
        </linearGradient>
      </defs>
    </svg>
  );
}